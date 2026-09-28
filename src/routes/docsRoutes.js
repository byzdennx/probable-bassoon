const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/authMiddleware');
const docsController = require('../controllers/docsController');

router.get('/', isAuthenticated, docsController.getDocs);

module.exports = router;
