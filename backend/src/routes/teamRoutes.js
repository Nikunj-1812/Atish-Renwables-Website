const express = require('express');

const {
  createTeamMember,
  deleteTeamMember,
  getTeam,
  getTeamDetail,
  updateTeamMember,
} = require('../controllers/teamController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getTeam);
router.get('/:id', getTeamDetail);

router.use(protect);

router.post('/', createTeamMember);
router.patch('/:id', updateTeamMember);
router.delete('/:id', deleteTeamMember);

module.exports = router;