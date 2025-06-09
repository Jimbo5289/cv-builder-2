#!/bin/bash

# Color formatting
BLUE='\033[0;34m'
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
BOLD='\033[1m'
RESET='\033[0m'

# Display header
echo -e "${BLUE}🚀 CV Builder Startup Script${RESET}"
echo -e "${BLUE}===========================${RESET}"

# Step 1: Stop any running Node processes
echo -e "${BLUE}📌 Step 1: Stopping all running Node processes${RESET}"
killall node 2>/dev/null
if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ Terminated all Node.js processes${RESET}"
else
  echo -e "${YELLOW}⚠️ No Node.js processes were running${RESET}"
fi

# Step 2: Free up ports 3005 and 5173
echo -e "${BLUE}📌 Step 2: Freeing all ports${RESET}"
lsof -ti:3005 | xargs kill -9 2>/dev/null
lsof -ti:5173 | xargs kill -9 2>/dev/null
echo -e "${GREEN}✅ Freed all ports${RESET}"

# Step 3: Set up development database
echo -e "${BLUE}📌 Step 3: Setting up development database${RESET}"
npm run fix-db
echo -e "${GREEN}✅ Development database setup completed${RESET}"

# Step 4: Start backend server
echo -e "${BLUE}📌 Step 4: Starting backend server${RESET}"
cd server && SKIP_AUTH_CHECK=true MOCK_SUBSCRIPTION_DATA=true DISABLE_PORT_FALLBACK=true npm run dev &
backend_pid=$!
cd ..
echo -e "${GREEN}✅ Backend server started (PID: $backend_pid)${RESET}"

# Wait for backend to initialize
echo -e "${YELLOW}⏳ Waiting for backend to initialize...${RESET}"
sleep 5

# Step 5: Start frontend
echo -e "${BLUE}📌 Step 5: Starting frontend${RESET}"
# Run npm dev directly in the current directory
VITE_DEV_MODE=true npm run dev &
frontend_pid=$!
echo -e "${GREEN}✅ Frontend started (PID: $frontend_pid)${RESET}"

# Success message
echo -e "${GREEN}✨ Application started successfully!${RESET}"
echo -e "Backend: http://localhost:3005"
echo -e "Frontend: http://localhost:5173"
echo -e "In Safari, remember to add ?devMode=true to URLs for better compatibility"
echo -e "e.g., http://localhost:5173?devMode=true"
echo -e "Press Ctrl+C to stop all servers"

# Wait for user to stop with Ctrl+C
wait 