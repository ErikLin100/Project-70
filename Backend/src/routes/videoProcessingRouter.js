const express = require('express');
const router = express.Router();
const { processVideo } = require('../controllers/videoProcessingController');

router.post('/', processVideo);

module.exports = router;