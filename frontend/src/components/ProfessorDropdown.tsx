import { useState, useEffect } from 'react';
import type { Professor } from '../types/index.ts';

interface ProfessorDropdownProps {
  onSelect: (professor: Professor | null) => void;
}

function ProfessorDropdown({ onSelect }: ProfessorDropdownProps) {

  const [professorsList, setProfessorsList] = useState<Professor[]>([]);
  const [selectedProfessorId, setSelectedProfessorId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadProfessors = async() => {
      try {
        const response = await fetch('/api/professors');
        const data = await response.json();
        setProfessorsList(data);
      } catch (error: any) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadProfessors();
  }, []); // empty array = run once when component mounts

  function handleSelectedProfessor(e: any) : void {
    const id = e.target.value;
    setSelectedProfessorId(id);

    // update professor selected
    const professor = professorsList.find(p => p._id === id) ?? null;
    onSelect(professor);
  }

  return (
    <div>
      {loading && <p>Loading...</p>}

      <h3>Professor Dropdown</h3>

      <select value={selectedProfessorId} onChange={handleSelectedProfessor}>
        <option value="">Select Professor</option>
        {professorsList.map(course => (
          <option key={course._id} value={course._id}>
            {course.First_Name} - {course.Last_Name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ProfessorDropdown;
