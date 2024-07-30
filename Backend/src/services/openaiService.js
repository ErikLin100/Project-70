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
Analyze the following transcribed video segments and identify main topics that could potentially go viral on social media. For each topic:

1. Provide a catchy, attention-grabbing title (max 20 characters).
2. Identify a segment with full context (aim for 60-240 seconds in length).
3. Include a brief description of why this segment could be interesting or shareable (max 150 characters).
4. Format the time range as start_second-end_second (e.g., 90-225).

Return ONLY a valid JSON array with the following structure, without any additional text or explanation:

[
  {
    "title": "Catchy Title Here",
    "time_range": "start_second-end_second",
    "description": "Brief description of why this is interesting or shareable"
  }
]

Ensure all time ranges are in the correct second-based format and that the JSON is valid without any trailing commas.

Transcribed Segments:
${segmentChunk.map(segment => JSON.stringify(segment)).join('\n')}
`;




   
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000
    });

    const topicsText = response.choices[0].message.content;
    console.log('Raw topics response:', topicsText);

    // Remove code block markers if present
    const jsonString = topicsText.replace(/```json\n|\n```/g, '').trim();
    
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error identifying topics:', error);
    return { error: 'Unable to parse topics', rawResponse: topicsText };
  }
};

module.exports = {
  transcribeAudio,
  identifyTopics,
};