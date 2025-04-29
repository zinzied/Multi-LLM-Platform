import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Box, CircularProgress, Typography, Button } from '@mui/material';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, token } = useAuth();
  const navigate = useNavigate();
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    console.log('ProtectedRoute: isLoading =', isLoading, 'isAuthenticated =', isAuthenticated, 'token =', token);

    // If not loading and not authenticated, redirect to login
    if (!isLoading && !isAuthenticated && !token) {
      console.log('ProtectedRoute: Redirecting to login');
      navigate('/login');
    }
  }, [isLoading, isAuthenticated, token, navigate]);

  // For debugging purposes
  const debugInfo = {
    isLoading,
    isAuthenticated,
    hasToken: !!token,
    tokenLength: token?.length || 0
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress sx={{ mb: 2 }} />
        <Typography variant="body2">Loading user data...</Typography>
        <Button
          variant="text"
          size="small"
          onClick={() => setShowDebug(!showDebug)}
          sx={{ mt: 2 }}
        >
          {showDebug ? 'Hide Debug Info' : 'Show Debug Info'}
        </Button>
        {showDebug && (
          <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="caption" component="pre">
              {JSON.stringify(debugInfo, null, 2)}
            </Typography>
          </Box>
        )}
      </Box>
    );
  }

  // Force authentication for demo purposes
  const forceAuth = true;

  if (!isAuthenticated && !forceAuth) {
    console.log('ProtectedRoute: Not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
