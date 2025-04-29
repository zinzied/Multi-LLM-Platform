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

- 🟢 **OpenAI** - GPT-4o, GPT-4 Turbo, GPT-4, GPT-3.5 Turbo
- 🟣 **Anthropic** - Claude 3 Opus, Claude 3 Sonnet, Claude 3 Haiku, Claude 2.1
- 🔵 **Google** - Gemini 1.5 Pro, Gemini 1.5 Flash, Gemini 1.0 Pro
- 🟠 **Mistral AI** - Mistral Large, Mistral Medium, Mistral Small, Open Mistral 7B
- 🟡 **Cohere** - Command R+, Command R, Command Light

## 🛠️ Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## 📦 Installation

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
   npm run server
   ```

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
   npm start
   ```

3. Access the application at `http://localhost:5001` 🚀

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

   # Start the backend server
   node backend/server.js

   # In a new terminal, start the frontend
   cd frontend; npm run dev
   ```

3. Visit `http://localhost:5001/api/create-user` to create a test user
4. Access the application at `http://localhost:5173`
5. Log in with:
   - Email: test@example.com
   - Password: password123

## 📝 Usage

1. 👤 Register a new account or log in
2. 🔑 Add your API keys for the LLM providers you want to use
3. 💬 Start a new chat and select a provider and model
4. 📨 Send messages and receive responses from the selected LLM

## 👑 Admin Features

Admin users have access to:
- 👥 User management
- 📊 Usage statistics and cost tracking
- ⚠️ Error logs and diagnostics

## 🧩 Adding a New LLM Provider

To add a new LLM provider:

1. Create a new adapter file in `backend/services/llm/`
2. Implement the required interface (name, description, models, chat function)
3. Add the new provider to the index.js file in the same directory

## 📸 Screenshots

<div align="center">
  <p><i>Coming soon!</i> 📷</p>
</div>

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
