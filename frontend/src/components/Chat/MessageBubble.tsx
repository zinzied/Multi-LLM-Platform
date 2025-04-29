import React from 'react';
import { Box, Paper, Typography, Avatar } from '@mui/material';
import { Person as PersonIcon, SmartToy as BotIcon } from '@mui/icons-material';
import ReactMarkdown from 'react-markdown';

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
      className="message-bubble"
      sx={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        mb: 2,
        width: '100%'
      }}
    >
      {!isUser && (
        <Avatar sx={{ bgcolor: 'primary.main', mr: 1, flexShrink: 0 }}>
          <BotIcon />
        </Avatar>
      )}

      <Paper
        elevation={1}
        className={isUser ? 'user-message' : 'assistant-message'}
        sx={{
          p: 2,
          maxWidth: '80%',
          bgcolor: isUser ? 'primary.light' : 'background.paper',
          color: isUser ? 'primary.contrastText' : 'text.primary',
          borderRadius: 2,
          wordBreak: 'break-word',
          '& pre': {
            backgroundColor: '#f5f5f5',
            padding: '8px',
            borderRadius: '4px',
            overflowX: 'auto',
            maxWidth: '100%'
          },
          '& code': {
            backgroundColor: '#f5f5f5',
            padding: '2px 4px',
            borderRadius: '4px',
            fontFamily: 'monospace'
          },
          '& p': {
            margin: '0.5em 0'
          },
          '& img': {
            maxWidth: '100%',
            height: 'auto'
          }
        }}
      >
        {isUser ? (
          <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>{message.content}</Typography>
        ) : (
          <ReactMarkdown>{message.content}</ReactMarkdown>
        )}
      </Paper>

      {isUser && (
        <Avatar sx={{ bgcolor: 'secondary.main', ml: 1, flexShrink: 0 }}>
          <PersonIcon />
        </Avatar>
      )}
    </Box>
  );
};

export default MessageBubble;
