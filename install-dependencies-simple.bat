@echo off
echo ===================================================
echo       Installing Dependencies (Simple)
echo ===================================================
echo.

echo Installing backend dependencies...
call npm install

echo.
echo Installing frontend dependencies...
cd frontend
call npm install
cd ..

echo.
echo ===================================================
echo Dependencies installed successfully!
echo.
echo You can now start the platform using:
echo start-platform-simple.bat
echo ===================================================
echo.
echo Press any key to exit...
pause > nul
