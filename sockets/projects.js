const { socketEvents } = require("../config/global");
const db = require("../lib/database");
const projects = {};

projects.create = (socket, data) => {
  const { planners, ...projectData } = data;
  let result;
  Promise.resolve()
    .then(() => {
      return db.Projects.create(projectData);
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
        message: "working",
      });
    });
};

module.exports = (socket) => {
  socket.on(socketEvents.CREATE_PROJECT, (data) =>
    projects.create(socket, data)
  );
};
