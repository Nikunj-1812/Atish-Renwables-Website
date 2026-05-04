const express = require('express');

const {
	getAllLeads,
	getLeadDashboardStats,
	getLeadDetail,
	updateLead,
	deleteLead,
	exportLeads,
} = require('../controllers/leadController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/stats', getLeadDashboardStats);
router.get('/export', exportLeads);
router.get('/', getAllLeads);
router.get('/:id', getLeadDetail);
router.put('/:id/status', updateLead);
router.patch('/:id', updateLead);
router.delete('/:id', deleteLead);

module.exports = router;