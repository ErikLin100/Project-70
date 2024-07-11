const chokidar = require('chokidar');
const path = require('path');
const { transcribeAndAnalyzeAudio } = require('../services/openaiService');

const downloadDirectory = path.join(__dirname, '../../temp');

const watcher = chokidar.watch(downloadDirectory, {
  persistent: true,
  ignoreInitial: true,
});

const handleNewVideoFile = async (filePath) => {
  try {
    const result = await transcribeAndAnalyzeAudio(filePath);
    // Handle the transcribed text, timestamps, and topic descriptions
    console.log('Transcription Result:', result);

    // You can add additional logic here to process the transcription result
    // and generate video clips or perform any other necessary operations

    console.log('Video processing completed successfully');
  } catch (error) {
    console.error('Error during video processing:', error);
  }
};

watcher.on('add', handleNewVideoFile);

exports.processVideo = async (req, res) => {
  const { filePath } = req.body;

  try {
    const result = await transcribeAndAnalyzeAudio(filePath);
    // Handle the transcribed text, timestamps, and topic descriptions
    console.log('Transcription Result:', result);

    // You can add additional logic here to process the transcription result
    // and generate video clips or perform any other necessary operations

    res.status(200).json({ message: 'Video processing completed successfully' });
  } catch (error) {
    console.error('Error during video processing:', error);
    res.status(500).json({ error: 'Error during video processing' });
  }
};