const axios = require('axios');

// Service information
const name = 'Anthropic';
const description = 'Anthropic\'s Claude models for chat and text generation';
const models = [
  { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', description: 'Most powerful Claude model' },
  { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet', description: 'Balanced performance and speed' },
  { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku', description: 'Fastest and most compact Claude model' },
  { id: 'claude-2.1', name: 'Claude 2.1', description: 'Previous generation Claude model' }
];

// Pricing per 1000 tokens (approximate)
const pricing = {
  'claude-3-opus-20240229': { input: 0.015, output: 0.075 },
  'claude-3-sonnet-20240229': { input: 0.003, output: 0.015 },
  'claude-3-haiku-20240307': { input: 0.00025, output: 0.00125 },
  'claude-2.1': { input: 0.008, output: 0.024 }
};

// Convert messages to Anthropic format
const formatMessages = (messages) => {
  // Anthropic expects a specific format with system prompt handled differently
  let systemMessage = '';
  const formattedMessages = [];
  
  for (const message of messages) {
    if (message.role === 'system') {
      systemMessage = message.content;
    } else {
      formattedMessages.push({
        role: message.role === 'assistant' ? 'assistant' : 'user',
        content: message.content
      });
    }
  }
  
  return { systemMessage, formattedMessages };
};

// Send a chat request to Anthropic
const chat = async (apiKey, model, messages) => {
  try {
    const { systemMessage, formattedMessages } = formatMessages(messages);
    
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model,
        system: systemMessage || undefined,
        messages: formattedMessages,
        max_tokens: 4096
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        }
      }
    );
    
    const result = response.data;
    
    // Calculate cost
    const modelPricing = pricing[model] || { input: 0, output: 0 };
    const promptCost = (result.usage.input_tokens / 1000) * modelPricing.input;
    const completionCost = (result.usage.output_tokens / 1000) * modelPricing.output;
    const totalCost = promptCost + completionCost;
    
    // Format usage to match OpenAI format for consistency
    const usage = {
      prompt_tokens: result.usage.input_tokens,
      completion_tokens: result.usage.output_tokens,
      total_tokens: result.usage.input_tokens + result.usage.output_tokens
    };
    
    return {
      message: {
        role: 'assistant',
        content: result.content[0].text
      },
      usage,
      cost: totalCost
    };
  } catch (error) {
    const errorMessage = error.response?.data?.error?.message || error.message;
    throw new Error(`Anthropic API Error: ${errorMessage}`);
  }
};

module.exports = {
  name,
  description,
  models,
  chat
};
