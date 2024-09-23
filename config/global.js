let globalConfig = {};

//* User role constant
//! note: if you change here then change database to
globalConfig.dbCollection = {
  USERS: "users",
  PROJECTS: "projects",
  PROJECT_PLANNERS: "planners",
  POSITIONS: "positions",
};

globalConfig.socketEvents = {
  // projects
  CREATE_PROJECT: "project:create",
  PROJECT_CREATED: "project:created",
  UPDATE_PROJECT: "project:update",
  PROJECT_UPDATED: "project:updated",
  // calculation
  GENERATE_CALCULATION: "project:generateCalcu",
  CALCULATION_GENERATED: "project:generatedCalcu",
  // positions
  CREATE_POSITION: "position:create",
  POSITION_CREATED: "position:created",
};

globalConfig.departmentsEnum = Object.freeze({
  Engineering: "engineering",
  Product: "product",
  Sales: "sales",
  Others: "others",
});
module.exports = globalConfig;
