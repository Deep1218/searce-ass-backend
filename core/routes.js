module.exports = function (app) {
  require("../controller/user")("/api/users", app);
  require("../controller/auth")("/api/auth", app);
  require("../controller/project")("/api/projects", app);
  require("../controller/position")("/api/positions", app);
};
