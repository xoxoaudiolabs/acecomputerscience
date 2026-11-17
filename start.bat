@echo off
rem Ace Computer Science: double-click to start the app and open it in your browser.
title Ace Computer Science
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed. Get it from https://nodejs.org and run this again.
  pause
  exit /b 1
)

echo Starting Ace Computer Science at http://localhost:5173
echo Keep this window open while you use the app. Close it to stop.
echo.

rem Open the browser a moment after the server starts.
start "" /b cmd /c "ping -n 2 127.0.0.1 >nul & start "" http://localhost:5173"

node server.js
