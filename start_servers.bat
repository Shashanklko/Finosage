@echo off
echo Starting Financial Advisor Application...


REM Start backend server
echo Starting backend server...
start cmd /k "cd backend && python main.py"

REM Wait for backend to initialize
timeout /t 2 /nobreak > nul

REM Start frontend server
echo Starting frontend server...
start cmd /k "cd frontend && python -m http.server 8001"

REM Wait for frontend to initialize
timeout /t 2 /nobreak > nul

echo.
echo Servers started successfully!
echo Backend is running at: http://localhost:8000
echo Frontend is running at: http://localhost:8001

REM Open the website in the default browser
echo Opening website in your default browser...
start http://localhost:8001

echo.
echo Press any key to close this window. The servers will continue running in their own windows.
pause > nul 