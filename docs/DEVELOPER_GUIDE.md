# Developer Guide for Multi-LLM Platform

This guide provides information for developers who want to extend or customize the Multi-LLM Platform.

## Table of Contents
- [Project Structure](#project-structure)
- [Backend Architecture](#backend-architecture)
- [Frontend Architecture](#frontend-architecture)
- [Adding a New LLM Provider](#adding-a-new-llm-provider)
- [Customizing the UI](#customizing-the-ui)
- [Database Schema](#database-schema)
- [Authentication System](#authentication-system)
- [API Documentation](#api-documentation)

## Project Structure

The Multi-LLM Platform follows a standard client-server architecture:

```
multi-llm-platform/
├── backend/               # Node.js Express server
│   ├── config/            # Configuration files
│   ├── models/            # Sequelize models
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   │   └── llm/           # LLM provider adapters
│   └── server.js          # Entry point
├── frontend/              # React application
│   ├── public/            # Static assets
│   └── src/               # Source code
│       ├── components/    # React components
│       ├── contexts/      # React contexts
│       └── services/      # API services
├── docs/                  # Documentation
└── .env                   # Environment variables
```

## Backend Architecture

The backend is built with Node.js and Express, using Sequelize as an ORM with SQLite as the database.

### Key Components:

1. **Server (server.js)**: The main entry point that sets up middleware, routes, and starts the server.

2. **Routes**: API endpoints organized by functionality:
   - `auth.js`: Authentication routes (register, login, etc.)
   - `llm.js`: LLM-related routes (chat, providers, etc.)
   - `admin.js`: Admin-only routes (user management, stats, etc.)

3. **Models**: Sequelize models representing database tables:
   - `User.js`: User accounts and API keys
   - `Conversation.js`: Chat conversations
   - `Usage.js`: LLM usage tracking

4. **Services**: Business logic separated from routes:
   - `llm/`: Adapters for different LLM providers
   - `llm/index.js`: Provider registry and factory

5. **Config**: Configuration files:
   - `database.js`: Database connection
   - `auth.js`: Authentication utilities (JWT)

## Frontend Architecture

The frontend is built with React, TypeScript, and Material-UI.

### Key Components:

1. **App.tsx**: The main component that sets up routing and global providers.

2. **Contexts**:
   - `AuthContext.tsx`: Authentication state and methods
   - Other contexts for global state management

3. **Components**:
   - `Auth/`: Authentication components (Login, Register)
   - `Chat/`: Chat interface components
   - `Settings/`: User settings components
   - `Admin/`: Admin panel components
   - `Dashboard.tsx`: Main layout component

4. **Services**:
   - `api.ts`: Axios instance for API calls

## Adding a New LLM Provider

To add support for a new LLM provider:

1. Create a new file in `backend/services/llm/` (e.g., `newprovider.js`)

2. Implement the required interface:
   ```javascript
   const name = 'New Provider Name';
   const description = 'Description of the provider';
   
   const models = [
     { id: 'model-id-1', name: 'Model Display Name 1' },
     { id: 'model-id-2', name: 'Model Display Name 2' }
   ];
   
   // Optional: Pricing information for cost calculation
   const pricing = {
     'model-id-1': { input: 0.0001, output: 0.0002 }, // per 1K tokens
     'model-id-2': { input: 0.0003, output: 0.0004 }
   };
   
   // Format messages for the provider's API
   const formatMessages = (messages) => {
     // Transform messages to the format expected by the provider
     return messages.map(msg => ({
       // Provider-specific format
     }));
   };
   
   // Send a chat request to the provider
   const chat = async (apiKey, model, messages) => {
     try {
       // Make API request to the provider
       const response = await axios.post(
         'https://api.newprovider.com/v1/chat',
         {
           model,
           messages: formatMessages(messages),
           // Other provider-specific parameters
         },
         {
           headers: {
             'Authorization': `Bearer ${apiKey}`,
             'Content-Type': 'application/json'
           }
         }
       );
       
       // Parse the response
       const result = response.data;
       
       // Return standardized response
       return {
         message: {
           role: 'assistant',
           content: result.choices[0].message.content
         },
         usage: {
           prompt_tokens: result.usage.prompt_tokens,
           completion_tokens: result.usage.completion_tokens,
           total_tokens: result.usage.total_tokens
         },
         cost: calculateCost(result.usage, pricing[model])
       };
     } catch (error) {
       throw new Error(`New Provider API Error: ${error.message}`);
     }
   };
   
   module.exports = {
     name,
     description,
     models,
     chat
   };
   ```

3. Register the provider in `backend/services/llm/index.js`:
   ```javascript
   const newProviderService = require('./newprovider');
   
   const services = {
     // Existing providers...
     newprovider: newProviderService
   };
   ```

4. Restart the server for the changes to take effect.

## Customizing the UI

The UI is built with Material-UI and can be customized in several ways:

1. **Theme**: Modify the theme in `frontend/src/App.tsx`:
   ```javascript
   const theme = createTheme({
     palette: {
       primary: {
         main: '#1976d2', // Change to your preferred color
       },
       secondary: {
         main: '#dc004e', // Change to your preferred color
       },
       // Add more customizations
     },
   });
   ```

2. **Components**: Customize individual components in their respective files.

3. **Styles**: Use Material-UI's styling system (sx prop, styled components, etc.) to customize component styles.

## Database Schema

The platform uses SQLite with Sequelize ORM. Here's the database schema:

### User
- `id`: UUID (primary key)
- `email`: String (unique)
- `password`: String (hashed)
- `role`: Enum ('user', 'admin')
- `apiKeys`: JSON (encrypted API keys)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### Conversation
- `id`: UUID (primary key)
- `title`: String
- `messages`: JSON (array of messages)
- `provider`: String
- `model`: String
- `UserId`: UUID (foreign key)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### Usage
- `id`: UUID (primary key)
- `provider`: String
- `model`: String
- `promptTokens`: Integer
- `completionTokens`: Integer
- `totalTokens`: Integer
- `cost`: Float
- `success`: Boolean
- `errorMessage`: Text (nullable)
- `timestamp`: DateTime
- `UserId`: UUID (foreign key)
- `createdAt`: DateTime
- `updatedAt`: DateTime

## Authentication System

The platform uses JWT (JSON Web Tokens) for authentication:

1. **Registration**: Users register with email and password.
2. **Login**: Users login to receive a JWT token.
3. **Authentication**: The token is included in the Authorization header for protected routes.
4. **Authorization**: Role-based access control for admin features.

Key files:
- `backend/config/auth.js`: JWT utilities
- `backend/routes/auth.js`: Authentication routes
- `frontend/src/contexts/AuthContext.tsx`: Authentication state management

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Login and get JWT token
- `GET /api/auth/me`: Get current user info
- `PUT /api/auth/api-keys`: Update API keys

### LLM Endpoints

- `GET /api/llm/providers`: Get available providers and models
- `POST /api/llm/chat`: Send a message to an LLM
- `GET /api/llm/conversations`: Get user's conversations
- `GET /api/llm/conversations/:id`: Get a specific conversation
- `DELETE /api/llm/conversations/:id`: Delete a conversation

### Admin Endpoints

- `GET /api/admin/users`: Get all users
- `GET /api/admin/usage`: Get usage statistics
- `GET /api/admin/usage/:userId`: Get usage for a specific user

---

For more information or if you have questions, please create an issue on the GitHub repository.
