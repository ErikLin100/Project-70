import React from 'react';
import HeroSection from '../components/HeroSection';
import Navbar from '../components/LandingNavbar';
import Process from '../components/Process';
import Features from '../components/Features';

function LandingPage() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <Process />
      <Features />
      
      {/* Add more sections as needed */}
    </div>
  );
}

export default LandingPage;