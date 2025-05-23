@echo off
setlocal enabledelayedexpansion
color 0B
title Multi-LLM Platform - All-in-One Launcher

REM Check for command-line arguments
if "%1"=="1" goto start_platform
if "%1"=="2" goto start_backend
if "%1"=="3" goto start_frontend
if "%1"=="4" goto auto_start_platform
if "%1"=="5" goto auto_start_with_test_user
if "%1"=="6" goto first_time_setup
if "%1"=="7" goto install_dependencies
if "%1"=="8" goto create_test_user
if "%1"=="9" goto backup_database
if "%1"=="10" goto restore_database
if "%1"=="11" goto build_production
if "%1"=="12" goto start_production

:menu
cls
echo ===================================================
echo           Multi-LLM Platform - Main Menu
echo ===================================================
echo.
echo  STARTUP OPTIONS:
echo  1. Start Platform (Backend + Frontend)
echo  2. Start Backend Only
echo  3. Start Frontend Only
echo  4. Auto-Start Platform (No Interaction)
echo  5. Auto-Start with Test User
echo.
echo  SETUP & MAINTENANCE:
echo  6. First-Time Setup (Install + Start)
echo  7. Install Dependencies
echo  8. Create Test User
echo  9. Backup Database
echo  10. Restore Database
echo.
echo  PRODUCTION:
echo  11. Build for Production
echo  12. Start Production Mode
echo.
echo  OTHER:
echo  13. Create Desktop Shortcut
echo  14. View Documentation
echo  0. Exit
echo.
echo ===================================================
echo.

set /p choice=Enter your choice (0-14):

if "%choice%"=="1" goto start_platform
if "%choice%"=="2" goto start_backend
if "%choice%"=="3" goto start_frontend
if "%choice%"=="4" goto auto_start_platform
if "%choice%"=="5" goto auto_start_with_test_user
if "%choice%"=="6" goto first_time_setup
if "%choice%"=="7" goto install_dependencies
if "%choice%"=="8" goto create_test_user
if "%choice%"=="9" goto backup_database
if "%choice%"=="10" goto restore_database
if "%choice%"=="11" goto build_production
if "%choice%"=="12" goto start_production
if "%choice%"=="13" goto create_shortcut
if "%choice%"=="14" goto view_docs
if "%choice%"=="0" goto exit

echo.
echo Invalid choice. Please try again.
timeout /t 2 >nul
goto menu

:start_platform
echo.
echo ===================================================
echo       Starting Multi-LLM Platform
echo ===================================================
echo.
echo This will start both the backend and frontend servers.
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ERROR: Node.js is not installed or not in your PATH.
    echo Please install Node.js from https://nodejs.org/ (v16 or higher)
    echo.
    pause
    goto menu
)

REM Create data directory if it doesn't exist
if not exist "backend\data" (
    echo Creating data directory...
    mkdir backend\data
)

REM Check if .env file exists, create if not
if not exist ".env" (
    echo Creating default .env file...
    echo NODE_ENV=development> .env
    echo PORT=5001>> .env
    echo JWT_SECRET=your_jwt_secret_key_change_this_in_production>> .env
)

REM Start the backend server in a new window
echo Starting backend server...
start "Multi-LLM Backend Server" cmd /c "color 0A && echo Backend Server is starting... && echo. && node backend/server.js"

REM Wait a moment for the backend to initialize
timeout /t 5 /nobreak > nul

REM Start the frontend server in a new window
echo Starting frontend server...
start "Multi-LLM Frontend Server" cmd /c "color 0B && cd frontend && echo Frontend Server is starting... && echo. && npm run dev"

echo.
echo ===================================================
echo Servers are starting in separate windows.
echo.
echo - Backend will be available at: http://localhost:5001
echo - Frontend will be available at: http://localhost:5173
echo.
echo IMPORTANT: Do not close the server windows until you're done using the platform.
echo            Closing the backend window will stop saving to the database.
echo ===================================================
echo.
echo You can now access the platform at: http://localhost:5173
echo.
echo Press any key to open the platform in your default browser...
pause > nul

REM Open the platform in the default browser
start http://localhost:5173

echo.
echo You can close this window now. The servers will continue running in their own windows.
echo.
pause
goto menu

:start_backend
echo.
echo ===================================================
echo       Starting Backend Server Only
echo ===================================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ERROR: Node.js is not installed or not in your PATH.
    echo Please install Node.js from https://nodejs.org/ (v16 or higher)
    echo.
    pause
    goto menu
)

