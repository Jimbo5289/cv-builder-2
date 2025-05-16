#!/bin/bash

echo "🚀 Starting CV Builder with Safari compatibility..."

# Kill any existing processes
pkill -f node || true
lsof -ti:3005,3006,3007,5173,5174,5175,5176,5177 | xargs kill -9 2>/dev/null || true
echo "✅ Freed all ports"

# Set environment variables for cross-origin support
export CORS_ALLOW_ORIGIN=*
export ALLOW_SAFARI_CONNECTIONS=true
export SKIP_AUTH_CHECK=true
export MOCK_SUBSCRIPTION_DATA=true
export MOCK_DATABASE=true
export DISABLE_PORT_FALLBACK=true

# Update environment files
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
DATABASE_URL=postgresql://postgres:password@localhost:5432/cvbuilder_dev
MOCK_DATABASE=true
EOL

cat > .env.local << EOL
VITE_API_URL=http://localhost:3005
VITE_SKIP_AUTH=true
VITE_DISABLE_PORT_FALLBACK=true
EOL

echo "✅ Updated environment files"

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