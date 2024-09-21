const express = require("express");
const { Op } = require("sequelize");

const db = require("../lib/database");
const helper = require("../core/helper");

const projectRouter = express.Router();

const project = {};

project.getAll = function (req, res) {
  const { user } = req;
  const query = `SELECT 
                    p.*,
                    pp.id as planner_id,
                    u_planner.id AS planner_user_id,
                    u_planner.name AS planner_name
                FROM 
                    projects p
                LEFT JOIN 
                    planners pp ON pp."projectId" = p.id
                LEFT JOIN 
                    users u_planner ON pp."userId"= u_planner.id
                WHERE 
                    p."userId" = :userId
                OR 
                    u_planner.id = :userId
                ORDER BY p.id;`;
  Promise.resolve()
    .then(() => {
      return db.sequelize.query(query, {
        replacements: {
          userId: user.id,
        },
      });
    })
    .then(([projects, _]) => {
      let projectsMap = new Map();
      projects.forEach((project) => {
        const { planner_id, planner_user_id, planner_name, ...projectData } =
          project;
        if (!projectsMap.has(projectData.id)) {
          projectsMap.set(projectData.id, { ...projectData, planners: [] });
        }
        const currentProject = projectsMap.get(projectData.id);
        currentProject.planners.push({
          planner_id,
          planner_user_id,
          planner_name,
        });
      });
      const result = Array.from(projectsMap, ([_, value]) => value);
      helper.success(res, result, 200);
    })
    .catch((e) => {
      helper.error(res, e);
    });
};

module.exports = function (uri, app) {
  projectRouter.get("/", project.getAll);
  app.use(uri, projectRouter);
};
