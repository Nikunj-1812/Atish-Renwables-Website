const express = require('express');

const { uploadImage } = require('../controllers/uploadController');
const upload = require('../middleware/upload');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.post('/', upload.single('image'), uploadImage);

module.exports = router;