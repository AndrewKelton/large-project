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
    <div className="section-card">
      <div className="section-card__header">Course Summary</div>

      <div className="selection-chip-row">
        <span className="selection-chip">{course.Code}</span>
        <span style={{ fontWeight: '600', fontSize: '1.05rem', color: '#1a1a1a' }}>
          {course.Name}
        </span>
        <span style={{
          marginLeft: 'auto',
          fontSize: '0.75rem',
          color: 'var(--appbar)',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          Selected
        </span>
      </div>

      {courseRatings !== null ? (
        <div className="section-card__body">
          <h4 style={{ marginTop: 0 }}>Course Ratings ({courseRatings.totalRatings} total)</h4>
          {(Object.keys(COURSE_QUESTIONS) as Array<keyof typeof COURSE_QUESTIONS>).map((key) => (
            <div key={key} className="section-card__row">
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
