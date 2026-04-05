import { useState, useEffect } from 'react';
import type { Professor, Course, ProfessorRatings } from '../types/index.ts';
import { PROFESSOR_QUESTIONS } from '../constants/ratingQuestions.ts';
import { StarRating } from './BarChart.tsx';

const PROFESSOR_POSITIVE_TAGS: Record<keyof ProfessorRatings, string | null> = {
  totalProfessorRatings: null,
  averageQ6: 'Highly Rated',
  averageQ7: 'Good Explainer',
  averageQ8: 'Very Accessible',
  averageQ9: 'Fair Grader',
  averageQ10: 'Recommended',
};

const PROFESSOR_NEGATIVE_TAGS: Record<keyof ProfessorRatings, string | null> = {
  totalProfessorRatings: null,
  averageQ6: 'Poorly Rated',
  averageQ7: 'Unclear Explanations',
  averageQ8: 'Hard to Reach',
  averageQ9: 'Unfair Grader',
  averageQ10: 'Not Recommended',
};

const POSITIVE_TAG_THRESHOLD = 4;
const NEGATIVE_TAG_THRESHOLD = 2;

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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
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
          {professorRatings !== null && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {(Object.keys(PROFESSOR_POSITIVE_TAGS) as Array<keyof typeof PROFESSOR_POSITIVE_TAGS>)
                .filter((key) => key !== 'totalProfessorRatings' && professorRatings[key] >= POSITIVE_TAG_THRESHOLD)
                .map((key) => (
                  <span key={`pos-${key}`} style={{
                    backgroundColor: '#d4edda',
                    color: '#155724',
                    border: '1px solid #c3e6cb',
                    borderRadius: '12px',
                    fontSize: '0.7rem',
                    fontWeight: '600',
                    padding: '0.15rem 0.55rem',
                    whiteSpace: 'nowrap',
                  }}>
                    ✓ {PROFESSOR_POSITIVE_TAGS[key]}
                  </span>
                ))
              }
              {(Object.keys(PROFESSOR_NEGATIVE_TAGS) as Array<keyof typeof PROFESSOR_NEGATIVE_TAGS>)
                .filter((key) => key !== 'totalProfessorRatings' && professorRatings[key] < NEGATIVE_TAG_THRESHOLD)
                .map((key) => (
                  <span key={`neg-${key}`} style={{
                    backgroundColor: '#f8d7da',
                    color: '#721c24',
                    border: '1px solid #f5c6cb',
                    borderRadius: '12px',
                    fontSize: '0.7rem',
                    fontWeight: '600',
                    padding: '0.15rem 0.55rem',
                    whiteSpace: 'nowrap',
                  }}>
                    ✗ {PROFESSOR_NEGATIVE_TAGS[key]}
                  </span>
                ))
              }
            </div>
          )}
        </div>
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
