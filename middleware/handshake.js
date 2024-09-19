const helper = require("../core/helper");
const jwt = require("../core/jwt");

const verify = (socket, next) => {
  const test = socket.handshake;
  Promise.resolve()
    .then(() => {
      return jwt.verifyAccessToken(test);
      //   c = !noAuthURL.includes(req.originalUrl.split("?")[0]);
      //   if (c) {
      //     if (
      //       req.originalUrl.startsWith("/api/auth/verify-email") ||
      //       req.originalUrl.startsWith("/api/auth/social-auth")
      //     ) {
      //       return Promise.reject(false);
      //     } else {
      //       return jwt.verifyAccessToken(test);
      //     }
      //   }
      //   return Promise.reject(false);
    })
    .then((d) => {
      //   req.uSession = d;
      next();
    })
    .catch((err) => {
      if (err === false) next();
      else helper.error(res, 401);
    });
  //   // Perform token validation
  //   if (token) {
  //     try {
  //       const decoded = jwt.verify(token); // Use your jwt.verify method
  //       socket.user = decoded; // Attach user info to the socket object
  //       next(); // Allow connection
  //     } catch (err) {
  //       return next(new Error("Authentication error")); // Reject connection
  //     }
  //   } else {
  //     return next(new Error("No token provided")); // Reject connection
  //   }
};
module.exports = function (io) {
  io.use(verify);
};
