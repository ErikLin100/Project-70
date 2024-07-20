const chokidar = require('chokidar');
const path = require('path');
const { transcribeAndAnalyzeAudio } = require('../services/openaiService');

const downloadDirectory = path.join(__dirname, '../temp');

const watcher = chokidar.watch(downloadDirectory, {
  persistent: true,
  ignoreInitial: true,
});

const handleNewAudioFile = async (filePath) => {
  try {
    const result = await transcribeAndAnalyzeAudio(filePath);
    console.log('Transcription Result:', result);

    // You can add additional logic here to process the transcription result
    // and generate video clips or perform any other necessary operations

    console.log('Audio processing completed successfully');
  } catch (error) {
    console.error('Error during audio processing:', error);
  }
};

watcher.on('add', (filePath) => {
  if (path.basename(filePath) === 'audio.mp3') {
    handleNewAudioFile(filePath);
  }
});

exports.processVideo = async (req, res) => {
  try {
    res.status(200).json({ message: 'Video processing initiated' });
  } catch (error) {
    console.error('Error during video processing:', error);
    res.status(500).json({ error: 'Error during video processing' });
  }
};