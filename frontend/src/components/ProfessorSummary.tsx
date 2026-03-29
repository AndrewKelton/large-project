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
      <p>Title: {professor.First_Name}</p>
      <p>Code: {professor.Last_Name}</p>
    </div>
  );
};

export default ProfessorSummary;
