import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Alert,
  Snackbar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

interface Provider {
  name: string;
  description: string;
  models: Array<{
    id: string;
    name: string;
    description: string;
  }>;
}

interface Providers {
  [key: string]: Provider;
}

const ApiKeys: React.FC = () => {
  const { user, updateApiKeys } = useAuth();
  const [providers, setProviders] = useState<Providers>({});
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProviders = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/llm/providers');
        setProviders(response.data.providers);
      } catch (err) {
        setError('Failed to load providers');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProviders();
  }, []);

  useEffect(() => {
    if (user?.apiKeys) {
      setApiKeys(user.apiKeys);
    }
  }, [user]);

  const handleApiKeyChange = (provider: string, value: string) => {
    setApiKeys(prev => ({
      ...prev,
      [provider]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    setSuccess('');
    
    try {
      await updateApiKeys(apiKeys);
      setSuccess('API keys saved successfully');
    } catch (err) {
      setError('Failed to save API keys');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccess('');
    setError('');
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        API Keys
      </Typography>
      <Typography variant="body1" paragraph>
        Enter your API keys for each provider you want to use. Your keys are encrypted and stored securely.
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          {Object.entries(providers).map(([providerId, provider]) => (
            <Grid item xs={12} key={providerId}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">{provider.name}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" paragraph>
                    {provider.description}
                  </Typography>
                  <Typography variant="subtitle2" gutterBottom>
                    Available Models:
                  </Typography>
                  <ul>
                    {provider.models.map(model => (
                      <li key={model.id}>
                        <Typography variant="body2">
                          <strong>{model.name}</strong> - {model.description}
                        </Typography>
                      </li>
                    ))}
                  </ul>
                  <TextField
                    fullWidth
                    label={`${provider.name} API Key`}
                    variant="outlined"
                    margin="normal"
                    type="password"
                    value={apiKeys[providerId] || ''}
                    onChange={(e) => handleApiKeyChange(providerId, e.target.value)}
                    placeholder={`Enter your ${provider.name} API key`}
                  />
                </AccordionDetails>
              </Accordion>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save API Keys'}
          </Button>
        </Box>
      </Paper>

      <Snackbar open={!!success} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>

      <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ApiKeys;
