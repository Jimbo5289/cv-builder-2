#!/bin/bash

# CV Builder Startup Script
# This script ensures a clean environment for the CV Builder app in Safari

echo "🚀 CV Builder Startup Script"
echo "==========================="

# Step 1: Kill all existing processes that might interfere
echo -e "\n📌 Step 1: Stopping all running Node processes"
pkill -f node || true
echo "✅ Terminated all Node.js processes"

echo -e "\n📌 Step 2: Freeing all ports"
lsof -ti:3005,3006,3007,5173,5174,5175,5176,5177 | xargs kill -9 2>/dev/null || true
echo "✅ Freed all ports"

# Step 3: Start the backend server
echo -e "\n📌 Step 3: Starting backend server"
cd server
SKIP_AUTH_CHECK=true MOCK_SUBSCRIPTION_DATA=true DISABLE_PORT_FALLBACK=true npm run dev &
backend_pid=$!
echo "✅ Backend server started (PID: $backend_pid)"

# Wait for backend to initialize
echo "⏳ Waiting for backend to initialize..."
sleep 5

# Step 4: Start the frontend
echo -e "\n📌 Step 4: Starting frontend"
cd ..
npm run dev &
frontend_pid=$!
echo "✅ Frontend started (PID: $frontend_pid)"

echo -e "\n✨ Application started successfully!"
echo "Backend: http://localhost:3005"
echo "Frontend: http://localhost:5173"
echo -e "\nIn Safari, remember to add ?devMode=true to URLs for better compatibility"
echo "e.g., http://localhost:5173?devMode=true"
echo -e "\nPress Ctrl+C to stop all servers"

# Wait for both processes
wait $backend_pid $frontend_pid 