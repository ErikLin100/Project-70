import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Youtube } from 'lucide-react';
import { auth } from '../firebase';
import ProjectCard from '../components/ProjectCard';

const HomePage = () => {
  const [videoLink, setVideoLink] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState('');
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
        setProjects([]);
      } else if (!response.ok) {
        throw new Error('Failed to fetch projects');
      } else {
        const data = await response.json();
        setProjects(data || []);
        
        // Check if the most recent project is still processing
        if (data && data.length > 0) {
          const mostRecentProject = data[0]; // Assuming projects are sorted by creation date
          setIsProcessing(mostRecentProject.status === 'processing');
          if (mostRecentProject.status === 'processing') {
            setProcessingMessage('Your project is being processed. Please wait.');
          } else {
            setProcessingMessage('');
          }
        } else {
          setIsProcessing(false);
          setProcessingMessage('');
        }
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
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
    setProcessingMessage('Your project is being processed. Please wait.');
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
        await fetchProjects();
        setVideoLink('');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error processing video:', error);
      setIsProcessing(false);
      setProcessingMessage('An error occurred while processing your video. Please try again.');
    }
  };

  const handleProjectStatusChange = (projectId, newStatus) => {
    if (newStatus === 'completed') {
      setIsProcessing(false);
      setProcessingMessage('');
      fetchProjects(); // Refresh the project list
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
    }
  };

  return (
    <div className="bg-gray-900 min-h-full w-full flex flex-col">
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-3xl px-4 py-8">
          <h1 className="text-4xl text-white font-bold mb-8">Get Your Clips</h1>
          
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-12">
            {!isProcessing ? (
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
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
                >
                  Process
                </button>
              </div>
            ) : (
              <div className="text-white text-center py-3">
                {processingMessage}
              </div>
            )}
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
                  onStatusChange={handleProjectStatusChange}
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

