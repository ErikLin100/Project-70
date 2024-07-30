const { transcribeAudio, identifyTopics } = require('../services/openaiService');
const path = require('path');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const { generateClips } = require('./clipsController');

ffmpeg.setFfmpegPath(ffmpegPath);

exports.processVideo = async ({ videoFilePath }) => {
  try {
    const tempDir = path.join(__dirname, '../temp');
    const audioFilePath = path.join(tempDir, 'audio.mp3');

    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    await extractAudio(videoFilePath, audioFilePath);

    console.log('Calling transcribeAudio with:', audioFilePath);
    const transcriptionResult = await transcribeAudio(audioFilePath);

    if (transcriptionResult && transcriptionResult.segments) {
      console.log('Number of segments:', transcriptionResult.segments.length);
      const topicsResult = await identifyTopics(transcriptionResult.segments);
      console.log('Identified Topics:', topicsResult);
      
      // Generate clips using the identified topics
      const clips = await generateClips(videoFilePath, topicsResult);
      
      return { topics: topicsResult, clips };
    } else {
      throw new Error('Transcription result is missing segments');
    }
  } catch (error) {
    console.error('Error during audio processing:', error);
    throw error;
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