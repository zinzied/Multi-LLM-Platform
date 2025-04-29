const axios = require('axios');

// Service information
const name = 'Google';
const description = 'Google\'s Gemini models for chat and text generation';
const models = [
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', description: 'Most capable Gemini model' },
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', description: 'Fast and efficient Gemini model' },
  { id: 'gemini-1.0-pro', name: 'Gemini 1.0 Pro', description: 'Previous generation Gemini model' }
];

// Pricing per 1000 tokens (approximate)
const pricing = {
  'gemini-1.5-pro': { input: 0.0025, output: 0.0075 },
  'gemini-1.5-flash': { input: 0.0005, output: 0.0015 },
  'gemini-1.0-pro': { input: 0.0025, output: 0.0075 }
};

// Convert messages to Google format
const formatMessages = (messages) => {
  return messages.map(msg => {
    let role = 'user';
    if (msg.role === 'assistant') {
      role = 'model';
    } else if (msg.role === 'system') {
      role = 'system';
    }
    
    return {
      role,
      parts: [{ text: msg.content }]
    };
  });
};

// Send a chat request to Google
const chat = async (apiKey, model, messages) => {
  try {
    const formattedMessages = formatMessages(messages);
    
    // Google API requires model name in a specific format
    const modelName = model.replace(/\./g, '-');
    
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
      {
        contents: formattedMessages,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    const result = response.data;
    
    // Extract content from response
    const content = result.candidates[0].content.parts[0].text;
    
    // Extract usage information if available
    const usage = {
      prompt_tokens: result.usageMetadata?.promptTokenCount || 0,
      completion_tokens: result.usageMetadata?.candidatesTokenCount || 0,
      total_tokens: (result.usageMetadata?.promptTokenCount || 0) + (result.usageMetadata?.candidatesTokenCount || 0)
    };
    
    // Calculate cost
    const modelPricing = pricing[model] || { input: 0, output: 0 };
    const promptCost = (usage.prompt_tokens / 1000) * modelPricing.input;
    const completionCost = (usage.completion_tokens / 1000) * modelPricing.output;
    const totalCost = promptCost + completionCost;
    
    return {
      message: {
        role: 'assistant',
        content
      },
      usage,
      cost: totalCost
    };
  } catch (error) {
    const errorMessage = error.response?.data?.error?.message || error.message;
    throw new Error(`Google API Error: ${errorMessage}`);
  }
};

module.exports = {
  name,
  description,
  models,
  chat
};
