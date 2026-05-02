const express = require('express');

const { calculateSolarEstimate } = require('../controllers/solarCalculatorController');
const { solarLimiter } = require('../middleware/rateLimiters');

const router = express.Router();

router.post('/calculate', solarLimiter, calculateSolarEstimate);

module.exports = router;