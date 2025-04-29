const axios = require('axios');

// Provider name and description
const name = 'Together AI';
const description = 'Access to open-source models with free tier and affordable pricing';

// Available models - focusing on free and affordable models
const models = [
  // Free tier models
  { id: 'togethercomputer/llama-2-7b-chat', name: 'Llama 2 7B Chat (Free Tier)', isFree: true },
  { id: 'mistralai/Mistral-7B-Instruct-v0.1', name: 'Mistral 7B Instruct (Free Tier)', isFree: true },
  { id: 'NousResearch/Nous-Hermes-Llama2-13b', name: 'Nous Hermes 13B (Free Tier)', isFree: true },
  { id: 'togethercomputer/RedPajama-INCITE-7B-Chat', name: 'RedPajama 7B (Free Tier)', isFree: true },
  { id: 'databricks/dolly-v2-12b', name: 'Dolly v2 12B (Free Tier)', isFree: true },
  
  // Paid but affordable models
  { id: 'togethercomputer/llama-2-70b-chat', name: 'Llama 2 70B Chat' },
  { id: 'mistralai/Mixtral-8x7B-Instruct-v0.1', name: 'Mixtral 8x7B Instruct' },
  { id: 'Qwen/Qwen-72B-Chat', name: 'Qwen 72B Chat' },
  { id: 'meta-llama/Llama-3-8B-Instruct', name: 'Llama 3 8B Instruct' },
  { id: 'meta-llama/Llama-3-70B-Instruct', name: 'Llama 3 70B Instruct' }
];

// Pricing information (approximate, may change)
const pricing = {
  // Free tier models (limited tokens per day)
  'togethercomputer/llama-2-7b-chat': { input: 0, output: 0 },
  'mistralai/Mistral-7B-Instruct-v0.1': { input: 0, output: 0 },
  'NousResearch/Nous-Hermes-Llama2-13b': { input: 0, output: 0 },
  'togethercomputer/RedPajama-INCITE-7B-Chat': { input: 0, output: 0 },
  'databricks/dolly-v2-12b': { input: 0, output: 0 },
  
  // Paid models (costs per 1M tokens)
  'togethercomputer/llama-2-70b-chat': { input: 0.0006, output: 0.0006 },
  'mistralai/Mixtral-8x7B-Instruct-v0.1': { input: 0.0006, output: 0.0006 },
  'Qwen/Qwen-72B-Chat': { input: 0.0009, output: 0.0009 },
  'meta-llama/Llama-3-8B-Instruct': { input: 0.0003, output: 0.0003 },
  'meta-llama/Llama-3-70B-Instruct': { input: 0.0009, output: 0.0009 }
};

// Send a chat request to Together AI
const chat = async (apiKey, model, messages) => {
  try {
    // Format messages for Together AI
    const formattedMessages = formatMessages(messages, model);
    
    const response = await axios.post(
      'https://api.together.xyz/v1/completions',
      {
        model: model,
        prompt: formattedMessages,
        temperature: 0.7,
        max_tokens: 1024,
        stop: ["<human>", "<assistant>"]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );
    
    const result = response.data;
    const content = result.choices[0].text.trim();
    
    // Calculate cost (if usage information is available)
    let cost = 0;
    if (result.usage) {
      const modelPricing = pricing[model] || { input: 0, output: 0 };
      const promptCost = (result.usage.prompt_tokens / 1000000) * modelPricing.input;
      const completionCost = (result.usage.completion_tokens / 1000000) * modelPricing.output;
      cost = promptCost + completionCost;
    }
    
    return {
      message: {
        role: 'assistant',
        content: content
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
    throw new Error(`Together AI Error: ${errorMessage}`);
  }
};

// Format messages for Together AI (which uses a different format than OpenAI)
const formatMessages = (messages, model) => {
  // Different models might need different formatting
  if (model.includes('llama')) {
    // Llama 2 format
    let prompt = "";
    messages.forEach((msg) => {
      if (msg.role === 'system') {
        prompt += `<system>${msg.content}</system>\n`;
      } else if (msg.role === 'user') {
        prompt += `<human>${msg.content}</human>\n`;
      } else if (msg.role === 'assistant') {
        prompt += `<assistant>${msg.content}</assistant>\n`;
      }
    });
    // Add the final assistant prompt
    prompt += "<assistant>";
    return prompt;
  } else {
    // Generic format for other models
    let prompt = "";
    messages.forEach((msg) => {
      if (msg.role === 'system') {
        prompt += `System: ${msg.content}\n\n`;
      } else if (msg.role === 'user') {
        prompt += `User: ${msg.content}\n\n`;
      } else if (msg.role === 'assistant') {
        prompt += `Assistant: ${msg.content}\n\n`;
      }
    });
    prompt += "Assistant: ";
    return prompt;
  }
};

module.exports = {
  name,
  description,
  models,
  chat
};
