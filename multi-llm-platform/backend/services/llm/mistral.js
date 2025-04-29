const axios = require('axios');

// Service information
const name = 'Mistral AI';
const description = 'Mistral AI\'s models for chat and text generation';
const models = [
  { id: 'mistral-large-latest', name: 'Mistral Large', description: 'Most capable Mistral model' },
  { id: 'mistral-medium-latest', name: 'Mistral Medium', description: 'Balanced performance and efficiency' },
  { id: 'mistral-small-latest', name: 'Mistral Small', description: 'Fast and efficient model' },
  { id: 'open-mistral-7b', name: 'Open Mistral 7B', description: 'Open-source 7B parameter model' }
];

// Pricing per 1000 tokens (approximate)
const pricing = {
  'mistral-large-latest': { input: 0.008, output: 0.024 },
  'mistral-medium-latest': { input: 0.0027, output: 0.0081 },
  'mistral-small-latest': { input: 0.0006, output: 0.0018 },
  'open-mistral-7b': { input: 0.0002, output: 0.0006 }
};

// Send a chat request to Mistral
const chat = async (apiKey, model, messages) => {
  try {
    const response = await axios.post(
      'https://api.mistral.ai/v1/chat/completions',
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
    throw new Error(`Mistral API Error: ${errorMessage}`);
  }
};

module.exports = {
  name,
  description,
  models,
  chat
};
