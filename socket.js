let io;

module.exports = {
  init: (httpServer, obj) => {
    io = require('socket.io')(httpServer, obj);
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error('Socket.io not initialized!');
    }
    return io;
  }
};
