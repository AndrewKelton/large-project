import type { Professor } from '../types/index.ts';

interface ProfessorSummaryProps {
  professor: Professor | null;
  courseSelected: boolean;
}

function ProfessorSummary({ professor, courseSelected }: ProfessorSummaryProps) {

  // no course selected — show heading with prompt
  if (!courseSelected) {
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
    </div>
  );
};

export default ProfessorSummary;
