const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Conversation = sequelize.define('Conversation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    defaultValue: 'New Conversation'
  },
  messages: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  provider: {
    type: DataTypes.STRING,
    allowNull: false
  },
  model: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

// Define associations
Conversation.belongsTo(User);
User.hasMany(Conversation);

module.exports = Conversation;
