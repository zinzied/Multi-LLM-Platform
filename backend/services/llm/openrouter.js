const axios = require('axios');

// Provider name and description
const name = 'OpenRouter';
const description = 'Access to multiple LLMs through a unified API, including free models';

// Available models - focusing on free and affordable models
const models = [
  // Free models
  { id: 'openai/gpt-3.5-turbo', name: 'GPT-3.5 Turbo (Free Tier)', isFree: true },
  { id: 'anthropic/claude-instant-1', name: 'Claude Instant (Free Tier)', isFree: true },
  { id: 'google/palm-2-chat-bison', name: 'PaLM 2 Chat (Free Tier)', isFree: true },
  { id: 'meta-llama/llama-2-13b-chat', name: 'Llama 2 13B (Free Tier)', isFree: true },
  { id: 'mistralai/mistral-7b-instruct', name: 'Mistral 7B (Free Tier)', isFree: true },
  
  // Paid models (but affordable)
  { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku' },
  { id: 'anthropic/claude-3-sonnet', name: 'Claude 3 Sonnet' },
  { id: 'openai/gpt-4-turbo', name: 'GPT-4 Turbo' },
  { id: 'google/gemini-pro', name: 'Gemini Pro' },
  { id: 'meta-llama/llama-2-70b-chat', name: 'Llama 2 70B' }
];

// Pricing information (approximate, may change)
const pricing = {
  // Free tier models have zero cost for limited usage
  'openai/gpt-3.5-turbo': { input: 0, output: 0 },
  'anthropic/claude-instant-1': { input: 0, output: 0 },
  'google/palm-2-chat-bison': { input: 0, output: 0 },
  'meta-llama/llama-2-13b-chat': { input: 0, output: 0 },
  'mistralai/mistral-7b-instruct': { input: 0, output: 0 },
  
  // Paid models (costs per 1K tokens)
  'anthropic/claude-3-haiku': { input: 0.00025, output: 0.00125 },
  'anthropic/claude-3-sonnet': { input: 0.003, output: 0.015 },
  'openai/gpt-4-turbo': { input: 0.01, output: 0.03 },
  'google/gemini-pro': { input: 0.0005, output: 0.0015 },
  'meta-llama/llama-2-70b-chat': { input: 0.0007, output: 0.0009 }
};

// Send a chat request to OpenRouter
const chat = async (apiKey, model, messages) => {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
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
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://multi-llm-platform.example.com', // Replace with your actual domain
          'X-Title': 'Multi-LLM Platform'
        }
      }
    );
    
    const result = response.data;
    const assistantMessage = result.choices[0].message;
    
    // Calculate cost (if usage information is available)
    let cost = 0;
    if (result.usage) {
      const modelPricing = pricing[model] || { input: 0, output: 0 };
      const promptCost = (result.usage.prompt_tokens / 1000) * modelPricing.input;
      const completionCost = (result.usage.completion_tokens / 1000) * modelPricing.output;
      cost = promptCost + completionCost;
    }
    
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
      cost: cost
    };
  } catch (error) {
    const errorMessage = error.response?.data?.error?.message || error.message;
    throw new Error(`OpenRouter API Error: ${errorMessage}`);
  }
};

module.exports = {
  name,
  description,
  models,
  chat
};
