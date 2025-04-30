# Database Guide for Multi-LLM Platform

This guide provides detailed information about the database system used in the Multi-LLM Platform, how to maintain it, and best practices for data persistence.

## Table of Contents
- [Database Overview](#database-overview)
- [Running the Server for Database Persistence](#running-the-server-for-database-persistence)
- [Database Schema](#database-schema)
- [Backup and Recovery](#backup-and-recovery)
- [Troubleshooting Database Issues](#troubleshooting-database-issues)
- [Advanced Configuration](#advanced-configuration)

## Database Overview

The Multi-LLM Platform uses SQLite as its database system. SQLite is a self-contained, serverless, zero-configuration, transactional SQL database engine. It's embedded directly into the application, which means:

- No separate database server is needed
- The database is stored in a single file
- It's portable and easy to back up
- It's ideal for small to medium-sized applications

### Database File Location

The SQLite database is stored in:
```
backend/data/database.sqlite
```

This file is created automatically when you first run the server. If the file doesn't exist, the server will create it along with all the necessary tables.

## Running the Server for Database Persistence

### Important: Use Node Directly

To ensure proper database persistence, always run the server using the direct Node command:

```bash
# Development mode
node backend/server.js

# Production mode
NODE_ENV=production node backend/server.js
```

**Why this matters**: When you run the server directly with Node, it maintains a continuous connection to the database and ensures all transactions are properly committed. If you use `npm run server` or other methods that might restart the server frequently (like nodemon), some recent database changes might not be properly saved.

### Avoid These Common Mistakes

1. **Don't use `npm run dev` for the backend** if you care about database persistence
2. **Don't kill the Node process abruptly** without allowing it to shut down gracefully
3. **Don't delete the database file** while the server is running

## Database Schema

The Multi-LLM Platform uses the following database tables:

### Users Table

Stores user account information and encrypted API keys.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| email | String | User's email (unique) |
| password | String | Hashed password |
| role | String | User role ('user' or 'admin') |
| apiKeys | JSON | Encrypted API keys for LLM providers |
| createdAt | DateTime | Account creation timestamp |
| updatedAt | DateTime | Last update timestamp |

### Conversations Table

Stores chat conversations and message history.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| title | String | Conversation title |
| messages | JSON | Array of messages |
| provider | String | LLM provider used |
| model | String | LLM model used |
| UserId | UUID | Foreign key to Users table |
| createdAt | DateTime | Conversation creation timestamp |
| updatedAt | DateTime | Last update timestamp |

### Usage Table

Tracks API usage, costs, and errors.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| provider | String | LLM provider used |
| model | String | LLM model used |
| promptTokens | Integer | Number of input tokens |
| completionTokens | Integer | Number of output tokens |
| totalTokens | Integer | Total tokens used |
| cost | Float | Estimated cost |
| success | Boolean | Whether the request succeeded |
| errorMessage | Text | Error message (if any) |
| UserId | UUID | Foreign key to Users table |
| createdAt | DateTime | Usage record timestamp |

## Backup and Recovery

### Creating Database Backups

It's recommended to regularly back up your database file, especially in production environments:

```bash
# Simple file copy backup (Windows)
copy backend\data\database.sqlite backend\data\database.sqlite.bak

# Simple file copy backup (Linux/macOS)
cp backend/data/database.sqlite backend/data/database.sqlite.bak

# Timestamped backup (Windows PowerShell)
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
copy backend\data\database.sqlite "backend\data\database_$timestamp.sqlite.bak"

# Timestamped backup (Linux/macOS)
timestamp=$(date +%Y%m%d_%H%M%S)
cp backend/data/database.sqlite "backend/data/database_$timestamp.sqlite.bak"
```

### Restoring from Backup

To restore from a backup:

1. Stop the server if it's running
2. Replace the current database file with the backup
3. Restart the server

```bash
# Windows
copy backend\data\database.sqlite.bak backend\data\database.sqlite

# Linux/macOS
cp backend/data/database.sqlite.bak backend/data/database.sqlite
```

## Troubleshooting Database Issues

### Database Locked Errors

If you see "database is locked" errors:

1. Make sure you don't have multiple server instances trying to access the database
2. Check if any other process is accessing the database file
3. If the issue persists, stop the server, make a backup of the database, and restart

### Corrupt Database

If the database becomes corrupt:

1. Stop the server
2. Restore from a backup if available
3. If no backup is available, rename or move the corrupt database and start the server to create a new one (note: this will result in data loss)

### Missing Data

If data appears to be missing:

1. Check if you're running the server with `node backend/server.js` directly
2. Verify that the server wasn't stopped abruptly during a write operation
3. Restore from a backup if necessary

## Advanced Configuration

### Using a Different Database System

For production environments with higher load, you might want to use a more robust database system like PostgreSQL or MySQL. This would require:

1. Modifying the database configuration in `backend/config/database.js`
2. Installing the appropriate Sequelize adapter
3. Migrating your data from SQLite to the new database

### Using a Process Manager

For production environments, it's recommended to use a process manager like PM2 to keep the Node server running:

```bash
# Install PM2
npm install -g pm2

# Start the server with PM2
pm2 start backend/server.js --name "multi-llm-platform"

# Make PM2 start the server on system boot
pm2 startup
pm2 save
```

This ensures that the server stays running and automatically restarts if it crashes, maintaining database connectivity.

---

For more information or if you have questions, please create an issue on the GitHub repository.
