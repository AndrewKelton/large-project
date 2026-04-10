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
      <CreateQuestionaire course={course} professor={professor} onSuccess={() => navigate("/")} />
      <button onClick={() => navigate('/')}>Back</button>
    </div>
  );
};

export default CreateQuestionnairePage;
