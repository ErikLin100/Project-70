const express = require('express');
const { createClip, getClips } = require('../controllers/clipsController');
const router = express.Router();

router.post('/', createClip);
router.get('/', getClips);

module.exports = router;