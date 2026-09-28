const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/authMiddleware');
const dashboardController = require('../controllers/dashboardController');

router.get('/', isAuthenticated, dashboardController.getDashboard);

module.exports = router;
