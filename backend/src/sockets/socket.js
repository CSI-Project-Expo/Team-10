const { matchmakingHandler } = require('../matchmaking/matchmaking');

function setupSocket(io, redisClient) {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    matchmakingHandler(io, socket, redisClient);
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
}

module.exports = { setupSocket };
