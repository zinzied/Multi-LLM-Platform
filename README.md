# 🤖 Multi-LLM Platform

<div align="center">
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Material--UI-0081CB?style=for-the-badge&logo=material-ui&logoColor=white" alt="Material UI" />
</div>

<p align="center">
  <b>One platform to rule them all! 🧠</b><br>
  A unified platform that connects to multiple LLM providers (OpenAI, Anthropic, Google, Mistral, Cohere) through their public APIs.
</p>

## ✨ Features

- 🔌 Connect to **multiple LLM providers** through their APIs
- 🔑 Secure **user authentication** and API key management
- 💬 Intuitive **chat interface** for interacting with LLMs
- 🔄 **Unified API abstraction** for all providers
- 📊 Comprehensive **usage tracking** and error logging
- 👑 Powerful **admin panel** for monitoring and management
- 🧩 **Extensible architecture** for easy addition of new LLM providers

## 🤝 Supported LLM Providers

### Paid Providers
- 🟢 **OpenAI** - GPT-4o, GPT-4 Turbo, GPT-4, GPT-3.5 Turbo
- 🟣 **Anthropic** - Claude 3 Opus, Claude 3 Sonnet, Claude 3 Haiku, Claude 2.1
- 🔵 **Google** - Gemini 1.5 Pro, Gemini 1.5 Flash, Gemini 1.0 Pro
- 🟠 **Mistral AI** - Mistral Large, Mistral Medium, Mistral Small, Open Mistral 7B
- 🟡 **Cohere** - Command R+, Command R, Command Light

### Free Providers
- 🌈 **OpenRouter** - Free access to GPT-3.5 Turbo, Claude Instant, PaLM 2, Llama 2, and Mistral 7B
- 🤝 **Together AI** - Free access to Llama 2, Mistral 7B, Nous Hermes, RedPajama, and Dolly v2
- 🤖 **Grok** - Free access to Grok-1 and Grok-1 Mini (with X Premium subscription)

## 🛠️ Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## 💾 Database Information

The Multi-LLM Platform uses SQLite for data storage, which offers several advantages:

- **No separate database server required** - SQLite runs embedded in the application
- **Simple setup** - The database is automatically created when you first run the server
- **Portable** - All data is stored in a single file (`backend/data/database.sqlite`)

### Important Database Notes

- **Always use `node backend/server.js`** to run the server for proper database persistence
- The database file is created automatically in the `backend/data` directory
- All your conversations, API keys, and user data are stored in this file
- If you stop the Node server abruptly, some recent changes might not be saved
- For production use, consider setting up regular backups of the database file

### Database Tables

- **Users**: Stores user accounts, passwords (hashed), and encrypted API keys
- **Conversations**: Stores chat conversations with message history
- **Usage**: Tracks API usage, costs, and errors for monitoring

## 📚 Documentation

Comprehensive documentation is available in the [docs](docs/) directory:

- [API Keys Guide](docs/API_KEYS_GUIDE.md) - How to obtain and manage API keys
- [Database Guide](docs/DATABASE_GUIDE.md) - Detailed information about the database system
- [Troubleshooting Guide](docs/TROUBLESHOOTING.md) - Solutions to common issues
- [Developer Guide](docs/DEVELOPER_GUIDE.md) - Information for extending the platform

## �📦 Installation

1. Clone the repository or download the source code:
   ```bash
   git clone https://github.com/zinzied/multi-llm-platform.git
   cd multi-llm-platform
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Install frontend dependencies (in PowerShell use semicolons instead of &&):
   ```bash
   # For bash/cmd:
   cd frontend && npm install && cd ..

   # For PowerShell:
   cd frontend; npm install; cd ..
   ```

4. Create a `.env` file in the root directory (if it doesn't exist):
   ```
   NODE_ENV=development
   PORT=5001
   JWT_SECRET=your_jwt_secret_key_change_this_in_production
   ```

5. Create the data directory for the SQLite database:
   ```bash
   # For bash/Linux/macOS:
   mkdir -p backend/data

   # For Windows:
   mkdir backend\data
   ```

## 🚀 Running the Application

### Development Mode

1. Start the backend server:
   ```bash
   # Using npm script
   npm run server

   # OR using node directly (recommended for database persistence)
   node backend/server.js
   ```

   > **IMPORTANT**: Always use `node backend/server.js` instead of `npm run server` if you want to ensure your database changes are properly saved and synced. The Node server maintains the SQLite database connection and ensures all data is properly persisted.

2. In a separate terminal, start the frontend:
   ```bash
   # For bash/cmd:
   cd frontend && npm run dev

   # For PowerShell:
   cd frontend; npm run dev
   ```

3. Access the application at `http://localhost:5173` 🎉

4. For testing purposes, you can create a test user by visiting:
   `http://localhost:5001/api/create-user`
   This will create a user with:
   - Email: test@example.com
   - Password: password123
   - Role: admin

5. **Database Persistence**:
   - The SQLite database is stored in `backend/data/database.sqlite`
   - All your conversations, API keys, and user data are saved in this file
   - Make sure to keep the Node server running to ensure all changes are saved
   - Consider backing up this file regularly if you store important conversations

### Production Mode

1. Build the frontend:
   ```bash
   # For bash/cmd:
   cd frontend && npm run build && cd ..

   # For PowerShell:
   cd frontend; npm run build; cd ..
   ```

2. Start the production server:
   ```bash
   # Using npm script
   npm start

   # OR using node directly (recommended for database persistence)
   NODE_ENV=production node backend/server.js
   ```

