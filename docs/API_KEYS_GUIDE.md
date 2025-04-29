# API Keys Guide for Multi-LLM Platform

This guide provides detailed instructions on how to obtain API keys for each supported LLM provider and how to add them to the Multi-LLM Platform.

## Table of Contents
- [Paid Providers](#paid-providers)
  - [OpenAI](#openai)
  - [Anthropic](#anthropic)
  - [Google AI (Gemini)](#google-ai-gemini)
  - [Mistral AI](#mistral-ai)
  - [Cohere](#cohere)
- [Free Providers](#free-providers)
  - [OpenRouter](#openrouter)
  - [Together AI](#together-ai)
  - [Grok](#grok)
- [Adding API Keys to the Platform](#adding-api-keys-to-the-platform)
- [API Key Security](#api-key-security)

## Paid Providers

## OpenAI

### Getting an OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to the API Keys section in the left sidebar
4. Click "Create new secret key"
5. Give your key a name (optional)
6. Copy the generated API key immediately (you won't be able to see it again)

### Pricing
- GPT-4o: $10/1M input tokens, $30/1M output tokens
- GPT-4 Turbo: $10/1M input tokens, $30/1M output tokens
- GPT-3.5 Turbo: $0.50/1M input tokens, $1.50/1M output tokens

For the most up-to-date pricing, visit [OpenAI Pricing](https://openai.com/pricing).

## Anthropic

### Getting an Anthropic API Key
1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Create an account or sign in
3. Navigate to the API Keys section
4. Click "Create API Key"
5. Name your key (optional)
6. Copy the API key

### Pricing
- Claude 3 Opus: $15/1M input tokens, $75/1M output tokens
- Claude 3 Sonnet: $3/1M input tokens, $15/1M output tokens
- Claude 3 Haiku: $0.25/1M input tokens, $1.25/1M output tokens

For the most up-to-date pricing, visit [Anthropic Pricing](https://www.anthropic.com/api).

## Google AI (Gemini)

### Getting a Google AI API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Get API key" or "Create API Key"
4. Name your key (optional)
5. Copy the API key

### Pricing
- Gemini 1.5 Pro: $7/1M input tokens, $21/1M output tokens
- Gemini 1.0 Pro: $4/1M input tokens, $12/1M output tokens

For the most up-to-date pricing, visit [Google AI Pricing](https://ai.google.dev/pricing).

## Mistral AI

### Getting a Mistral AI API Key
1. Go to [Mistral AI Platform](https://console.mistral.ai/)
2. Create an account or sign in
3. Navigate to the API Keys section
4. Generate a new API key
5. Copy the API key

### Pricing
- Mistral Large: €8/1M input tokens, €24/1M output tokens
- Mistral Medium: €2.5/1M input tokens, €7.5/1M output tokens
- Mistral Small: €0.25/1M input tokens, €0.75/1M output tokens

For the most up-to-date pricing, visit [Mistral AI Pricing](https://mistral.ai/pricing/).

## Cohere

### Getting a Cohere API Key
1. Visit [Cohere Dashboard](https://dashboard.cohere.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the API key

### Pricing
- Command R+: $5/1M input tokens, $15/1M output tokens
- Command R: $1/1M input tokens, $3/1M output tokens

For the most up-to-date pricing, visit [Cohere Pricing](https://cohere.com/pricing).

## Free Providers

## OpenRouter

### Getting an OpenRouter API Key
1. Visit [OpenRouter](https://openrouter.ai/)
2. Sign up or log in to your account
3. Go to the API Keys section
4. Create a new API key
5. Copy the API key

### Free Tier
OpenRouter offers a generous free tier that includes:
- Access to multiple LLMs through a unified API
- Free credits that refresh monthly
- Free models include GPT-3.5 Turbo, Claude Instant, PaLM 2, Llama 2, and Mistral 7B

For the most up-to-date information, visit [OpenRouter Pricing](https://openrouter.ai/pricing).

## Together AI

### Getting a Together AI API Key
1. Visit [Together AI](https://www.together.ai/)
2. Create an account or sign in
3. Navigate to the API Keys section
4. Generate a new API key
5. Copy the API key

### Free Tier
Together AI offers a free tier that includes:
- Up to 5 million tokens per month for free
- Access to open-source models like Llama 2, Mistral, and more
- No credit card required for the free tier

For the most up-to-date information, visit [Together AI Pricing](https://www.together.ai/pricing).

## Grok

### Getting a Grok API Key
1. Subscribe to X Premium (formerly Twitter Blue)
2. Access Grok through the X platform
3. For API access, follow the instructions provided to X Premium subscribers

### Free Tier
- Grok is available for free to X Premium subscribers
- Includes access to Grok-1 and Grok-1 Mini models
- No additional cost beyond the X Premium subscription

For the most up-to-date information, visit [X Premium](https://premium.x.com/).

## Adding API Keys to the Platform

1. Log in to the Multi-LLM Platform
2. Navigate to Settings > API Keys in the sidebar
3. Enter your API keys for each provider you want to use
4. Click Save to store your keys securely

![API Keys Management](images/api-keys.png)

## API Key Security

The Multi-LLM Platform takes security seriously:

- API keys are encrypted before being stored in the database
- Keys are never exposed in the frontend code
- All API requests are made from the backend server
- Keys are masked when displayed in the UI
- The platform uses HTTPS for all communications

### Best Practices

1. Use different API keys for development and production
2. Set usage limits on your API keys when possible
3. Regularly rotate your API keys
4. Monitor your usage to detect any unauthorized access
5. Never share your API keys with others

---

If you encounter any issues with API keys, please check the provider's documentation or contact their support.
