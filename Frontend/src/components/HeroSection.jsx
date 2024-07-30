import React from 'react';
import { Link } from 'react-router-dom';

function HeroSection() {
  return (
    <div className="rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-20 px-4 sm:px-8 animated-gradient">
      <div className="container mx-auto text-center">
      <h1 className="text-5xl font-bold mb-4 text-[#313030]">Welcome to HiLight, your AI content companion</h1>
        <p className="text-xl mb-8">Discover viral moments in your videos with AI</p>
        <Link to="/signup" className="bg-white text-purple-600 py-2 px-6 rounded-full text-lg font-semibold hover:bg-gray-100 transition duration-300">
          Get Started
        </Link>
      </div>
    </div>
  );
}

export default HeroSection;