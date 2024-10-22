import { useEffect, useState } from 'react';
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Clock } from 'lucide-react';
import PropTypes from 'prop-types';

const VideoEditor = ({ title, description, url, duration }) => {
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    const storage = getStorage();
    const videoRef = ref(storage, url);
    getDownloadURL(videoRef)
      .then(setVideoUrl)
      .catch((error) => console.error("Error fetching video URL:", error));
  }, [url]);

  return (
    <Card className="bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-700 transition duration-150 ease-in-out overflow-hidden mb-8">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl text-white font-semibold flex items-center">
          <Video className="mr-2" size={24} />
          <span className="truncate">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {videoUrl && (
          <AspectRatio ratio={16 / 9} className="mb-4">
            <video controls className="rounded-md object-cover w-full h-full">
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </AspectRatio>
        )}
        <p className="text-gray-400 mb-4">{description}</p>
        {duration && (
          <div className="flex items-center text-green-400 font-bold">
            <Clock className="mr-2" size={20} />
            <span>{duration} seconds</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

VideoEditor.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  duration: PropTypes.number
};

export default VideoEditor;
