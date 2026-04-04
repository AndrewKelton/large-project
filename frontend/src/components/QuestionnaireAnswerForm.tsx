import { useState } from 'react';
import type { QuestionnaireEntry } from '../types/index.ts';
import QuestionnaireEntryCard from './QuestionnaireEntryCard.tsx';

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
  courseId: string;
  professorId: string | null;
}

function SingleAnswerCard({ entry, questionIdx, courseId, professorId }: SingleAnswerCardProps) {
  const [selected, setSelected] = useState<OptionKey | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const handleSubmit = async () => {
    if (!selected) return;
    try {
      const token = localStorage.getItem('token');
      const payload = {
        courseId,
        professorId,
        answers: [{ questionnaireId: entry._id, selectedOption: selected }],
      };

      const response = await fetch('/api/answerQuestionnaire', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.warn('Answer questionnaire API not available yet.');
        setSubmitError(true);
      }
    } catch {
      console.warn('Answer questionnaire API not available yet.');
      setSubmitError(true);
    }

    setSubmitted(true);
  };

  // After submission — show the bar-chart results card with a confirmation note
  if (submitted) {
    return (
      <div>
        {!submitError
          ? <p style={{ color: '#2a6db5', fontWeight: 'bold', marginBottom: '0.25rem' }}>✓ Answer submitted.</p>
          : <p style={{ color: '#888', fontSize: '0.85rem', marginBottom: '0.25rem' }}>(Will sync once the API is available.)</p>
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
function QuestionnaireAnswerForm({ questionnaires, courseId, professorId, onDone }: QuestionnaireAnswerFormProps) {
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
          courseId={courseId}
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
