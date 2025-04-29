const openaiService = require('./openai');
const anthropicService = require('./anthropic');
const googleService = require('./google');
const mistralService = require('./mistral');
const cohereService = require('./cohere');
const openrouterService = require('./openrouter');
const togetherService = require('./together');
const grokService = require('./grok');

// Map of provider names to service implementations
const services = {
  openai: openaiService,
  anthropic: anthropicService,
  google: googleService,
  mistral: mistralService,
  cohere: cohereService,
  openrouter: openrouterService,
  together: togetherService,
  grok: grokService
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
      description: service.description,
      hasFreeModels: service.models.some(model => model.isFree === true)
    };
  }

  return providers;
};

// Get only providers that offer free models
const getFreeProviders = () => {
  const allProviders = getAvailableProviders();
  const freeProviders = {};

  for (const [provider, info] of Object.entries(allProviders)) {
    if (info.hasFreeModels) {
      freeProviders[provider] = info;
    }
  }

  return freeProviders;
};

module.exports = {
  getService,
  getAvailableProviders,
  getFreeProviders
};
