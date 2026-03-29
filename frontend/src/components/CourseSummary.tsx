import { useState, useEffect } from 'react';
import type { Course } from '../types/index.ts';

interface CourseSummaryProps {
  course: Course | null;
}

function CourseSummary({ course }: CourseSummaryProps) {

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
    </div>
  );

};

export default CourseSummary;
