#!/bin/bash

# CV Builder Reliable Startup Script
# This script kills any existing processes and starts both the frontend and backend

# Text colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}CV Builder Reliable Startup Script${NC}"
echo -e "${YELLOW}Stopping any existing servers...${NC}"

# Function to kill process by port
kill_port() {
  local port=$1
  
  # Check if a process is using the port
  if lsof -i :$port > /dev/null 2>&1; then
    echo -e "${YELLOW}Killing process on port $port...${NC}"
    lsof -i :$port -t | xargs kill -9 > /dev/null 2>&1
  else
    echo -e "${GREEN}No process found on port $port${NC}"
  fi
}

# Kill any processes on common ports
FRONTEND_PORTS=(5173 5174 5175 5176 5177 5178 5179 5180)
BACKEND_PORTS=(3005 3006 3007 3008 3009)

# Kill frontend ports
for port in "${FRONTEND_PORTS[@]}"; do
  kill_port $port
done

# Kill backend ports
for port in "${BACKEND_PORTS[@]}"; do
  kill_port $port
done

# Wait for processes to terminate
echo -e "${YELLOW}Waiting for processes to terminate...${NC}"
sleep 2

# Start backend server with mock data for development
echo -e "${GREEN}Starting backend server...${NC}"
cd server
MOCK_SUBSCRIPTION_DATA=true SKIP_AUTH_CHECK=true node restart-server.js &
BACKEND_PID=$!

# Wait for backend to initialize
echo -e "${YELLOW}Waiting for backend to initialize...${NC}"
sleep 5

# Start frontend
echo -e "${GREEN}Starting frontend...${NC}"
cd ..
npm run dev &
FRONTEND_PID=$!

# Set up process monitoring
echo -e "${GREEN}Both services started successfully!${NC}"
echo -e "Backend PID: $BACKEND_PID"
echo -e "Frontend PID: $FRONTEND_PID"
echo -e "${YELLOW}Press Ctrl+C to stop both services${NC}"

# Function to clean up on exit
cleanup() {
  echo -e "\n${RED}Stopping services...${NC}"
  kill $FRONTEND_PID 2>/dev/null
  kill $BACKEND_PID 2>/dev/null
  exit 0
}

# Set trap to catch Ctrl+C
trap cleanup SIGINT

# Keep script running until user presses Ctrl+C
while true; do
  sleep 1
done 