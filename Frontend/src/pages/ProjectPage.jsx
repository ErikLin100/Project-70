import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import ClipCard from '../components/ClipCard';
import VideoEditor from '../components/VideoEditor';

const ProjectPage = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [status, setStatus] = useState('Processing');
  const [clips, setClips] = useState([]);
  const [fullVideoUrl, setFullVideoUrl] = useState('');
  const [error, setError] = useState(null);
  const [selectedClips, setSelectedClips] = useState([]);
  const [editingOptions, setEditingOptions] = useState({});

  const handleEditingOptionChange = useCallback((options) => {
    setEditingOptions(prev => ({
      ...prev,
      [options.id]: {
        captionsEnabled: options.captionsEnabled,
        phoneRatioEnabled: options.phoneRatioEnabled,
      }
    }));
  }, []);

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
        setFullVideoUrl(data.fullVideoUrl || '');

        // Set all clips as selected by default
        setSelectedClips(data.clips.map(clip => clip.id));

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

  const handleDeleteClip = (clipId) => {
    setClips(clips.filter(clip => clip.id !== clipId));
  };

  const handleClipSelect = (clipId) => {
    setSelectedClips(prev => 
      prev.includes(clipId) ? prev.filter(id => id !== clipId) : [...prev, clipId]
    );
  };

  const handleSaveEdits = async () => {
    const response = await fetch('http://localhost:3000/api/save-edits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId,
        selectedClips,
        editingOptions
      })
    });

    if (response.ok) {
      const updatedClips = await response.json();
      setClips(updatedClips);
      setSelectedClips([]); // Clear selection after saving
      setEditingOptions({});
    }
  };

  if (error) {
    return <div className="text-center text-white">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {project && fullVideoUrl && (
          <VideoEditor 
            title={project.title} 
            description={project.description} 
            url={fullVideoUrl} 
            onDelete={() => console.log('Delete video logic here')}
          />
        )}

        <h2 className="text-3xl font-bold text-white mb-8 mt-12">Clips</h2>
        {status === 'Processing' ? (
          <div className="text-center">
            <p className="text-2xl text-white mb-4">Your clips are being generated...</p>
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white mx-auto"></div>
          </div>
        ) : (
          <div className="space-y-8">
            {clips.map((clip) => (
              <ClipCard
                key={clip.id}
                id={clip.id}
                title={clip.title}
                description={clip.description}
                url={clip.url}
                duration={clip.duration}
                onDelete={handleDeleteClip}
                onSelect={handleClipSelect}
                isSelected={selectedClips.includes(clip.id)}
                onEditingOptionChange={handleEditingOptionChange}
              />
            ))}
          </div>
        )}
        <button 
          onClick={handleSaveEdits} 
          className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition duration-300"
        >
          Save Edits
        </button>
      </div>
    </div>
  );
};

export default ProjectPage;
