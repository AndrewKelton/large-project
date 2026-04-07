import { useState, useEffect, useCallback } from 'react';
import type { Course, CourseQuestionnaireResults } from '../types/index.ts';
import QuestionnaireEntryCard from './QuestionnaireEntryCard.tsx';

const PAGE_SIZE = 3;

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

interface CourseQuestionnaireResultsProps {
  course: Course | null;
}

function CourseQuestionnaireResultsComponent({ course }: CourseQuestionnaireResultsProps) {
  const [results, setResults] = useState<CourseQuestionnaireResults | null>(null);
  const [answeredIds, setAnsweredIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(0);

  // Fetch the questionnaire results
  const fetchResults = useCallback(async () => {
    if (course === null) {
      setResults(null);
      return;
    }
    try {
      const response = await fetch(`/api/fetchCO/course/${course._id}`);
      if (!response.ok) {
        setResults(null);
        return;
      }
      const data: CourseQuestionnaireResults = await response.json();
      setResults(data);
    } catch (error: any) {
      console.error(error);
      setResults(null);
    }
  }, [course]);

  useEffect(() => {
    setCurrentPage(0);
    fetchResults();
  }, [fetchResults]);

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

  if (!course) {
    return null;
  }

  const questionnaires = results?.Questionnaires ?? [];
  const totalPages = Math.ceil(questionnaires.length / PAGE_SIZE);
  const pageSlice = questionnaires.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);

  return (
    <div>
      <h4>Course Questionnaire Results</h4>
      {questionnaires.length > 0 ? (
        <>
          {pageSlice.map((entry, idx) => (
            <QuestionnaireEntryCard
              key={idx}
              entry={entry}
              courseId={course._id}
              professorId={null}
              alreadyAnswered={answeredIds.has(entry._id)}
              onAnswered={fetchResults}
            />
          ))}
          {totalPages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginTop: '0.75rem' }}>
              <button
                onClick={() => setCurrentPage(p => p - 1)}
                disabled={currentPage === 0}
                aria-label="Previous page"
                style={{ fontSize: '1.2rem', padding: '0.25rem 0.75rem', cursor: currentPage === 0 ? 'not-allowed' : 'pointer' }}
              >
                &#8592;
              </button>
              <span style={{ fontSize: '0.9rem' }}>
                {currentPage + 1} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => p + 1)}
                disabled={currentPage === totalPages - 1}
                aria-label="Next page"
                style={{ fontSize: '1.2rem', padding: '0.25rem 0.75rem', cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer' }}
              >
                &#8594;
              </button>
            </div>
          )}
        </>
      ) : (
        <p>No questionnaire results yet</p>
      )}
    </div>
  );
}

export default CourseQuestionnaireResultsComponent;
