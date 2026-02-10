@echo off
echo Starting SleekWheels Development Server...
echo.
echo This will:
echo 1. Install dependencies (if needed)
echo 2. Start the development server
echo 3. Open your browser to the application
echo.
echo Press any key to continue...
pause >nul

echo.
echo Installing dependencies...
npm install

echo.
echo Starting development server...
echo.
echo The application will be available at:
echo - Main Site: http://localhost:5004
echo - Admin Dashboard: http://localhost:5004/admin
echo.
echo Default admin credentials:
echo Username: admin
echo Password: admin123
echo.
echo Press Ctrl+C to stop the server
echo.

start http://localhost:5004
npm run dev
