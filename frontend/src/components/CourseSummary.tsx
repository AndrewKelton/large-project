import { useState, useEffect } from 'react';
import type { Course, CourseRatings } from '../types/index.ts';

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
      <p>Title: {course.Title}</p>
      <p>Code: {course.Code}</p>

      {courseRatings !== null ? (
        <div>
          <h4>Course Ratings ({courseRatings.totalRatings} total)</h4>
          <p>Q1: {courseRatings.averageQ1}</p>
          <p>Q2: {courseRatings.averageQ2}</p>
          <p>Q3: {courseRatings.averageQ3}</p>
          <p>Q4: {courseRatings.averageQ4}</p>
          <p>Q5: {courseRatings.averageQ5}</p>
        </div>
      ) : (
        <p>No ratings yet</p>
      )}
    </div>
  );
};

export default CourseSummary;
