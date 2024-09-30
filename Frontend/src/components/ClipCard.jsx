import { useEffect, useState } from 'react';
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { FaCheck, FaTimes } from 'react-icons/fa';

const ClipCard = ({ id, title, description, url, duration, onDelete, isSelected, onSelect, onEditingOptionChange }) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [captionsEnabled, setCaptionsEnabled] = useState(true); // Default to true
  const [phoneRatioEnabled, setPhoneRatioEnabled] = useState(true); // Default to true

  useEffect(() => {
    const storage = getStorage();
    const videoRef = ref(storage, url);
    getDownloadURL(videoRef)
      .then(setVideoUrl)
      .catch((error) => console.error("Error fetching video URL:", error));
  }, [url]);

  useEffect(() => {
    // Update editing options when captions or phone ratio changes
    onEditingOptionChange({ id, captionsEnabled, phoneRatioEnabled });
  }, [captionsEnabled, phoneRatioEnabled, onEditingOptionChange, id]);

  const handleDeleteClick = () => setShowDeleteConfirm(true);
  const handleConfirmDelete = () => {
    onDelete(id);
    setShowDeleteConfirm(false);
  };
  const handleCancelDelete = () => setShowDeleteConfirm(false);
  const handleSelect = () => onSelect(id);

  const toggleCaptions = () => setCaptionsEnabled(!captionsEnabled);
  const togglePhoneRatio = () => setPhoneRatioEnabled(!phoneRatioEnabled);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <input 
            type="checkbox" 
            checked={isSelected} 
            onChange={handleSelect} 
            className="form-checkbox h-5 w-5 text-green-600 border-gray-300 rounded focus:ring-green-500 mr-2" 
          />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {videoUrl && (
          <AspectRatio ratio={16 / 9}>
            <video controls className="rounded-md object-cover w-full h-full">
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </AspectRatio>
        )}
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        <p className="mt-1 text-sm text-muted-foreground">Duration: {duration} seconds</p>
        
        <div className="flex space-x-2 mt-4">
          <Button 
            variant={captionsEnabled ? "green" : "gray"} 
            onClick={toggleCaptions} 
            className={`flex items-center ${captionsEnabled ? 'bg-green-500' : 'bg-gray-300'}`}
          >
            {captionsEnabled ? <FaCheck /> : <FaTimes />} Captions
          </Button>
          <Button 
            variant={phoneRatioEnabled ? "green" : "gray"} 
            onClick={togglePhoneRatio} 
            className={`flex items-center ${phoneRatioEnabled ? 'bg-green-500' : 'bg-gray-300'}`}
          >
            {phoneRatioEnabled ? <FaCheck /> : <FaTimes />} 9:16 Format
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {!showDeleteConfirm ? (
          <Button variant="ghost" onClick={handleDeleteClick}>Delete</Button>
        ) : (
          <div className="flex items-center space-x-2">
            <span className="text-sm">Confirm delete?</span>
            <Button variant="destructive" size="sm" onClick={handleConfirmDelete}>Yes</Button>
            <Button variant="outline" size="sm" onClick={handleCancelDelete}>No</Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ClipCard;