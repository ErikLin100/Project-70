import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ActionPage from './pages/ActionPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <div className="container mx-auto px-2 py-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/action" element={<ActionPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;