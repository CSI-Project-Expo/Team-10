const Problem = require('../models/Problem');

/**
 * GET /api/problem
 * Returns all problems with optional filtering
 */
exports.getProblems = async (req, res) => {
  try {
    const { difficulty, limit = 50, page = 1 } = req.query;
    const filter = {};

    if (difficulty && ['Easy', 'Medium', 'Hard'].includes(difficulty)) {
      filter.difficulty = difficulty;
    }

    const skip = (Math.max(1, parseInt(page)) - 1) * parseInt(limit);

    const [problems, total] = await Promise.all([
      Problem.find(filter)
        .select('title difficulty createdAt')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Math.min(100, parseInt(limit)))
        .lean(),
      Problem.countDocuments(filter),
    ]);

    res.json({
      problems,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
      },
    });
  } catch (err) {
    console.error('Get problems error:', err);
    res.status(500).json({ message: 'Failed to fetch problems' });
  }
};

/**
 * GET /api/problem/:id
 * Returns a single problem by ID
 */
exports.getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    // Hide hidden test cases for non-admin users
    const publicProblem = {
      ...problem.toObject(),
      testCases: problem.testCases.filter(tc => !tc.isHidden),
    };

    res.json(publicProblem);
  } catch (err) {
    console.error('Get problem error:', err);
    res.status(500).json({ message: 'Failed to fetch problem' });
  }
};

/**
 * GET /api/problem/random
 * Returns a random problem, optionally filtered by difficulty
 */
exports.getRandomProblem = async (req, res) => {
  try {
    const { difficulty } = req.query;
    const filter = {};

    if (difficulty && ['Easy', 'Medium', 'Hard'].includes(difficulty)) {
      filter.difficulty = difficulty;
    }

    const count = await Problem.countDocuments(filter);
    if (count === 0) {
      return res.status(404).json({ message: 'No problems found' });
    }

    const randomIndex = Math.floor(Math.random() * count);
    const problem = await Problem.findOne(filter).skip(randomIndex);

    // Hide hidden test cases
    const publicProblem = {
      ...problem.toObject(),
      testCases: problem.testCases.filter(tc => !tc.isHidden),
    };

    res.json(publicProblem);
  } catch (err) {
    console.error('Get random problem error:', err);
    res.status(500).json({ message: 'Failed to fetch random problem' });
  }
};
