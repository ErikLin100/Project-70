import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory
import Button from '../components/Button'; // Adjust path based on your project structure
import InputField from '../components/InputField'; // Adjust path based on your project structure

const ActionPage = () => {
  const [videoLink, setVideoLink] = useState('');
  const navigate = useNavigate(); // Use useNavigate hook for navigation

  const handleInputChange = (e) => {
    setVideoLink(e.target.value);
  };

  const handleSubmit = async () => {
    console.log('Video link submitted:', videoLink);
    navigate('/results');
  
    try {
      await fetch('http://localhost:3000/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: videoLink })
      });
    } catch (error) {
      console.error('Error processing video:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 rounded-md p-8">
      <h1 className="text-4xl text-white font-bold mb-4">Get Your Clips</h1>
      <InputField value={videoLink} onChange={handleInputChange} />
      <Button onClick={handleSubmit}>Submit</Button>
      {/* Placeholder for displaying the results */}
      <div id="results" className="mt-8">
        {/* Implement logic to display processing indicator or results here */}
      </div>
    </div>
  );
};

export default ActionPage;