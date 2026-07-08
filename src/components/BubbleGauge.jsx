const SIZE = 148;
const STROKE = 12;
const RADIUS = (SIZE - STROKE) / 2;
const CIRC = 2 * Math.PI * RADIUS;

export default function BubbleGauge({ value, label, accent = 'var(--gold)', size = SIZE }) {
  const pct = value == null ? 0 : Math.round(value * 100);
  const scale = size / SIZE;
  const offset = value == null ? CIRC : CIRC * (1 - value);

  return (
    <div className="bubble-gauge" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="var(--line)"
          strokeWidth={STROKE}
        />
        {value != null && (
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke={accent}
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
            style={{ transition: 'stroke-dashoffset 0.5s var(--ease)' }}
          />
        )}
      </svg>
      <div className="bubble-gauge-center">
        <span className="bubble-gauge-pct">{value == null ? '—' : `${pct}%`}</span>
        {label && <span className="bubble-gauge-label">{label}</span>}
      </div>
    </div>
  );
}
