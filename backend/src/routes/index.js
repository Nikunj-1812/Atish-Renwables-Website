const express = require('express');

const authRoutes = require('./authRoutes');
const brochureRoutes = require('./brochureRoutes');
const contactRoutes = require('./contactRoutes');
const leadRoutes = require('./leadRoutes');
const solarRoutes = require('./solarRoutes');
const vcardRoutes = require('./vcardRoutes');
const healthRoutes = require('./healthRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/brochure', brochureRoutes);
router.use('/vcard', vcardRoutes);
router.use('/solar', solarRoutes);
router.use('/leads', leadRoutes);
router.use('/contact', contactRoutes);
router.use('/health', healthRoutes);

module.exports = router;