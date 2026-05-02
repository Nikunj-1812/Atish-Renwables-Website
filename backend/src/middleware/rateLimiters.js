const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts. Please try again later.',
    data: null,
    errors: ['Too many login attempts. Please try again later.'],
  },
});

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
    data: null,
    errors: ['Too many requests. Please try again later.'],
  },
});

const solarLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
    data: null,
    errors: ['Too many requests. Please try again later.'],
  },
});

const vcardLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
    data: null,
    errors: ['Too many requests. Please try again later.'],
  },
});

module.exports = {
  contactLimiter,
  loginLimiter,
  solarLimiter,
  vcardLimiter,
};