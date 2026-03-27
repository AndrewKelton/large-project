import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';
import './App.css';

import LoginPage from './pages/LoginPage.tsx';
import HomePage from './pages/HomePage.tsx';
import RegistrationPage  from './pages/RegistrationPage.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';

function App()
{
    return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/HomePage" element={
            <ProtectedRoute>
                <HomePage />
            </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path = "/register" element = {<RegistrationPage />} />
      </Routes>
    </Router>
  );
}

export default App;