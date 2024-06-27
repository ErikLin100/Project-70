const express = require('express');
const { downloadVideo } = require('../controllers/downloadsController');
const router = express.Router();

router.post('/download', downloadVideo);

module.exports = router;