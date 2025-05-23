@echo off
echo ===================================================
echo       Creating Test User (Simple)
echo ===================================================
echo.

echo Checking if backend server is running...
curl -s http://localhost:5001/api/test > nul
if %ERRORLEVEL% neq 0 (
    echo ERROR: Backend server is not running.
    echo Please start the platform first using start-platform-simple.bat
    echo.
    pause
    exit /b
)

echo Creating test user...
curl -s http://localhost:5001/api/create-user

echo.
echo ===================================================
echo Test user created successfully!
echo.
echo You can now log in with:
echo - Email: test@example.com
echo - Password: password123
echo ===================================================
echo.
echo Press any key to exit...
pause > nul
