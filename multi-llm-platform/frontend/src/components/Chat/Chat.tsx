import React, { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import {
  Send as SendIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Demo providers and models
const demoProviders = {
  openai: {
    name: 'OpenAI',
    models: [
      { id: 'gpt-4o', name: 'GPT-4o' },
      { id: 'gpt-4', name: 'GPT-4' },
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
      { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
      { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash' }
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
      { id: 'command-r-plus', name: 'Command R+' },
      { id: 'command-r', name: 'Command R' },
      { id: 'command-light', name: 'Command Light' }
    ]
  }
};

// Demo responses for each provider
const demoResponses = {
  openai: "I'm a simulated OpenAI assistant. This is a demo response to show how the chat interface works. In a real implementation, this would be a response from the OpenAI API.",
  anthropic: "I'm Claude, a simulated Anthropic assistant. This is a demo response to show how the chat interface works. In a real implementation, this would be a response from the Anthropic API.",
  google: "I'm a simulated Google Gemini assistant. This is a demo response to show how the chat interface works. In a real implementation, this would be a response from the Google API.",
  mistral: "I'm a simulated Mistral AI assistant. This is a demo response to show how the chat interface works. In a real implementation, this would be a response from the Mistral API.",
  cohere: "I'm a simulated Cohere assistant. This is a demo response to show how the chat interface works. In a real implementation, this would be a response from the Cohere API."
};

const Chat: React.FC = () => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedProvider, setSelectedProvider] = useState('openai');
  const [selectedModel, setSelectedModel] = useState('gpt-4o');
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

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
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleProviderChange = (event: SelectChangeEvent) => {
    const provider = event.target.value;
    setSelectedProvider(provider);

    // Set default model for the selected provider
    if (demoProviders[provider as keyof typeof demoProviders]?.models.length > 0) {
      setSelectedModel(demoProviders[provider as keyof typeof demoProviders].models[0].id);
    }
  };

  const handleModelChange = (event: SelectChangeEvent) => {
    setSelectedModel(event.target.value);
  };

  return (
    <Grid container spacing={2} sx={{ height: 'calc(100vh - 88px)' }}>
      {/* Chat area */}
      <Grid item xs={12} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Paper sx={{ p: 2, mb: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
            <FormControl sx={{ minWidth: 200 }} size="small">
              <InputLabel id="provider-label">Provider</InputLabel>
              <Select
                labelId="provider-label"
                value={selectedProvider}
                label="Provider"
                onChange={handleProviderChange}
              >
                {Object.entries(demoProviders).map(([id, provider]) => (
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
                  demoProviders[selectedProvider as keyof typeof demoProviders]?.models.map(model => (
                    <MenuItem key={model.id} value={model.id}>
                      {model.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Box>
        </Paper>

        {/* Messages area */}
        <Paper
          sx={{
            p: 2,
            mb: 2,
            flexGrow: 1,
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {messages.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Typography variant="body1" color="text.secondary">
                Start a new conversation by sending a message
              </Typography>
            </Box>
          ) : (
            <Box sx={{ flexGrow: 1 }}>
              {messages.map((msg, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    mb: 2
                  }}
                >
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      maxWidth: '80%',
                      bgcolor: msg.role === 'user' ? 'primary.light' : 'background.paper',
                      color: msg.role === 'user' ? 'primary.contrastText' : 'text.primary',
                      borderRadius: 2
                    }}
                  >
                    <Typography variant="body1">{msg.content}</Typography>
                  </Paper>
                </Box>
              ))}
            </Box>
          )}
        </Paper>

        {/* Input area */}
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
              endIcon={<SendIcon />}
              onClick={handleSendMessage}
              disabled={!message.trim() || isSending}
            >
              {isSending ? 'Sending...' : 'Send'}
            </Button>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Chat;
