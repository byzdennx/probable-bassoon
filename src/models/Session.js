const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.PG_DATABASE ? `postgres://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}` : `postgres://${process.env.PG_USER}:${process.env.PG_PASSWORD}@localhost:5432/epannrouter`, {
  logging: false,
});

const Session = sequelize.define('Session', {
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
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  model: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'gemini'
  },
  provider: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'google'
  },
  messages: {
    type: DataTypes.TEXT,
    defaultValue: '[]'
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = Session;
