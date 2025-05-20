@echo off
echo Choose environment:
echo 1. Development
echo 2. Production
set /p choice="Enter choice (1 or 2): "

if "%choice%"=="1" (
    echo Starting in Development Mode...
    docker compose down
    docker compose up --build
) else if "%choice%"=="2" (
    echo Starting in Production Mode...
    docker compose down
    set NODE_ENV=production
    set REACT_APP_API_BASE_URL=https://financeflow.icu
    docker compose up --build
) else (
    echo Invalid choice. Please enter 1 or 2.
)
