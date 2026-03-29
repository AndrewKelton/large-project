import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageTitle from '../components/PageTitle.tsx';
import WelcomeMessage from '../components/WelcomeMessage.tsx';
import Logout from '../components/Logout.tsx';
import CourseDropdown from '../components/CourseDropdown.tsx';
import ProfessorDropdown from '../components/ProfessorDropdown.tsx';
import CourseSummary from '../components/CourseSummary.tsx';
import type { Course } from '../types/index.ts';

const HomePage = () => {
  const token = localStorage.getItem('token'); // save token
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  return(
    <div>
      <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
        {!token && <Link to="/auth">Login / Sign Up</Link>}
      </div>

      <PageTitle />
      <WelcomeMessage />

      <CourseDropdown onSelect={(course) => setSelectedCourse(course)} />
      <ProfessorDropdown />

      <CourseSummary course={(selectedCourse)} />

      {token && <Logout/>}
    </div>
  );
};
export default HomePage;
