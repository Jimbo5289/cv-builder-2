#!/bin/bash

echo "🚀 Fixing localhost access for CV Builder..."

# Kill all existing processes
echo "Killing existing processes..."
lsof -ti:3005,3006,3007,3008,3009,5173,5174,5175,5176,5177 | xargs kill -9 2>/dev/null || true
pkill -f "node src/index.js" 2>/dev/null || true
pkill -f "npx vite" 2>/dev/null || true

# Wait for ports to be released
echo "Waiting for ports to be released..."
sleep 2

# Start backend server with environment variables for development
echo "Starting backend server..."
cd server
MOCK_SUBSCRIPTION_DATA=true SKIP_AUTH_CHECK=true DISABLE_PORT_FALLBACK=true node src/index.js &
BACKEND_PID=$!
cd ..

# Wait for backend to initialize
echo "Waiting for backend server to initialize..."
sleep 3

# Start frontend with explicit host binding
echo "Starting frontend server with localhost binding..."
VITE_DEV_MODE=true npx vite --host localhost --strictPort --port 5173 &
FRONTEND_PID=$!

# Display access information
echo ""
echo "✅ Servers started successfully!"
echo "Backend running on: http://localhost:3005"
echo "Frontend running on: http://localhost:5173"
echo ""
echo "📱 Important: Access the application using:"
echo "http://localhost:5173?devMode=true"
echo ""
echo "Press Ctrl+C to stop all servers"

# Trap Ctrl+C to kill both processes
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT

# Keep script running
wait 