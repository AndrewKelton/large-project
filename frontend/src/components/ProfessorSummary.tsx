import { useState, useEffect } from 'react';
import type { Professor, Course, ProfessorRatings } from '../types/index.ts';

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
        <div>
          <h4>Course Ratings ({professorRatings.totalProfessorRatings} total)</h4>
          <p>Q1: {professorRatings.averageQ6}</p>
          <p>Q2: {professorRatings.averageQ7}</p>
          <p>Q3: {professorRatings.averageQ8}</p>
          <p>Q4: {professorRatings.averageQ9}</p>
          <p>Q5: {professorRatings.averageQ10}</p>
        </div>
      ) : (
        <p>No ratings yet</p>
      )}
    </div>
  );
};

export default ProfessorSummary;
