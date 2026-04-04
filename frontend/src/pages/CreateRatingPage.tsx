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
      <div>
        <h2>Create Rating</h2>
        <p>No course selected. Please go back and select a course first.</p>
        <button onClick={() => navigate('/')}>Go Back</button>
      </div>
    );
  }

  const { course, professor } = state;

  return (
    <div>
      <h2>Create Rating</h2>
      <p><strong>Course:</strong> {course.Code} – {course.Name}</p>
      <CreateRating course={course} professor={professor} onSuccess={() => navigate("/")} />
      <button onClick={() => navigate('/')}>Back</button>
    </div>
  );
};

export default CreateRatingPage;
