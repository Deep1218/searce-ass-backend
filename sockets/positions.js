const { socketEvents, dbCollection } = require("../config/global");
const db = require("../lib/database");
const positions = {};

positions.create = (socket, data) => {
  Promise.resolve()
    .then(() => {
      const query = `SELECT p.id FROM ${dbCollection.PROJECTS} p
                LEFT JOIN ${dbCollection.PROJECT_PLANNERS} as pp ON pp."projectId" = p.id
                WHERE (p."userId" = :userId or pp."userId" = :userId) AND p.id = :projectId
                LIMIT 1;`;
      return db.sequelize.query(query, {
        replacements: {
          userId: data.userId,
          projectId: data.projectId,
        },
      });
    })
    .then(([project, _]) => {
      if (!project.length) {
        socket.emit(socketEvents.POSITION_CREATED, {
          success: false,
          error: true,
          message: "Project not found",
        });
        return Promise.reject("Project not found");
      }
      const { userId, ...positionData } = data;
      return db.Positions.create({
        ...positionData,
        created_by: userId,
        updated_by: userId,
      });
    })
    .then((position) => {
      socket.emit(socketEvents.POSITION_CREATED, {
        success: true,
        data: position.toJSON(),
        message: "success",
        error: false,
      });
    })
    .catch((err) => {
      socket.emit(socketEvents.POSITION_CREATED, {
        success: false,
        error: true,
        message: "internal server error",
      });
    });
};

module.exports = (socket, io) => {
  socket.on(socketEvents.CREATE_POSITION, (data) => positions.create(io, data));
};
