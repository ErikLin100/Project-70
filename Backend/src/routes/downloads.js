const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const downloadService = require('../services/downloadService');

// POST /api/downloads
router.post('/', [
  body('youtubeUrl').isURL().withMessage('Invalid YouTube URL'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { youtubeUrl } = req.body;
    const result = await downloadService.processDownload(youtubeUrl);

    return res.status(200).json({ message: 'Video download initiated', data: result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;