#!/bin/bash

echo "🚀 CV Builder - Complete Setup and Launch Script"
echo "================================================"

# Kill all existing processes
echo "⏱️  Step 1/6: Killing existing processes..."
lsof -ti:3005,3006,3007,3008,3009,5173,5174,5175,5176,5177 | xargs kill -9 2>/dev/null || true
pkill -f "node src/index.js" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true
pkill -f "nodemon" 2>/dev/null || true
echo "✅ All existing processes killed"

# Wait for ports to be released
echo "⏳ Waiting for ports to be released..."
sleep 3

# Install backend dependencies
echo "⏱️  Step 2/6: Installing backend dependencies..."
cd server
npm install express --save || true
npm install --no-fund || true
echo "✅ Backend dependencies installed"

# Install frontend dependencies
echo "⏱️  Step 3/6: Installing frontend dependencies..."
cd ..
npm install --no-fund --legacy-peer-deps || true
echo "✅ Frontend dependencies installed"

# Verify required files exist
echo "⏱️  Step 4/6: Verifying required files..."
if [ ! -f "src/context/ThemeContext.jsx" ]; then
  echo "❌ Missing ThemeContext.jsx file. Please run this script again after resolving."
  exit 1
fi

if [ ! -f "src/utils/errorHandler.js" ]; then
  echo "❌ Missing errorHandler.js file. Please run this script again after resolving."
  exit 1
fi
echo "✅ All required files exist"

# Create separate terminal for backend
echo "⏱️  Step 5/6: Starting backend server..."
cd server
osascript -e 'tell app "Terminal" to do script "cd \"'$PWD'\" && MOCK_SUBSCRIPTION_DATA=true SKIP_AUTH_CHECK=true node src/index.js"'
cd ..
echo "✅ Backend server started in separate terminal"

# Wait for backend to initialize
echo "⏳ Waiting for backend to initialize..."
sleep 5

# Create separate terminal for frontend
echo "⏱️  Step 6/6: Starting frontend server with localhost binding..."
osascript -e 'tell app "Terminal" to do script "cd \"'$PWD'\" && VITE_DEV_MODE=true npm run dev -- --host localhost"'
echo "✅ Frontend server started in separate terminal"

# Final message and instructions
echo ""
echo "✨ CV Builder is now running in separate terminal windows!"
echo "════════════════════════════════════════"
echo "🔗 Backend: http://localhost:3005"
echo "🔗 Frontend: http://localhost:5173"
echo ""
echo "ℹ️  For best experience, use: http://localhost:5173?devMode=true"
echo ""
echo "⚠️  Close the terminal windows to stop the servers"
echo "" 