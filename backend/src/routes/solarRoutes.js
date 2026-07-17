const express = require('express');

const {
  calculateSolarEstimate,
  downloadPdfReport,
  emailReport,
} = require('../controllers/solarCalculatorController');
const { solarLimiter } = require('../middleware/rateLimiters');

const router = express.Router();

router.post('/calculate', solarLimiter, calculateSolarEstimate);
router.get('/download-pdf', downloadPdfReport);
router.post('/email-report', emailReport);

module.exports = router;