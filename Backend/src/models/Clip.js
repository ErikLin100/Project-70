const mongoose = require('mongoose');

const ClipSchema = new mongoose.Schema({
    title: String,
    url: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Clip', ClipSchema);