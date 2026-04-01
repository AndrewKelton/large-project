import { useState, useEffect } from 'react';
import type { Course, Professor, ProfessorQuestionnaireResults, QuestionnaireEntry } from '../types/index.ts';
import { SingleBar } from './BarChart.tsx';

interface ProfessorQuestionnaireResultsProps {
  course: Course | null;
  professor: Professor | null;
}

// Returns the percentage (0–100) for a count out of total, or null if count is null
function getPercent(count: number | null, total: number): number | null {
  if (count === null || total === 0) return null;
  return (count / total) * 100;
}

const OPTION_LABELS: Array<'A' | 'B' | 'C' | 'D'> = ['A', 'B', 'C', 'D'];

function QuestionnaireEntryCard({ entry }: { entry: QuestionnaireEntry }) {
  const total = OPTION_LABELS.reduce((sum, key) => {
    const count = entry.Counts[key];
    return sum + (count !== null ? count : 0);
  }, 0);

  return (
    <div style={{ marginBottom: '1rem', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '6px' }}>
      <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{entry.Question}</p>
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
    </div>
  );
}

function ProfessorQuestionnaireResultsComponent({ course, professor }: ProfessorQuestionnaireResultsProps) {
  const [results, setResults] = useState<ProfessorQuestionnaireResults | null>(null);

  useEffect(() => {
    if (course === null || professor === null) {
      setResults(null);
      return;
    }

    const fetchResults = async () => {
      try {
        const response = await fetch(`/api/fetchCAP/course/${course._id}/professor/${professor._id}`);
        if (!response.ok) {
          setResults(null);
          return;
        }

        const data: ProfessorQuestionnaireResults = await response.json();
        setResults(data);
      } catch (error: any) {
        console.error(error);
        setResults(null);
      }
    };

    fetchResults();
  }, [course, professor]);

  if (!course || !professor) {
    return null;
  }

  return (
    <div>
      <h4>Professor Questionnaire Results</h4>
      {results && results.Questionnaires.length > 0 ? (
        results.Questionnaires.map((entry, idx) => (
          <QuestionnaireEntryCard key={idx} entry={entry} />
        ))
      ) : (
        <p>No questionnaire results yet</p>
      )}
    </div>
  );
}

export default ProfessorQuestionnaireResultsComponent;
