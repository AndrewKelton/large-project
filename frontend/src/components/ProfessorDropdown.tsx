import { useState, useEffect } from 'react';
import type { Professor } from '../types/index.ts';

function ProfessorDropdown() {

  const [professorsList, setProfessorsList] = useState<Professor[]>([]);
  const [selectedProfessorId, setSelectedProfessorId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

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
    setSelectedProfessorId(e.target.value);
  }

  // get full selected course
  const selectedProfessor = professorsList.find(course => course._id === selectedProfessorId) ?? null;

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
