@echo off
echo ========================================================
echo  Starting Multilingual Student Query System
echo ========================================================

echo Starting FastAPI Backend on http://127.0.0.1:8000 ...
start "Backend (FastAPI)" cmd /k "cd /d %~dp0backend && python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000"

timeout /t 3 /nobreak >nul

echo Starting React Vite Frontend on http://localhost:5173 ...
start "Frontend (React Vite)" cmd /k "cd /d %~dp0frontend && npm run dev"

timeout /t 3 /nobreak >nul

echo Opening browser...
start http://localhost:5173

echo ========================================================
echo  Application is running!
echo  Frontend: http://localhost:5173
echo  Backend:  http://127.0.0.1:8000/docs
echo ========================================================
pause
