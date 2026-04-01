import { useState, useEffect } from 'react';
import type { Course, CourseRatings } from '../types/index.ts';
import { COURSE_QUESTIONS } from '../constants/ratingQuestions.ts';

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
        <p>No course selected</p>
      </div>
    );
  }

  return (
    <div>
      <h3>Course Summary</h3>
      <p>Name: {course.Name}</p>
      <p>Code: {course.Code}</p>

      {courseRatings !== null ? (
        <div style={{ border: '1px solid #ccc', borderRadius: '6px', padding: '0.75rem' }}>
          <h4 style={{ marginTop: 0 }}>Course Ratings ({courseRatings.totalRatings} total)</h4>
          {(Object.keys(COURSE_QUESTIONS) as Array<keyof typeof COURSE_QUESTIONS>).map((key, idx, arr) => (
            <div key={key} style={{ paddingBottom: '0.6rem', marginBottom: '0.6rem', borderBottom: idx < arr.length - 1 ? '1px solid #eee' : 'none' }}>
              <p style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{COURSE_QUESTIONS[key]}</p>
              <p style={{ margin: 0 }}>
                <strong>Average:</strong> {courseRatings[key]} / 5
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

export default CourseSummary;
