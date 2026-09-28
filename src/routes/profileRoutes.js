const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/authMiddleware');
const profileController = require('../controllers/profileController');

router.get('/', isAuthenticated, profileController.getProfile);
router.post('/delete', isAuthenticated, profileController.deleteAccount);

module.exports = router;
