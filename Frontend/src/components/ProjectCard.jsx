import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Video, Calendar, Trash2 } from 'lucide-react';

const ProjectCard = ({ project, onDelete }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [statusBarClass, setStatusBarClass] = useState('bg-gray-500'); // Default color

  useEffect(() => {
    console.log('Project status:', project.status);
    if (typeof project.status === 'string') {
      const lowercaseStatus = project.status.toLowerCase();
      if (lowercaseStatus === 'processing') {
        setStatusBarClass('bg-yellow-400 animate-pulse');
      } else if (lowercaseStatus === 'completed' || lowercaseStatus === 'done') {
        setStatusBarClass('bg-green-500');
      } else {
        setStatusBarClass('bg-gray-500'); // Default for unknown status
      }
    } else {
      console.error('Project status is not a string:', project.status);
    }
  }, [project.status]);

  const formatDate = (dateValue) => {
    if (dateValue && typeof dateValue === 'object' && '_seconds' in dateValue) {
      const date = new Date(dateValue._seconds * 1000);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    }
    return 'Invalid Date';
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowConfirmModal(true);
  };

  const confirmDelete = () => {
    onDelete(project.id);
    setShowConfirmModal(false);
  };

  return (
    <div className="relative">
      <Link to={`/project/${project.id}`} className="block w-full">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-700 transition duration-150 ease-in-out h-48 flex flex-col justify-between relative overflow-hidden">
          <div className={`absolute top-0 left-0 w-full h-1.5 ${statusBarClass}`} />
          <div>
            <h3 className="text-xl text-white font-semibold mb-2 truncate">{project.title}</h3>
            <p className="text-gray-400 mb-2">Status: {project.status}</p>
          </div>
          <div className="flex justify-between items-end">
            {project.clipCount !== undefined && (
              <div className="flex items-center text-green-400 font-bold">
                <Video className="mr-2" size={20} />
                <span>{project.clipCount} clips</span>
              </div>
            )}
            {project.createdAt && (
              <div className="flex items-center text-white text-sm">
                <Calendar className="mr-1" size={14} />
                <span>{formatDate(project.createdAt)}</span>
              </div>
            )}
          </div>
        </div>
      </Link>
      <button
        onClick={handleDelete}
        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
      >
        <Trash2 size={16} />
      </button>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Are you sure you want to delete this project?</h3>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

ProjectCard.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    clipCount: PropTypes.number,
    createdAt: PropTypes.shape({
      _seconds: PropTypes.number,
      _nanoseconds: PropTypes.number
    }),
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ProjectCard;

