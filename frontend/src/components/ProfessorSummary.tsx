import type { Professor } from '../types/index.ts';

interface ProfessorSummaryProps {
  professor: Professor | null;
}

function ProfessorSummary({ professor }: ProfessorSummaryProps) {

  // base case, no professor selected yet
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
