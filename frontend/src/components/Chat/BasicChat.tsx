import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  CircularProgress,
  Switch,
  FormControlLabel,
  Chip
} from '@mui/material';

// Define available LLM providers and models
const providers = {
  // Standard paid providers
  openai: {
    name: 'OpenAI',
    models: [
      { id: 'gpt-4o', name: 'GPT-4o' },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' }
    ]
  },
  anthropic: {
    name: 'Anthropic',
    models: [
      { id: 'claude-3-opus', name: 'Claude 3 Opus' },
      { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet' },
      { id: 'claude-3-haiku', name: 'Claude 3 Haiku' }
    ]
  },
  google: {
    name: 'Google',
    models: [
      { id: 'gemini-pro', name: 'Gemini Pro' },
      { id: 'gemini-ultra', name: 'Gemini Ultra' }
    ]
  },
  mistral: {
    name: 'Mistral AI',
    models: [
      { id: 'mistral-large', name: 'Mistral Large' },
      { id: 'mistral-medium', name: 'Mistral Medium' },
      { id: 'mistral-small', name: 'Mistral Small' }
    ]
  },
  cohere: {
    name: 'Cohere',
    models: [
      { id: 'command-r', name: 'Command R' },
      { id: 'command-r-plus', name: 'Command R+' }
    ]
  },

  // Free providers
  openrouter: {
    name: 'OpenRouter (Free Options)',
    hasFreeModels: true,
    models: [
      { id: 'openai/gpt-3.5-turbo', name: 'GPT-3.5 Turbo (Free Tier)', isFree: true },
      { id: 'anthropic/claude-instant-1', name: 'Claude Instant (Free Tier)', isFree: true },
      { id: 'google/palm-2-chat-bison', name: 'PaLM 2 Chat (Free Tier)', isFree: true },
      { id: 'meta-llama/llama-2-13b-chat', name: 'Llama 2 13B (Free Tier)', isFree: true },
      { id: 'mistralai/mistral-7b-instruct', name: 'Mistral 7B (Free Tier)', isFree: true },
      { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku' },
      { id: 'openai/gpt-4-turbo', name: 'GPT-4 Turbo' }
    ]
  },
  together: {
    name: 'Together AI (Free Options)',
    hasFreeModels: true,
    models: [
      { id: 'togethercomputer/llama-2-7b-chat', name: 'Llama 2 7B Chat (Free Tier)', isFree: true },
      { id: 'mistralai/Mistral-7B-Instruct-v0.1', name: 'Mistral 7B Instruct (Free Tier)', isFree: true },
      { id: 'NousResearch/Nous-Hermes-Llama2-13b', name: 'Nous Hermes 13B (Free Tier)', isFree: true },
      { id: 'togethercomputer/RedPajama-INCITE-7B-Chat', name: 'RedPajama 7B (Free Tier)', isFree: true },
      { id: 'databricks/dolly-v2-12b', name: 'Dolly v2 12B (Free Tier)', isFree: true },
      { id: 'meta-llama/Llama-3-8B-Instruct', name: 'Llama 3 8B Instruct' }
    ]
  },
  grok: {
    name: 'Grok (Free with X Premium)',
    hasFreeModels: true,
    models: [
      { id: 'grok-1', name: 'Grok-1 (Free with X Premium)', isFree: true },
      { id: 'grok-1-mini', name: 'Grok-1 Mini (Free with X Premium)', isFree: true }
    ]
  }
};

// Demo responses for each provider
const demoResponses: Record<string, string> = {
  // Standard providers
  openai: "I'm a simulated OpenAI assistant. This is a demo response to show how the chat interface works. In a real implementation, this would be a response from the OpenAI API.",
  anthropic: "I'm a simulated Anthropic Claude assistant. This is a demo response to show how the chat interface works. In a real implementation, this would be a response from the Claude API.",
  google: "I'm a simulated Google Gemini assistant. This is a demo response to show how the chat interface works. In a real implementation, this would be a response from the Gemini API.",
  mistral: "I'm a simulated Mistral AI assistant. This is a demo response to show how the chat interface works. In a real implementation, this would be a response from the Mistral API.",
  cohere: "I'm a simulated Cohere assistant. This is a demo response to show how the chat interface works. In a real implementation, this would be a response from the Cohere API.",

  // Free providers
  openrouter: "I'm a simulated OpenRouter assistant. This is a demo response to show how the chat interface works. OpenRouter provides access to multiple LLMs through a unified API, including free models with a generous free tier.",
  together: "I'm a simulated Together AI assistant. Together AI offers access to open-source models with a free tier that includes up to 5 million tokens per month. This is perfect for testing and small projects.",
  grok: "I'm a simulated Grok assistant. Grok is available for free to X Premium subscribers. It's designed to be helpful, harmless, and honest while also having a bit of wit and personality."
};

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const BasicChat: React.FC = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! How can I help you today? Please select an LLM provider and model to start chatting. We now offer free models from OpenRouter, Together AI, and Grok!' }
  ]);
  const [selectedProvider, setSelectedProvider] = useState('openrouter');
  const [selectedModel, setSelectedModel] = useState('openai/gpt-3.5-turbo');
  const [isSending, setIsSending] = useState(false);
  const [showFreeModelsOnly, setShowFreeModelsOnly] = useState(true);
  const [filteredProviders, setFilteredProviders] = useState<typeof providers>(providers);

  // Filter providers based on free models toggle
  useEffect(() => {
    if (showFreeModelsOnly) {
      // Only show providers with free models
      const filtered: typeof providers = {};
      Object.entries(providers).forEach(([key, provider]) => {
        if (provider.hasFreeModels) {
          filtered[key as keyof typeof providers] = provider;
        }
      });
      setFilteredProviders(filtered);

      // If current provider doesn't have free models, switch to a provider that does
      if (!providers[selectedProvider as keyof typeof providers]?.hasFreeModels) {
        // Find first provider with free models
        const firstFreeProvider = Object.keys(filtered)[0];
        if (firstFreeProvider) {
          setSelectedProvider(firstFreeProvider);
          // Select first free model
          const firstFreeModel = filtered[firstFreeProvider as keyof typeof filtered].models.find(m => m.isFree)?.id;
          if (firstFreeModel) {
            setSelectedModel(firstFreeModel);
          } else {
            setSelectedModel(filtered[firstFreeProvider as keyof typeof filtered].models[0].id);
          }
        }
      }
    } else {
      // Show all providers
      setFilteredProviders(providers);
    }
  }, [showFreeModelsOnly, selectedProvider]);

  // Filter models based on free models toggle
  const getFilteredModels = () => {
    if (!selectedProvider) return [];

    const providerModels = providers[selectedProvider as keyof typeof providers]?.models || [];

    if (showFreeModelsOnly) {
      return providerModels.filter(model => model.isFree);
    }

    return providerModels;
  };

  const handleProviderChange = (event: SelectChangeEvent) => {
    const provider = event.target.value;
    setSelectedProvider(provider);

    // Reset model when provider changes
    const filteredModels = showFreeModelsOnly
      ? providers[provider as keyof typeof providers]?.models.filter(m => m.isFree)
      : providers[provider as keyof typeof providers]?.models;

    if (filteredModels && filteredModels.length > 0) {
      setSelectedModel(filteredModels[0].id);
    } else {
      setSelectedModel('');
    }
  };

  const handleModelChange = (event: SelectChangeEvent) => {
    setSelectedModel(event.target.value);
  };

  const handleFreeModelsToggle = () => {
    setShowFreeModelsOnly(!showFreeModelsOnly);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      // Add user message
      const userMessage: Message = { role: 'user', content: message };
      setMessages(prev => [...prev, userMessage]);
      setMessage('');

      // Simulate sending to API
      setIsSending(true);

      // Simulate delay
      setTimeout(() => {
        // Add assistant response
        const assistantMessage: Message = {
          role: 'assistant',
          content: demoResponses[selectedProvider as keyof typeof demoResponses]
        };
        setMessages(prev => [...prev, assistantMessage]);
        setIsSending(false);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Free models toggle */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <FormControlLabel
              control={
                <Switch
                  checked={showFreeModelsOnly}
                  onChange={handleFreeModelsToggle}
                  color="primary"
                />
              }
              label="Show Free Models Only"
            />

            {showFreeModelsOnly && (
              <Chip
                label="Free Models Active"
                color="success"
                variant="outlined"
                sx={{ fontWeight: 'bold' }}
              />
            )}
          </Box>

          {/* Provider and model selection */}
          <Box sx={{ display: 'flex', gap: 2, width: '100%', flexWrap: 'wrap' }}>
            <FormControl sx={{ minWidth: 200, flex: 1 }} size="small">
              <InputLabel id="provider-label">LLM Provider</InputLabel>
              <Select
                labelId="provider-label"
                value={selectedProvider}
                label="LLM Provider"
                onChange={handleProviderChange}
              >
                {Object.entries(filteredProviders).map(([id, provider]) => (
                  <MenuItem key={id} value={id}>
                    {provider.name}
                    {provider.hasFreeModels && (
                      <Chip
                        label="Free"
                        color="success"
                        size="small"
                        sx={{ ml: 1, height: 20 }}
                      />
                    )}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 200, flex: 1 }} size="small">
              <InputLabel id="model-label">Model</InputLabel>
              <Select
                labelId="model-label"
                value={selectedModel}
                label="Model"
                onChange={handleModelChange}
              >
                {selectedProvider &&
                  getFilteredModels().map(model => (
                    <MenuItem key={model.id} value={model.id}>
                      {model.name}
                      {model.isFree && (
                        <Chip
                          label="Free"
                          color="success"
                          size="small"
                          sx={{ ml: 1, height: 20 }}
                        />
                      )}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Box>

          {/* Selected model info */}
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              <strong>Selected:</strong> {providers[selectedProvider as keyof typeof providers]?.name} -
              {providers[selectedProvider as keyof typeof providers]?.models.find(m => m.id === selectedModel)?.name}
              {providers[selectedProvider as keyof typeof providers]?.models.find(m => m.id === selectedModel)?.isFree && (
                <Chip
                  label="Free Model"
                  color="success"
                  size="small"
                  sx={{ ml: 1, height: 20 }}
                />
              )}
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Paper
        elevation={3}
        sx={{
          p: 2,
          flexGrow: 1,
          mb: 2,
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <List sx={{ width: '100%' }}>
          {messages.map((msg, index) => (
            <React.Fragment key={index}>
              <ListItem
                alignItems="flex-start"
                sx={{
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  pl: msg.role === 'user' ? 4 : 1,
                  pr: msg.role === 'user' ? 1 : 4,
                }}
              >
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    maxWidth: '80%',
                    bgcolor: msg.role === 'user' ? 'primary.light' : 'background.paper',
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="subtitle2" color={msg.role === 'user' ? 'primary' : 'secondary'} gutterBottom>
                    {msg.role === 'user' ? 'You' : 'Assistant'}
                  </Typography>
                  <Typography variant="body1">{msg.content}</Typography>
                </Paper>
              </ListItem>
              {index < messages.length - 1 && <Box sx={{ my: 1 }} />}
            </React.Fragment>
          ))}
        </List>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isSending}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSendMessage}
            disabled={!message.trim() || isSending}
            sx={{ minWidth: '100px' }}
          >
            {isSending ? <CircularProgress size={24} /> : 'Send'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default BasicChat;
