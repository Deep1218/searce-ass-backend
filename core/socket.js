const socketIO = require("socket.io");

module.exports = function (server) {
  const io = socketIO(server, { cors: { origin: "*" } });

  require("../middleware/handshake")(io);

  io.on("connection", (socket) => {
    require("../sockets/projects")(socket);

    socket.on("disconnect", () => {
      console.log("disconnected from user", socket.user);
    });
  });

  return io;
};
