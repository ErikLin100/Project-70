import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import ProjectPage from './pages/ProjectPage';

function MainContent() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen">
      {user && <Navbar />}
      <div className={`flex-grow ${user ? 'ml-16' : ''}`}>
        <Routes>
          <Route path="/" element={user ? <Navigate to="/home" /> : <LandingPage />} />
          <Route path="/home" element={user ? <HomePage /> : <Navigate to="/" />} />
          {user && (
            <Route path="/project/:projectId" element={<ProjectPage />} />
          )}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default MainContent;
