import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'animate.css';

const texts = [
  "Discover viral moments in your videos with AI",
  "Save hours of editing time with smart video analysis",
  "Maximize ROI on every piece of video content"
];

function HeroSection() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [animationClass, setAnimationClass] = useState('animate__backInLeft');

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationClass('animate__backOutRight');
      setTimeout(() => {
        setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
        setAnimationClass('animate__backInLeft');
      }, 750);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-20 px-4 sm:px-8 animated-gradient">
      <div className="container mx-auto text-center">
        <h1 className="leading-slightly-relaxed text-5xl font-semibold font-opensans mb-4 text-[#313030]">Welcome to HiLight, your AI content companion</h1>
        <p className={`font-normal font-opensans text-xl my-20 animate__animated ${animationClass} text-glow`}>
          {texts[currentTextIndex]}
        </p>
        <Link to="/signup" className="bg-white font-semibold font-opensans text-purple-600 py-2 px-6 rounded-full text-lg hover:bg-gray-100 transition duration-300">
          Get Started
        </Link>
      </div>
    </div>
  );
}

export default HeroSection;