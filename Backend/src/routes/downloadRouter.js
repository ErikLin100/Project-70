const express = require('express');
const router = express.Router();
const downloadController = require('../controllers/downloadController');

// POST /api/download
router.post('/', downloadController.downloadVideo);

module.exports = router;