REM Create data directory if it doesn't exist
if not exist "backend\data" (
    echo Creating data directory...
    mkdir backend\data
)

REM Check if .env file exists, create if not
if not exist ".env" (
    echo Creating default .env file...
    echo NODE_ENV=development> .env
    echo PORT=5001>> .env
    echo JWT_SECRET=your_jwt_secret_key_change_this_in_production>> .env
)

echo Starting backend server...
start "Multi-LLM Backend Server" cmd /c "color 0A && echo Backend Server is starting... && echo. && node backend/server.js"

echo.
echo Backend server is starting in a separate window.
echo The server will be available at: http://localhost:5001
echo.
pause
goto menu

:start_frontend
echo.
echo ===================================================
echo       Starting Frontend Server Only
echo ===================================================
echo.
echo IMPORTANT: Make sure the backend server is already running!
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ERROR: Node.js is not installed or not in your PATH.
    echo Please install Node.js from https://nodejs.org/ (v16 or higher)
    echo.
    pause
    goto menu
)

REM Check if backend is running by trying to connect to it
echo Checking if backend server is running...
curl -s http://localhost:5001/api/test > nul
if %ERRORLEVEL% neq 0 (
    echo WARNING: Backend server does not appear to be running.
    echo          The frontend will start, but functionality will be limited.
    echo          It's recommended to start the backend server first.
    echo.
    echo Press any key to continue anyway or Ctrl+C to cancel...
    pause > nul
)

echo Starting frontend server...
start "Multi-LLM Frontend Server" cmd /c "color 0B && cd frontend && echo Frontend Server is starting... && echo. && npm run dev"

echo.
echo Frontend server is starting in a separate window.
echo The frontend will be available at: http://localhost:5173
echo.
pause
goto menu

:auto_start_platform
echo.
echo ===================================================
echo   Auto-Starting Multi-LLM Platform
echo ===================================================
echo.
echo Starting the Multi-LLM Platform automatically...
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ERROR: Node.js is not installed or not in your PATH.
    echo Please install Node.js from https://nodejs.org/ (v16 or higher)
    echo.
    pause
    goto menu
)

REM Create data directory if it doesn't exist
if not exist "backend\data" (
    echo Creating data directory...
    mkdir backend\data
)

REM Check if .env file exists, create if not
if not exist ".env" (
    echo Creating default .env file...
    echo NODE_ENV=development> .env
    echo PORT=5001>> .env
    echo JWT_SECRET=your_jwt_secret_key_change_this_in_production>> .env
)

REM Start the backend server in a new window
echo Starting backend server...
start "Multi-LLM Backend Server" cmd /c "color 0A && echo Backend Server is starting... && echo. && node backend/server.js"

REM Wait a moment for the backend to initialize
timeout /t 5 /nobreak > nul

REM Start the frontend server in a new window
echo Starting frontend server...
start "Multi-LLM Frontend Server" cmd /c "color 0B && cd frontend && echo Frontend Server is starting... && echo. && npm run dev"

echo.
echo ===================================================
echo Servers are starting in separate windows.
echo.
echo - Backend will be available at: http://localhost:5001
echo - Frontend will be available at: http://localhost:5173
echo ===================================================
echo.
echo Opening the platform in your default browser...

REM Wait a moment for the frontend to initialize
timeout /t 3 /nobreak > nul

REM Open the platform in the default browser
start http://localhost:5173

goto menu

:auto_start_with_test_user
echo.
echo ===================================================
echo   Auto-Starting Platform with Test User
echo ===================================================
echo.
echo This will start the platform and create a test user.
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ERROR: Node.js is not installed or not in your PATH.
    echo Please install Node.js from https://nodejs.org/ (v16 or higher)
    echo.
    pause
    goto menu
)

REM Create data directory if it doesn't exist
if not exist "backend\data" (
    echo Creating data directory...
    mkdir backend\data
)

REM Check if .env file exists, create if not
if not exist ".env" (
    echo Creating default .env file...
    echo NODE_ENV=development> .env
    echo PORT=5001>> .env
    echo JWT_SECRET=your_jwt_secret_key_change_this_in_production>> .env
)

REM Start the backend server in a new window
echo Starting backend server...
start "Multi-LLM Backend Server" cmd /c "color 0A && echo Backend Server is starting... && echo. && node backend/server.js"

REM Wait a moment for the backend to initialize
timeout /t 5 /nobreak > nul

