#!/bin/bash

# Define colors for better readability
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}===============================================${NC}"
echo -e "${BLUE}       CV BUILDER - CLEAN SERVER START${NC}"
echo -e "${BLUE}===============================================${NC}"

# Ensure all node processes are killed
echo -e "${YELLOW}Stopping any running Node.js processes...${NC}"

# Try regular SIGTERM first
pkill -f node || true
sleep 1

# Find any remaining processes and forcefully kill them
node_pids=$(ps aux | grep node | grep -v grep | awk '{print $2}')
if [ ! -z "$node_pids" ]; then
  echo -e "${YELLOW}Force killing remaining Node.js processes: ${node_pids}${NC}"
  kill -9 $node_pids 2>/dev/null || true
fi

# Kill any processes using the ports we need
echo -e "${YELLOW}Ensuring all ports are available...${NC}"
ports="3005 3006 3007 3008 3009 5173 5174 5175 5176 5177"
for port in $ports; do
  pid=$(lsof -ti:$port)
  if [ ! -z "$pid" ]; then
    echo -e "${YELLOW}Freeing port $port (PID: $pid)${NC}"
    kill -9 $pid 2>/dev/null || true
  fi
done

# Verify all ports are free
all_ports_free=true
for port in $ports; do
  if lsof -ti:$port > /dev/null; then
    echo -e "${RED}Port $port is still in use!${NC}"
    all_ports_free=false
  fi
done

if [ "$all_ports_free" = false ]; then
  echo -e "${RED}Some ports are still in use. Please close the applications using them.${NC}"
  echo -e "${YELLOW}You may need to restart your terminal.${NC}"
  exit 1
fi

# Wait to ensure ports are released
echo -e "${GREEN}All ports cleared. Waiting for system to release resources...${NC}"
sleep 2

# Start backend with environment variables for testing
echo -e "${BLUE}Starting backend server with mock data and auth bypass...${NC}"
cd server
MOCK_SUBSCRIPTION_DATA=true SKIP_AUTH_CHECK=true npm run dev &
BACKEND_PID=$!

# Wait for backend to start
echo -e "${YELLOW}Waiting for backend to initialize (5 seconds)...${NC}"
sleep 5

# Check if backend started successfully
if ! ps -p $BACKEND_PID > /dev/null; then
  echo -e "${RED}Backend failed to start!${NC}"
  exit 1
fi

echo -e "${GREEN}Backend started successfully on PID $BACKEND_PID${NC}"

# Wait a bit longer to ensure backend is fully initialized
echo -e "${BLUE}Starting frontend...${NC}"
cd ..
npm run dev &
FRONTEND_PID=$!

# Check if frontend started successfully
sleep 3
if ! ps -p $FRONTEND_PID > /dev/null; then
  echo -e "${RED}Frontend failed to start!${NC}"
  exit 1
fi

echo -e "${GREEN}Frontend started successfully on PID $FRONTEND_PID${NC}"

# Save PIDs to a file for later cleanup
echo "$BACKEND_PID $FRONTEND_PID" > .server-pids

echo -e "${GREEN}===============================================${NC}"
echo -e "${GREEN}Server started in development mode!${NC}"
echo -e "${GREEN}Backend: PID $BACKEND_PID (localhost:3005)${NC}"
echo -e "${GREEN}Frontend: PID $FRONTEND_PID (localhost:5173)${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop all processes${NC}"
echo -e "${GREEN}===============================================${NC}"

# Function to handle interruption
cleanup() {
  echo -e "\n${YELLOW}Shutting down servers...${NC}"
  kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
  sleep 1
  # Force kill if still running
  kill -9 $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
  rm -f .server-pids
  echo -e "${GREEN}Servers stopped.${NC}"
  exit 0
}

# Register the cleanup function for Ctrl+C
trap cleanup INT TERM

# Wait for both processes
wait 