const ytdl = require('@distube/ytdl-core');
const path = require('path');
const fs = require('fs');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const { processVideo } = require('./videoProcessingController');

ffmpeg.setFfmpegPath(ffmpegPath);

exports.downloadVideo = async (req, res) => {
  const youtubeUrl = req.body.url;

  try {
    const info = await ytdl.getInfo(youtubeUrl);
    const videoTitle = info.videoDetails.title.replace(/[^\w\s]/gi, '');

    const videoFilePath = path.join(__dirname, '../temp', `video.webm`);

    const videoStream = ytdl(youtubeUrl, {
      quality: 'highestvideo',
      filter: 'videoandaudio',
      format: 'webm'
    });

    const videoFileStream = fs.createWriteStream(videoFilePath);
    videoStream.pipe(videoFileStream);

    videoFileStream.on('finish', async () => {
      console.log('Video file downloaded successfully');
      await processVideo({ videoFilePath }); // Call the processVideo function with the videoFilePath
    });

    videoFileStream.on('error', (err) => {
      console.error('Error writing video file:', err);
      res.status(500).json({ error: err.message });
    });

    res.status(200).json({ message: 'Video download started and processing will begin shortly' });

  } catch (err) {
    console.error('Error fetching video info:', err);
    res.status(500).json({ error: 'Failed to fetch video information' });
  }
};