import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import InputField from '../components/InputField';
import { auth } from '../firebase';

const ActionPage = () => {
  const [videoLink, setVideoLink] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setVideoLink(e.target.value);
  };

  const handleSubmit = async () => {
    setIsProcessing(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error('User not authenticated');
        // TODO: Show a message to the user that they need to be logged in
        setIsProcessing(false);
        return;
      }
      const response = await fetch('http://localhost:3000/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: videoLink, uid: user.uid })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.result && data.result.projectId) {
        navigate('/home', { state: { newProjectId: data.result.projectId } });
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error processing video:', error);
      // TODO: Show an error message to the user
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 rounded-md p-8">
      <h1 className="text-4xl text-white font-bold mb-4">Get Your Clips</h1>
      <InputField value={videoLink} onChange={handleInputChange} />
      <Button onClick={handleSubmit} disabled={isProcessing}>
        {isProcessing ? 'Processing...' : 'Submit'}
      </Button>
    </div>
  );
};

export default ActionPage;