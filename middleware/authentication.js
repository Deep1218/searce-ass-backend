const helper = require("../core/helper");
const jwt = require("../core/jwt");

module.exports = function (app) {
  let auth = function (req, res, next) {
    let prefix = "/api";
    let noAuthURL = ["/", prefix + "/auth/login", prefix + "/users/"];

    Promise.resolve()
      .then(() => {
        c = !noAuthURL.includes(req.originalUrl.split("?")[0]);
        if (c) {
          return jwt.verifyAccessToken(req);
        }
        return Promise.reject(false);
      })
      .then((d) => {
        req.user = d;
        next();
      })
      .catch((err) => {
        if (err === false) next();
        else helper.error(res, 401);
      });
  };
  app.use(auth);
};
