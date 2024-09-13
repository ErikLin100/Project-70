import { useEffect, useState } from 'react';
import { getStorage, ref, getDownloadURL } from "firebase/storage";

const ClipCard = ({ id, title, description, url, duration, onDelete }) => {
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    const storage = getStorage();
    const videoRef = ref(storage, url);
    getDownloadURL(videoRef)
      .then((url) => {
        setVideoUrl(url);
      })
      .catch((error) => {
        console.error("Error fetching video URL:", error);
      });
  }, [url]);

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
      {videoUrl && (
        <video controls className="w-full h-48 object-cover">
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      <div className="p-4">
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-400 mb-4">{description}</p>
        <p className="text-gray-400 mb-4">Duration: {duration} seconds</p>
        <button
          onClick={() => onDelete(id)}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ClipCard;