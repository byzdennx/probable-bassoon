const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/authMiddleware');
const exploreController = require('../controllers/exploreController');

router.get('/', isAuthenticated, exploreController.getExplore);

module.exports = router;
