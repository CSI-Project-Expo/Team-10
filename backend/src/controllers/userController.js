const User = require('../models/User');

/**
 * GET /api/user/profile
 * Returns the authenticated user's profile
 */
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
};

/**
 * GET /api/user/leaderboard
 * Returns paginated leaderboard sorted by rating
 */
exports.getLeaderboard = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find()
        .select('username rating stats createdAt')
        .sort({ rating: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(),
    ]);

    // Add rank to each user
    const leaderboard = users.map((user, idx) => ({
      ...user,
      rank: skip + idx + 1,
    }));

    res.json({
      leaderboard,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error('Get leaderboard error:', err);
    res.status(500).json({ message: 'Failed to fetch leaderboard' });
  }
};

/**
 * GET /api/user/:id
 * Returns a user's public profile by ID
 */
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('username rating stats createdAt preferredLanguages');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
};

/**
 * PATCH /api/user/profile
 * Updates the authenticated user's profile
 */
exports.updateProfile = async (req, res) => {
  try {
    const allowedUpdates = ['preferredLanguages'];
    const updates = {};

    for (const field of allowedUpdates) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};
