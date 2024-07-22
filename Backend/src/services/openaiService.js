const { OpenAI } = require('openai');
const fs = require('fs');
require('dotenv').config(); // Load environment variables from .env file

const openai = new OpenAI(process.env.OPENAI_API_KEY);

const transcribeAudio = async (audioPath) => {
  try {
    const audioFile = fs.createReadStream(audioPath);
    const transcription = await openai.audio.transcriptions.create(
      {
        model: 'whisper-1',
        file: audioFile,
        response_format: "verbose_json",
        timestamp_granularities: ["segment"],
        
        
      }
    );
    console.log('Transcription Response:', transcription);
    return transcription.data;
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw error;
  }
};

module.exports = {
  transcribeAudio,
};