REM Create test user
echo Creating test user...
curl -s http://localhost:5001/api/create-user > nul

if %ERRORLEVEL% neq 0 (
    echo WARNING: Failed to create test user. The server might still be starting up.
    echo Will try again in a few seconds...
    timeout /t 5 /nobreak > nul

    curl -s http://localhost:5001/api/create-user > nul

    if %ERRORLEVEL% neq 0 (
        echo WARNING: Still failed to create test user.
        echo You can try manually by visiting http://localhost:5001/api/create-user
    ) else (
        echo Test user created successfully!
        echo - Email: test@example.com
        echo - Password: password123
    )
) else (
    echo Test user created successfully!
    echo - Email: test@example.com
    echo - Password: password123
)

REM Start the frontend server in a new window
echo Starting frontend server...
start "Multi-LLM Frontend Server" cmd /c "color 0B && cd frontend && echo Frontend Server is starting... && echo. && npm run dev"

echo.
echo ===================================================
echo Servers are starting in separate windows.
echo.
echo - Backend will be available at: http://localhost:5001
echo - Frontend will be available at: http://localhost:5173
echo.
echo Test user credentials:
echo - Email: test@example.com
echo - Password: password123
echo ===================================================
echo.
echo Opening the login page in your default browser...

REM Wait a moment for the frontend to initialize
timeout /t 3 /nobreak > nul

REM Open the login page in the default browser
start http://localhost:5173/login

goto menu

:first_time_setup
echo.
echo ===================================================
echo   Multi-LLM Platform - First Time Setup
echo ===================================================
echo.
echo This script will install dependencies, create a test user,
echo and start the platform automatically.
echo.
echo This may take several minutes to complete.
echo.
pause

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ERROR: Node.js is not installed or not in your PATH.
    echo Please install Node.js from https://nodejs.org/ (v16 or higher)
    echo.
    pause
    goto menu
)

echo Installing backend dependencies...
call npm install

if %ERRORLEVEL% neq 0 (
    echo.
    echo WARNING: There were issues installing backend dependencies.
    echo Trying with --legacy-peer-deps flag...
    echo.
    call npm install --legacy-peer-deps
)

echo.
echo Installing frontend dependencies...
cd frontend
call npm install

if %ERRORLEVEL% neq 0 (
    echo.
    echo WARNING: There were issues installing frontend dependencies.
    echo Trying with --legacy-peer-deps flag...
    echo.
    call npm install --legacy-peer-deps
)

cd ..

REM Create data directory if it doesn't exist
if not exist "backend\data" (
    echo.
    echo Creating data directory...
    mkdir backend\data
)

REM Check if .env file exists, create if not
if not exist ".env" (
    echo.
    echo Creating default .env file...
    echo NODE_ENV=development> .env
    echo PORT=5001>> .env
    echo JWT_SECRET=your_jwt_secret_key_change_this_in_production>> .env
)

echo.
echo ===================================================
echo Installation complete!
echo.
echo Now starting the platform...
echo ===================================================
echo.

REM Start the backend server in a new window
echo Starting backend server...
start "Multi-LLM Backend Server" cmd /c "color 0A && echo Backend Server is starting... && echo. && node backend/server.js"

REM Wait a moment for the backend to initialize
timeout /t 5 /nobreak > nul

REM Create test user
echo Creating test user...
curl -s http://localhost:5001/api/create-user > nul

if %ERRORLEVEL% neq 0 (
    echo WARNING: Failed to create test user. The server might still be starting up.
    echo Will try again in a few seconds...
    timeout /t 5 /nobreak > nul

    curl -s http://localhost:5001/api/create-user > nul

    if %ERRORLEVEL% neq 0 (
        echo WARNING: Still failed to create test user.
        echo You can try manually by visiting http://localhost:5001/api/create-user
    ) else (
        echo Test user created successfully!
        echo - Email: test@example.com
        echo - Password: password123
    )
) else (
    echo Test user created successfully!
    echo - Email: test@example.com
    echo - Password: password123
)

REM Start the frontend server in a new window
echo Starting frontend server...
start "Multi-LLM Frontend Server" cmd /c "color 0B && cd frontend && echo Frontend Server is starting... && echo. && npm run dev"

echo.
echo ===================================================
echo Setup complete! The platform is now running.
echo.
echo - Backend is available at: http://localhost:5001
echo - Frontend is available at: http://localhost:5173
echo.
echo Test user credentials:
echo - Email: test@example.com
echo - Password: password123
echo ===================================================
echo.
echo Opening the login page in your default browser...

