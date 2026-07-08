const PREFIX = 'quizapp.v1.stats.';
const RECENT_MAX = 15;

function keyFor(quizId) {
  return `${PREFIX}${quizId}`;
}

function emptyStats() {
  return {
    totalCorrect: 0,
    totalAnswered: 0,
    recent: [], // booleans, unlimited mode only, oldest first, max 15
  };
}

export function getStats(quizId) {
  try {
    const raw = localStorage.getItem(keyFor(quizId));
    if (!raw) return emptyStats();
    const parsed = JSON.parse(raw);
    return {
      totalCorrect: parsed.totalCorrect ?? 0,
      totalAnswered: parsed.totalAnswered ?? 0,
      recent: Array.isArray(parsed.recent) ? parsed.recent : [],
    };
  } catch {
    return emptyStats();
  }
}

/**
 * Records one answer for a quiz's all-time stats.
 * @param {string} quizId
 * @param {boolean} isCorrect
 * @param {boolean} trackRecent - whether to also push into the recent-15 ring buffer (unlimited mode only)
 */
export function recordAnswer(quizId, isCorrect, trackRecent) {
  const stats = getStats(quizId);
  stats.totalAnswered += 1;
  if (isCorrect) stats.totalCorrect += 1;

  if (trackRecent) {
    stats.recent = [...stats.recent, isCorrect].slice(-RECENT_MAX);
  }

  try {
    localStorage.setItem(keyFor(quizId), JSON.stringify(stats));
  } catch {
    // localStorage unavailable (private mode, quota, etc.) — fail silently
  }
  return stats;
}

export function overallAccuracy(stats) {
  if (!stats.totalAnswered) return null;
  return stats.totalCorrect / stats.totalAnswered;
}

export function recentAccuracy(stats) {
  if (!stats.recent.length) return null;
  const correct = stats.recent.filter(Boolean).length;
  return correct / stats.recent.length;
}
