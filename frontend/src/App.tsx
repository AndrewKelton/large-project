import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import './App.css';

import LoginPage from './pages/AuthPage.tsx';
import HomePage from './pages/HomePage.tsx';
import CreateRatingPage from './pages/CreateRatingPage.tsx';
import CreateQuestionnairePage from './pages/CreateQuestionnairePage.tsx';
import LogoLink from './components/LogoLink.tsx';

function App()
{
    return (
    <Router>
      <LogoLink />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<LoginPage />} />
        <Route path="/create-rating" element={<CreateRatingPage />} />
        <Route path="/create-questionnaire" element={<CreateQuestionnairePage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;