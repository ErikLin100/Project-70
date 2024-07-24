const { OpenAI } = require('openai');
const fs = require('fs');
require('dotenv').config(); // Load environment variables from .env file

const openai = new OpenAI(process.env.OPENAI_API_KEY);

const transcribeAudio = async (audioPath) => {
  try {
    console.log('Sending to API...');
    const audioFile = fs.createReadStream(audioPath);
    const transcription = await openai.audio.transcriptions.create({
      model: 'whisper-1',
      file: audioFile,
      response_format: "verbose_json",
      timestamp_granularities: ["segment"],
    });
    console.log('Full Transcription Response:', transcription);
    return transcription;
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw error;
  }
};

const identifyTopics = async (segments) => {
  try {
    const prompt = `
    Given the following transcribed video segments with timestamps, identify the main topics discussed in each segment and return a JSON object with topics and their corresponding time ranges.try to make the segments into 20 - 240 second chunks that have some clear context inside of them

    Segments:
    ${segments.map(segment => JSON.stringify(segment)).join('\n')}
    `;
    
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000
    });

    const topicsText = response.choices[0].message.content;
    console.log('Raw topics response:', topicsText);

    // Attempt to parse the response as JSON
    try {
      const topics = JSON.parse(topicsText);
      return topics;
    } catch (parseError) {
      console.error('Failed to parse topics as JSON:', parseError);
      return { error: 'Unable to parse topics', rawResponse: topicsText };
    }
  } catch (error) {
    console.error('Error identifying topics:', error);
    throw error;
  }
};

module.exports = {
  transcribeAudio,
  identifyTopics,
};