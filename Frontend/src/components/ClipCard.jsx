import { useEffect, useState } from 'react';
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const ClipCard = ({ id, title, description, url, duration, onDelete }) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const storage = getStorage();
    const videoRef = ref(storage, url);
    getDownloadURL(videoRef)
      .then(setVideoUrl)
      .catch((error) => console.error("Error fetching video URL:", error));
  }, [url]);

  const handleDeleteClick = () => setShowDeleteConfirm(true);
  const handleConfirmDelete = () => {
    onDelete(id);
    setShowDeleteConfirm(false);
  };
  const handleCancelDelete = () => setShowDeleteConfirm(false);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
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