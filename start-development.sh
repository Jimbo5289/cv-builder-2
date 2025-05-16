#!/bin/bash

# Kill any running servers on ports we need
echo "Cleaning up any running servers..."
lsof -ti:3005-3009,5173-5177 | xargs kill -9 2> /dev/null

# Set environment variables for development
export MOCK_SUBSCRIPTION_DATA=true
export SKIP_AUTH_CHECK=true

# Start the backend server
echo "Starting backend server..."
cd server && npm run dev &
BACKEND_PID=$!

# Wait for backend to initialize
sleep 3

# Start the frontend server
echo "Starting frontend server..."
cd .. && npm run dev &
FRONTEND_PID=$!

# Trap Ctrl+C to kill both servers
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT

# Keep script running
echo "Development environment started!"
echo "Backend running on http://localhost:3005"
echo "Frontend running on http://localhost:5173"
echo "Press Ctrl+C to stop all servers"

# Wait for both processes
wait 