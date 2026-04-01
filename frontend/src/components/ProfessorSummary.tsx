import { useState, useEffect } from 'react';
import type { Professor, Course, ProfessorRatings } from '../types/index.ts';
import { PROFESSOR_QUESTIONS } from '../constants/ratingQuestions.ts';

interface ProfessorSummaryProps {
  professor: Professor | null;
  course: Course | null;
}

function ProfessorSummary({ professor, course }: ProfessorSummaryProps) {

  const [professorRatings, setProfessorRatings] = useState<ProfessorRatings | null>(null);

  useEffect(() => {
    if (professor === null || course === null) {
      setProfessorRatings(null);
      return;
    }

    const fetchRatings = async() => {
      try {
        const response = await fetch(`/api/fetchRatings/course/${course._id}/professor/${professor._id}`);
        if (!response.ok) {
          setProfessorRatings(null);
          return;
        }

        const data = await response.json();
        setProfessorRatings(data);

      } catch(error: any) {
        console.error(error);
      } finally {
        // do something
      }
    };

    fetchRatings();
  }, [professor, course]);

  // no course selected — show heading with prompt
  if (!course) {
    return (
      <div>
        <h3>Professor Summary</h3>
        <p>You need to select a course with a professor</p>
      </div>
    );
  }

  // course selected but no professor chosen yet
  if (!professor) {
    return (
      <div>
        <h3>Professor Summary</h3>
        <p>No professor selected</p>
      </div>
    );
  }

  return (
    <div>
      <h3>Professor Summary</h3>
      <p>Firstname: {professor.First_Name}</p>
      <p>Lastname: {professor.Last_Name}</p>

      {professorRatings !== null ? (
        <div style={{ border: '1px solid #ccc', borderRadius: '6px', padding: '0.75rem' }}>
          <h4 style={{ marginTop: 0 }}>Professor Ratings ({professorRatings.totalProfessorRatings} total)</h4>
          {(Object.keys(PROFESSOR_QUESTIONS) as Array<keyof typeof PROFESSOR_QUESTIONS>).map((key, idx, arr) => (
            <div key={key} style={{ paddingBottom: '0.6rem', marginBottom: '0.6rem', borderBottom: idx < arr.length - 1 ? '1px solid #eee' : 'none' }}>
              <p style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{PROFESSOR_QUESTIONS[key]}</p>
              <p style={{ margin: 0 }}>
                <strong>Average:</strong> {professorRatings[key]} / 5
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>No ratings yet</p>
      )}
    </div>
  );
};

export default ProfessorSummary;
