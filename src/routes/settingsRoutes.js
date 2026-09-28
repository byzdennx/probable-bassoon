const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/authMiddleware');
const settingsController = require('../controllers/settingsController');

router.get('/', isAuthenticated, settingsController.getSettings);
router.post('/update', isAuthenticated, settingsController.updateSettings);
router.post('/password', isAuthenticated, settingsController.changePassword);
router.post('/api-key', isAuthenticated, settingsController.generateApiKey);

module.exports = router;
