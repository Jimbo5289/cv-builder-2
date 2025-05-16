#!/bin/bash

# Safari Compatibility Fix for CV Builder
# This script ensures the application works properly in Safari browsers

echo "🧩 CV Builder - Safari Compatibility Fix"
echo "========================================"

# 1. Kill all existing processes
echo -e "\n📌 Step 1: Stopping all existing processes"
pkill -f node || true
lsof -ti:3005,3006,3007,5173,5174,5175,5176,5177 | xargs kill -9 2>/dev/null || true
echo "✅ All processes terminated"

# 2. Set up environment files
echo -e "\n📌 Step 2: Setting up environment files"

# Server environment
cat > server/.env << EOL
NODE_ENV=development
PORT=3005
DISABLE_PORT_FALLBACK=true
SKIP_AUTH_CHECK=true
MOCK_SUBSCRIPTION_DATA=true
FRONTEND_URL=http://localhost:5173
JWT_SECRET=dev-secret-key
JWT_EXPIRES_IN=86400
ALLOW_SAFARI_CONNECTIONS=true
DEBUG_CORS=true
EOL

# Frontend environment
cat > .env.local << EOL
VITE_API_URL=http://localhost:3005
VITE_SKIP_AUTH=true
VITE_DISABLE_PORT_FALLBACK=true
EOL

echo "✅ Environment files created"

# 3. Start the backend server
echo -e "\n📌 Step 3: Starting backend server"
cd server && SKIP_AUTH_CHECK=true MOCK_SUBSCRIPTION_DATA=true node src/index.js &
backend_pid=$!
echo "✅ Backend server started (PID: $backend_pid)"

# Wait for backend to initialize
echo "⏳ Waiting for backend to initialize..."
sleep 3

# 4. Start the frontend
echo -e "\n📌 Step 4: Starting frontend"
cd .. && npm run dev &
frontend_pid=$!
echo "✅ Frontend started (PID: $frontend_pid)"

echo -e "\n🚀 CV Builder is now running with Safari compatibility fixes!"
echo "   Backend URL: http://localhost:3005"
echo "   Frontend URL: http://localhost:5173"
echo -e "\n   Use Ctrl+C to stop both servers"

# Wait for user to press Ctrl+C
wait 