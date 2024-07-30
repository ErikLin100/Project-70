import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import ActionPage from './pages/ActionPage';
import ResultsPage from './pages/ResultsPage';

function MainContent() {
  const { isLoggedIn } = useAuth();

  return (
    <div className="app">
      {isLoggedIn && <Navbar />}
      <div className="container mx-auto px-2 py-4">
        <Routes>
          <Route path="/" element={isLoggedIn ? <Navigate to="/home" /> : <LandingPage />} />
          <Route path="/home" element={isLoggedIn ? <HomePage /> : <Navigate to="/" />} />
          {isLoggedIn && (
            <>
              <Route path="/action" element={<ActionPage />} />
              <Route path="/results" element={<ResultsPage />} />
            </>
          )}
        </Routes>
      </div>
    </div>
  );
}

export default MainContent;