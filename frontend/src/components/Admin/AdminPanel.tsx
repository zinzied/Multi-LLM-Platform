import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import api from '../../services/api';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}

interface UsageRecord {
  id: string;
  provider: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  cost: number;
  success: boolean;
  errorMessage?: string;
  timestamp: string;
  User: {
    id: string;
    email: string;
  };
}

interface UsageTotals {
  [provider: string]: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    cost: number;
    successCount: number;
    errorCount: number;
  };
}

const AdminPanel: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [users, setUsers] = useState<User[]>([]);
  const [usage, setUsage] = useState<UsageRecord[]>([]);
  const [errors, setErrors] = useState<UsageRecord[]>([]);
  const [totals, setTotals] = useState<UsageTotals>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<'user' | 'admin'>('user');
  
  // Filters
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [providerFilter, setProviderFilter] = useState<string>('');
  const [userFilter, setUserFilter] = useState<string>('');

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      if (tabValue !== 0) return;
      
      setIsLoading(true);
      try {
        const response = await api.get('/admin/users');
        setUsers(response.data.users);
      } catch (err) {
        console.error('Failed to load users:', err);
        setError('Failed to load users');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [tabValue]);

  // Fetch usage data
  useEffect(() => {
    const fetchUsage = async () => {
      if (tabValue !== 1) return;
      
      setIsLoading(true);
      try {
        let url = '/admin/usage?';
        
        if (startDate) {
          url += `startDate=${startDate.toISOString()}&`;
        }
        
        if (endDate) {
          url += `endDate=${endDate.toISOString()}&`;
        }
        
        if (providerFilter) {
          url += `provider=${providerFilter}&`;
        }
        
        if (userFilter) {
          url += `userId=${userFilter}`;
        }
        
        const response = await api.get(url);
        setUsage(response.data.usage);
        setTotals(response.data.totals);
      } catch (err) {
        console.error('Failed to load usage data:', err);
        setError('Failed to load usage data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsage();
  }, [tabValue, startDate, endDate, providerFilter, userFilter]);

  // Fetch errors
  useEffect(() => {
    const fetchErrors = async () => {
      if (tabValue !== 2) return;
      
      setIsLoading(true);
      try {
        const response = await api.get('/admin/errors');
        setErrors(response.data.errors);
      } catch (err) {
        console.error('Failed to load errors:', err);
        setError('Failed to load errors');
      } finally {
        setIsLoading(false);
      }
    };

    fetchErrors();
  }, [tabValue]);

  const handleRoleChange = (user: User) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setDialogOpen(true);
  };

  const handleUpdateRole = async () => {
    if (!selectedUser) return;
    
    try {
      await api.put(`/admin/users/${selectedUser.id}/role`, { role: newRole });
      
      // Update users list
      setUsers(prev => prev.map(user => 
        user.id === selectedUser.id ? { ...user, role: newRole } : user
      ));
      
      setDialogOpen(false);
    } catch (err) {
      console.error('Failed to update user role:', err);
      setError('Failed to update user role');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 4
    }).format(amount);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Admin Panel
      </Typography>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="admin tabs">
          <Tab label="Users" />
          <Tab label="Usage Statistics" />
          <Tab label="Error Logs" />
        </Tabs>

        {error && (
          <Alert severity="error" sx={{ m: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Users Tab */}
        <TabPanel value={tabValue} index={0}>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Created At</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>{formatDate(user.createdAt)}</TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleRoleChange(user)}
                        >
                          Change Role
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {users.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        No users found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </TabPanel>

        {/* Usage Statistics Tab */}
        <TabPanel value={tabValue} index={1}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Filters
              </Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={3}>
                  <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={setStartDate}
                    slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={setEndDate}
                    slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Provider</InputLabel>
                    <Select
                      value={providerFilter}
                      label="Provider"
                      onChange={(e) => setProviderFilter(e.target.value)}
                    >
                      <MenuItem value="">All Providers</MenuItem>
                      <MenuItem value="openai">OpenAI</MenuItem>
                      <MenuItem value="anthropic">Anthropic</MenuItem>
                      <MenuItem value="google">Google</MenuItem>
                      <MenuItem value="mistral">Mistral</MenuItem>
                      <MenuItem value="cohere">Cohere</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>User</InputLabel>
                    <Select
                      value={userFilter}
                      label="User"
                      onChange={(e) => setUserFilter(e.target.value)}
                    >
                      <MenuItem value="">All Users</MenuItem>
                      {users.map(user => (
                        <MenuItem key={user.id} value={user.id}>
                          {user.email}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          </LocalizationProvider>

          <Typography variant="h6" gutterBottom>
            Summary
          </Typography>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {Object.entries(totals).map(([provider, data]) => (
              <Grid item xs={12} sm={6} md={4} key={provider}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {provider.charAt(0).toUpperCase() + provider.slice(1)}
                    </Typography>
                    <Typography variant="body2">
                      Total Tokens: {data.totalTokens.toLocaleString()}
                    </Typography>
                    <Typography variant="body2">
                      Total Cost: {formatCurrency(data.cost)}
                    </Typography>
                    <Typography variant="body2">
                      Success Rate: {Math.round((data.successCount / (data.successCount + data.errorCount)) * 100)}%
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
            {Object.keys(totals).length === 0 && (
              <Grid item xs={12}>
                <Typography variant="body2" align="center">
                  No usage data available
                </Typography>
              </Grid>
            )}
          </Grid>

          <Typography variant="h6" gutterBottom>
            Detailed Usage
          </Typography>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Provider</TableCell>
                    <TableCell>Model</TableCell>
                    <TableCell>Tokens</TableCell>
                    <TableCell>Cost</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Timestamp</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {usage.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.User.email}</TableCell>
                      <TableCell>{record.provider}</TableCell>
                      <TableCell>{record.model}</TableCell>
                      <TableCell>{record.totalTokens.toLocaleString()}</TableCell>
                      <TableCell>{formatCurrency(record.cost)}</TableCell>
                      <TableCell>
                        {record.success ? (
                          <Typography color="success.main">Success</Typography>
                        ) : (
                          <Typography color="error.main">Error</Typography>
                        )}
                      </TableCell>
                      <TableCell>{formatDate(record.timestamp)}</TableCell>
                    </TableRow>
                  ))}
                  {usage.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        No usage data found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </TabPanel>

        {/* Error Logs Tab */}
        <TabPanel value={tabValue} index={2}>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Provider</TableCell>
                    <TableCell>Model</TableCell>
                    <TableCell>Error Message</TableCell>
                    <TableCell>Timestamp</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {errors.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.User.email}</TableCell>
                      <TableCell>{record.provider}</TableCell>
                      <TableCell>{record.model}</TableCell>
                      <TableCell>{record.errorMessage}</TableCell>
                      <TableCell>{formatDate(record.timestamp)}</TableCell>
                    </TableRow>
                  ))}
                  {errors.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No errors found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </TabPanel>
      </Paper>

      {/* Role Change Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Change User Role</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Change the role for user: {selectedUser?.email}
          </DialogContentText>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Role</InputLabel>
            <Select
              value={newRole}
              label="Role"
              onChange={(e) => setNewRole(e.target.value as 'user' | 'admin')}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdateRole} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminPanel;
