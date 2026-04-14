import { useLocation, useNavigate } from 'react-router-dom';
import {useState} from 'react'
import type { Course, Professor } from '../types/index.ts';
import CreateRating from '../components/CreateRating.tsx'

interface CreateRatingState {
  course: Course;
  professor?: Professor | null;
}

const CreateRatingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as CreateRatingState | null;
  const initialProfessor = state?.professor ?? null;
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(initialProfessor ?? null);

  if (!state?.course) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Create Rating</h2>
        <p>No course selected. Please go back and select a course first.</p>
        <button onClick={() => navigate('/')}>← Go Back</button>
      </div>
    );
  }

  const course = state.course;


  return (
    <div style={{ padding: '2rem 1rem', maxWidth: '740px', margin: '0 auto' }}>

      {/* ── Page header ─────────────────────────────────────────────── */}
      <div className="selection-chip-row">
        <span className="selection-chip">⭐ Rate</span>
        <div>
          <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>
            {course.Code} – {course.Name}
          </div>
          {selectedProfessor && (
            <div style={{ fontSize: '0.9rem', color: '#333', marginTop: '0.2rem' }}>
              Professor: {selectedProfessor.First_Name} {selectedProfessor.Last_Name}
            </div>
          )}
        </div>
      </div>

      <CreateRating course={course} professor={selectedProfessor} setSelectedProfessor = {setSelectedProfessor} onSuccess={() => navigate("/")} />

      <button
        onClick={() => navigate('/')}
        style={{ marginTop: '0.5rem' }}
        aria-label="Go back to home page"
      >
        ← Back
      </button>
    </div>
  );
};

export default CreateRatingPage;
