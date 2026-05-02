const express = require('express');

const { downloadBrochure } = require('../controllers/brochureController');

const router = express.Router();

router.get('/download', downloadBrochure);

module.exports = router;