@echo off
echo ========================================================
echo   Launching SmartCanteen System
echo   Website: http://localhost:3000
echo ========================================================
echo.
timeout /t 2 /nobreak >nul
start http://localhost:3000
node server.js
pause
