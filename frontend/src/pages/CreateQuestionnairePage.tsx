import { useLocation, useNavigate } from 'react-router-dom';
import type { Course, Professor } from '../types/index.ts';

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
      <div>
        <h2>Create Questionnaire</h2>
        <p>No course selected. Please go back and select a course first.</p>
        <button onClick={() => navigate('/')}>Go Back</button>
      </div>
    );
  }

  const { course, professor } = state;

  return (
    <div>
      <h2>Create Questionnaire</h2>
      <p><strong>Course:</strong> {course.Code} – {course.Name}</p>
      {professor && (
        <p><strong>Professor:</strong> {professor.First_Name} {professor.Last_Name}</p>
      )}
      {/* Questionnaire form will go here */}
      <button onClick={() => navigate('/')}>Back</button>
    </div>
  );
};

export default CreateQuestionnairePage;
