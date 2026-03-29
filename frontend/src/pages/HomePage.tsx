import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageTitle from '../components/PageTitle.tsx';
import WelcomeMessage from '../components/WelcomeMessage.tsx';
import Logout from '../components/Logout.tsx';
import CourseDropdown from '../components/CourseDropdown.tsx';
import ProfessorDropdown from '../components/ProfessorDropdown.tsx';
import CourseSummary from '../components/CourseSummary.tsx';
import ProfessorSummary from '../components/ProfessorSummary.tsx';
import type { Course, Professor } from '../types/index.ts';

const HomePage = () => {
  const token = localStorage.getItem('token'); // save token
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null);

  return(
    <div>
      <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
        {!token && <Link to="/auth">Login / Sign Up</Link>}
        {token && <Logout/>}
      </div>

      <PageTitle />
      <WelcomeMessage />

      <CourseDropdown onSelect={(course) => setSelectedCourse(course)} />
      <ProfessorDropdown onSelect={(professor) => setSelectedProfessor(professor)}/>

      <CourseSummary course={(selectedCourse)} />

      <ProfessorSummary professor={(selectedProfessor)}/>
    </div>
  );
};
export default HomePage;
