const express = require('express');

const {
  createProject,
  deleteProject,
  getProjectDetail,
  getProjects,
  updateProject,
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getProjects);
router.get('/:id', getProjectDetail);

router.use(protect);

router.post('/', createProject);
router.patch('/:id', updateProject);
router.delete('/:id', deleteProject);

module.exports = router;