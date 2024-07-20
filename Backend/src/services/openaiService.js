const { Transcription } = require('openai');
const fs = require('fs');
require('dotenv').config(); // Load environment variables from .env file

const transcribeAndAnalyzeAudio = async (audioPath) => {
  try {
    console.log('Sending audio file to OpenAI API:', audioPath);

    const transcription = new Transcription(process.env.OPENAI_API_KEY);
    const response = await transcription.createTranscription(
      fs.createReadStream(audioPath),
      'whisper-1',
      {
        prompt: 'Transcribe the audio and identify the topics discussed with timestamps and short descriptions in JSON format.',
        response_format: 'verbose_json',
        timestamp_granularities: ['word']
      }
    );

    // The response will contain the transcribed text, word-level timestamps, and topic descriptions in JSON format
    return response.data;
  } catch (error) {
    console.error('Error transcribing and analyzing audio:', error);
    throw error;
  }
};

module.exports = {
  transcribeAndAnalyzeAudio,
};