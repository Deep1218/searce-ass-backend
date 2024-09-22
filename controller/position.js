const express = require("express");

const db = require("../lib/database");
const helper = require("../core/helper");
const { dbCollection } = require("../config/global");

const positionRouter = express.Router();
const position = {};

position.getPostionsByProjectId = function (req, res) {
  const { user, params } = req;
  /* ------------Param Error-------------- */
  let promise = helper.paramValidate({
    code: 1500,
    val: !params.id || !+params.id === Number,
  });
  /* ------------------------------------- */

  let query = `SELECT p.id FROM ${dbCollection.PROJECTS} p
                LEFT JOIN ${dbCollection.PROJECT_PLANNERS} as pp ON pp."projectId" = p.id
                WHERE (p."userId" = :userId or pp."userId" = :userId) AND p.id = :projectId
                LIMIT 1;`;

  promise
    .then(() => {
      return db.sequelize.query(query, {
        replacements: {
          userId: user.id,
          projectId: params.id,
        },
      });
    })
    .then(([project, _]) => {
      if (!project.length) {
        return Promise.reject(2001);
      }
      // TODO pagination
      query = `SELECT
                  p.*,
                  u.id as user_id,
                  u.name as user_name
                FROM ${dbCollection.POSITIONS} p
                LEFT JOIN ${dbCollection.USERS} u ON u.id = p."updated_by"
                WHERE p."projectId" = :projectId`;
      return db.sequelize.query(query, {
        replacements: {
          projectId: params.id,
        },
      });
    })
    .then(([positions, _]) => {
      helper.success(res, positions, 200);
    })
    .catch((e) => {
      helper.error(res, e);
    });
};

module.exports = function (uri, app) {
  positionRouter.get("/project/:id", position.getPostionsByProjectId);
  app.use(uri, positionRouter);
};
