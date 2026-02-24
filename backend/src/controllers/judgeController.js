const mongoose = require('mongoose');
const { judgeCode } = require('../judge/judgeService');
const Problem = require('../models/Problem');
const User = require('../models/User');

// POST /api/judge
async function handleJudge(req, res) {
  try {
    const { code, language = 'javascript', testCases = [] } = req.body;
    if (!code || !Array.isArray(testCases)) {
      return res.status(400).json({ message: 'code and testCases are required' });
    }
    const data = await judgeCode({ code, language, testCases });
    return res.json(data);
  } catch (err) {
    console.error('Judge error', err);
    return res.status(500).json({ message: err.message });
  }
}

// POST /api/judge/submit
async function handleSubmit(req, res) {
  try {
    const { code, language = 'javascript', testCases = [], problemId, userId } = req.body;
    if (!code) {
      return res.status(400).json({ message: 'code is required' });
    }

    let casesToRun = testCases;
    if (!casesToRun || !Array.isArray(casesToRun) || casesToRun.length === 0) {
      if (!problemId) return res.status(400).json({ message: 'testCases or problemId required' });
      const problem = await Problem.findById(problemId);
      if (!problem) return res.status(404).json({ message: 'Problem not found' });
      casesToRun = problem.testCases.map(tc => ({ input: tc.input, expectedOutput: tc.expectedOutput }));
    }

    const data = await judgeCode({ code, language, testCases: casesToRun });
    const allPass = Array.isArray(data?.results) && data.results.every(r => r.pass);

    let ratingDelta = 0;
    let newRating = undefined;
    if (allPass && userId) {
      // Allow both ObjectId and username strings without throwing
      const isObjectId = mongoose.isValidObjectId(userId);
      const user = isObjectId
        ? await User.findById(userId)
        : await User.findOne({ username: userId });

      if (user) {
        ratingDelta = 25;
        user.rating += ratingDelta;
        user.stats.matchesPlayed = (user.stats?.matchesPlayed || 0) + 1;
        user.stats.matchesWon = (user.stats?.matchesWon || 0) + 1;
        user.stats.currentStreak = (user.stats?.currentStreak || 0) + 1;
        await user.save();
        newRating = user.rating;
      }
    }

    return res.json({ ...data, allPass, ratingDelta, newRating });
  } catch (err) {
    console.error('Submit error', err);
    return res.status(500).json({ message: err.message });
  }
}

module.exports = { handleJudge, handleSubmit };
