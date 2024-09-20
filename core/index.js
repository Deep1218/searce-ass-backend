module.exports = function (app, server) {
  require("./../middleware/authentication")(app);
  require("./routes")(app);
  require("./socket")(server);
};
