const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { formatNumber } = require('../utils/helpers');

const PLANS = {
  free: {
    id: 'price_1...',
    name: 'Free',
    price: 0,
    currency: 'usd',
    features: ['10 messages/day', 'Basic models', 'Standard support']
  },
  pro: {
    id: 'price_2...',
    name: 'Pro',
    price: 29,
    currency: 'usd',
    features: ['Unlimited messages', 'All models', 'Priority support', 'Advanced analytics']
  },
  enterprise: {
    id: 'price_3...',
    name: 'Enterprise',
    price: 99,
    currency: 'usd',
    features: ['Unlimited messages', 'All models', 'Dedicated support', 'Custom integrations', 'SLA']
  }
};

async function createCustomer(email) {
  const customer = await stripe.customers.create({ email });
  return customer;
}

async function createSubscription(userId, planId) {
  const billing = await Billing.findOne({ where: { userId } });
  if (!billing) return null;
  
  const customer = billing.stripeCustomerId;
  if (!customer) {
    // Create customer
    const user = await User.findByPk(userId);
    const customer = await createCustomer(user.email);
    billing.stripeCustomerId = customer.id;
    await billing.save();
  }
  
  const subscription = await stripe.subscriptions.create({
    customer,
    items: [{ price: planId }],
    payment_behavior: 'default_incomplete',
    expand: ['payment_intent']
  });
  
  billing.stripeSubscriptionId = subscription.id;
  billing.subscriptionStatus = subscription.status;
  billing.nextBillingDate = new Date(subscription.current_period_end * 1000);
  await billing.save();
  
  return subscription;
}

async function cancelSubscription(userId) {
  const billing = await Billing.findOne({ where: { userId } });
  if (!billing || !billing.stripeSubscriptionId) return null;
  
  await stripe.subscriptions.cancel(billing.stripeSubscriptionId);
  billing.subscriptionStatus = 'canceled';
  await billing.save();
  return billing;
}

async function getPrice(product) {
  const plan = Object.values(PLANS).find(p => p.id === product);
  return plan ? plan.price : 0;
}

async function listPlans() {
  return Object.values(PLANS);
}

module.exports = {
  createCustomer,
  createSubscription,
  cancelSubscription,
  getPrice,
  listPlans,
  PLANS
};
