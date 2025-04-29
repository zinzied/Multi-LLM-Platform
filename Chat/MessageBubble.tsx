import React from 'react';
import { Box, Paper, Typography, Avatar } from '@mui/material';
import { Person as PersonIcon, SmartToy as BotIcon } from '@mui/icons-material';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        mb: 2
      }}
    >
      {!isUser && (
        <Avatar sx={{ bgcolor: 'primary.main', mr: 1 }}>
          <BotIcon />
        </Avatar>
      )}
      
      <Paper
        elevation={1}
        sx={{
          p: 2,
          maxWidth: '80%',
          bgcolor: isUser ? 'primary.light' : 'background.paper',
          color: isUser ? 'primary.contrastText' : 'text.primary',
          borderRadius: 2,
          '& pre': {
            backgroundColor: '#f5f5f5',
            padding: '8px',
            borderRadius: '4px',
            overflowX: 'auto'
          },
          '& code': {
            backgroundColor: '#f5f5f5',
            padding: '2px 4px',
            borderRadius: '4px',
            fontFamily: 'monospace'
          }
        }}
      >
        <Typography variant="body1">{message.content}</Typography>
      </Paper>
      
      {isUser && (
        <Avatar sx={{ bgcolor: 'secondary.main', ml: 1 }}>
          <PersonIcon />
        </Avatar>
      )}
    </Box>
  );
};

export default MessageBubble;
