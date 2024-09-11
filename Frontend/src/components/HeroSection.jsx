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
    <div className="mt-8 rounded-lg bg-main-gradient from-main-start to-main-end text-white py-20 px-4 sm:px-8 animated-gradient overflow-hidden">
      <div className="container mx-auto text-center">
        <h1 className="leading-slightly-relaxed text-5xl font-semibold font-opensans mb-4 text-[#313030]">Welcome to HiLight, your AI content companion</h1>
        <div className="my-12 mb-12 h-20 relative">
          <p className={`font-normal font-opensans text-xl my-12 animate__animated ${animationClass} text-glow leading-slightly-relaxed absolute w-full left-0 right-0`}>
            {texts[currentTextIndex]}
          </p>
        </div>
        <Link to="/signup" className="bg-white font-semibold font-opensans text-purple-600 py-2 px-6 rounded-full text-lg hover:bg-gray-100 transition duration-300">
          Get Started
        </Link>
      </div>
    </div>
  );
}

export default HeroSection;