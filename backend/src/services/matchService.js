const Match = require('../models/Match');
const User = require('../models/User');
const { calculateElo } = require('../utils/elo');

/**
 * Completes a match, updates winner/loser ratings and stats
 * @param {string} matchId - MongoDB ObjectId of the match
 * @param {string} winnerId - MongoDB ObjectId of the winner
 * @param {string} loserId - MongoDB ObjectId of the loser
 * @returns {Object} Updated match data with new ratings
 */
async function finishMatch(matchId, winnerId, loserId) {
  // Validate inputs
  if (!matchId || !winnerId || !loserId) {
    throw new Error('matchId, winnerId, and loserId are required');
  }

  // Find and validate match
  const match = await Match.findById(matchId);
  if (!match) {
    throw new Error('Match not found');
  }

  if (match.status === 'completed') {
    throw new Error('Match has already been completed');
  }

  // Find both players
  const [winner, loser] = await Promise.all([
    User.findById(winnerId),
    User.findById(loserId),
  ]);

  if (!winner || !loser) {
    throw new Error('One or both players not found');
  }

  // Calculate new Elo ratings
  const { newWinnerElo, newLoserElo } = calculateElo(winner.rating, loser.rating);
  const winnerDelta = newWinnerElo - winner.rating;
  const loserDelta = newLoserElo - loser.rating;

  // Update match
  match.winner = winnerId;
  match.status = 'completed';
  match.endedAt = new Date();

  // Update winner stats
  winner.rating = newWinnerElo;
  winner.stats.matchesPlayed = (winner.stats.matchesPlayed || 0) + 1;
  winner.stats.matchesWon = (winner.stats.matchesWon || 0) + 1;
  winner.stats.currentStreak = (winner.stats.currentStreak || 0) + 1;

  // Update loser stats
  loser.rating = newLoserElo;
  loser.stats.matchesPlayed = (loser.stats.matchesPlayed || 0) + 1;
  loser.stats.currentStreak = 0; // Reset streak on loss

  // Save all documents
  await Promise.all([match.save(), winner.save(), loser.save()]);

  return {
    match,
    winner: { id: winnerId, newRating: newWinnerElo, delta: winnerDelta },
    loser: { id: loserId, newRating: newLoserElo, delta: loserDelta },
  };
}

/**
 * Creates a new match between two players
 * @param {string} player1Id - First player's ObjectId
 * @param {string} player2Id - Second player's ObjectId
 * @param {string} problemId - Problem ObjectId
 * @returns {Object} Created match document
 */
async function createMatch(player1Id, player2Id, problemId) {
  const match = await Match.create({
    players: [player1Id, player2Id],
    problemId,
    status: 'ongoing',
    startedAt: new Date(),
  });
  return match;
}

/**
 * Gets match by ID with populated player data
 * @param {string} matchId - Match ObjectId
 * @returns {Object} Match with populated players
 */
async function getMatchWithPlayers(matchId) {
  return Match.findById(matchId)
    .populate('players', 'username rating stats')
    .populate('winner', 'username rating');
}

module.exports = { finishMatch, createMatch, getMatchWithPlayers };
