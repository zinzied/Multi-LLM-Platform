import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  ListItemIcon
} from '@mui/material';
import {
  Send as SendIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';

// Create mock implementations for missing modules
const useAuth = () => ({ user: { apiKeys: {} } });
const api = {
  get: async (url: string) => ({ data: { providers: {}, conversations: [], conversation: {} } }),
  post: async (url: string, data: any) => ({ data: { message: {}, conversation: {} } }),
  delete: async (url: string) => ({})
};

import MessageBubble from './MessageBubble';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface Conversation {
  id: string;
  title: string;
  provider: string;
  model: string;
}

interface Provider {
  name: string;
  models: Array<{
    id: string;
    name: string;
    description: string;
  }>;
}

interface Providers {
  [key: string]: Provider;
}

const Chat: React.FC = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [providers, setProviders] = useState<Providers>({});
  const [selectedProvider, setSelectedProvider] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);

  // Fetch providers and models
  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await api.get('/llm/providers');
        setProviders(response.data.providers);
        
        // Set default provider and model if none selected
        if (!selectedProvider && Object.keys(response.data.providers).length > 0) {
          const firstProvider = Object.keys(response.data.providers)[0];
          setSelectedProvider(firstProvider);
          
          const models = response.data.providers[firstProvider].models;
          if (models.length > 0) {
            setSelectedModel(models[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load providers:', err);
        setError('Failed to load providers');
      }
    };

    fetchProviders();
  }, [selectedProvider]);

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await api.get('/llm/conversations');
        setConversations(response.data.conversations);
      } catch (err) {
        console.error('Failed to load conversations:', err);
      }
    };

    fetchConversations();
  }, []);

  // Fetch conversation messages if conversationId is provided
  useEffect(() => {
    const fetchConversation = async () => {
      if (!conversationId) {
        setMessages([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await api.get(`/llm/conversations/${conversationId}`);
        const conversation = response.data.conversation;
        
        setMessages(conversation.messages || []);
        setSelectedProvider(conversation.provider);
        setSelectedModel(conversation.model);
      } catch (err) {
        console.error('Failed to load conversation:', err);
        setError('Failed to load conversation');
        navigate('/chat');
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversation();
  }, [conversationId, navigate]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    if (!selectedProvider || !selectedModel) {
      setError('Please select a provider and model');
      return;
    }

    // Check if API key is set for the selected provider
    if (!user?.apiKeys?.[selectedProvider]) {
      setError(`API key for ${providers[selectedProvider]?.name || selectedProvider} is not set. Please add it in the API Keys section.`);
      return;
    }

    const newMessage: Message = { role: 'user', content: message };
    setMessages(prev => [...prev, newMessage]);
    setMessage('');
    setIsSending(true);
    setError('');

    try {
      const response = await api.post('/llm/chat', {
        provider: selectedProvider,
        model: selectedModel,
        messages: conversationId ? [newMessage] : [...messages, newMessage],
        conversationId
      });

      // Update messages with assistant response
      setMessages(prev => [...prev, response.data.message]);
      
      // If this is a new conversation, navigate to the new conversation URL
      if (!conversationId && response.data.conversation?.id) {
        navigate(`/chat/${response.data.conversation.id}`);
        
        // Update conversations list
        setConversations(prev => [response.data.conversation, ...prev]);
      }
    } catch (err: any) {
      console.error('Failed to send message:', err);
      setError(err.response?.data?.message || 'Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNewChat = () => {
    navigate('/chat');
    setMessages([]);
    setSelectedConversation(null);
  };

  const handleProviderChange = (event: SelectChangeEvent) => {
    const provider = event.target.value;
    setSelectedProvider(provider);
    
    // Reset model when provider changes
    if (providers[provider]?.models.length > 0) {
      setSelectedModel(providers[provider].models[0].id);
    } else {
      setSelectedModel('');
    }
  };

  const handleModelChange = (event: SelectChangeEvent) => {
    setSelectedModel(event.target.value);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, conversationId: string) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedConversation(conversationId);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedConversation(null);
  };

  const handleDeleteConversation = async () => {
    if (!selectedConversation) return;
    
    try {
      await api.delete(`/llm/conversations/${selectedConversation}`);
      
      // Update conversations list
      setConversations(prev => prev.filter(conv => conv.id !== selectedConversation));
      
      // If the deleted conversation is the current one, navigate to new chat
      if (conversationId === selectedConversation) {
        navigate('/chat');
      }
    } catch (err) {
      console.error('Failed to delete conversation:', err);
      setError('Failed to delete conversation');
    } finally {
      handleMenuClose();
    }
  };

  return (
    <Grid container spacing={2} sx={{ height: 'calc(100vh - 88px)' }}>
      {/* Sidebar with conversations */}
      <Grid item xs={12} md={3} sx={{ height: '100%', display: { xs: 'none', md: 'block' } }}>
        <Paper sx={{ height: '100%', overflow: 'auto', p: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            fullWidth
            onClick={handleNewChat}
            sx={{ mb: 2 }}
          >
            New Chat
          </Button>
          
          <Divider sx={{ mb: 2 }} />
          
          <List>
            {conversations.map(conversation => (
              <ListItem
                key={conversation.id}
                disablePadding
                secondaryAction={
                  <IconButton edge="end" onClick={(e) => handleMenuOpen(e, conversation.id)}>
                    <MoreVertIcon />
                  </IconButton>
                }
              >
                <ListItemButton
                  selected={conversationId === conversation.id}
                  onClick={() => navigate(`/chat/${conversation.id}`)}
                >
                  <ListItemText
                    primary={conversation.title}
                    secondary={`${providers[conversation.provider]?.name || conversation.provider} - ${conversation.model}`}
                    primaryTypographyProps={{
                      noWrap: true,
                      style: { maxWidth: '180px' }
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
            {conversations.length === 0 && (
              <Typography variant="body2" color="text.secondary" align="center">
                No conversations yet
              </Typography>
            )}
          </List>
          
          <Menu
            anchorEl={menuAnchorEl}
            open={Boolean(menuAnchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleDeleteConversation}>
              <ListItemIcon>
                <DeleteIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Delete</ListItemText>
            </MenuItem>
          </Menu>
        </Paper>
      </Grid>
      
      {/* Chat area */}
      <Grid item xs={12} md={9} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Paper sx={{ p: 2, mb: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
            <FormControl sx={{ minWidth: 200 }} size="small">
              <InputLabel id="provider-label">Provider</InputLabel>
              <Select
                labelId="provider-label"
                value={selectedProvider}
                label="Provider"
                onChange={handleProviderChange}
                disabled={!!conversationId}
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
                disabled={!!conversationId || !selectedProvider}
              >
                {selectedProvider &&
                  providers[selectedProvider]?.models.map(model => (
                    <MenuItem key={model.id} value={model.id}>
                      {model.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            
            <Box sx={{ display: { xs: 'block', md: 'none' }, ml: 'auto' }}>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleNewChat}
                size="small"
              >
                New
              </Button>
            </Box>
          </Box>
        </Paper>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        
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
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress />
            </Box>
          ) : messages.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Typography variant="body1" color="text.secondary">
                Start a new conversation by sending a message
              </Typography>
            </Box>
          ) : (
            <Box sx={{ flexGrow: 1 }}>
              {messages.map((msg, index) => (
                <MessageBubble key={index} message={msg} />
              ))}
              <div ref={messagesEndRef} />
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
              {isSending ? <CircularProgress size={24} /> : 'Send'}
            </Button>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Chat;
