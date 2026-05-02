const express = require('express');

const { downloadVCard } = require('../controllers/vcardController');
const { vcardLimiter } = require('../middleware/rateLimiters');

const router = express.Router();

router.get('/download', vcardLimiter, downloadVCard);

module.exports = router;