import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Button from '../components/Button';
import InputField from '../components/InputField';
import { auth } from '../firebase';

const HomePage = () => {
  const [videoLink, setVideoLink] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [projects, setProjects] = useState([]);
  const location = useLocation();

  useEffect(() => {
    fetchProjects();
    // Check for new project from state
    if (location.state && location.state.newProjectId) {
      // Refresh projects or update the list with the new project
      fetchProjects();
    }
  }, [location]);

  const fetchProjects = async () => {
    // Fetch user's projects from the backend
    try {
      const user = auth.currentUser;
      if (!user) return;

      const response = await fetch(`http://localhost:3000/api/projects?uid=${user.uid}`);
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

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
        // Instead of navigating, update the projects list
        fetchProjects();
        setVideoLink(''); // Clear the input field
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

      <div className="mt-8">
        <h2 className="text-2xl text-white font-bold mb-4">Your Projects</h2>
        {projects.map((project) => (
          <Link key={project.id} to={`/project/${project.id}`} className="block mb-2">
            <div className="bg-gray-700 p-4 rounded">
              <h3 className="text-xl text-white">{project.title}</h3>
              <p className="text-gray-300">Status: {project.status}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomePage;