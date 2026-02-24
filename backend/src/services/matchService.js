const Match = require('../models/Match');
const User = require('../models/User');
const { calculateElo } = require('../utils/elo');

async function finishMatch(matchId, winnerId, loserId) {
  const match = await Match.findById(matchId);
  if (!match) throw new Error('Match not found');
  match.winner = winnerId;
  match.endedAt = new Date();
  await match.save();

  const winner = await User.findById(winnerId);
  const loser = await User.findById(loserId);
  const { newWinnerElo, newLoserElo } = calculateElo(winner.elo, loser.elo);
  winner.elo = newWinnerElo;
  loser.elo = newLoserElo;
  winner.stats.wins++;
  loser.stats.losses++;
  await winner.save();
  await loser.save();
}

module.exports = { finishMatch };
