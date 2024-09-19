module.exports = function (app) {
  require("../controller/user")("/api/users", app);
  require("../controller/auth")("/api/auth", app);
};
