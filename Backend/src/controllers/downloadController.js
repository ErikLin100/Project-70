const ytdl = require('@distube/ytdl-core');
const path = require('path');
const fs = require('fs');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
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
      extractAudio(videoFilePath, audioFilePath);
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

const extractAudio = (videoPath, audioPath) => {
  ffmpeg(videoPath)
    .output(audioPath)
    .on('end', () => {
      console.log('Audio file extracted successfully');
      res.json({ videoFilePath, audioFilePath });
    })
    .on('error', (err) => {
      console.error('Error extracting audio:', err);
      res.status(500).json({ error: err.message });
    })
    .run();
};