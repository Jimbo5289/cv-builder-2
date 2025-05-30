#!/bin/bash

# kill any existing processes on required ports
echo "Killing any existing processes on required ports..."
lsof -ti:3005,3006,3007,3008,3009,5173,5174,5175,5176,5177 | xargs kill -9 2>/dev/null || true
pkill -f "node src/index.js" || true
pkill -f "vite" || true

# Wait for ports to be released
echo "Waiting for ports to be released..."
sleep 2

# Make sure we're in the project root directory
PROJECT_ROOT="$(pwd)"

# Start the backend server with nohup to keep it running
echo "Starting backend server..."
cd "$PROJECT_ROOT/server"
export PORT=3005
export MOCK_SUBSCRIPTION_DATA=true
export SKIP_AUTH_CHECK=true
nohup node src/index.js > "$PROJECT_ROOT/logs/backend.log" 2>&1 &
BACKEND_PID=$!
echo "Backend server started with PID: $BACKEND_PID"

# Wait for backend to initialize
echo "Waiting for backend to initialize..."
sleep 5

# Check if backend is running
curl -s http://localhost:3005/health
if [ $? -ne 0 ]; then
  echo "Backend failed to start. Check logs/backend.log for details."
  exit 1
fi
echo "Backend is running successfully."

# Start the frontend with nohup to keep it running
echo "Starting frontend server..."
cd "$PROJECT_ROOT"
export VITE_API_URL=http://localhost:3005
export VITE_MOCK_SUBSCRIPTION_DATA=true
export VITE_SKIP_AUTH_CHECK=true
nohup npm run dev -- --port 5173 > "$PROJECT_ROOT/logs/frontend.log" 2>&1 &
FRONTEND_PID=$!
echo "Frontend server started with PID: $FRONTEND_PID"

# Wait for frontend to initialize
echo "Waiting for frontend to initialize..."
sleep 5

# Save the PIDs for later cleanup
echo "$BACKEND_PID" > "$PROJECT_ROOT/logs/backend.pid"
echo "$FRONTEND_PID" > "$PROJECT_ROOT/logs/frontend.pid"

echo "===================================================="
echo "Servers are now running in the background:"
echo "Backend: http://localhost:3005 (PID: $BACKEND_PID)"
echo "Frontend: http://localhost:5173 (PID: $FRONTEND_PID)"
echo "===================================================="
echo "To view logs:"
echo "  Backend: tail -f $PROJECT_ROOT/logs/backend.log"
echo "  Frontend: tail -f $PROJECT_ROOT/logs/frontend.log"
echo "===================================================="
echo "To stop the servers:"
echo "  ./stop-servers.sh"
echo "====================================================" 