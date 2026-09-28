const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/authMiddleware');
const playgroundController = require('../controllers/playgroundController');

router.get('/', isAuthenticated, playgroundController.getPlayground);
router.post('/chat', isAuthenticated, playgroundController.chatWithAI);

module.exports = router;
