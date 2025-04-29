const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user'
  },
  apiKeys: {
    type: DataTypes.JSON,
    defaultValue: {}
  }
}, {
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Instance method to compare passwords
User.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to safely return user data without sensitive information
User.prototype.toJSON = function() {
  const values = { ...this.get() };
  delete values.password;
  
  // Mask API keys for security
  if (values.apiKeys) {
    const maskedKeys = {};
    for (const [provider, key] of Object.entries(values.apiKeys)) {
      if (key && key.length > 8) {
        maskedKeys[provider] = `${key.substring(0, 4)}...${key.substring(key.length - 4)}`;
      } else if (key) {
        maskedKeys[provider] = '********';
      }
    }
    values.apiKeys = maskedKeys;
  }
  
  return values;
};

module.exports = User;
