import { useState, useEffect } from 'react';
import type { Professor, Course, ProfessorRatings } from '../types/index.ts';
import { PROFESSOR_QUESTIONS } from '../constants/ratingQuestions.ts';
import { StarRating } from './BarChart.tsx';

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
        <p style={{ color: '#888' }}>You need to select a course with a professor</p>
      </div>
    );
  }

  // course selected but no professor chosen yet
  if (!professor) {
    return (
      <div>
        <h3>Professor Summary</h3>
        <p style={{ color: '#888' }}>No professor selected</p>
      </div>
    );
  }

  return (
    <div>
      <h3>Professor Summary</h3>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.75rem 1rem',
        marginBottom: '0.75rem',
        backgroundColor: '#eef4fc',
        border: '1px solid #4a90d9',
        borderRadius: '8px',
      }}>
        <span style={{
          backgroundColor: '#4a90d9',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: '1rem',
          padding: '0.3rem 0.65rem',
          borderRadius: '6px',
          whiteSpace: 'nowrap',
        }}>
          {professor.First_Name} {professor.Last_Name}
        </span>
        <span style={{
          marginLeft: 'auto',
          fontSize: '0.75rem',
          color: '#4a90d9',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          Selected
        </span>
      </div>

      {professorRatings !== null ? (
        <div style={{ border: '1px solid #ccc', borderRadius: '6px', padding: '0.75rem' }}>
          <h4 style={{ marginTop: 0 }}>Professor Ratings ({professorRatings.totalProfessorRatings} total)</h4>
          {(Object.keys(PROFESSOR_QUESTIONS) as Array<keyof typeof PROFESSOR_QUESTIONS>).map((key, idx, arr) => (
            <div key={key} style={{ paddingBottom: '0.6rem', marginBottom: '0.6rem', borderBottom: idx < arr.length - 1 ? '1px solid #eee' : 'none' }}>
              <p style={{ fontWeight: 'bold', marginBottom: '0.4rem' }}>{PROFESSOR_QUESTIONS[key]}</p>
              <StarRating value={professorRatings[key]} />
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
