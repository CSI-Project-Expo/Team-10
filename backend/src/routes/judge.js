const express = require('express');
const router = express.Router();
const { handleJudge, handleSubmit } = require('../controllers/judgeController');

router.post('/', handleJudge);
router.post('/submit', handleSubmit);

module.exports = router;
