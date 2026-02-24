const { v4: uuidv4 } = require('uuid');

function matchmakingHandler(io, socket, redisClient) {
  // Register the socket under the userId room so targeted emits work
  socket.on('register_user', async ({ userId }) => {
    if (!userId) return;
    socket.data.userId = userId;
    socket.join(userId);
    await redisClient.sAdd('online_users', userId);
  });

  socket.on('find_match', async ({ userId, elo }) => {
    const id = userId || socket.data.userId;
    if (!id) return;
    socket.data.userId = id;
    socket.join(id);
    // ensure fresh placement in queue
    await redisClient.zRem('matchmaking_queue', id);
    await redisClient.zAdd('matchmaking_queue', [{ score: elo || 1200, value: id }]);
    checkForMatch(io, redisClient);
  });

  socket.on('cancel_match', async () => {
    if (socket.data.userId) {
      await redisClient.zRem('matchmaking_queue', socket.data.userId);
    }
  });

  socket.on('disconnect', async () => {
    if (socket.data.userId) {
      await redisClient.zRem('matchmaking_queue', socket.data.userId);
      await redisClient.sRem('online_users', socket.data.userId);
    }
  });
}

async function checkForMatch(io, redisClient) {
  const queue = await redisClient.zRangeWithScores('matchmaking_queue', 0, -1);
  if (queue.length >= 2) {
    const [user1, user2] = queue;
    await redisClient.zRem('matchmaking_queue', user1.value, user2.value);
    const roomId = uuidv4();
    io.to(user1.value).emit('match_found', { roomId, opponent: user2.value });
    io.to(user2.value).emit('match_found', { roomId, opponent: user1.value });
  }
}

module.exports = { matchmakingHandler };
