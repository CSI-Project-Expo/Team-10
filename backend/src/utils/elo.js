// ELO rating calculation
function calculateElo(winnerElo, loserElo, k = 32) {
  const expectedWin = 1 / (1 + Math.pow(10, (loserElo - winnerElo) / 400));
  const newWinnerElo = Math.round(winnerElo + k * (1 - expectedWin));
  const newLoserElo = Math.round(loserElo + k * (0 - (1 - expectedWin)));
  return { newWinnerElo, newLoserElo };
}

module.exports = { calculateElo };
