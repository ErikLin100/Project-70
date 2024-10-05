import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Youtube, Loader2 } from 'lucide-react';
import { auth } from '../firebase';
import ProjectCard from '../components/ProjectCard';

const HomePage = () => {
  const [videoLink, setVideoLink] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    fetchProjects();
    if (location.state && location.state.newProjectId) {
      fetchProjects();
    }
  }, [location]);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        setProjects([]);
        return;
      }

      const response = await fetch(`http://localhost:3000/api/projects?uid=${user.uid}`);
      if (response.status === 500) {
        // Assume no projects if we get a 500 error
        setProjects([]);
      } else if (!response.ok) {
        throw new Error('Failed to fetch projects');
      } else {
        const data = await response.json();
        setProjects(data || []);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      // Don't throw the error, just set projects to empty array
      setProjects([]);
    } finally {
      setIsLoading(false);
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

  const handleDeleteProject = async (projectId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/projects/${projectId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete project');
      }
      await fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col">
      <div className="flex-grow">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <h1 className="text-4xl text-white font-bold mb-8">Get Your Clips</h1>
          
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-12">
            <div className="flex items-center space-x-2">
              <div className="relative flex-grow">
                <input
                  type="text"
                  value={videoLink}
                  onChange={handleInputChange}
                  placeholder="Paste YouTube URL here"
                  className="w-full bg-gray-700 text-white px-4 py-3 pr-12 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Youtube className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
              <button
                onClick={handleSubmit}
                disabled={isProcessing}
                className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out ${
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

          <h2 className="text-3xl text-white font-bold mb-8">Your Projects</h2>
          {isLoading ? (
            <div className="text-white">Loading projects...</div>
          ) : projects.length > 0 ? (
            <div className="space-y-6">
              {projects.map((project) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  onDelete={handleDeleteProject}
                />
              ))}
            </div>
          ) : (
            <div className="text-white">No projects found. Start by processing a YouTube video!</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;