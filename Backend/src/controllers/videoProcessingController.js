const { transcribeAudio, identifyTopics } = require('../services/openaiService');
const path = require('path');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const { generateClips } = require('./clipsController');
const { uploadFile, saveProjectToFirestore, saveClipToFirestore, updateProjectStatus } = require('../services/firebaseService');

ffmpeg.setFfmpegPath(ffmpegPath);

const ffprobePath = require('@ffprobe-installer/ffprobe').path;
ffmpeg.setFfprobePath(ffprobePath);

const splitAudio = (audioPath, chunkDuration = 1500) => {  // 1500 seconds = 25 minutes
  return new Promise((resolve, reject) => {
    const audioDir = path.dirname(audioPath);
    const chunkDir = path.join(audioDir, 'chunks');
    if (!fs.existsSync(chunkDir)) {
      fs.mkdirSync(chunkDir);
    }

    ffmpeg.ffprobe(audioPath, (err, metadata) => {
      if (err) {
        reject(err);
        return;
      }

      const duration = metadata.format.duration;
      const chunks = Math.ceil(duration / chunkDuration);
      const chunkPromises = [];

      for (let i = 0; i < chunks; i++) {
        const start = i * chunkDuration;
        const output = path.join(chunkDir, `chunk_${i}.mp3`);

        chunkPromises.push(
          new Promise((resolveChunk, rejectChunk) => {
            ffmpeg(audioPath)
              .setStartTime(start)
              .setDuration(chunkDuration)
              .output(output)
              .on('end', () => resolveChunk(output))
              .on('error', rejectChunk)
              .run();
          })
        );
      }

      Promise.all(chunkPromises)
        .then((chunkPaths) => resolve(chunkPaths))
        .catch(reject);
    });
  });
};

const extractAudio = (videoPath, audioPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .outputOptions('-vn')
      .outputOptions('-ar', '16000')
      .outputOptions('-ac', '1')
      .outputOptions('-b:a', '64k')
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

const clearTempFolder = () => {
  const tempDir = path.join(__dirname, '../temp');
  fs.readdir(tempDir, (err, files) => {
    if (err) {
      console.error('Error reading temp directory:', err);
      return;
    }

    for (const file of files) {
      fs.unlink(path.join(tempDir, file), err => {
        if (err) console.error(`Failed to delete ${file}:`, err);
        else console.log(`Successfully deleted ${file}`);
      });
    }
  });
};

exports.processVideo = async ({ videoFilePath, videoTitle, uid }) => {
  try {
    console.log('Starting video processing');
    const tempDir = path.join(__dirname, '../temp');
    const audioFilePath = path.join(tempDir, 'audio.mp3');

    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    if (!uid) {
      throw new Error('User ID is required for processing video');
    }

    // Upload full video to Firebase Storage first
    const videoUrl = await uploadFile(videoFilePath, `videos/${path.basename(videoFilePath)}`);

    // Create project with 'Processing' status
    const projectId = await saveProjectToFirestore({
      title: videoTitle,
      status: 'Processing',
      createdAt: new Date(),
      uid: uid,
      fullVideoUrl: videoUrl // Now this is valid
    });

    console.log('Project created with ID:', projectId);

    await extractAudio(videoFilePath, audioFilePath);

    console.log('Splitting audio into chunks...');
    const audioChunks = await splitAudio(audioFilePath);

    let allTopics = [];

    for (const chunkPath of audioChunks) {
      console.log(`Transcribing chunk: ${chunkPath}`);
      const chunkTranscription = await transcribeAudio(chunkPath);
      
      console.log(`Identifying topics for chunk: ${chunkPath}`);
      const chunkTopics = await identifyTopics(chunkTranscription.segments);
      allTopics = allTopics.concat(chunkTopics);
    }

    console.log('All identified topics:', allTopics);

    // Generate clips using all identified topics
    const clips = await generateClips(videoFilePath, allTopics);

    // Save clips to Firestore
    for (const clip of clips) {
      const clipUrl = await uploadFile(clip.path, `clips/${path.basename(clip.path)}`);
      await saveClipToFirestore({
        projectId,
        title: clip.title,
        description: clip.description,
        url: clipUrl,
        duration: clip.duration
      });
    }

    console.log('All clips saved to Firestore');

    // Update project status to 'Completed'
    await updateProjectStatus(projectId, 'Completed');

    console.log('Project status updated to Completed');

  

    return { projectId, topics: allTopics, clips };
  } catch (error) {
    console.error('Error during video processing:', error);
    throw error;
  }
};