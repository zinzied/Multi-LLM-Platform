const express = require('express');
const { authenticate } = require('../config/auth');
const User = require('../models/User');
const Conversation = require('../models/Conversation');
const Usage = require('../models/Usage');
const LLMService = require('../services/llm');

const router = express.Router();

// Get available providers and models
router.get('/providers', (req, res) => {
  try {
    const providers = LLMService.getAvailableProviders();
    res.json({
      success: true,
      providers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get providers',
      error: error.message
    });
  }
});

// Get only providers that offer free models
router.get('/free-providers', (req, res) => {
  try {
    const freeProviders = LLMService.getFreeProviders();
    res.json({
      success: true,
      providers: freeProviders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get free providers',
      error: error.message
    });
  }
});

// Send a message to an LLM
router.post('/chat', authenticate, async (req, res) => {
  try {
    const { provider, model, messages, conversationId } = req.body;

    // Get user for API keys
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if API key exists for the provider
    if (!user.apiKeys || !user.apiKeys[provider]) {
      return res.status(400).json({
        success: false,
        message: `API key for ${provider} is not set`
      });
    }

    // Get or create conversation
    let conversation;
    if (conversationId) {
      conversation = await Conversation.findOne({
        where: { id: conversationId, UserId: user.id }
      });

      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: 'Conversation not found'
        });
      }
    } else {
      conversation = await Conversation.create({
        title: messages[0]?.content.substring(0, 30) + '...',
        provider,
        model,
        messages: [],
        UserId: user.id
      });
    }

    // Get LLM service for the provider
    const llmService = LLMService.getService(provider);

    // Send message to LLM
    const apiKey = user.apiKeys[provider];
    const response = await llmService.chat(apiKey, model, messages);

    // Update conversation with new messages
    const updatedMessages = [...conversation.messages, ...messages, response.message];
    conversation.messages = updatedMessages;
    await conversation.save();

    // Record usage
    await Usage.create({
      provider,
      model,
      promptTokens: response.usage?.prompt_tokens || 0,
      completionTokens: response.usage?.completion_tokens || 0,
      totalTokens: response.usage?.total_tokens || 0,
      cost: response.cost || 0,
      success: true,
      UserId: user.id
    });

    res.json({
      success: true,
      message: response.message,
      conversation: {
        id: conversation.id,
        title: conversation.title,
        provider: conversation.provider,
        model: conversation.model
      },
      usage: response.usage
    });
  } catch (error) {
    // Record error
    if (req.body.provider && req.body.model) {
      await Usage.create({
        provider: req.body.provider,
        model: req.body.model,
        success: false,
        errorMessage: error.message,
        UserId: req.user.id
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to get LLM response',
      error: error.message
    });
  }
});

// Get user conversations
router.get('/conversations', authenticate, async (req, res) => {
  try {
    const conversations = await Conversation.findAll({
      where: { UserId: req.user.id },
      order: [['updatedAt', 'DESC']]
    });

    res.json({
      success: true,
      conversations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get conversations',
      error: error.message
    });
  }
});

// Get a specific conversation
router.get('/conversations/:id', authenticate, async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      where: { id: req.params.id, UserId: req.user.id }
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    res.json({
      success: true,
      conversation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get conversation',
      error: error.message
    });
  }
});

// Delete a conversation
router.delete('/conversations/:id', authenticate, async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      where: { id: req.params.id, UserId: req.user.id }
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    await conversation.destroy();

    res.json({
      success: true,
      message: 'Conversation deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete conversation',
      error: error.message
    });
  }
});

module.exports = router;
