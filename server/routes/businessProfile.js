const express = require('express');
const router = express.Router();
const businessProfileController = require('../controllers/businessProfileController');
const authMiddleware = require('../middleware/authMiddleware');

// Protect all routes with authMiddleware
router.use(authMiddleware);

router.get('/', businessProfileController.getProfiles);
router.post('/', businessProfileController.createProfile);
router.put('/:id', businessProfileController.updateProfile);
router.delete('/:id', businessProfileController.deleteProfile);

module.exports = router;
