const express = require('express');

const authRoutes = require('./authRoutes');
const brochureRoutes = require('./brochureRoutes');
const contactRoutes = require('./contactRoutes');
const leadRoutes = require('./leadRoutes');
const serviceRoutes = require('./serviceRoutes');
const projectRoutes = require('./projectRoutes');
const teamRoutes = require('./teamRoutes');
const solarRoutes = require('./solarRoutes');
const vcardRoutes = require('./vcardRoutes');
const uploadRoutes = require('./uploadRoutes');
const healthRoutes = require('./healthRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/brochure', brochureRoutes);
router.use('/vcard', vcardRoutes);
router.use('/solar', solarRoutes);
router.use('/leads', leadRoutes);
router.use('/services', serviceRoutes);
router.use('/projects', projectRoutes);
router.use('/team', teamRoutes);
router.use('/upload-image', uploadRoutes);
router.use('/contact', contactRoutes);
router.use('/health', healthRoutes);

module.exports = router;