const express = require('express');
const router = express.Router();
const { getProfile, getLeaderboard, getUserById, updateProfile } = require('../controllers/userController');
const { authenticate } = require('../middleware/authenticate');

// Public routes
router.get('/leaderboard', getLeaderboard);
router.get('/:id', getUserById);

// Protected routes
router.get('/profile', authenticate, getProfile);
router.patch('/profile', authenticate, updateProfile);

module.exports = router;
