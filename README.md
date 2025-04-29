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

1. Clone the repository:
   ```bash
   git clone https://github.com/zinzied/multi-llm-platform.git
   cd multi-llm-platform
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. Create a `.env` file in the root directory:
   ```
   NODE_ENV=development
   PORT=5000
   JWT_SECRET=your_jwt_secret_key_change_this_in_production
   ```

## 🚀 Running the Application

### Development Mode

1. Start the backend server:
   ```bash
   npm run server
   ```

2. In a separate terminal, start the frontend:
   ```bash
   npm run client
   ```

3. Or run both concurrently:
   ```bash
   npm run dev
   ```

4. Access the application at `http://localhost:5173` 🎉

### Production Mode

1. Build the frontend:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

3. Access the application at `http://localhost:5000` 🚀

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
