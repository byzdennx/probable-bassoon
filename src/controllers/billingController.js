const { listPlans, createSubscription, cancelSubscription, getPrice } = require('../services/billingService');
const Billing = require('../models/Billing');

exports.getBilling = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const billing = await Billing.findOne({ where: { userId } });
    const plans = await listPlans();
    
    return res.render('billing', {
      plans,
      billing,
      userPlan: req.session.user.plan,
      layout: 'main'
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to load billing' });
  }
};

exports.updatePlan = async (req, res) => {
  try {
    const { plan } = req.body;
    const validPlans = ['free', 'pro', 'enterprise'];
    if (!validPlans.includes(plan)) {
      return res.status(400).json({ error: 'Invalid plan' });
    }
    
    const userId = req.session.user.id;
    const billing = await Billing.findOne({ where: { userId } });
    
    if (!billing) {
      // Create billing record
      billing = await Billing.create({ userId, plan });
    }
    
    billing.plan = plan;
    await billing.save();
    
    req.session.user.plan = plan;
    
    // If upgrading, create subscription
    if (plan !== 'free') {
      await createSubscription(userId, plan);
    }
    
    return res.json({ message: 'Plan updated', plan });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to update plan' });
  }
};

exports.cancelPlan = async (req, res) => {
  try {
    const userId = req.session.user.id;
    await cancelSubscription(userId);
    req.session.user.plan = 'free';
    return res.json({ message: 'Subscription canceled' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to cancel subscription' });
  }
};
