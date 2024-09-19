const socketIO = require("socket.io");

module.exports = function (server) {
  const io = socketIO(server, { cors: { origin: "*" } });

  require("../middleware/handshake")(io);
  //   require("../sockets/projects")(io);

  io.on("connection", (socket) => {
    socket.on("disconnect", () => {
      console.log("disconnected from user");
    });
  });

  return io;
};
