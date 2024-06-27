const ytdl = require('ytdl-core');
const fs = require('fs');
const path = require('path');

async function processDownload(youtubeUrl) {
  try {
    const info = await ytdl.getInfo(youtubeUrl);
    const title = info.videoDetails.title.replace(/[^\w\s]/gi, '');

    const downloadPath = path.join(__dirname, '../../downloads', `${title}.mp4`);

    const video = ytdl(youtubeUrl, { quality: 'highestaudio' })
      .pipe(fs.createWriteStream(downloadPath));

    return { title, downloadPath };
  } catch (error) {
    throw error;
  }
}

module.exports = {
  processDownload,
};