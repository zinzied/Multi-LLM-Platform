# Troubleshooting Guide for Multi-LLM Platform

This guide addresses common issues you might encounter when setting up or using the Multi-LLM Platform.

## Table of Contents
- [Installation Issues](#installation-issues)
- [Connection Issues](#connection-issues)
- [Authentication Issues](#authentication-issues)
- [API Key Issues](#api-key-issues)
- [Chat Interface Issues](#chat-interface-issues)
- [Performance Issues](#performance-issues)

## Installation Issues

### Node.js Version Errors
**Issue**: Error messages related to Node.js version compatibility.

**Solution**:
1. Check your Node.js version: `node -v`
2. Make sure you have Node.js v16 or higher installed
3. If needed, install a newer version from [Node.js website](https://nodejs.org/)

### Package Installation Failures
**Issue**: `npm install` fails with dependency errors.

**Solution**:
1. Try using the `--legacy-peer-deps` flag:
   ```bash
   npm install --legacy-peer-deps
   ```
2. Clear npm cache and try again:
   ```bash
   npm cache clean --force
   npm install
   ```
3. Check for conflicting global packages:
   ```bash
   npm list -g --depth=0
   ```

### Missing Data Directory
**Issue**: Database errors related to missing directories.

**Solution**:
1. Create the data directory manually:
   ```bash
   # For Windows:
   mkdir backend\data
   
   # For Linux/macOS:
   mkdir -p backend/data
   ```

## Connection Issues

### Port Already in Use
**Issue**: Error message indicating the port is already in use.

**Solution**:
1. Change the port in your `.env` file:
   ```
   PORT=5002
   ```
2. Kill the process using the current port (Windows):
   ```bash
   netstat -ano | findstr :5001
   taskkill /PID <PID> /F
   ```
3. Kill the process using the current port (Linux/macOS):
   ```bash
   lsof -i :5001
   kill -9 <PID>
   ```

### CORS Errors
**Issue**: Console errors related to Cross-Origin Resource Sharing (CORS).

**Solution**:
1. Make sure the backend CORS settings match your frontend URL
2. Check the server.js file for the CORS configuration
3. Ensure you're using the correct URL to access the application

## Authentication Issues

### Registration Fails
**Issue**: Unable to register a new account.

**Solution**:
1. Check if the email is already in use
2. Ensure password meets minimum requirements (at least 6 characters)
3. Check browser console for specific error messages
4. Try using the test user account:
   - Email: test@example.com
   - Password: password123

### Login Issues
**Issue**: Unable to log in with valid credentials.

**Solution**:
1. Clear browser cookies and cache
2. Try using the test user account
3. Check if the backend server is running
4. Reset your password (if implemented)

## API Key Issues

### API Keys Not Saving
**Issue**: API keys don't save or disappear after saving.

**Solution**:
1. Make sure you're logged in
2. Check if the backend server is running
3. Ensure the API key format is correct
4. Try refreshing the page after saving

### API Errors When Chatting
**Issue**: Errors when trying to use a specific LLM provider.

**Solution**:
1. Verify your API key is correct and active
2. Check if you have sufficient credits with the provider
3. Ensure the selected model is available on your plan
4. Check the browser console for specific error messages

## Chat Interface Issues

### Chat Interface Not Loading
**Issue**: The chat interface doesn't appear or loads incorrectly.

**Solution**:
1. Check if you're logged in
2. Clear browser cache and cookies
3. Try a different browser
4. Check browser console for JavaScript errors

### Messages Not Sending
**Issue**: Messages don't send or no response is received.

**Solution**:
1. Verify you've selected a provider and model
2. Check if your API key for that provider is set
3. Ensure the backend server is running
4. Check browser console for network errors

## Performance Issues

### Slow Response Times
**Issue**: LLM responses take a long time to appear.

**Solution**:
1. Try a different model (smaller models are usually faster)
2. Check your internet connection
3. Verify the provider's status page for outages
4. Reduce the length of your messages

### High Memory Usage
**Issue**: The application uses excessive memory.

**Solution**:
1. Close other browser tabs and applications
2. Restart the browser
3. Clear browser cache
4. Limit the number of concurrent conversations

---

If you continue to experience issues not covered in this guide, please:
1. Check the browser console for specific error messages
2. Look at the backend server logs for additional information
3. Create an issue on the GitHub repository with detailed information about the problem
