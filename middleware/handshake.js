const jwt = require("../core/jwt");

const verify = (socket, next) => {
  const headers = socket.handshake.headers;
  Promise.resolve()
    .then(() => {
      return jwt.verify(headers["authorization"]);
    })
    .then((user) => {
      const { id, email } = user;
      socket.user = { id, email };
      next();
    })
    .catch((err) => {
      console.error(err);
      return next(new Error("No token provided"));
    });
};
module.exports = function (io) {
  io.use(verify);
};
