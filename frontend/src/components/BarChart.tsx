// Shared horizontal bar chart primitives used by summaries and questionnaire results.
import './BarChart.css';

interface SingleBarProps {
  label: string;
  percent: number; // 0–100
  displayValue: string;
}

// A single labelled horizontal bar row
export function SingleBar({ label, percent, displayValue }: SingleBarProps) {
  return (
    <div className="bar-row">
      <span style={{ minWidth: '1.5rem', fontWeight: 'bold', textAlign: 'right' }}>{label}</span>
      <div className="bar-track">
        <div className="bar-fill" style={{ width: `${percent}%` }} />
      </div>
      <span style={{ minWidth: '3rem', fontSize: '0.85rem', color: '#555' }}>{displayValue}</span>
    </div>
  );
}

// ── Star rating ──────────────────────────────────────────────────────────────

interface StarRatingProps {
  /** Value on a 1–5 scale */
  value: number;
  /** Total number of stars (default 5) */
  total?: number;
}

/**
 * Renders `total` stars where each star can be empty, 25%, 50%, 75%, or 100%
 * filled based on how much of that star's range `value` covers.
 */
export function StarRating({ value, total = 5 }: StarRatingProps) {
  const uid = `star-grad-${Math.random().toString(36).slice(2, 7)}`;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
      <svg width={0} height={0} style={{ position: 'absolute' }}>
        <defs>
          {Array.from({ length: total }, (_, i) => {
            // How filled is this star? 0–1
            const fill = Math.min(1, Math.max(0, value - i));
            // Round to nearest 0.25
            const rounded = Math.round(fill * 4) / 4;
            const id = `${uid}-${i}`;
            return (
              <linearGradient key={id} id={id} x1="0" x2="1" y1="0" y2="0">
                <stop offset={`${rounded * 100}%`} stopColor="#f5a623" />
                <stop offset={`${rounded * 100}%`} stopColor="#e0e0e0" />
              </linearGradient>
            );
          })}
        </defs>
      </svg>

      {Array.from({ length: total }, (_, i) => {
        const id = `${uid}-${i}`;
        return (
          <svg key={i} width="22" height="22" viewBox="0 0 24 24">
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              fill={`url(#${id})`}
              stroke="#f5a623"
              strokeWidth="1"
            />
          </svg>
        );
      })}

      <span style={{ fontSize: '0.85rem', color: '#555' }}>{value.toFixed(2)} / {total}</span>
    </div>
  );
}
