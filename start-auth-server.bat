@echo off
echo ========================================
echo   Starting Authentication Server
echo ========================================
echo.
echo Server will run on: http://localhost:3001
echo.
echo User data will be stored in:
echo   - backend/users.json
echo   - backend/passwords.json
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

cd /d "%~dp0"
npm run auth-server

pause
