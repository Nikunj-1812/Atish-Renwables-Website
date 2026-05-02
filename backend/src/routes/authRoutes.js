const express = require('express');

const { loginAdmin, logoutAdmin } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { loginLimiter } = require('../middleware/rateLimiters');

const router = express.Router();

router.post('/login', loginLimiter, loginAdmin);
router.post('/logout', protect, logoutAdmin);

module.exports = router;