REM Wait a moment for the frontend to initialize
timeout /t 3 /nobreak > nul

REM Open the login page in the default browser
start http://localhost:5173/login

echo.
pause
goto menu

:install_dependencies
echo.
echo ===================================================
echo    Multi-LLM Platform - Install Dependencies
echo ===================================================
echo.
echo This will install all required dependencies.
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ERROR: Node.js is not installed or not in your PATH.
    echo Please install Node.js from https://nodejs.org/ (v16 or higher)
    echo.
    pause
    goto menu
)

echo Installing backend dependencies...
call npm install

if %ERRORLEVEL% neq 0 (
    echo.
    echo WARNING: There were issues installing backend dependencies.
    echo Trying with --legacy-peer-deps flag...
    echo.
    call npm install --legacy-peer-deps
)

echo.
echo Installing frontend dependencies...
cd frontend
call npm install

if %ERRORLEVEL% neq 0 (
    echo.
    echo WARNING: There were issues installing frontend dependencies.
    echo Trying with --legacy-peer-deps flag...
    echo.
    call npm install --legacy-peer-deps
)

cd ..

REM Create data directory if it doesn't exist
if not exist "backend\data" (
    echo.
    echo Creating data directory...
    mkdir backend\data
)

REM Check if .env file exists, create if not
if not exist ".env" (
    echo.
    echo Creating default .env file...
    echo NODE_ENV=development> .env
    echo PORT=5001>> .env
    echo JWT_SECRET=your_jwt_secret_key_change_this_in_production>> .env
)

echo.
echo ===================================================
echo Installation complete!
echo.
echo You can now run option 1 to start the application.
echo ===================================================
echo.
pause
goto menu

:create_test_user
echo.
echo ===================================================
echo       Multi-LLM Platform - Create Test User
echo ===================================================
echo.
echo This will create a test user with admin privileges.
echo.
echo Test user details:
echo - Email: test@example.com
echo - Password: password123
echo - Role: admin
echo.

REM Check if backend is running by trying to connect to it
echo Checking if backend server is running...
curl -s http://localhost:5001/api/test > nul
if %ERRORLEVEL% neq 0 (
    echo ERROR: Backend server does not appear to be running.
    echo Please start the backend server first using option 2.
    echo.
    pause
    goto menu
)

echo Creating test user...
curl -s http://localhost:5001/api/create-user > nul

if %ERRORLEVEL% neq 0 (
    echo.
    echo ERROR: Failed to create test user. Make sure the backend server is running.
    echo.
    pause
    goto menu
)

echo.
echo ===================================================
echo Test user created successfully!
echo.
echo You can now log in with:
echo - Email: test@example.com
echo - Password: password123
echo ===================================================
echo.
echo Press any key to open the login page in your browser...
pause > nul

REM Open the login page in the default browser
start http://localhost:5173/login

echo.
pause
goto menu

:backup_database
echo.
echo ===================================================
echo       Multi-LLM Platform - Database Backup
echo ===================================================
echo.

REM Check if database file exists
if not exist "backend\data\database.sqlite" (
    echo ERROR: Database file not found.
    echo The platform may not have been started yet or no data has been saved.
    echo.
    pause
    goto menu
)

REM Create backups directory if it doesn't exist
if not exist "backups" (
    echo Creating backups directory...
    mkdir backups
)

REM Get current date and time for filename
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "YYYY=%dt:~0,4%"
set "MM=%dt:~4,2%"
set "DD=%dt:~6,2%"
set "HH=%dt:~8,2%"
set "Min=%dt:~10,2%"
set "Sec=%dt:~12,2%"

set "timestamp=%YYYY%%MM%%DD%_%HH%%Min%%Sec%"
set "backup_file=backups\database_backup_%timestamp%.sqlite"

echo Creating backup of the database...
echo.
echo From: backend\data\database.sqlite
echo To: %backup_file%
echo.

REM Copy the database file to the backups directory
copy "backend\data\database.sqlite" "%backup_file%"

if %ERRORLEVEL% neq 0 (
    echo.
    echo ERROR: Failed to create backup.
    echo The database file may be in use or inaccessible.
    echo.
    pause
    goto menu
)

echo.
echo ===================================================
echo Database backup created successfully!
echo.
echo Location: %backup_file%
echo ===================================================
echo.
pause
goto menu

