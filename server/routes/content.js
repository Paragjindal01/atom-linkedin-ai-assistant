const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');
const authMiddleware = require('../middleware/authMiddleware');

// Protect all routes
router.use(authMiddleware);

router.post('/generate', contentController.generateAIContent);
router.get('/history', contentController.getContentHistory);
router.delete('/:id', contentController.deleteContent);

module.exports = router;
