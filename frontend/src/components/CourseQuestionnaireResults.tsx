import { useState, useEffect } from 'react';
import type { Course, CourseQuestionnaireResults } from '../types/index.ts';
import QuestionnaireEntryCard from './QuestionnaireEntryCard.tsx';

interface CourseQuestionnaireResultsProps {
  course: Course | null;
}

function CourseQuestionnaireResultsComponent({ course }: CourseQuestionnaireResultsProps) {
  const [results, setResults] = useState<CourseQuestionnaireResults | null>(null);

  useEffect(() => {
    if (course === null) {
      setResults(null);
      return;
    }

    const fetchResults = async () => {
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
    };

    fetchResults();
  }, [course]);

  if (!course) {
    return null;
  }

  return (
    <div>
      <h4>Course Questionnaire Results</h4>
      {results && results.Questionnaires.length > 0 ? (
        results.Questionnaires.map((entry, idx) => (
          <QuestionnaireEntryCard key={idx} entry={entry} courseId={course._id} professorId={null} />
        ))
      ) : (
        <p>No questionnaire results yet</p>
      )}
    </div>
  );
}

export default CourseQuestionnaireResultsComponent;
