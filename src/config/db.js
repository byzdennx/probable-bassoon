const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.PG_DATABASE ? `postgres://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}` : `postgres://${process.env.PG_USER}:${process.env.PG_PASSWORD}@localhost:5432/epannrouter`, {
  logging: false,
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

// Sync all models
const User = require('../models/User');
const Session = require('../models/Session');
const Billing = require('../models/Billing');

// Relations
User.hasMany(Session, { foreignKey: 'userId' });
Session.belongsTo(User, { foreignKey: 'userId' });
User.hasOne(Billing, { foreignKey: 'userId' });
Billing.belongsTo(User, { foreignKey: 'userId' });

async function initializeDB() {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connected');
    // Sync models (in production, use migrations)
    await sequelize.sync({ force: false });
    console.log('✅ Database schema synchronized');
  } catch (err) {
    console.error('❌ DB initialization failed:', err);
  }
}

module.exports = { sequelize, initializeDB };
