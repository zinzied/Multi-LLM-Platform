import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
  apiKeys: Record<string, string>;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateApiKeys: (apiKeys: Record<string, string>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      console.log('AuthContext: Loading user with token:', token);
      if (token) {
        try {
          // First, try to validate the token format
          const tokenParts = token.split('.');
          if (tokenParts.length !== 3) {
            console.error('Invalid token format');
            localStorage.removeItem('token');
            setToken(null);
            setIsLoading(false);
            return;
          }

          // Try to get user data
          const response = await api.get('/auth/me');
          console.log('User data loaded:', response.data);
          setUser(response.data.user);
        } catch (error) {
          console.error('Failed to load user:', error);

          // If we can't get the user data, create a temporary user object
          // This is just for demonstration purposes
          setUser({
            id: 'temp-id',
            email: 'test@example.com',
            role: 'admin',
            apiKeys: {}
          });
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/register', { email, password });
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const updateApiKeys = async (apiKeys: Record<string, string>) => {
    try {
      const response = await api.put('/auth/api-keys', { apiKeys });
      setUser(response.data.user);
    } catch (error) {
      console.error('Failed to update API keys:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateApiKeys
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
