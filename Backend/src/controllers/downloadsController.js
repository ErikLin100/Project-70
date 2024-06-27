const ytdl = require('ytdl-core');
const path = require('path');
const fs = require('fs');
const { extractAudio } = require('../utils/audioExtractor');

exports.downloadVideo = async (req, res) => {
    const url = req.body.url;
    const videoPath = path.resolve(__dirname, '../temp/video.mp4');

    ytdl(url, { filter: 'audioandvideo' })
        .pipe(fs.createWriteStream(videoPath))
        .on('finish', async () => {
            const audioPath = await extractAudio(videoPath);
            res.json({ audioPath });
        })
        .on('error', (err) => res.status(500).json({ error: err.message }));
};