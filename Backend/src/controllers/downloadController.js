const ytdl = require('@distube/ytdl-core');
const path = require('path');
const fs = require('fs');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const { processVideo } = require('./videoProcessingController');

ffmpeg.setFfmpegPath(ffmpegPath);

exports.downloadVideo = async (req, res) => {
  const youtubeUrl = req.body.url;
  const uid = req.body.uid;

  if (!uid) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const info = await ytdl.getInfo(youtubeUrl);
    const videoTitle = info.videoDetails.title.replace(/[^\w\s-]/gi, '');
    const sanitizedTitle = videoTitle.replace(/\s+/g, '_').toLowerCase();

    const videoFilePath = path.join(__dirname, '../temp', `${sanitizedTitle}.webm`);

    const videoStream = ytdl(youtubeUrl, {
      quality: 'highestvideo',
      filter: 'videoandaudio',
      format: 'webm'
    });

    const videoFileStream = fs.createWriteStream(videoFilePath);
    videoStream.pipe(videoFileStream);

    videoFileStream.on('finish', async () => {
      try {
        const result = await processVideo({ videoFilePath, videoTitle, uid });
        res.status(200).json({ message: 'Video processed successfully', result });
      } catch (error) {
        console.error('Error processing video:', error);
        res.status(500).json({ error: 'Failed to process video', details: error.message });
      }
    });

  } catch (err) {
    console.error('Error fetching video info:', err);
    res.status(500).json({ error: 'Failed to fetch video information', details: err.message });
  }
};