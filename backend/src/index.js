require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const { createClient } = require('redis');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const problemRoutes = require('./routes/problem');
const matchRoutes = require('./routes/match');
const judgeRoutes = require('./routes/judge');
const { setupSocket } = require('./sockets/socket');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/problem', problemRoutes);
app.use('/api/match', matchRoutes);
app.use('/api/judge', judgeRoutes);

// Health
app.get('/', (_req, res) => res.json({ status: 'ok' }));

// Error handler
app.use(errorHandler);

// MongoDB - Modern connection (deprecated options removed)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Handle MongoDB connection events
mongoose.connection.on('disconnected', () => console.warn('MongoDB disconnected'));
mongoose.connection.on('reconnected', () => console.log('MongoDB reconnected'));

// Redis
const redisClient = createClient({ url: process.env.REDIS_URL });
redisClient.connect().then(() => console.log('Redis connected')).catch(console.error);

// Socket.io
setupSocket(io, redisClient);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
