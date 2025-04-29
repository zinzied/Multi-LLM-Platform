# Multi-LLM Platform

A platform that supports multiple LLM providers (OpenAI, Anthropic, Google, Mistral, Cohere) through their public APIs.

## Features

- Connect to multiple LLM providers through their APIs
- User authentication and API key management
- Chat interface for interacting with LLMs
- Unified API abstraction for all providers
- Usage tracking and error logging
- Admin panel for monitoring and management
- Easy addition of new LLM providers

## Supported LLM Providers

- **OpenAI** - GPT-4o, GPT-4 Turbo, GPT-4, GPT-3.5 Turbo
- **Anthropic** - Claude 3 Opus, Claude 3 Sonnet, Claude 3 Haiku, Claude 2.1
- **Google** - Gemini 1.5 Pro, Gemini 1.5 Flash, Gemini 1.0 Pro
- **Mistral AI** - Mistral Large, Mistral Medium, Mistral Small, Open Mistral 7B
- **Cohere** - Command R+, Command R, Command Light

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/zinzied/multi-llm-platform.git
   cd multi-llm-platform
   ```

2. Install backend dependencies:
   ```
   npm install
   ```

3. Install frontend dependencies:
   ```
   cd frontend
   npm install
   cd ..
   ```

4. Create a `.env` file in the root directory with the following variables:
   ```
   NODE_ENV=development
   PORT=5000
   JWT_SECRET=your_jwt_secret_key_change_this_in_production
   ```

## Running the Application

### Development Mode

1. Start the backend server:
   ```
   npm run server
   ```

2. In a separate terminal, start the frontend development server:
   ```
   npm run client
   ```

3. Or run both concurrently:
   ```
   npm run dev
   ```

4. Access the application at `http://localhost:5173`

### Production Mode

1. Build the frontend:
   ```
   npm run build
   ```

2. Start the production server:
   ```
   npm start
   ```

3. Access the application at `http://localhost:5000`

## Usage

1. Register a new account or log in
2. Add your API keys for the LLM providers you want to use
3. Start a new chat and select a provider and model
4. Send messages and receive responses from the selected LLM

## Admin Features

Admin users have access to:
- User management
- Usage statistics
- Error logs

## Adding a New LLM Provider

To add a new LLM provider:

1. Create a new adapter file in `backend/services/llm/`
2. Implement the required interface (name, description, models, chat function)
3. Add the new provider to the index.js file in the same directory

## License

MIT
