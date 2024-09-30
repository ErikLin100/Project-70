const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobePath = require('@ffprobe-installer/ffprobe').path;
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

const path = require('path');
const fs = require('fs').promises;
const { transcribeAudioWithWordTimestamps } = require('../services/openaiService');

exports.generateClips = async (videoFilePath, topics) => {
  const clipsDir = path.join(__dirname, '../temp/clips');
  await fs.mkdir(clipsDir, { recursive: true });

  const clips = [];

  for (let i = 0; i < topics.length; i++) {
    const topic = topics[i];
    let [start, end] = topic.time_range.split('-').map(Number);
    const clipPath = path.join(clipsDir, `clip_${i}.mp4`);
    const captionedClipPath = path.join(clipsDir, `clip_${i}_captioned.mp4`);

    try {
      console.log(`Processing clip ${i} for topic: ${topic.title}`);

      // Generate the clip
      await new Promise((resolve, reject) => {
        ffmpeg(videoFilePath)
          .setStartTime(start)
          .setDuration(end - start)
          .output(clipPath)
          .on('start', (command) => {
            console.log(`FFmpeg clip generation started: ${command}`);
          })
          .on('progress', (progress) => {
            console.log(`Processing: ${progress.percent}% done`);
          })
          .on('end', () => {
            console.log(`Clip generated: ${clipPath}`);
            resolve();
          })
          .on('error', (err) => {
            console.error(`Error generating clip: ${err.message}`);
            reject(err);
          })
          .run();
      });

      // Transcribe and generate subtitles
      console.log('Sending to Whisper API for word-level transcription...');
      const transcription = await transcribeAudioWithWordTimestamps(clipPath);
      console.log('Word-level transcription completed');

      // Generate ASS content
      const assContent = generateASS(transcription.words);
      const assPath = path.join(clipsDir, `clip_${i}.ass`);
      await fs.writeFile(assPath, assContent);

      console.log(`ASS file generated: ${assPath}`);
      console.log(`ASS content (first 200 chars): ${assContent.substring(0, 200)}`);

      // Verify ASS file is accessible
      try {
        await fs.access(assPath, fs.constants.R_OK);
        console.log('ASS file exists and is readable');
      } catch (error) {
        console.error('Error accessing ASS file:', error);
        throw error;
      }

      // Add subtitles to the clip using libass
      await new Promise((resolve, reject) => {
        const escapedAssPath = assPath.replace(/\\/g, '/').replace(/:/g, '\\:');
        ffmpeg(clipPath)
          .outputOptions([
            '-vf',
            `ass='${escapedAssPath}'`
          ])
          .output(captionedClipPath)
          .on('start', (command) => {
            console.log(`FFmpeg subtitle process started: ${command}`);
          })
          .on('progress', (progress) => {
            console.log(`Subtitling: ${progress.percent}% done`);
          })
          .on('stderr', (stderrLine) => {
            console.log('FFmpeg stderr:', stderrLine);
          })
          .on('end', () => {
            console.log(`Captioned clip generated: ${captionedClipPath}`);
            clips.push({
              title: topic.title,
              description: topic.description || '',
              path: captionedClipPath,
              duration: end - start
            });
            resolve();
          })
          .on('error', (err, stdout, stderr) => {
            console.error('Error adding captions to clip:', err.message);
            console.error('FFmpeg stdout:', stdout);
            console.error('FFmpeg stderr:', stderr);
            reject(err);
          })
          .run();
      });

      // Clean up temporary files
      await fs.unlink(clipPath);
      await fs.unlink(assPath);

    } catch (error) {
      console.error(`Error processing clip ${i}:`, error.message);
      console.error('Stack trace:', error.stack);
    }
  }

  return clips;
};

function generateASS(words) {
  let assContent = `[Script Info]
ScriptType: v4.00+
PlayResX: 384
PlayResY: 288
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Arial,20,&H00FFFFFF,&H000000FF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,2,2,2,10,10,10,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
`;

  words.forEach((word) => {
    const start = formatTime(word.start);
    const end = formatTime(word.end);
    assContent += `Dialogue: 0,${start},${end},Default,,0,0,0,,${word.word}\n`;
  });

  return assContent;
}

function formatTime(seconds) {
  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours().toString().padStart(1, '0');
  const mm = date.getUTCMinutes().toString().padStart(2, '0');
  const ss = date.getUTCSeconds().toString().padStart(2, '0');
  const ms = date.getUTCMilliseconds().toString().padStart(2, '0').slice(0, 2);
  return `${hh}:${mm}:${ss}.${ms}`;
}