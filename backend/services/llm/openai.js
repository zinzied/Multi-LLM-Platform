const axios = require('axios');

// Service information
const name = 'OpenAI';
const description = 'OpenAI\'s GPT models for chat and text generation';
const models = [
  { id: 'gpt-4o', name: 'GPT-4o', description: 'Most capable model, optimized for chat' },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', description: 'Improved version of GPT-4' },
  { id: 'gpt-4', name: 'GPT-4', description: 'Most capable GPT-4 model' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Fast and efficient model' }
];

// Pricing per 1000 tokens (approximate)
const pricing = {
  'gpt-4o': { input: 0.005, output: 0.015 },
  'gpt-4-turbo': { input: 0.01, output: 0.03 },
  'gpt-4': { input: 0.03, output: 0.06 },
  'gpt-3.5-turbo': { input: 0.0005, output: 0.0015 }
};

// Send a chat request to OpenAI
const chat = async (apiKey, model, messages) => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model,
        messages: messages.map(msg => ({
          role: msg.role || 'user',
          content: msg.content
        })),
        temperature: 0.7
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
    
    // Calculate cost
    const modelPricing = pricing[model] || { input: 0, output: 0 };
    const promptCost = (result.usage.prompt_tokens / 1000) * modelPricing.input;
    const completionCost = (result.usage.completion_tokens / 1000) * modelPricing.output;
    const totalCost = promptCost + completionCost;
    
    return {
      message: {
        role: 'assistant',
        content: assistantMessage.content
      },
      usage: result.usage,
      cost: totalCost
    };
  } catch (error) {
    const errorMessage = error.response?.data?.error?.message || error.message;
    throw new Error(`OpenAI API Error: ${errorMessage}`);
  }
};

module.exports = {
  name,
  description,
  models,
  chat
};
