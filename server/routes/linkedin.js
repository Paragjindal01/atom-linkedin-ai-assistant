const express = require('express');
const router = express.Router();
const linkedinController = require('../controllers/linkedinController');
const authMiddleware = require('../middleware/authMiddleware');

// Public route for OAuth callback from LinkedIn
router.get('/callback', linkedinController.handleCallback);

// Protected routes
router.use(authMiddleware);

router.get('/status', linkedinController.getStatus);
router.get('/auth-url', linkedinController.getAuthUrl);
router.post('/publish-post', linkedinController.publishPost);
router.post('/schedule-post', linkedinController.schedulePost);
router.get('/scheduled-posts', linkedinController.getScheduledPosts);

module.exports = router;
