const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  // ELO Rating for matchmaking in 1v1 duels
  rating: {
    type: Number,
    default: 1200,
  },
  stats: {
    matchesPlayed: { type: Number, default: 0 },
    matchesWon: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
  },
  // To track which languages they prefer (useful for Docker env setup)
  preferredLanguages: [{
    type: String,
    enum: ['javascript', 'python', 'cpp', 'java'],
    default: ['javascript']
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', UserSchema);