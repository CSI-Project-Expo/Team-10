const express = require('express');
const router = express.Router();
const { getMatches, getMatchById, getMatchesByUser } = require('../controllers/matchController');

router.get('/', getMatches);
router.get('/user/:userId', getMatchesByUser);
router.get('/:id', getMatchById);

module.exports = router;
