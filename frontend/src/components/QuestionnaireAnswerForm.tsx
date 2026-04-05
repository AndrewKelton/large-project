import { useState } from 'react';
import type { QuestionnaireEntry } from '../types/index.ts';
import QuestionnaireEntryCard from './QuestionnaireEntryCard.tsx';

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
const OPTION_KEYS: OptionKey[] = ['A', 'B', 'C', 'D'];

interface QuestionnaireAnswerFormProps {
  questionnaires: QuestionnaireEntry[];
  courseId: string;
  professorId: string | null;
  onDone: () => void;
}

// Single question card — manages its own answer/submitted state independently
interface SingleAnswerCardProps {
  entry: QuestionnaireEntry;
  questionIdx: number;
  professorId: string | null;
}

function SingleAnswerCard({ entry, questionIdx, professorId }: SingleAnswerCardProps) {
  const [selected, setSelected] = useState<OptionKey | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!selected) return;
    try {
      const userId = getUserIdFromToken();
      if (!userId) {
        setSubmitError('Not logged in — please log in and try again.');
        setSubmitted(true);
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
  };

  // After submission — show the bar-chart results card with a confirmation note
  if (submitted) {
    return (
      <div>
        {!submitError
          ? <p style={{ color: '#2a6db5', fontWeight: 'bold', marginBottom: '0.25rem' }}>✓ Answer submitted.</p>
          : <p style={{ color: '#c0392b', fontSize: '0.85rem', marginBottom: '0.25rem' }}>⚠ {submitError}</p>
        }
        <QuestionnaireEntryCard entry={entry} />
      </div>
    );
  }

  // Answer form for this single question
  return (
    <div style={{ marginBottom: '1.25rem', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '6px' }}>
      <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
        {questionIdx + 1}. {entry.Question}
      </p>

      {OPTION_KEYS.map((key) => {
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
              name={`question-${questionIdx}`}
              value={key}
              checked={selected === key}
              onChange={() => setSelected(key)}
            />
            <span><strong>{key}.</strong> {optionText}</span>
          </label>
        );
      })}

      <button
        onClick={handleSubmit}
        disabled={selected === null}
        style={{ marginTop: '0.5rem' }}
      >
        Submit Answer
      </button>
    </div>
  );
}

// Renders all questions — each answerable independently
function QuestionnaireAnswerForm({ questionnaires, professorId, onDone }: QuestionnaireAnswerFormProps) {
  return (
    <div>
      <p style={{ color: '#555', marginBottom: '1rem' }}>
        Answer as many questions as you like. Each answer is submitted individually and cannot be changed.
      </p>

      {questionnaires.map((entry, idx) => (
        <SingleAnswerCard
          key={idx}
          entry={entry}
          questionIdx={idx}
          professorId={professorId}
        />
      ))}

      <button onClick={onDone} style={{ marginTop: '0.25rem' }}>
        View Results
      </button>
    </div>
  );
}

export default QuestionnaireAnswerForm;
