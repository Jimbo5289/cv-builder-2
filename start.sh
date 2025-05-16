#!/bin/bash

# Kill existing processes
echo "Killing existing server processes..."
pkill -f "node.*server/src/index.js" || true
pkill -f "vite" || true

# Ensure environment variables are set
export SKIP_AUTH_CHECK=true
export MOCK_SUBSCRIPTION_DATA=true

# Start servers
echo "Starting backend server..."
cd server && SKIP_AUTH_CHECK=true MOCK_SUBSCRIPTION_DATA=true npm run dev &
sleep 2

echo "Starting frontend..."
cd .. && npm run dev &

echo "Development environment started!"
echo "Press Ctrl+C in each terminal to stop" 