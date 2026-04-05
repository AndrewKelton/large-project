import { useState, useEffect } from 'react';
import type { Course, Professor, ProfessorQuestionnaireResults } from '../types/index.ts';
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

interface ProfessorQuestionnaireResultsProps {
  course: Course | null;
  professor: Professor | null;
}

function ProfessorQuestionnaireResultsComponent({ course, professor }: ProfessorQuestionnaireResultsProps) {
  const [results, setResults] = useState<ProfessorQuestionnaireResults | null>(null);
  const [answeredIds, setAnsweredIds] = useState<Set<string>>(new Set());

  // Fetch the questionnaire results
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

  // Fetch the logged-in user's answered questionnaire IDs
  useEffect(() => {
    const userId = getUserIdFromToken();
    if (!userId) return;

    const fetchAnswered = async () => {
      try {
        const response = await fetch(`/api/user/${userId}/answered-questionnaires`);
        if (!response.ok) return;
        const data = await response.json();
        setAnsweredIds(new Set(data.answeredQuestionnaires.map((id: any) => id.toString())));
      } catch (error: any) {
        console.error(error);
      }
    };

    fetchAnswered();
  }, []);

  if (!course || !professor) {
    return null;
  }

  return (
    <div>
      <h4>Professor Questionnaire Results</h4>
      {results && results.Questionnaires.length > 0 ? (
        results.Questionnaires.map((entry, idx) => (
          <QuestionnaireEntryCard
            key={idx}
            entry={entry}
            courseId={course._id}
            professorId={professor._id}
            alreadyAnswered={answeredIds.has(entry._id)}
          />
        ))
      ) : (
        <p>No questionnaire results yet</p>
      )}
    </div>
  );
}

export default ProfessorQuestionnaireResultsComponent;
