import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LandingNavbar() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await login();
      navigate('/home');
    } catch (error) {
      console.error('Failed to log in', error);
    }
  };

  return (
    <nav className="bg-transparent p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="font-semibold font-opensans text-[#313030] text-xl">HiLight.AI</Link>
        <div className="flex-grow flex justify-center">
          <Link to="/features" className="font-semibold font-opensans text-[#313030] mx-4">Features</Link>
          <Link to="/pricing" className="font-semibold font-opensans text-[#313030] mx-4">Pricing</Link>
        </div>
        <div>
          {user ? (
            <Link to="/home" className="font-semibold font-opensans bg-white text-purple-600 py-2 px-4 rounded-full">Dashboard</Link>
          ) : (
            <button onClick={handleLogin} className="font-semibold font-opensans bg-white text-purple-600 py-2 px-4 rounded-full">Sign In with Google</button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default LandingNavbar;