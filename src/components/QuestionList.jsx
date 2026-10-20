import { useState } from 'react';
import Icon from './Icon.jsx';
import Explanation, { hasExplanation } from './Explanation.jsx';

const LETTERS = ['A', 'B', 'C', 'D'];

export default function QuestionList({ quiz, onBack }) {
  const [shownAnswers, setShownAnswers] = useState(() => new Set());
  const [showChoices, setShowChoices] = useState(false);
  const [shownExplanations, setShownExplanations] = useState(() => new Set());

  function toggle(setter, index) {
    setter((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  return (
    <div className="question-list-screen">
      <button className="back-link" onClick={onBack}>
        <Icon name="arrow_back" size={18} />
        <span>戻る</span>
      </button>

      <div className="setup-header">
        <span className="eyebrow">問題の一覧</span>
        <h1 className="hero-title">{quiz.title}</h1>
        <p className="hero-sub">回答はタップで表示されます。</p>
      </div>

      <label className="check-row">
        <input
          type="checkbox"
          checked={showChoices}
          onChange={(e) => setShowChoices(e.target.checked)}
        />
        <span>選択肢表示モード</span>
      </label>

      <ol className="question-list">
        {quiz.questions.map((q, i) => {
          const answerShown = shownAnswers.has(i);
          const explanationShown = shownExplanations.has(i);
          return (
            <li key={q.id ?? i} className="sheet question-item">
              <p className="question-item-text">
                <span className="question-item-num">{i + 1}.</span> {q.question}
              </p>
              {showChoices && (
                <ul className="question-item-choices">
                  {q.choices.map((choice, ci) => (
                    <li
                      key={ci}
                      className={answerShown && ci === q.answer ? 'is-answer' : undefined}
                    >
                      <span className="choice-letter">{LETTERS[ci]}</span>
                      <span>{choice}</span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="question-item-answer-row">
                <span className="question-item-label">回答:</span>
                <button
                  type="button"
                  className={`answer-chip${answerShown ? ' is-shown' : ''}`}
                  onClick={() => toggle(setShownAnswers, i)}
                  aria-label={answerShown ? '回答を隠す' : '回答を表示'}
                >
                  {answerShown ? q.choices[q.answer] : 'タップで表示'}
                </button>
                {hasExplanation(q) && (
                  <button
                    type="button"
                    className={`info-btn${explanationShown ? ' is-active' : ''}`}
                    onClick={() => toggle(setShownExplanations, i)}
                    aria-label="解説を表示"
                    aria-expanded={explanationShown}
                  >
                    <Icon name="info" size={20} />
                  </button>
                )}
              </div>
              {explanationShown && (
                <div className="answer-reveal">
                  <Explanation question={q} />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
