import { useState, useEffect } from 'react';
import type { Course, Professor, ProfessorQuestionnaireResults } from '../types/index.ts';
import QuestionnaireEntryCard from './QuestionnaireEntryCard.tsx';

interface ProfessorQuestionnaireResultsProps {
  course: Course | null;
  professor: Professor | null;
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
          <QuestionnaireEntryCard key={idx} entry={entry} courseId={course._id} professorId={professor._id} />
        ))
      ) : (
        <p>No questionnaire results yet</p>
      )}
    </div>
  );
}

export default ProfessorQuestionnaireResultsComponent;
