const Match = require('../models/Match');

/**
 * GET /api/match
 * Returns paginated list of matches
 */
exports.getMatches = async (req, res) => {
  try {
    const { status, limit = 20, page = 1 } = req.query;
    const filter = {};

    if (status && ['pending', 'ongoing', 'completed'].includes(status)) {
      filter.status = status;
    }

    const skip = (Math.max(1, parseInt(page)) - 1) * parseInt(limit);

    const [matches, total] = await Promise.all([
      Match.find(filter)
        .populate('players', 'username rating')
        .populate('winner', 'username')
        .sort({ startedAt: -1 })
        .skip(skip)
        .limit(Math.min(50, parseInt(limit)))
        .lean(),
      Match.countDocuments(filter),
    ]);

    res.json({
      matches,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
      },
    });
  } catch (err) {
    console.error('Get matches error:', err);
    res.status(500).json({ message: 'Failed to fetch matches' });
  }
};

/**
 * GET /api/match/:id
 * Returns a single match by ID
 */
exports.getMatchById = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id)
      .populate('players', 'username rating stats')
      .populate('winner', 'username rating');

    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    res.json(match);
  } catch (err) {
    console.error('Get match error:', err);
    res.status(500).json({ message: 'Failed to fetch match' });
  }
};

/**
 * GET /api/match/user/:userId
 * Returns matches for a specific user
 */
exports.getMatchesByUser = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const matches = await Match.find({ players: req.params.userId })
      .populate('players', 'username rating')
      .populate('winner', 'username')
      .sort({ startedAt: -1 })
      .limit(Math.min(50, parseInt(limit)))
      .lean();

    res.json({ matches });
  } catch (err) {
    console.error('Get user matches error:', err);
    res.status(500).json({ message: 'Failed to fetch user matches' });
  }
};
