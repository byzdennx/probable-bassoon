const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/authMiddleware');
const usageController = require('../controllers/usageController');

router.get('/', isAuthenticated, usageController.getUsage);

module.exports = router;
