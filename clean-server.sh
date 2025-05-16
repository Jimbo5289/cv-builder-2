#!/bin/bash

# Define colors for better readability
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}===============================================${NC}"
echo -e "${BLUE}       CV BUILDER - SERVER CLEANUP UTILITY${NC}"
echo -e "${BLUE}===============================================${NC}"

# Check if running on macOS
if [[ "$OSTYPE" == "darwin"* ]]; then
  echo -e "${YELLOW}Running on macOS...${NC}"
else
  echo -e "${YELLOW}Running on Linux or other system...${NC}"
fi

# Ensure all node processes are killed
echo -e "${YELLOW}Stopping any running Node.js processes...${NC}"

# Find any remaining processes and forcefully kill them
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS specific commands
  node_pids=$(ps -ef | grep -E "node.*index.js|node.*dev" | grep -v grep | awk '{print $2}')
else
  # Linux specific commands
  node_pids=$(ps aux | grep -E "node.*index.js|node.*dev" | grep -v grep | awk '{print $2}')
fi

if [ ! -z "$node_pids" ]; then
  echo -e "${YELLOW}Found Node.js processes: ${node_pids}${NC}"
  echo -e "${YELLOW}Killing processes...${NC}"
  for pid in $node_pids; do
    kill -9 $pid 2>/dev/null || true
    echo -e "${GREEN}Killed process $pid${NC}"
  done
else
  echo -e "${GREEN}No Node.js processes found.${NC}"
fi

# Kill any processes using the ports we need
echo -e "${YELLOW}Ensuring all ports are available...${NC}"
ports="3005 3006 3007 3008 3009 5173 5174 5175 5176 5177"

for port in $ports; do
  if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS specific command
    pid=$(lsof -ti:$port)
  else
    # Linux specific command 
    pid=$(netstat -tulpn 2>/dev/null | grep ":$port " | awk '{print $7}' | cut -d'/' -f1)
  fi
  
  if [ ! -z "$pid" ]; then
    echo -e "${YELLOW}Freeing port $port (PID: $pid)${NC}"
    kill -9 $pid 2>/dev/null || true
  else
    echo -e "${GREEN}Port $port is free${NC}"
  fi
done

# Wait to ensure ports are released
echo -e "${GREEN}All ports should be cleared. Waiting for system to release resources...${NC}"
sleep 2

# Create a function to check if a port is free
check_port() {
  if [[ "$OSTYPE" == "darwin"* ]]; then
    lsof -i:"$1" >/dev/null 2>&1
    if [ $? -eq 0 ]; then
      echo -e "${RED}Port $1 is still in use!${NC}"
      return 1
    else
      echo -e "${GREEN}Port $1 is free${NC}"
      return 0
    fi
  else
    netstat -tuln | grep ":$1 " >/dev/null 2>&1
    if [ $? -eq 0 ]; then
      echo -e "${RED}Port $1 is still in use!${NC}"
      return 1
    else
      echo -e "${GREEN}Port $1 is free${NC}"
      return 0
    fi
  fi
}

# Verify all ports are free
echo -e "${YELLOW}Verifying all ports are free...${NC}"
all_ports_free=true
for port in $ports; do
  if ! check_port "$port"; then
    all_ports_free=false
  fi
done

if [ "$all_ports_free" = false ]; then
  echo -e "${RED}Some ports are still in use. Please close the applications using them.${NC}"
  echo -e "${YELLOW}You may need to restart your terminal or computer if the issue persists.${NC}"
  exit 1
fi

# Start the server
echo -e "${BLUE}Starting server with mock data and auth bypass...${NC}"
echo -e "${YELLOW}Do you want to start the server in development mode? (y/n)${NC}"
read start_server

if [[ "$start_server" =~ ^[Yy]$ ]]; then
  # Navigate to server directory and start it
  echo -e "${BLUE}Starting backend server...${NC}"
  cd server
  MOCK_SUBSCRIPTION_DATA=true SKIP_AUTH_CHECK=true npm run dev &
  SERVER_PID=$!
  cd ..
  
  # Check if server started
  sleep 3
  if ps -p $SERVER_PID > /dev/null; then
    echo -e "${GREEN}Server started successfully with PID $SERVER_PID${NC}"
    echo -e "${GREEN}Server is running on http://localhost:3005${NC}"
    
    # Start the frontend
    echo -e "${BLUE}Starting frontend...${NC}"
    npm run dev &
    FRONTEND_PID=$!
    
    # Check if frontend started
    sleep 3
    if ps -p $FRONTEND_PID > /dev/null; then
      echo -e "${GREEN}Frontend started successfully with PID $FRONTEND_PID${NC}"
      echo -e "${GREEN}Frontend is running on http://localhost:5173${NC}"
      echo -e "${GREEN}===============================================${NC}"
      echo -e "${GREEN}All services started successfully!${NC}"
      echo -e "${GREEN}You can access the application at: http://localhost:5173${NC}"
      echo -e "${GREEN}===============================================${NC}"
    else
      echo -e "${RED}Frontend failed to start!${NC}"
    fi
  else
    echo -e "${RED}Server failed to start!${NC}"
  fi
else
  echo -e "${BLUE}Server cleanup complete. You can now start the server manually.${NC}"
fi

echo -e "${YELLOW}Done!${NC}" 