import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const SimpleChat: React.FC = () => {
  return (
    <Box sx={{ width: '100%', height: '100%', p: 2 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          height: '80vh', 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f8f9fa'
        }}
      >
        <Typography variant="h4" gutterBottom>
          Chat Interface
        </Typography>
        <Typography variant="body1">
          This is a simplified chat interface to test rendering.
        </Typography>
      </Paper>
    </Box>
  );
};

export default SimpleChat;
