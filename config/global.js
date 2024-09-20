let globalConfig = {};

//* User role constant
//! note: if you change here then change database to
globalConfig.dbCollection = {
  USERS: "users",
  PROJECTS: "projects",
  PROJECT_PLANNERS: "planners",
};

globalConfig.socketEvents = {
  CREATE_PROJECT: "project:create",
  PROJECT_CREATED: "project:created",
};
module.exports = globalConfig;
