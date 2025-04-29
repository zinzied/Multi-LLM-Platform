const openaiService = require('./openai');
const anthropicService = require('./anthropic');
const googleService = require('./google');
const mistralService = require('./mistral');
const cohereService = require('./cohere');

// Map of provider names to service implementations
const services = {
  openai: openaiService,
  anthropic: anthropicService,
  google: googleService,
  mistral: mistralService,
  cohere: cohereService
};

// Get service for a specific provider
const getService = (provider) => {
  const service = services[provider.toLowerCase()];
  
  if (!service) {
    throw new Error(`Provider '${provider}' is not supported`);
  }
  
  return service;
};

// Get information about all available providers and their models
const getAvailableProviders = () => {
  const providers = {};
  
  for (const [provider, service] of Object.entries(services)) {
    providers[provider] = {
      name: service.name,
      models: service.models,
      description: service.description
    };
  }
  
  return providers;
};

module.exports = {
  getService,
  getAvailableProviders
};
