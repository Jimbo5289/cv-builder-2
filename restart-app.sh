#!/bin/bash

# CV Builder Restart Script
echo "🔧 CV Builder Restart Script"
echo "=========================="

# Kill all existing processes
echo -e "\n📌 Step 1: Stopping all existing processes"
pkill -f node || true
lsof -ti:3005,3006,3007,5173,5174,5175,5176,5177 | xargs kill -9 2>/dev/null || true
echo "✅ All processes terminated"

# Start the backend server
echo -e "\n📌 Step 2: Starting backend server"
cd server
MOCK_SUBSCRIPTION_DATA=true SKIP_AUTH_CHECK=true DISABLE_PORT_FALLBACK=true npm run dev &
backend_pid=$!
echo "✅ Backend server started (PID: $backend_pid)"

# Wait for backend to initialize
echo "⏳ Waiting 5 seconds for backend to initialize..."
sleep 5

# Start the frontend
echo -e "\n📌 Step 3: Starting frontend"
cd ..
npm run dev &
frontend_pid=$!
echo "✅ Frontend started (PID: $frontend_pid)"

echo -e "\n🎉 Application started successfully!"
echo "- Backend: http://localhost:3005"
echo "- Frontend: http://localhost:5173"
echo -e "\nPress Ctrl+C to stop both servers"

# Wait for user to press Ctrl+C
wait $backend_pid $frontend_pid 