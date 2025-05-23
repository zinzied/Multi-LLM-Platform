@echo off
echo ===================================================
echo       First-Time Setup (Simple)
echo ===================================================
echo.
echo This script will:
echo 1. Install dependencies
echo 2. Start the platform
echo 3. Create a test user
echo.
echo This may take several minutes to complete.
echo.
pause

echo.
echo Step 1: Installing dependencies...
echo.
call install-dependencies-simple.bat

echo.
echo Step 2: Starting the platform...
echo.
start start-platform-simple.bat

echo.
echo Waiting for servers to start (10 seconds)...
timeout /t 10 /nobreak > nul

echo.
echo Step 3: Creating test user...
echo.
call create-test-user-simple.bat

echo.
echo ===================================================
echo First-time setup complete!
echo.
echo You can now access the platform at:
echo http://localhost:5173
echo.
echo Login with:
echo - Email: test@example.com
echo - Password: password123
echo ===================================================
echo.
echo Press any key to exit...
pause > nul
