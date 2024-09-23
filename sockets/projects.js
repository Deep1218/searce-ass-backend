const { socketEvents, dbCollection } = require("../config/global");
const db = require("../lib/database");
const projects = {};

projects.create = (socket, data) => {
  const { planners, ...projectData } = data;
  const { user } = socket;
  let result;
  Promise.resolve()
    .then(() => {
      return db.Projects.create({ ...projectData, userId: user.id });
    })
    .then((project) => {
      result = project.toJSON();
      const plannersData = planners.map((userId) => ({
        projectId: project.id,
        userId,
      }));
      return db.Planners.bulkCreate(plannersData);
    })
    .then((planners) => {
      result.planners = [];
      planners.forEach((element) => {
        result.planners.push(element.toJSON());
      });

      socket.emit(socketEvents.PROJECT_CREATED, {
        success: true,
        data: result,
        message: "Project created successfully",
        error: false,
      });
    })
    .catch((err) => {
      socket.emit(socketEvents.PROJECT_CREATED, {
        success: false,
        error: true,
        message: "internal server error",
      });
    });
};
// update
projects.update = (socket, data) => {
  const { user } = socket;
  const query = `SELECT p.id FROM ${dbCollection.PROJECTS} p
                LEFT JOIN ${dbCollection.PROJECT_PLANNERS} as pp ON pp."projectId" = p.id
                WHERE (p."userId" = ${user.id} or pp."userId" = ${user.id}) AND p.id = ${data.id}
                LIMIT 1;`;
  Promise.resolve()
    .then(() => {
      return db.sequelize.query(query);
    })
    .then(([project, _]) => {
      if (!project.length) {
        socket.emit(socketEvents.PROJECT_UPDATED, {
          success: false,
          error: true,
          message: "Project not found",
        });
        return Promise.reject("Project not found");
      }
      const { id, ...projectData } = data;
      return db.Projects.update(
        { ...projectData },
        { where: { id: project[0].id } }
      );
    })
    .then((udpate) => {
      socket.emit(socketEvents.PROJECT_UPDATED, {
        success: true,
        error: false,
        message: "Project updated succesfully",
        data,
      });
    })
    .catch((err) => {
      socket.emit(socketEvents.PROJECT_UPDATED, {
        success: false,
        error: true,
        message: "internal server error",
      });
    });
};

projects.graphData = (socket, data) => {
  const { user } = socket;
  const query = `SELECT p.id FROM ${dbCollection.PROJECTS} p
  LEFT JOIN ${dbCollection.PROJECT_PLANNERS} as pp ON pp."projectId" = p.id
  WHERE (p."userId" = :userId or pp."userId" = :userId) AND p.id = :projectId
  LIMIT 1;`;

  Promise.resolve()
    .then(() => {
      return db.sequelize.query(query, {
        replacements: {
          userId: user.id,
          projectId: data.projectId,
        },
      });
    })
    .then(([project, _]) => {
      if (!project.length) {
        socket.emit(socketEvents.CALCULATION_GENERATED, {
          success: false,
          error: true,
          message: "Project not found",
        });
        return Promise.reject("Project not found");
      }
      const budgetCalculationQuery = `SELECT
                                  COALESCE(SUM(ps.budget), 0) as total_used,
                                  COUNT(ps.id) as total_positions,
                                  p."totalBudget",
                                  GREATEST(COALESCE(p."totalBudget" - SUM(ps.budget), 0), 0) AS remaining
                                FROM ${dbCollection.POSITIONS} as ps
                                LEFT JOIN ${dbCollection.PROJECTS} as p on p.id = ps."projectId"
                                WHERE ps."projectId" = :projectId
                                GROUP BY p.id;`;
      const departmentCalculationQuery = `SELECT 
                                            COALESCE(SUM(ps.budget), 0) as total_department_usage,
                                            ps.department,
                                            GREATEST(COALESCE((SUM(ps.budget) / NULLIF(p."totalBudget", 0)) * 100, 0), 0) AS percent_used
                                          FROM positions as ps
                                          LEFT JOIN projects as p on p.id = ps."projectId"
                                          WHERE ps."projectId" = :projectId and ps.department = :department
                                          GROUP BY ps.department, p."totalBudget";`;
      return Promise.all([
        db.sequelize.query(budgetCalculationQuery, {
          replacements: {
            projectId: data.projectId,
          },
        }),
        db.sequelize.query(departmentCalculationQuery, {
          replacements: {
            projectId: data.projectId,
            department: "engineering",
          },
        }),
        db.sequelize.query(departmentCalculationQuery, {
          replacements: {
            projectId: data.projectId,
            department: "product",
          },
        }),
        db.sequelize.query(departmentCalculationQuery, {
          replacements: {
            projectId: data.projectId,
            department: "sales",
          },
        }),
        db.sequelize.query(departmentCalculationQuery, {
          replacements: {
            projectId: data.projectId,
            department: "others",
          },
        }),
      ]);
    })
    .then(
      ([
        [result, metadata],
        [result1, metadata1],
        [result2, metadata2],
        [result3, metadata3],
        [result4, metadata4],
      ]) => {
        socket.emit(socketEvents.CALCULATION_GENERATED, {
          success: true,
          data: [...result, ...result1, ...result2, ...result3, ...result4],
          error: false,
          message: "success",
        });
      }
    )
    .catch((err) => {
      socket.emit(socketEvents.CALCULATION_GENERATED, {
        success: false,
        error: true,
        message: "internal server error",
      });
    });
};
module.exports = (socket) => {
  socket.on(socketEvents.CREATE_PROJECT, (data) =>
    projects.create(socket, data)
  );
  socket.on(socketEvents.UPDATE_PROJECT, (data) =>
    projects.update(socket, data)
  );
  socket.on(socketEvents.GENERATE_CALCULATION, (data) =>
    projects.graphData(socket, data)
  );
};
