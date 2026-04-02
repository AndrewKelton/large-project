import { useState, useEffect } from 'react';
import type { Course, CourseRatings } from '../types/index.ts';
import { COURSE_QUESTIONS } from '../constants/ratingQuestions.ts';
import { StarRating } from './BarChart.tsx';

interface CourseSummaryProps {
  course: Course | null;
}

function CourseSummary({ course }: CourseSummaryProps) {

  const [courseRatings, setCourseRatings] = useState<CourseRatings | null>(null);

  useEffect(() => {
    if (course === null) {
      setCourseRatings(null);
      return;
    }

    const fetchRatings = async() => {
      try {
        const response = await fetch(`/api/fetchRatings/course/${course._id}`);
        if (!response.ok) {
          setCourseRatings(null);
          return;
        }

        const data = await response.json();
        setCourseRatings(data);

      } catch (error: any) {
        console.error(error);
      } finally {
        // do something
      }
    };

    fetchRatings();

  }, [course])

  // base case, no course selected yet
  if (!course) {
    return (
      <div>
        <h3>Course Summary</h3>
        <p style={{ color: '#888' }}>No course selected</p>
      </div>
    );
  }

  return (
    <div>
      <h3>Course Summary</h3>
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
          letterSpacing: '0.03em',
          whiteSpace: 'nowrap',
        }}>
          {course.Code}
        </span>
        <span style={{ fontWeight: '600', fontSize: '1.05rem', color: '#1a1a1a' }}>
          {course.Name}
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

      {courseRatings !== null ? (
        <div style={{ border: '1px solid #ccc', borderRadius: '6px', padding: '0.75rem' }}>
          <h4 style={{ marginTop: 0 }}>Course Ratings ({courseRatings.totalRatings} total)</h4>
          {(Object.keys(COURSE_QUESTIONS) as Array<keyof typeof COURSE_QUESTIONS>).map((key, idx, arr) => (
            <div key={key} style={{ paddingBottom: '0.6rem', marginBottom: '0.6rem', borderBottom: idx < arr.length - 1 ? '1px solid #eee' : 'none' }}>
              <p style={{ fontWeight: 'bold', marginBottom: '0.4rem' }}>{COURSE_QUESTIONS[key]}</p>
              <StarRating value={courseRatings[key]} />
            </div>
          ))}
        </div>
      ) : (
        <p>No ratings yet</p>
      )}
    </div>
  );
};

export default CourseSummary;
