import React from 'react';
import { useLocation } from 'react-router-dom';

const ResultsPage = () => {
  const location = useLocation();
  const { videoUrl } = location.state || {};

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 rounded-md p-8">
      <h1 className="text-4xl text-white font-bold mb-4">Your Clips</h1>
      {videoUrl ? (
        <video controls className="max-w-full h-auto">
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <p className="text-lg text-white">No video available. Please go back and submit a video link.</p>
      )}
    </div>
  );
};

export default ResultsPage;