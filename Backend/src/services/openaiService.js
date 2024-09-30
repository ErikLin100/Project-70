const { OpenAI } = require('openai');
const fs = require('fs');
require('dotenv').config(); // Load environment variables from .env file

const openai = new OpenAI(process.env.OPENAI_API_KEY);


const transcribeAudioWithWordTimestamps = async (audioPath) => {
  try {
    console.log('Sending to Whisper API for word-level transcription...');
    const audioFile = fs.createReadStream(audioPath);
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      response_format: "verbose_json",
      timestamp_granularities: ["word"]
    });
    console.log('Word-level transcription completed');
    return transcription;
  } catch (error) {
    console.error('Error transcribing audio with word timestamps:', error);
    throw error;
  }
};

const transcribeAudio = async (audioPath) => {
  try {
    console.log('Sending to API...');
    const audioFile = fs.createReadStream(audioPath);
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      response_format: "verbose_json",
    });
    console.log('Chunk transcription completed');
    return transcription;
  } catch (error) {
    console.error('Error transcribing audio chunk:', error);
    throw error;
  }
};

const identifyTopics = async (segments) => {
  try {
    const segmentData = segments.map(segment => ({
      text: segment.text,
      start: segment.start,
      end: segment.end
    }));

    const prompt = `
Analyze the following transcribed segments from a long-form video content. Identify distinct, complete topics or discussions. For each topic:

1. Provide a simple, descriptive title (max 30 characters).
2. Identify the full segment that captures the entire topic or discussion from start to finish.
3. Format the time range as start_second-end_second (e.g., 90-225).
4. Ensure each selected segment is self-contained, providing full context without cutting off mid-thought or mid-sentence.
5. Each segment MUST be at least 30 seconds long, and ideally between 2 to 6 minutes in duration.
6. Do not include segments shorter than 30 seconds under any circumstances.
8. For topics longer than 6 minutes, try to find logical break points to split them into multiple segments, each at least 2 minutes long.
9. Avoid overlapping segments. If topics blend together, choose the most logical breakpoint.
10. Include a few seconds before and after the main content to capture more context, if available.

Aim to identify approximately 15-30 segments for a 3-hour video, scaling proportionally for shorter or longer content.

Return ONLY a valid JSON array with the following structure, without any additional text or explanation:

[
  {
    "title": "Descriptive Topic Title",
    "description": "Brief description of the topic (1-2 sentences)",
    "time_range": "start_second-end_second"
    
  }
]

Ensure all time ranges are in the correct second-based format and that the JSON is valid without any trailing commas.

Transcribed Segments:
${JSON.stringify(segmentData)}
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.6,
      max_tokens: 4000
    });

    const topicsText = response.choices[0].message.content;
    console.log('Raw topics response:', topicsText);

    // Remove code block markers if present
    const jsonString = topicsText.replace(/```json\n|\n```/g, '').trim();
    
    const parsedTopics = JSON.parse(jsonString);
    console.log('Parsed topics:', JSON.stringify(parsedTopics, null, 2));

    // Validate and filter topics
    const validatedTopics = parsedTopics.filter(topic => {
      const [start, end] = topic.time_range.split('-').map(Number);
      return (end - start) >= 60; // Ensure minimum 60 seconds duration
    });

    console.log('Validated topics:', JSON.stringify(validatedTopics, null, 2));

    return validatedTopics;
  } catch (error) {
    console.error('Error identifying topics:', error);
    throw error;
  }
};
module.exports = {
  transcribeAudio,
  transcribeAudioWithWordTimestamps,
  identifyTopics,
};