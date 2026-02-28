/**
 * Default configuration values
 * Environment variables take precedence
 */
module.exports = {
  // Server
  port: parseInt(process.env.PORT, 10) || 5000,

  // Database
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/competitive-coding',

  // Redis
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',

  // Judge microservice
  judgeUrl: process.env.JUDGE_URL || 'http://localhost:8000/judge',

  // JWT
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',

  // Matchmaking
  matchmaking: {
    eloRange: 200, // Match users within this Elo range
    queueTimeout: 60000, // Remove from queue after 60s
  },

  // Rating
  rating: {
    default: 1200,
    kFactor: 32,
    floor: 100,
  },
};
