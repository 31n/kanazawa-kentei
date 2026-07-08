import Icon from './Icon.jsx';

const BASE_OPTIONS = [
  { value: 10, label: '10問' },
  { value: 20, label: '20問' },
  { value: 'all', label: '全問' },
  { value: 'unlimited', label: '無制限' },
];

export default function Setup({ quiz, onStart, onBack }) {
  const total = quiz.questions.length;
  const options = BASE_OPTIONS.filter((opt) => typeof opt.value !== 'number' || opt.value <= total);

  return (
    <div className="setup">
      <button className="back-link" onClick={onBack}>
        <Icon name="arrow_back" size={18} />
        <span>問題集選択に戻る</span>
      </button>

      <div className="setup-header">
        <span className="eyebrow">問題数を選択</span>
        <h1 className="hero-title">{quiz.title}</h1>
        <p className="hero-sub">全 {total} 問収録</p>
      </div>

      <div className="option-grid">
        {options.map((opt) => (
          <button key={opt.value} className="option-card" onClick={() => onStart(opt.value)}>
            {opt.value === 'unlimited' ? (
              <Icon name="all_inclusive" size={24} />
            ) : (
              <span className="option-num">{opt.value === 'all' ? total : opt.value}</span>
            )}
            <span className="option-label">{opt.label}</span>
            {opt.value === 'unlimited' && (
              <span className="option-note">直近15問の正答率も記録</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
