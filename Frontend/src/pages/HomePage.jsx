import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Youtube, Loader2 } from 'lucide-react';
import { auth } from '../firebase';

const HomePage = () => {
  const [videoLink, setVideoLink] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [projects, setProjects] = useState([]);
  const location = useLocation();

  useEffect(() => {
    fetchProjects();
    if (location.state && location.state.newProjectId) {
      fetchProjects();
    }
  }, [location]);

  const fetchProjects = async () => {
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
        fetchProjects();
        setVideoLink('');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error processing video:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-4xl text-white font-bold mb-8">Get Your Clips</h1>
        
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
          <div className="flex items-center space-x-2">
            <div className="relative flex-grow">
              <input
                type="text"
                value={videoLink}
                onChange={handleInputChange}
                placeholder="Paste YouTube URL here"
                className="w-full bg-gray-700 text-white px-4 py-2 pr-12 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Youtube className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
            <button
              onClick={handleSubmit}
              disabled={isProcessing}
              className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out ${
                isProcessing ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isProcessing ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                'Process'
              )}
            </button>
          </div>
        </div>

        <h2 className="text-2xl text-white font-bold mb-4">Your Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link key={project.id} to={`/project/${project.id}`} className="block">
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-700 transition duration-150 ease-in-out">
                <h3 className="text-xl text-white font-semibold mb-2">{project.title}</h3>
                <p className="text-gray-400">Status: {project.status}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;