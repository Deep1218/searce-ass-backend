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
        message: "success",
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

module.exports = (socket) => {
  socket.on(socketEvents.CREATE_PROJECT, (data) =>
    projects.create(socket, data)
  );
  socket.on(socketEvents.UPDATE_PROJECT, (data) =>
    projects.update(socket, data)
  );
};
