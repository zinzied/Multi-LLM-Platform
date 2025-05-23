# Multi-LLM Platform All-in-One Launcher

This document explains how to use the all-in-one launcher (`all-in-one-launcher.bat`) for the Multi-LLM Platform.

## Overview

The all-in-one launcher is a comprehensive batch file that includes all the functionality needed to run, manage, and maintain the Multi-LLM Platform. It eliminates the need for multiple separate batch files by consolidating everything into a single, easy-to-use menu system.

## Features

- **Interactive Menu**: Simple numbered options for all platform operations
- **Automatic Startup**: Can be launched with command-line arguments for automatic startup
- **Desktop Shortcut**: Creates a desktop shortcut for one-click platform launch
- **Database Management**: Backup and restore database functionality
- **Complete Setup**: First-time setup option that installs dependencies and starts the platform

## Using the Launcher

### Basic Usage

1. Double-click `all-in-one-launcher.bat` to open the interactive menu
2. Select an option by entering the corresponding number
3. Follow the on-screen instructions

### Menu Options

#### Startup Options
- **1. Start Platform (Backend + Frontend)**: Starts both servers with interactive prompts
- **2. Start Backend Only**: Starts only the backend server
- **3. Start Frontend Only**: Starts only the frontend server
- **4. Auto-Start Platform**: Starts both servers automatically without interaction
- **5. Auto-Start with Test User**: Starts the platform and creates a test user

#### Setup & Maintenance
- **6. First-Time Setup**: Installs dependencies, creates a test user, and starts the platform
- **7. Install Dependencies**: Installs all required dependencies
- **8. Create Test User**: Creates a test user with admin privileges
- **9. Backup Database**: Creates a timestamped backup of the database
- **10. Restore Database**: Restores the database from a previous backup

#### Production
- **11. Build for Production**: Builds the frontend for production use
- **12. Start Production Mode**: Starts the platform in production mode

#### Other
- **13. Create Desktop Shortcut**: Creates a desktop shortcut to launch the platform
- **14. View Documentation**: Opens the documentation
- **0. Exit**: Exits the launcher

### Command-Line Arguments

You can start the launcher with a command-line argument to automatically execute a specific option:

```
all-in-one-launcher.bat 4
```

This will run option 4 (Auto-Start Platform) without showing the menu.

Available arguments:
- `1` to `12`: Corresponds to menu options 1-12

### Desktop Shortcut

The desktop shortcut created by option 13 will automatically start the platform (equivalent to option 4) when clicked. This provides a convenient one-click solution to launch the platform.

## Troubleshooting

### Common Issues

1. **"Node.js is not installed" error**:
   - Install Node.js from https://nodejs.org/ (v16 or higher)
   - Make sure it's added to your PATH

2. **"Port already in use" error**:
   - Check if another instance of the server is already running
   - Close any existing server windows and try again

3. **Database errors**:
   - Make sure the backend server is running when trying to create a test user
   - If the database is corrupted, use the restore option to recover from a backup

4. **Installation failures**:
   - The launcher will automatically try with the `--legacy-peer-deps` flag if normal installation fails
   - Make sure you have a stable internet connection

### Getting Help

If you encounter issues not covered in this guide:
1. Check the console output in the server windows for specific error messages
2. Refer to the main documentation in the `docs` directory
3. Create an issue on the GitHub repository

## Best Practices

1. **Always use the launcher** to start and stop the platform
2. **Regularly backup your database** using option 9
3. **Don't close server windows** while using the platform
4. **Use the desktop shortcut** for convenient access

---

For more detailed information, see the main [README.md](README.md) and the documentation in the [docs](docs/) directory.
