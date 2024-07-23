const { transcribeAudio } = require('../services/openaiService');
const path = require('path');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');

ffmpeg.setFfmpegPath(ffmpegPath);

exports.processVideo = async ({ videoFilePath }) => {
  try {
    const tempDir = path.join(__dirname, '../temp');
    const audioFilePath = path.join(tempDir, 'audio.mp3');

    // Ensure temp directory exists
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    // Extract audio from the video file
    await extractAudio(videoFilePath, audioFilePath);

    // Debug log before calling the service
    console.log('Calling transcribeAudio with:', audioFilePath);
    const transcriptionResult = await transcribeAudio(audioFilePath);


    if (transcriptionResult && Array.isArray(transcriptionResult)) {
      // Handle the transcription result as needed
      console.log('Segments with Topics:', transcriptionResult);
    } else {
      console.error('Error: Transcription result is null or invalid');
    }
  } catch (error) {
    console.error('Error during audio processing:', error);
  }
};

const extractAudio = (videoPath, audioPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .outputOptions('-vn') // Ensure only audio stream is extracted
      .output(audioPath)
      .on('end', () => {
        console.log('Audio file extracted successfully');
        resolve();
      })
      .on('error', (err) => {
        console.error('Error extracting audio:', err);
        reject(err);
      })
      .run();
  });
};