:restore_database
echo.
echo ===================================================
echo     Multi-LLM Platform - Restore Database
echo ===================================================
echo.

REM Check if backups directory exists
if not exist "backups" (
    echo ERROR: No backups directory found.
    echo You need to create a backup first using option 9.
    echo.
    pause
    goto menu
)

REM Count backup files
set "count=0"
for %%f in (backups\database_backup_*.sqlite) do set /a count+=1

if %count% equ 0 (
    echo ERROR: No database backups found in the backups directory.
    echo You need to create a backup first using option 9.
    echo.
    pause
    goto menu
)

echo Available database backups:
echo.
set "index=0"
for %%f in (backups\database_backup_*.sqlite) do (
    set /a index+=1
    echo !index!. %%~nxf
)

echo.
set /p choice=Enter the number of the backup to restore (or 0 to cancel):

if "%choice%"=="0" (
    echo.
    echo Restore cancelled.
    echo.
    pause
    goto menu
)

REM Validate choice
set "valid=false"
set "index=0"
set "selected_file="
for %%f in (backups\database_backup_*.sqlite) do (
    set /a index+=1
    if "!index!"=="%choice%" (
        set "valid=true"
        set "selected_file=%%f"
    )
)

if "%valid%"=="false" (
    echo.
    echo ERROR: Invalid selection.
    echo.
    pause
    goto menu
)

echo.
echo You selected: %selected_file%
echo.
echo WARNING: This will replace your current database with the selected backup.
echo          All changes since the backup was created will be lost.
echo.
set /p confirm=Are you sure you want to continue? (y/n):

if /i not "%confirm%"=="y" (
    echo.
    echo Restore cancelled.
    echo.
    pause
    goto menu
)

echo.
echo Checking if the server is running...
curl -s http://localhost:5001/api/test > nul
if %ERRORLEVEL% equ 0 (
    echo WARNING: The server appears to be running.
    echo          It's recommended to stop the server before restoring the database.
    echo.
    set /p server_confirm=Continue anyway? (y/n):

    if /i not "%server_confirm%"=="y" (
        echo.
        echo Restore cancelled. Please stop the server and try again.
        echo.
        pause
        goto menu
    )
)

echo.
echo Creating backup of current database before restoring...
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "YYYY=%dt:~0,4%"
set "MM=%dt:~4,2%"
set "DD=%dt:~6,2%"
set "HH=%dt:~8,2%"
set "Min=%dt:~10,2%"
set "Sec=%dt:~12,2%"

set "timestamp=%YYYY%%MM%%DD%_%HH%%Min%%Sec%"
set "pre_restore_backup=backups\database_pre_restore_%timestamp%.sqlite"

if exist "backend\data\database.sqlite" (
    copy "backend\data\database.sqlite" "%pre_restore_backup%"
    echo Current database backed up to: %pre_restore_backup%
)

echo.
echo Restoring database from backup...
copy "%selected_file%" "backend\data\database.sqlite"

if %ERRORLEVEL% neq 0 (
    echo.
    echo ERROR: Failed to restore database.
    echo The database file may be in use or inaccessible.
    echo.
    pause
    goto menu
)

echo.
echo ===================================================
echo Database restored successfully!
echo.
echo If the server was running during restore, you may need to
echo restart it for the changes to take effect.
echo ===================================================
echo.
pause
goto menu

:build_production
echo.
echo ===================================================
echo    Multi-LLM Platform - Production Build
echo ===================================================
echo.
echo This will build the platform for production use.
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ERROR: Node.js is not installed or not in your PATH.
    echo Please install Node.js from https://nodejs.org/ (v16 or higher)
    echo.
    pause
    goto menu
)

REM Check if dependencies are installed
if not exist "node_modules" (
    echo ERROR: Backend dependencies not found.
    echo Please run option 7 (Install Dependencies) first.
    echo.
    pause
    goto menu
)

if not exist "frontend\node_modules" (
    echo ERROR: Frontend dependencies not found.
    echo Please run option 7 (Install Dependencies) first.
    echo.
    pause
    goto menu
)

REM Create data directory if it doesn't exist
if not exist "backend\data" (
    echo Creating data directory...
    mkdir backend\data
)

REM Check if .env file exists, create if not
if not exist ".env" (
    echo Creating production .env file...
    echo NODE_ENV=production> .env
    echo PORT=5001>> .env
    echo JWT_SECRET=your_jwt_secret_key_change_this_in_production>> .env
    echo.
    echo WARNING: A default JWT_SECRET has been set in the .env file.
    echo          For security, you should change this to a strong random string.
    echo.
)

