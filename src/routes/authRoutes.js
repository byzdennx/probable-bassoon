const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/login', authController.login);
router.post('/login', authController.login);
router.get('/register', authController.register);
router.post('/register', authController.register);
router.get('/logout', authController.logout);
router.get('/is-online', authController.isLoggedIn);

module.exports = router;
