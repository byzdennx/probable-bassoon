const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.PG_DATABASE ? `postgres://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}` : `postgres://${process.env.PG_USER}:${process.env.PG_PASSWORD}@localhost:5432/epannrouter`, {
  logging: false,
});

const Billing = sequelize.define('Billing', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  plan: {
    type: DataTypes.ENUM('free', 'pro', 'enterprise'),
    defaultValue: 'free'
  },
  stripeCustomerId: {
    type: DataTypes.STRING
  },
  stripeSubscriptionId: {
    type: DataTypes.STRING
  },
  subscriptionStatus: {
    type: DataTypes.ENUM('active', 'canceled', 'trialing', 'past_due'),
    defaultValue: 'active'
  },
  nextBillingDate: {
    type: DataTypes.DATE
  },
  amount: {
    type: DataTypes.FLOAT
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = Billing;
