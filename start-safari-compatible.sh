#!/bin/bash

echo "🚀 Starting CV Builder with Safari compatibility..."

# Set environment variables for cross-origin support
export CORS_ALLOW_ORIGIN=*
export ALLOW_SAFARI_CONNECTIONS=true
export SKIP_AUTH_CHECK=true
export MOCK_SUBSCRIPTION_DATA=true
export MOCK_DATABASE=true
export DISABLE_PORT_FALLBACK=true

# Start backend in one terminal
cd server && node src/index.js &
SERVER_PID=$!
echo "✅ Backend started (PID: $SERVER_PID)"

# Wait for server to initialize
echo "⏳ Waiting for backend to initialize..."
sleep 3

# Start frontend
cd ..
npm run vite &
FRONTEND_PID=$!
echo "✅ Frontend started (PID: $FRONTEND_PID)"

echo ""
echo "🌐 CV Builder is now running with Safari compatibility:"
echo "   Backend: http://localhost:3005"
echo "   Frontend: http://localhost:5173"
echo ""
echo "📱 For Safari users, access: http://localhost:5173?devMode=true"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for Ctrl+C
wait
