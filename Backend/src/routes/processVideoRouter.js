const express = require('express');
const { processVideo } = require('../controllers/processVideoController');
const router = express.Router();

router.post('/', processVideo);

module.exports = router;