const express = require('express');
const { authenticate, authorizeAdmin } = require('../config/auth');
const User = require('../models/User');
const Usage = require('../models/Usage');
const { Op } = require('sequelize');

const router = express.Router();

// Get all users (admin only)
router.get('/users', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });
    
    res.json({
      success: true,
      users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get users',
      error: error.message
    });
  }
});

// Update user role (admin only)
router.put('/users/:id/role', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
    }
    
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    user.role = role;
    await user.save();
    
    res.json({
      success: true,
      message: 'User role updated successfully',
      user: user.toJSON()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update user role',
      error: error.message
    });
  }
});

// Get usage statistics (admin only)
router.get('/usage', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { startDate, endDate, provider, userId } = req.query;
    
    const whereClause = {};
    
    // Filter by date range
    if (startDate && endDate) {
      whereClause.timestamp = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    } else if (startDate) {
      whereClause.timestamp = {
        [Op.gte]: new Date(startDate)
      };
    } else if (endDate) {
      whereClause.timestamp = {
        [Op.lte]: new Date(endDate)
      };
    }
    
    // Filter by provider
    if (provider) {
      whereClause.provider = provider;
    }
    
    // Filter by user
    if (userId) {
      whereClause.UserId = userId;
    }
    
    const usage = await Usage.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          attributes: ['id', 'email']
        }
      ],
      order: [['timestamp', 'DESC']]
    });
    
    // Calculate totals
    const totals = usage.reduce((acc, record) => {
      const provider = record.provider;
      
      if (!acc[provider]) {
        acc[provider] = {
          promptTokens: 0,
          completionTokens: 0,
          totalTokens: 0,
          cost: 0,
          successCount: 0,
          errorCount: 0
        };
      }
      
      acc[provider].promptTokens += record.promptTokens;
      acc[provider].completionTokens += record.completionTokens;
      acc[provider].totalTokens += record.totalTokens;
      acc[provider].cost += record.cost;
      
      if (record.success) {
        acc[provider].successCount += 1;
      } else {
        acc[provider].errorCount += 1;
      }
      
      return acc;
    }, {});
    
    res.json({
      success: true,
      usage,
      totals
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get usage statistics',
      error: error.message
    });
  }
});

// Get error logs (admin only)
router.get('/errors', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const errors = await Usage.findAll({
      where: { success: false },
      include: [
        {
          model: User,
          attributes: ['id', 'email']
        }
      ],
      order: [['timestamp', 'DESC']]
    });
    
    res.json({
      success: true,
      errors
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get error logs',
      error: error.message
    });
  }
});

module.exports = router;
