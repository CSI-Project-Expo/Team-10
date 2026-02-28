const express = require('express');
const router = express.Router();
const { getProblems, getProblemById, getRandomProblem } = require('../controllers/problemController');

router.get('/', getProblems);
router.get('/random', getRandomProblem);
router.get('/:id', getProblemById);

module.exports = router;
