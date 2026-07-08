import { useMemo, useState } from 'react';
import Icon from './Icon.jsx';
import { shuffle } from '../utils/shuffle.js';
import { recordAnswer, getStats, overallAccuracy, recentAccuracy } from '../utils/storage.js';

const LETTERS = ['A', 'B', 'C', 'D'];

function buildInitialQueue(questions, mode) {
  const pool = shuffle(questions);
  if (mode === 10 || mode === 20) return pool.slice(0, mode);
  return pool; // 'all' or 'unlimited' — unlimited refills as it drains
}

export default function Quiz({ quiz, mode, onFinish, onExit }) {
  const isUnlimited = mode === 'unlimited';
  const total = mode === 'all' || isUnlimited ? quiz.questions.length : mode;

  const [queue, setQueue] = useState(() => buildInitialQueue(quiz.questions, mode));
  const [qIndex, setQIndex] = useState(0); // count of questions served so far
  const [current, setCurrent] = useState(() => queue[0]);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionAnswered, setSessionAnswered] = useState(0);
  const [liveStats, setLiveStats] = useState(() => getStats(quiz.id));

  const answered = selected !== null;
  const isCorrect = answered && selected === current.answer;

  const sessionAccuracy = sessionAnswered ? sessionCorrect / sessionAnswered : null;
  const recentAcc = isUnlimited ? recentAccuracy(liveStats) : null;

  function handleSelect(choiceIdx) {
    if (answered) return;
    const correct = choiceIdx === current.answer;
    setSelected(choiceIdx);
    setRevealed(false);
    setSessionAnswered((n) => n + 1);
    if (correct) setSessionCorrect((n) => n + 1);
    const updated = recordAnswer(quiz.id, correct, isUnlimited);
    setLiveStats(updated);
  }

  function handleNext() {
    const nextServedCount = qIndex + 1;

    if (!isUnlimited && nextServedCount >= total) {
      onFinish({ sessionCorrect, sessionAnswered });
      return;
    }

    let nextQueue = queue.slice(1);
    if (isUnlimited && nextQueue.length === 0) {
      nextQueue = shuffle(quiz.questions);
    }
    setQueue(nextQueue);
    setCurrent(nextQueue[0]);
    setQIndex(nextServedCount);
    setSelected(null);
    setRevealed(false);
  }

  function handleFinishNow() {
    onFinish({ sessionCorrect, sessionAnswered });
  }

  return (
    <div className="quiz-screen">
      <div className="quiz-topline">
        <button className="back-link" onClick={onExit}>
          <Icon name="close" size={18} />
          <span>中断</span>
        </button>
        {isUnlimited ? (
          <div className="quiz-progress-unlimited">
            <Icon name="all_inclusive" size={16} />
            <span>{qIndex + 1}問目</span>
          </div>
        ) : (
          <div className="quiz-progress-text">
            {qIndex + 1} / {total}
          </div>
        )}
        {isUnlimited && (
          <button className="btn-finish-now" onClick={handleFinishNow}>
            終了する
          </button>
        )}
      </div>

      {!isUnlimited && (
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${((qIndex + (answered ? 1 : 0)) / total) * 100}%` }}
          />
        </div>
      )}

      <div className="sheet question-card">
        {current.category && <span className="eyebrow">{current.category}</span>}
        <h2 className="question-text">{current.question}</h2>

        <div className="choice-list">
          {current.choices.map((choice, i) => {
            let state = 'idle';
            if (answered) {
              if (i === selected && isCorrect) state = 'correct';
              else if (i === selected && !isCorrect) state = 'wrong';
              else if (i === current.answer && revealed) state = 'correct';
            }
            return (
              <button
                key={i}
                className={`choice-row choice-${state}`}
                onClick={() => handleSelect(i)}
                disabled={answered}
              >
                <span className="choice-letter">{LETTERS[i]}</span>
                <span className="choice-text">{choice}</span>
                {state === 'correct' && <Icon name="check" className="choice-icon" />}
                {state === 'wrong' && <Icon name="close" className="choice-icon" />}
              </button>
            );
          })}
        </div>

        {answered && (
          <div className={`feedback feedback-${isCorrect ? 'correct' : 'wrong'}`}>
            <div className="feedback-head">
              <Icon name={isCorrect ? 'check_circle' : 'cancel'} size={20} />
              <span>{isCorrect ? '正解' : '不正解'}</span>
            </div>
            <div className="feedback-stats">
              <span>
                今回 <strong>{sessionCorrect}/{sessionAnswered}</strong> ={' '}
                {Math.round(sessionAccuracy * 100)}%
              </span>
              {isUnlimited && recentAcc != null && (
                <span>
                  直近15問 <strong>{Math.round(recentAcc * 100)}%</strong>
                </span>
              )}
            </div>

            {!isCorrect && !revealed && (
              <button className="btn btn-secondary reveal-btn" onClick={() => setRevealed(true)}>
                <Icon name="visibility" size={18} />
                答えを見る
              </button>
            )}
            {!isCorrect && revealed && (
              <div className="answer-reveal">
                <p>
                  正解は <strong>{LETTERS[current.answer]}. {current.choices[current.answer]}</strong>
                </p>
                {current.explanation && <p className="explanation">{current.explanation}</p>}
              </div>
            )}

            <button className="btn btn-primary next-btn" onClick={handleNext}>
              次の問題へ
              <Icon name="arrow_forward" size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
