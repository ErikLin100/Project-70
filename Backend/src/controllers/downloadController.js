const ytdl = require('@distube/ytdl-core');
const path = require('path');
const fs = require('fs');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const axios = require('axios');

ffmpeg.setFfmpegPath(ffmpegPath);

exports.downloadVideo = async (req, res) => {
  const youtubeUrl = req.body.url;

  try {
    const info = await ytdl.getInfo(youtubeUrl);
    const videoTitle = info.videoDetails.title.replace(/[^\w\s]/gi, '');

    const videoFilePath = path.join(__dirname, '../temp', `video.webm`);
    const audioFilePath = path.join(__dirname, '../temp', `audio.mp3`);

    const videoStream = ytdl(youtubeUrl, {
      quality: 'highestvideo',
      filter: 'videoandaudio',
      format: 'webm'
    });

    const videoFileStream = fs.createWriteStream(videoFilePath);
    videoStream.pipe(videoFileStream);

    videoFileStream.on('finish', () => {
      console.log('Video file downloaded successfully');
      extractAudio(videoFilePath, audioFilePath, res);
    });

    videoFileStream.on('error', (err) => {
      console.error('Error writing video file:', err);
      res.status(500).json({ error: err.message });
    });
  } catch (err) {
    console.error('Error fetching video info:', err);
    res.status(500).json({ error: 'Failed to fetch video information' });
  }
};

const extractAudio = (videoPath, audioPath, res) => {
  const ffmpegCommand = ffmpeg(videoPath)
    .output(audioPath)
    .on('end', () => {
      console.log('Audio file extracted successfully');
      const audioFilePath = audioPath; // Define audioFilePath here
      axios.post('http://localhost:3000/api/process-video', { audioFilePath })
        .then(response => {
          console.log('Audio file sent for processing:', response.data);
          res.status(200).json({ message: 'Video and audio files downloaded successfully' });
        })
        .catch(error => {
          console.error('Error sending audio file for processing:', error);
          res.status(500).json({ error: 'Error sending audio file for processing' });
        });
    })
    .on('error', (err) => {
      console.error('Error extracting audio:', err);
      res.status(500).json({ error: err.message });
    });

  ffmpegCommand.run();
};