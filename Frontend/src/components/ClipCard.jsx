import { useState, useEffect } from 'react';
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { Video,Trash2, Subtitles, Smartphone } from 'lucide-react';
import PropTypes from 'prop-types';

const ClipCard = ({ id, title, description, url, duration, onDelete, isSelected, onSelect, onEditingOptionChange }) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [captionsEnabled, setCaptionsEnabled] = useState(true);
  const [phoneRatioEnabled, setPhoneRatioEnabled] = useState(true);

  useEffect(() => {
    const storage = getStorage();
    const videoRef = ref(storage, url);
    getDownloadURL(videoRef)
      .then(setVideoUrl)
      .catch((error) => console.error("Error fetching video URL:", error));
  }, [url]);

  useEffect(() => {
    onEditingOptionChange({ id, captionsEnabled, phoneRatioEnabled });
  }, [captionsEnabled, phoneRatioEnabled, onEditingOptionChange, id]);

  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    onDelete(id);
    setShowDeleteConfirm(false);
  };

  const toggleCaptions = () => setCaptionsEnabled(!captionsEnabled);
  const togglePhoneRatio = () => setPhoneRatioEnabled(!phoneRatioEnabled);

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-700 transition duration-150 ease-in-out overflow-hidden">
      <div className="flex">
        <div className="w-2/3 pr-4">
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onSelect(id)}
              className="form-checkbox h-5 w-5 text-green-500 border-gray-600 rounded focus:ring-green-500 mr-2"
            />
            <h3 className="text-xl text-white font-semibold truncate">{title}</h3>
          </div>
          <div className="aspect-w-16 aspect-h-9 mb-2">
            {videoUrl && (
              <video controls className="rounded-md object-cover w-full h-full">
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
          <p className="text-gray-400 mb-2">{description}</p>
          <div className="flex items-center text-white text-sm">
            <Video className="mr-2" size={16} />
            <span>{duration} seconds</span>
          </div>
        </div>
        <div className="w-1/3 flex flex-col justify-between">
          <div>
            <h4 className="text-white font-semibold mb-2">Editing Options</h4>
            <button
              onClick={toggleCaptions}
              className={`w-full mb-2 py-2 px-4 rounded flex items-center justify-center ${
                captionsEnabled ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-600 hover:bg-gray-500'
              }`}
            >
              <Subtitles className="mr-2" size={16} />
              Captions {captionsEnabled ? 'On' : 'Off'}
            </button>
            <button
              onClick={togglePhoneRatio}
              className={`w-full py-2 px-4 rounded flex items-center justify-center ${
                phoneRatioEnabled ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-600 hover:bg-gray-500'
              }`}
            >
              <Smartphone className="mr-2" size={16} />
              9:16 Format {phoneRatioEnabled ? 'On' : 'Off'}
            </button>
          </div>
          <div>
            {!showDeleteConfirm ? (
              <button 
                onClick={handleDeleteClick} 
                className="w-full mt-4 py-2 px-4 rounded text-red-500 hover:text-red-400 flex items-center justify-center"
              >
                <Trash2 className="mr-2" size={16} />
                Delete
              </button>
            ) : (
              <div className="text-center mt-4">
                <p className="text-white mb-2">Confirm delete?</p>
                <div className="flex justify-between">
                  <button 
                    onClick={handleConfirmDelete} 
                    className="w-1/2 mr-1 py-2 px-4 rounded bg-red-500 hover:bg-red-600 text-white"
                  >
                    Yes
                  </button>
                  <button 
                    onClick={() => setShowDeleteConfirm(false)} 
                    className="w-1/2 ml-1 py-2 px-4 rounded bg-gray-600 hover:bg-gray-500 text-white"
                  >
                    No
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

ClipCard.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  duration: PropTypes.number.isRequired,
  onDelete: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  onEditingOptionChange: PropTypes.func.isRequired
};

export default ClipCard;
