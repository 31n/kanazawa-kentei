import { useState } from 'react';
import Icon from './Icon.jsx';
import Explanation, { hasExplanation } from './Explanation.jsx';

export default function QuestionList({ quiz, onBack }) {
  const [shownAnswers, setShownAnswers] = useState(() => new Set());
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

      <ol className="question-list">
        {quiz.questions.map((q, i) => {
          const answerShown = shownAnswers.has(i);
          const explanationShown = shownExplanations.has(i);
          return (
            <li key={q.id ?? i} className="sheet question-item">
              <p className="question-item-text">
                <span className="question-item-num">{i + 1}.</span> {q.question}
              </p>
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
