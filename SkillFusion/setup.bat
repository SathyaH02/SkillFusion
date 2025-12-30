@echo off
echo ==========================================
echo SkillFusion Project Setup Script
echo ==========================================
echo.
echo Installing Server Dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo Error installing server dependencies!
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo Installing Client Dependencies...
cd client
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo Error installing client dependencies!
    cd ..
    pause
    exit /b %ERRORLEVEL%
)
cd ..

echo.
echo ==========================================
echo Setup Complete!
echo You can now start the application:
echo 1. Server: node server.js
echo 2. Client: cd client && npm run dev
echo ==========================================
pause
