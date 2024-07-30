import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LandingNavbar() {
  const { toggleLogin } = useAuth();

  return (
    <nav className="bg-transparent p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="font-semibold font-opensans text-[#313030] text-xl">HiLight.AI</Link>
        <div className="flex-grow flex justify-center">
          <Link to="/features" className="font-semibold font-opensans text-[#313030] mx-4">Features</Link>
          <Link to="/pricing" className="font-semibold font-opensans text-[#313030] mx-4">Pricing</Link>
        </div>
        <div>
          <button onClick={toggleLogin} className="font-semibold font-opensans text-[#313030] mr-4">Login</button>
          <Link to="/signup" className="font-semibold font-opensans bg-white text-purple-600 py-2 px-4 rounded-full">Sign Up</Link>
        </div>
      </div>
    </nav>
  );
}

export default LandingNavbar;