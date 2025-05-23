@echo off
echo ===================================================
echo       Starting Multi-LLM Platform (Simple)
echo ===================================================
echo.

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

echo.
echo Starting backend server...
start "Multi-LLM Backend" cmd /k "cd backend && node server.js"

echo.
echo Waiting for backend to initialize (5 seconds)...
timeout /t 5 /nobreak > nul

echo.
echo Starting frontend server...
start "Multi-LLM Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ===================================================
echo Servers are starting in separate windows.
echo.
echo - Backend will be available at: http://localhost:5001
echo - Frontend will be available at: http://localhost:5173
echo ===================================================
echo.
echo IMPORTANT: 
echo 1. Do not close the server windows until you're done.
echo 2. If the browser doesn't open automatically, manually
echo    open this URL in your browser: http://localhost:5173
echo.
echo Waiting for frontend to initialize (5 seconds)...
timeout /t 5 /nobreak > nul

echo.
echo Attempting to open in browser...
echo.

REM Try to open the browser using multiple methods
start "" "http://localhost:5173"

echo.
echo If the browser didn't open automatically, please manually open:
echo http://localhost:5173
echo.
echo Press any key to exit...
pause > nul
