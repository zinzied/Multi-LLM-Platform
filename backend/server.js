const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const llmRoutes = require('./routes/llm');
const adminRoutes = require('./routes/admin');

// Initialize database
const db = require('./config/database');

// Create Express app
const app = express();

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for testing
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// Direct route to create a user (for testing)
app.get('/api/create-user', async (req, res) => {
  try {
    const User = require('./models/User');

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email: 'test@example.com' } });
    if (existingUser) {
      return res.json({
        success: true,
        message: 'User already exists',
        user: existingUser.toJSON(),
        token: require('./config/auth').generateToken(existingUser)
      });
    }

    // Create new user
    const user = await User.create({
      email: 'test@example.com',
      password: 'password123',
      role: 'admin'
    });

    // Generate token
    const token = require('./config/auth').generateToken(user);

    res.json({
      success: true,
      message: 'User created successfully',
      user: user.toJSON(),
      token
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create user',
      error: error.message
    });
  }
});

// Test registration route
app.post('/api/test-register', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Test registration attempt:', { email });

    const User = require('./models/User');

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      console.log('User already exists');
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Create new user
    const user = await User.create({
      email,
      password,
      role: 'user'
    });

    // Generate token
    const token = require('./config/auth').generateToken(user);

    console.log('User registered successfully');
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Registration failed:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/llm', llmRoutes);
app.use('/api/admin', adminRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
