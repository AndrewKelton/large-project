import { useLocation, useNavigate } from 'react-router-dom';
import type { Course, Professor } from '../types/index.ts';
import CreateQuestionaire from '../components/CreateQuestionaire.tsx';

interface CreateQuestionnaireState {
  course: Course;
  professor?: Professor | null;
}

const CreateQuestionnairePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as CreateQuestionnaireState | null;

  if (!state?.course) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Create Questionnaire</h2>
        <p>No course selected. Please go back and select a course first.</p>
        <button onClick={() => navigate('/')}>← Go Back</button>
      </div>
    );
  }

  const { course, professor } = state;

  return (
    <div style={{ padding: '2rem 1rem', maxWidth: '700px', margin: '0 auto' }}>

      {/* ── Page header ─────────────────────────────────────────────── */}
      <div className="selection-chip-row">
        <span className="selection-chip">📝 Questionnaire</span>
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

      <p style={{ fontSize: '0.875rem', color: '#555', marginBottom: '0.25rem' }}>
        One question per submission — create multiple questionnaires for more questions.
      </p>

      <CreateQuestionaire course={course} professor={professor} onSuccess={() => navigate("/")} />

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

export default CreateQuestionnairePage;
