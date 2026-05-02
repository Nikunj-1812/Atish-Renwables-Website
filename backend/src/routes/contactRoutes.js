const express = require('express');

const { submitContactForm } = require('../controllers/contactController');
const { contactLimiter } = require('../middleware/rateLimiters');

const router = express.Router();

router.post('/', contactLimiter, submitContactForm);

module.exports = router;