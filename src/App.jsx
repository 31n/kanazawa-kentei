import { useState } from 'react';
import Icon from './components/Icon.jsx';
import Home from './components/Home.jsx';
import Setup from './components/Setup.jsx';
import Quiz from './components/Quiz.jsx';
import Result from './components/Result.jsx';

export default function App() {
  const [screen, setScreen] = useState('home');
  const [quiz, setQuiz] = useState(null);
  const [mode, setMode] = useState(null);
  const [result, setResult] = useState(null);
  const [attempt, setAttempt] = useState(0);

  function handleSelectQuiz(selected) {
    setQuiz(selected);
    setScreen('setup');
  }

  function handleStart(selectedMode) {
    setMode(selectedMode);
    setAttempt((n) => n + 1);
    setScreen('quiz');
  }

  function handleFinish(sessionResult) {
    setResult(sessionResult);
    setScreen('result');
  }

  function handleExitQuiz() {
    setScreen('home');
    setQuiz(null);
    setMode(null);
  }

  function handleRetry() {
    setAttempt((n) => n + 1);
    setScreen('quiz');
  }

  function handleHome() {
    setScreen('home');
    setQuiz(null);
    setMode(null);
    setResult(null);
  }

  return (
    <div className="app-shell">
      {screen === 'home' && (
        <div className="topbar">
          <div className="brand">
            <span className="mark">
              マークシート<span className="tick">.</span>
            </span>
          </div>
          <span className="icon-btn" aria-hidden="true">
            <Icon name="fact_check" size={20} />
          </span>
        </div>
      )}

      {screen === 'home' && <Home onSelectQuiz={handleSelectQuiz} />}

      {screen === 'setup' && quiz && (
        <Setup quiz={quiz} onStart={handleStart} onBack={() => setScreen('home')} />
      )}

      {screen === 'quiz' && quiz && mode && (
        <Quiz
          key={`${quiz.id}-${mode}-${attempt}`}
          quiz={quiz}
          mode={mode}
          onFinish={handleFinish}
          onExit={handleExitQuiz}
        />
      )}

      {screen === 'result' && quiz && result && (
        <Result
          quiz={quiz}
          mode={mode}
          sessionCorrect={result.sessionCorrect}
          sessionAnswered={result.sessionAnswered}
          log={result.log ?? []}
          onRetry={handleRetry}
          onHome={handleHome}
        />
      )}
    </div>
  );
}