3. Access the application at `http://localhost:5001` 🚀

> **Production Database**: In production mode, the same SQLite database in `backend/data/database.sqlite` is used. For a production environment, you might want to:
> - Set up regular database backups
> - Consider migrating to a more robust database like PostgreSQL or MySQL
> - Use a process manager like PM2 to keep the Node server running: `pm2 start backend/server.js`

### Troubleshooting

If you encounter any issues:

1. Make sure all dependencies are installed correctly:
   ```bash
   # For the backend:
   npm install

   # For the frontend (PowerShell):
   cd frontend; npm install; cd ..
   ```

2. Check that the `.env` file exists in the root directory

3. Ensure the data directory exists:
   ```bash
   mkdir backend\data
   ```

4. If you get errors about missing modules, try:
   ```bash
   npm install --legacy-peer-deps
   cd frontend; npm install --legacy-peer-deps; cd ..
   ```

5. If you see errors about Vite not being found, make sure you've installed the frontend dependencies:
   ```bash
   cd frontend; npm install; cd ..
   ```

6. If port 5001 is already in use, change the PORT value in your .env file to another port (e.g., 5002, 5003, etc.)

7. Make sure you have the latest version of Node.js installed (v16 or higher)

For more detailed troubleshooting steps, see our [Troubleshooting Guide](docs/TROUBLESHOOTING.md).

### Quick Start Guide

For a quick start:

1. Create the .env file with the content provided above
2. Run these commands:
   ```bash
   # Install dependencies
   npm install
   cd frontend; npm install; cd ..

   # Create data directory
   mkdir backend\data

   # Start the backend server (IMPORTANT: use node directly for database persistence)
   node backend/server.js

   # In a new terminal, start the frontend
   cd frontend; npm run dev
   ```

3. Visit `http://localhost:5001/api/create-user` to create a test user
4. Access the application at `http://localhost:5173`
5. Log in with:
   - Email: test@example.com
   - Password: password123

> **Database Note**: Always keep the Node server running with `node backend/server.js` to ensure your database changes (conversations, API keys, user data) are properly saved. The SQLite database is stored in `backend/data/database.sqlite`.

## 📝 Usage

1. 👤 Register a new account or log in with the test account:
   - Email: test@example.com
   - Password: password123

2. 🔑 Add your API keys for the LLM providers you want to use:
   - Navigate to Settings > API Keys in the sidebar
   - Enter your API keys for each provider you want to use
   - Click Save to store your keys securely

3. 💬 Start a new chat:
   - Click on "New Chat" in the sidebar
   - Select a provider from the dropdown menu (OpenAI, Anthropic, Google, etc.)
   - Select a specific model from the chosen provider
   - Type your message and click Send

4. 📨 Send messages and receive responses from the selected LLM
   - Your conversation history will be saved automatically
   - You can view past conversations in the sidebar

## 🔑 Getting API Keys for LLM Providers

To use the Multi-LLM Platform, you'll need API keys from the LLM providers you want to use. Here's a quick overview:

### OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Click "Create new secret key"
5. Copy the generated API key

### Anthropic API Key
1. Visit [Anthropic Console](https://console.anthropic.com/)
2. Create an account or sign in
3. Go to the API Keys section
4. Generate a new API key

### Google AI (Gemini) API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key

### Mistral AI API Key
1. Visit [Mistral AI Platform](https://console.mistral.ai/)
2. Create an account or sign in
3. Navigate to the API Keys section
4. Generate a new API key

### Cohere API Key
1. Visit [Cohere Dashboard](https://dashboard.cohere.com/)
2. Sign up or log in
3. Navigate to API Keys
4. Create a new API key

For detailed instructions, pricing information, and security best practices, see our [API Keys Guide](docs/API_KEYS_GUIDE.md).

## 👑 Admin Features

Admin users have access to:
- 👥 User management
- 📊 Usage statistics and cost tracking
- ⚠️ Error logs and diagnostics

## 🧩 Extending the Platform

The Multi-LLM Platform is designed to be easily extended and customized.

### Adding a New LLM Provider

To add a new LLM provider:

1. Create a new adapter file in `backend/services/llm/` (e.g., `newprovider.js`)
2. Implement the required interface (name, description, models, chat function)
3. Add the new provider to the `index.js` file in the same directory
4. Restart the server for the changes to take effect

For detailed instructions and code examples, see our [Developer Guide](docs/DEVELOPER_GUIDE.md).

### Customizing the UI

The UI is built with Material-UI and can be customized by:

1. Modifying the theme in `frontend/src/App.tsx`
2. Customizing individual components in their respective files
3. Using Material-UI's styling system to adjust component styles

See the [Developer Guide](docs/DEVELOPER_GUIDE.md) for more information on customizing the platform.

## 📸 Screenshots

<div align="center">
  <h3>Chat Interface</h3>
  <p>The main chat interface with LLM provider and model selection</p>
  <img src="docs/images/chat-interface.png" alt="Chat Interface" width="800" />

  <h3>API Keys Management</h3>
  <p>Securely manage your API keys for different LLM providers</p>
  <img src="docs/images/api-keys.png" alt="API Keys Management" width="800" />

  <h3>Admin Dashboard</h3>
  <p>Monitor usage, costs, and manage users (admin only)</p>
  <img src="docs/images/admin-dashboard.png" alt="Admin Dashboard" width="800" />
</div>

> Note: The actual interface may vary slightly from the screenshots as the application continues to evolve.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/zinzied">zinzied</a>
</p>