echo Building frontend for production...
cd frontend
call npm run build

if %ERRORLEVEL% neq 0 (
    echo.
    echo ERROR: Failed to build frontend.
    echo.
    cd ..
    pause
    goto menu
)

cd ..

echo.
echo ===================================================
echo Production build completed successfully!
echo.
echo To start the production server, use option 12.
echo ===================================================
echo.
pause
goto menu

:start_production
echo.
echo ===================================================
echo    Multi-LLM Platform - Production Server
echo ===================================================
echo.
echo Starting production server...
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ERROR: Node.js is not installed or not in your PATH.
    echo Please install Node.js from https://nodejs.org/ (v16 or higher)
    echo.
    pause
    goto menu
)

REM Check if frontend is built
if not exist "frontend\dist" (
    echo ERROR: Production build not found.
    echo Please run option 11 (Build for Production) first.
    echo.
    pause
    goto menu
)

REM Create data directory if it doesn't exist
if not exist "backend\data" (
    echo Creating data directory...
    mkdir backend\data
)

REM Check if .env file exists, create if not
if not exist ".env" (
    echo Creating production .env file...
    echo NODE_ENV=production> .env
    echo PORT=5001>> .env
    echo JWT_SECRET=your_jwt_secret_key_change_this_in_production>> .env
)

REM Start the production server
echo Starting production server...
start "Multi-LLM Production Server" cmd /c "color 0E && echo Production Server is starting... && echo. && set NODE_ENV=production && node backend/server.js"

echo.
echo ===================================================
echo Production server is starting.
echo.
echo The application will be available at: http://localhost:5001
echo ===================================================
echo.
echo Press any key to open the platform in your default browser...
pause > nul

REM Open the platform in the default browser
start http://localhost:5001

echo.
pause
goto menu

:create_shortcut
echo.
echo ===================================================
echo   Multi-LLM Platform - Create Desktop Shortcut
echo ===================================================
echo.
echo This will create a desktop shortcut to launch the platform.
echo.

REM Get the current directory
set "current_dir=%cd%"

REM Get the desktop path
for /f "tokens=2* delims= " %%a in ('reg query "HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\Shell Folders" /v Desktop') do set "desktop_dir=%%b"

echo Creating shortcut on your desktop...

REM Create a VBScript to make the shortcut
echo Set oWS = WScript.CreateObject("WScript.Shell") > "%temp%\CreateShortcut.vbs"
echo sLinkFile = "%desktop_dir%\Multi-LLM Platform.lnk" >> "%temp%\CreateShortcut.vbs"
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> "%temp%\CreateShortcut.vbs"
echo oLink.TargetPath = "%current_dir%\all-in-one-launcher.bat" >> "%temp%\CreateShortcut.vbs"
echo oLink.Arguments = "4" >> "%temp%\CreateShortcut.vbs"
echo oLink.WorkingDirectory = "%current_dir%" >> "%temp%\CreateShortcut.vbs"
echo oLink.Description = "Launch Multi-LLM Platform" >> "%temp%\CreateShortcut.vbs"
echo oLink.IconLocation = "%SystemRoot%\System32\SHELL32.dll,41" >> "%temp%\CreateShortcut.vbs"
echo oLink.Save >> "%temp%\CreateShortcut.vbs"

REM Run the VBScript to create the shortcut
cscript //nologo "%temp%\CreateShortcut.vbs"
del "%temp%\CreateShortcut.vbs"

echo.
echo ===================================================
echo Desktop shortcut created successfully!
echo.
echo You can now launch the platform directly from your desktop.
echo ===================================================
echo.
pause
goto menu

:view_docs
echo.
echo ===================================================
echo   Multi-LLM Platform - Documentation
echo ===================================================
echo.
echo Opening documentation...
echo.

if exist "ALL_IN_ONE_LAUNCHER.md" (
    start "" "ALL_IN_ONE_LAUNCHER.md"
) else if exist "README.md" (
    start "" "README.md"
) else (
    echo Documentation files not found.
    echo.
    echo You can find documentation on the GitHub repository:
    echo https://github.com/zinzied/multi-llm-platform
    echo.
    pause
)

goto menu

:exit
echo.
echo Thank you for using Multi-LLM Platform!
echo.
timeout /t 2 >nul
exit
