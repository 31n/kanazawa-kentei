import Icon from './Icon.jsx';
import BubbleGauge from './BubbleGauge.jsx';
import { getStats, overallAccuracy, recentAccuracy } from '../utils/storage.js';

export default function Result({ quiz, mode, sessionCorrect, sessionAnswered, onRetry, onHome }) {
  const stats = getStats(quiz.id);
  const overall = overallAccuracy(stats);
  const recent = recentAccuracy(stats);
  const sessionAcc = sessionAnswered ? sessionCorrect / sessionAnswered : null;
  const showRecent = mode === 'unlimited' && recent != null;

  return (
    <div className="result-screen">
      <div className="result-header">
        <span className="eyebrow">結果</span>
        <h1 className="hero-title">{quiz.title}</h1>
      </div>

      <div className="sheet result-card">
        <div className="gauge-row">
          <BubbleGauge value={sessionAcc} label="今回" accent="var(--gold)" />
        </div>
        <p className="result-score">
          {sessionCorrect} / {sessionAnswered} 問正解
        </p>

        <div className={`stat-strip ${showRecent ? 'stat-strip-two' : ''}`}>
          <div className="stat-block">
            <span className="stat-label">
              <Icon name="history" size={16} />
              通算正答率
            </span>
            <span className="stat-value">
              {overall != null ? `${Math.round(overall * 100)}%` : '—'}
            </span>
            <span className="stat-sub">{stats.totalAnswered}問中{stats.totalCorrect}問正解</span>
          </div>
          {showRecent && (
            <div className="stat-block">
              <span className="stat-label">
                <Icon name="all_inclusive" size={16} />
                直近15問
              </span>
              <span className="stat-value">{Math.round(recent * 100)}%</span>
              <span className="stat-sub">{stats.recent.length}問分の記録</span>
            </div>
          )}
        </div>
      </div>

      <div className="result-actions">
        <button className="btn btn-primary" onClick={onRetry}>
          <Icon name="replay" size={18} />
          もう一度挑戦
        </button>
        <button className="btn btn-secondary" onClick={onHome}>
          <Icon name="home" size={18} />
          問題集選択に戻る
        </button>
      </div>
    </div>
  );
}
