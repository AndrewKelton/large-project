import { useState } from 'react';
import type { QuestionnaireEntry } from '../types/index.ts';
import { SingleBar } from './BarChart.tsx';

// Decode the userId from the stored JWT without an external library
function getUserIdFromToken(): string | null {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.userId ?? null;
  } catch {
    return null;
  }
}

type OptionKey = 'A' | 'B' | 'C' | 'D';
const OPTION_LABELS: Array<OptionKey> = ['A', 'B', 'C', 'D'];

function getPercent(count: number | null, total: number): number | null {
  if (count === null || total === 0) return null;
  return (count / total) * 100;
}

interface QuestionnaireEntryCardProps {
  entry: QuestionnaireEntry;
  // When provided and a token exists, an "Answer" button is shown on this card
  courseId?: string;
  professorId?: string | null;
}

function QuestionnaireEntryCard({ entry, courseId, professorId }: QuestionnaireEntryCardProps) {
  const canAnswer = !!localStorage.getItem('token') && !!courseId;

  const [mode, setMode] = useState<'results' | 'answer'>('results');
  const [selected, setSelected] = useState<OptionKey | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const total = OPTION_LABELS.reduce((sum, key) => {
    const count = entry.Counts[key];
    return sum + (count !== null ? count : 0);
  }, 0);

  const handleSubmit = async () => {
    if (!selected) return;
    try {
      const userId = getUserIdFromToken();
      if (!userId) {
        setSubmitError('Not logged in — please log in and try again.');
        setSubmitted(true);
        setMode('results');
        return;
      }

      // Use respondToCAP when a professor is present, respondToCO otherwise
      const endpoint = professorId
        ? `/api/respondToCAP/${entry._id}/respond`
        : `/api/respondToCO/${entry._id}/respond`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, response: selected }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        const msg = data?.message ?? `Server returned ${response.status}`;
        console.warn('Questionnaire respond error:', msg);
        setSubmitError(msg);
      }
    } catch (err) {
      console.warn('Questionnaire respond request failed:', err);
      setSubmitError('Network error — please try again.');
    }
    setSubmitted(true);
    setMode('results');
  };

  // Answer form view
  if (mode === 'answer') {
    return (
      <div style={{ marginBottom: '1rem', padding: '0.75rem', border: '1px solid #4a90d9', borderRadius: '6px' }}>
        <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{entry.Question}</p>
        <p style={{ fontSize: '0.85rem', color: '#555', marginBottom: '0.5rem' }}>
          Select an option. You won't be able to change your answer after submitting.
        </p>

        {OPTION_LABELS.map((key) => {
          const optionText = entry.Options[key];
          if (optionText === null) return null;
          return (
            <label
              key={key}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '0.4rem',
                cursor: 'pointer',
                padding: '0.3rem 0.5rem',
                borderRadius: '4px',
                backgroundColor: selected === key ? '#e8f0fe' : 'transparent',
                transition: 'background-color 0.15s ease',
              }}
            >
              <input
                type="radio"
                name={`q-${entry._id ?? entry.Question}`}
                value={key}
                checked={selected === key}
                onChange={() => setSelected(key)}
              />
              <span><strong>{key}.</strong> {optionText}</span>
            </label>
          );
        })}

        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
          <button onClick={handleSubmit} disabled={selected === null}>
            Submit Answer
          </button>
          <button onClick={() => setMode('results')}>
            View Results
          </button>
        </div>
      </div>
    );
  }

  // Results view
  return (
    <div style={{ marginBottom: '1rem', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '6px' }}>
      <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{entry.Question}</p>

      {submitted && !submitError && (
        <p style={{ color: '#2a6db5', fontSize: '0.85rem', marginBottom: '0.4rem' }}>✓ Answer submitted.</p>
      )}
      {submitted && submitError && (
        <p style={{ color: '#c0392b', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
          ⚠ {submitError}
        </p>
      )}

      {OPTION_LABELS.map((key) => {
        const option = entry.Options[key];
        const percent = getPercent(entry.Counts[key], total);
        if (option === null || percent === null) return null;
        return (
          <SingleBar
            key={key}
            label={key}
            percent={percent}
            displayValue={`${option} (${percent.toFixed(1)}%)`}
          />
        );
      })}

      {canAnswer && !submitted && (
        <button onClick={() => setMode('answer')} style={{ marginTop: '0.5rem' }}>
          Answer this Question
        </button>
      )}
    </div>
  );
}

export default QuestionnaireEntryCard;
