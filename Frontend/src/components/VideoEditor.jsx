import React, { useEffect, useState } from 'react';
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const VideoEditor = ({ title, description, url }) => {
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    const storage = getStorage();
    const videoRef = ref(storage, url);
    getDownloadURL(videoRef)
      .then(setVideoUrl)
      .catch((error) => console.error("Error fetching video URL:", error));
  }, [url]);

  return (
    <Card className="w-full mb-8">
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
      </CardContent>
    </Card>
  );
};

export default VideoEditor;