/**
 * ELO rating calculation utilities
 */

/** Default K-factor for rating changes */
const DEFAULT_K = 32;

/** Rating floor - users cannot go below this */
const RATING_FLOOR = 100;

/**
 * Calculates expected win probability for player A against player B
 * @param {number} ratingA - Player A's rating
 * @param {number} ratingB - Player B's rating
 * @returns {number} Probability (0-1) that A wins
 */
function getExpectedScore(ratingA, ratingB) {
  return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
}

/**
 * Calculates new Elo ratings after a match
 * @param {number} winnerElo - Winner's current Elo
 * @param {number} loserElo - Loser's current Elo
 * @param {number} [k=32] - K-factor for rating volatility
 * @returns {{ newWinnerElo: number, newLoserElo: number, delta: number }}
 */
function calculateElo(winnerElo, loserElo, k = DEFAULT_K) {
  const expectedWin = getExpectedScore(winnerElo, loserElo);
  const delta = Math.round(k * (1 - expectedWin));

  const newWinnerElo = winnerElo + delta;
  const newLoserElo = Math.max(RATING_FLOOR, loserElo - delta);

  return { newWinnerElo, newLoserElo, delta };
}

/**
 * Calculates Elo change for a draw
 * @param {number} player1Elo - First player's rating
 * @param {number} player2Elo - Second player's rating
 * @param {number} [k=32] - K-factor
 * @returns {{ newPlayer1Elo: number, newPlayer2Elo: number }}
 */
function calculateDrawElo(player1Elo, player2Elo, k = DEFAULT_K) {
  const expected1 = getExpectedScore(player1Elo, player2Elo);
  const expected2 = 1 - expected1;

  const newPlayer1Elo = Math.round(player1Elo + k * (0.5 - expected1));
  const newPlayer2Elo = Math.round(player2Elo + k * (0.5 - expected2));

  return {
    newPlayer1Elo: Math.max(RATING_FLOOR, newPlayer1Elo),
    newPlayer2Elo: Math.max(RATING_FLOOR, newPlayer2Elo),
  };
}

/**
 * Gets rank title based on rating
 * @param {number} rating - User's current rating
 * @returns {{ title: string, color: string }}
 */
function getRankTitle(rating) {
  if (rating >= 2400) return { title: 'Grandmaster', color: '#ff0000' };
  if (rating >= 2100) return { title: 'Master', color: '#ff8c00' };
  if (rating >= 1800) return { title: 'Expert', color: '#a020f0' };
  if (rating >= 1500) return { title: 'Specialist', color: '#03a89e' };
  if (rating >= 1200) return { title: 'Apprentice', color: '#00ff00' };
  return { title: 'Newbie', color: '#808080' };
}

module.exports = {
  calculateElo,
  calculateDrawElo,
  getExpectedScore,
  getRankTitle,
  DEFAULT_K,
  RATING_FLOOR,
};
