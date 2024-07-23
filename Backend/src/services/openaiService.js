const { OpenAI } = require('openai');
const fs = require('fs');
require('dotenv').config(); // Load environment variables from .env file

const openai = new OpenAI(process.env.OPENAI_API_KEY);

const transcribeAudio = async (audioPath) => {
  try {
    console.log('Sending to API...')
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
    return transcription.data.segments; // Adjust to return only segments
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw error;
  }
};

const identifyTopics = async (segments) => {
  try {
    const prompt = `
    Given the following transcribed video segments with timestamps, identify the main topics discussed in each segment and return a JSON object with topics and their corresponding time ranges.

    Segments:
    ${segments.map(segment => JSON.stringify(segment)).join('\n')}
    `;
    
    const response = await openai.completions.create({
      model: 'gpt-4',
      prompt: prompt,
      max_tokens: 1500 // Adjust as needed
    });

    const topics = JSON.parse(response.choices[0].text);
    console.log('Topic Identification Response:', topics);
    return topics;
  } catch (error) {
    console.error('Error identifying topics:', error);
    throw error;
  }
};

module.exports = {
  transcribeAudio,
  identifyTopics,
};