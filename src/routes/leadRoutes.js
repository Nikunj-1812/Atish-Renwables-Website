const express = require('express');

const { getAllLeads, updateLeadStatus, deleteLead } = require('../controllers/leadController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', getAllLeads);
router.put('/:id/status', updateLeadStatus);
router.delete('/:id', deleteLead);

module.exports = router;