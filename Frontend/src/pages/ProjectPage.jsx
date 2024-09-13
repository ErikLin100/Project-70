import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ClipCard from '../components/ClipCard';

const ProjectPage = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [status, setStatus] = useState('Processing');
  const [clips, setClips] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) {
        setError('No project ID provided');
        return;
      }
  
      try {
        const response = await fetch(`http://localhost:3000/api/projects/${projectId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProject(data);
        setStatus(data.status || 'Processing');
        setClips(data.clips || []);
  
        // If still processing, poll again after 5 seconds
        if (data.status === 'Processing') {
          setTimeout(fetchProject, 5000);
        }
      } catch (error) {
        console.error('Error fetching project:', error);
        setError('Failed to fetch project details. Please try again later.');
      }
    };
  
    fetchProject();
  }, [projectId]);

  if (error) {
    return <div className="text-center text-white">{error}</div>;
  }

  const handleDeleteClip = (clipId) => {
    setClips(clips.filter(clip => clip.id !== clipId));
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Your Clips</h1>
        {status === 'Processing' ? (
          <div className="text-center">
            <p className="text-2xl text-white mb-4">Your clips are being generated...</p>
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {clips.map((clip) => (
              <ClipCard
                key={clip.id}
                id={clip.id}
                title={clip.title}
                description={clip.description}
                url={clip.url}
                duration={clip.duration}
                onDelete={handleDeleteClip}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectPage;