const Clip = require('../models/Clip');

exports.createClip = async (req, res) => {
    const { title, url } = req.body;

    const newClip = new Clip({ title, url });
    try {
        const savedClip = await newClip.save();
        res.json(savedClip);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getClips = async (req, res) => {
    try {
        const clips = await Clip.find();
        res.json(clips);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};