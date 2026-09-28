const express = require('express');
const router = express.Router();
const { isAuthenticated, requirePlan } = require('../middlewares/authMiddleware');
const billingController = require('../controllers/billingController');

router.get('/', isAuthenticated, billingController.getBilling);
router.post('/plan', isAuthenticated, billingController.updatePlan);
router.post('/cancel', isAuthenticated, billingController.cancelPlan);

module.exports = router;
