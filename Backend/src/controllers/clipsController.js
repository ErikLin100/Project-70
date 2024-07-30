const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

exports.generateClips = async (videoFilePath, topics) => {
  const clipsDir = path.join(__dirname, '../temp/clips');
  if (!fs.existsSync(clipsDir)) {
    fs.mkdirSync(clipsDir);
  }

  const clips = [];

  for (const topic of topics) {
    const [start, end] = topic.time_range.split('-').map(Number);
    const clipPath = path.join(clipsDir, `${topic.title.replace(/\s+/g, '_')}.mp4`);

    await new Promise((resolve, reject) => {
      ffmpeg(videoFilePath)
        .setStartTime(start)
        .setDuration(end - start)
        .output(clipPath)
        .on('end', () => {
          console.log(`Clip generated: ${clipPath}`);
          clips.push({
            title: topic.title,
            description: topic.description,
            path: clipPath
          });
          resolve();
        })
        .on('error', (err) => {
          console.error('Error generating clip:', err);
          reject(err);
        })
        .run();
    });
  }

  return clips;
};