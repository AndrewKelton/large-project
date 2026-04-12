import { useLocation, useNavigate } from 'react-router-dom';
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

  if (!state?.course) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Create Rating</h2>
        <p>No course selected. Please go back and select a course first.</p>
        <button onClick={() => navigate('/')}>← Go Back</button>
      </div>
    );
  }

  const { course, professor } = state;

  return (
    <div style={{ padding: '2rem 1rem', maxWidth: '740px', margin: '0 auto' }}>

      {/* ── Page header ─────────────────────────────────────────────── */}
      <div className="selection-chip-row">
        <span className="selection-chip">⭐ Rate</span>
        <div>
          <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>
            {course.Code} – {course.Name}
          </div>
          {professor && (
            <div style={{ fontSize: '0.9rem', color: '#333', marginTop: '0.2rem' }}>
              Professor: {professor.First_Name} {professor.Last_Name}
            </div>
          )}
        </div>
      </div>

      <CreateRating course={course} professor={professor} onSuccess={() => navigate("/")} />

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
