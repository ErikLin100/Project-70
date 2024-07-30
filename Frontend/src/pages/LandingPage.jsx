import React from 'react';
import HeroSection from '../components/HeroSection';
import Navbar from '../components/LandingNavbar';

function LandingPage() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      {/* Add more sections as needed */}
    </div>
  );
}

export default LandingPage;