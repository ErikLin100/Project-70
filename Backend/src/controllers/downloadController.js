const ytdl = require('ytdl-core');
const path = require('path');
const fs = require('fs');

exports.downloadVideo = async (req, res) => {
  const youtubeUrl = req.body.url;

  try {
    const info = await ytdl.getInfo(youtubeUrl);
    const videoTitle = info.videoDetails.title.replace(/[^\w\s]/gi, '');

    const outputFilePath = path.join(__dirname, '../temp', `${videoTitle}.webm`);

    const videoStream = ytdl(youtubeUrl, {
      quality: 'highestvideo',
      filter: 'videoandaudio',
      format: 'webm'
    });
    const fileStream = fs.createWriteStream(outputFilePath);

    videoStream.pipe(fileStream);

    fileStream.on('finish', () => {
      res.status(200).json({ message: 'Video downloaded successfully', filePath: outputFilePath });
    });

    fileStream.on('error', (err) => {
      console.error('Error writing video file:', err);
      res.status(500).json({ error: err.message });
    });
  } catch (err) {
    console.error('Error fetching video info:', err);
    res.status(500).json({ error: 'Failed to fetch video information' });
  }
};