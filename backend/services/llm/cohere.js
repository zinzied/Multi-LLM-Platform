const axios = require('axios');

// Service information
const name = 'Cohere';
const description = 'Cohere\'s models for chat and text generation';
const models = [
  { id: 'command-r-plus', name: 'Command R+', description: 'Most capable Cohere model' },
  { id: 'command-r', name: 'Command R', description: 'Balanced performance and efficiency' },
  { id: 'command-light', name: 'Command Light', description: 'Fast and efficient model' }
];

// Pricing per 1000 tokens (approximate)
const pricing = {
  'command-r-plus': { input: 0.015, output: 0.015 },
  'command-r': { input: 0.005, output: 0.005 },
  'command-light': { input: 0.0015, output: 0.0015 }
};

// Convert messages to Cohere format
const formatMessages = (messages) => {
  // Extract system message if present
  let preamble = '';
  const chatHistory = [];
  
  for (const message of messages) {
    if (message.role === 'system') {
      preamble = message.content;
    } else if (message.role === 'user' || message.role === 'assistant') {
      chatHistory.push({
        role: message.role,
        message: message.content
      });
    }
  }
  
  // The last user message should be the current message
  let message = '';
  if (chatHistory.length > 0 && chatHistory[chatHistory.length - 1].role === 'user') {
    message = chatHistory[chatHistory.length - 1].message;
    chatHistory.pop(); // Remove the last message from chat history
  }
  
  return { preamble, chatHistory, message };
};

// Send a chat request to Cohere
const chat = async (apiKey, model, messages) => {
  try {
    const { preamble, chatHistory, message } = formatMessages(messages);
    
    const response = await axios.post(
      'https://api.cohere.ai/v1/chat',
      {
        model,
        message: message || 'Hello',
        chat_history: chatHistory,
        preamble: preamble || undefined,
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
    
    // Extract usage information
    const usage = {
      prompt_tokens: result.meta?.billable_tokens?.input_tokens || 0,
      completion_tokens: result.meta?.billable_tokens?.output_tokens || 0,
      total_tokens: (result.meta?.billable_tokens?.input_tokens || 0) + (result.meta?.billable_tokens?.output_tokens || 0)
    };
    
    // Calculate cost
    const modelPricing = pricing[model] || { input: 0, output: 0 };
    const promptCost = (usage.prompt_tokens / 1000) * modelPricing.input;
    const completionCost = (usage.completion_tokens / 1000) * modelPricing.output;
    const totalCost = promptCost + completionCost;
    
    return {
      message: {
        role: 'assistant',
        content: result.text
      },
      usage,
      cost: totalCost
    };
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    throw new Error(`Cohere API Error: ${errorMessage}`);
  }
};

module.exports = {
  name,
  description,
  models,
  chat
};
