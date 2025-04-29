const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Usage = sequelize.define('Usage', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  provider: {
    type: DataTypes.STRING,
    allowNull: false
  },
  model: {
    type: DataTypes.STRING,
    allowNull: false
  },
  promptTokens: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  completionTokens: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  totalTokens: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  cost: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  success: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  errorMessage: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

// Define associations
Usage.belongsTo(User);
User.hasMany(Usage);

module.exports = Usage;
