import React, { useState } from 'react';
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
  CircularProgress
} from '@mui/material';

// Define available LLM providers and models
const providers = {
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
  }
};

// Demo responses for each provider
const demoResponses: Record<string, string> = {
  openai: "I'm a simulated OpenAI assistant. This is a demo response to show how the chat interface works. In a real implementation, this would be a response from the OpenAI API.",
  anthropic: "I'm a simulated Anthropic Claude assistant. This is a demo response to show how the chat interface works. In a real implementation, this would be a response from the Claude API.",
  google: "I'm a simulated Google Gemini assistant. This is a demo response to show how the chat interface works. In a real implementation, this would be a response from the Gemini API.",
  mistral: "I'm a simulated Mistral AI assistant. This is a demo response to show how the chat interface works. In a real implementation, this would be a response from the Mistral API.",
  cohere: "I'm a simulated Cohere assistant. This is a demo response to show how the chat interface works. In a real implementation, this would be a response from the Cohere API."
};

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const BasicChat: React.FC = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! How can I help you today? Please select an LLM provider and model to start chatting.' }
  ]);
  const [selectedProvider, setSelectedProvider] = useState('openai');
  const [selectedModel, setSelectedModel] = useState('gpt-4o');
  const [isSending, setIsSending] = useState(false);

  const handleProviderChange = (event: SelectChangeEvent) => {
    const provider = event.target.value;
    setSelectedProvider(provider);

    // Reset model when provider changes
    if (providers[provider as keyof typeof providers]?.models.length > 0) {
      setSelectedModel(providers[provider as keyof typeof providers].models[0].id);
    } else {
      setSelectedModel('');
    }
  };

  const handleModelChange = (event: SelectChangeEvent) => {
    setSelectedModel(event.target.value);
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
      <Paper sx={{ p: 2, mb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
          <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel id="provider-label">LLM Provider</InputLabel>
            <Select
              labelId="provider-label"
              value={selectedProvider}
              label="LLM Provider"
              onChange={handleProviderChange}
            >
              {Object.entries(providers).map(([id, provider]) => (
                <MenuItem key={id} value={id}>
                  {provider.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel id="model-label">Model</InputLabel>
            <Select
              labelId="model-label"
              value={selectedModel}
              label="Model"
              onChange={handleModelChange}
            >
              {selectedProvider &&
                providers[selectedProvider as keyof typeof providers]?.models.map(model => (
                  <MenuItem key={model.id} value={model.id}>
                    {model.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          <Typography variant="body2" sx={{ ml: 'auto', alignSelf: 'center', color: 'text.secondary' }}>
            Selected: {providers[selectedProvider as keyof typeof providers]?.name} -
            {providers[selectedProvider as keyof typeof providers]?.models.find(m => m.id === selectedModel)?.name}
          </Typography>
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
