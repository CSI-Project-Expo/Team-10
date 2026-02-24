const express = require('express');
const router = express.Router();
const { getProfile } = require('../controllers/userController');
const { authenticate } = require('../middleware/authenticate');

router.get('/profile', authenticate, getProfile);

module.exports = router;
