import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import ProjectPage from './pages/ProjectPage';

function MainContent() {
  const { user } = useAuth();

  return (
    <div className="app">
      {user && <Navbar />}
      <div className="container mx-auto px-2 py-4">
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