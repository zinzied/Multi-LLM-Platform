const axios = require('axios');

// Provider name and description
const name = 'Grok';
const description = 'Access to xAI\'s Grok model with free tier for X Premium subscribers';

// Available models
const models = [
  // Free model for X Premium subscribers
  { id: 'grok-1', name: 'Grok-1 (Free with X Premium)', isFree: true },
  { id: 'grok-1-mini', name: 'Grok-1 Mini (Free with X Premium)', isFree: true }
];

// Pricing information
const pricing = {
  'grok-1': { input: 0, output: 0 }, // Free with X Premium
  'grok-1-mini': { input: 0, output: 0 } // Free with X Premium
};

// Send a chat request to Grok API
const chat = async (apiKey, model, messages) => {
  try {
    // Note: This is a simplified implementation as Grok's API is not publicly documented
    // Users will need to provide their own access token from X Premium
    const response = await axios.post(
      'https://api.grok.x.ai/v1/chat/completions',
      {
        model: model,
        messages: messages.map(msg => ({
          role: msg.role || 'user',
          content: msg.content
        })),
        temperature: 0.7,
        max_tokens: 1024
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );
    
    const result = response.data;
    const assistantMessage = result.choices[0].message;
    
    return {
      message: {
        role: 'assistant',
        content: assistantMessage.content
      },
      usage: result.usage || {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0
      },
      cost: 0 // Free with X Premium
    };
  } catch (error) {
    // Special handling for Grok API errors
    if (error.response?.status === 401) {
      throw new Error('Grok API Error: Authentication failed. Make sure you have an X Premium subscription and have provided the correct access token.');
    } else if (error.response?.status === 403) {
      throw new Error('Grok API Error: Access forbidden. Your X Premium subscription may not include Grok access or you may have reached your usage limit.');
    }
    
    const errorMessage = error.response?.data?.error?.message || error.message;
    throw new Error(`Grok API Error: ${errorMessage}`);
  }
};

module.exports = {
  name,
  description,
  models,
  chat
};
