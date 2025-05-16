#!/bin/bash

# Define colors for better readability
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${BLUE}===============================================${NC}"
echo -e "${BLUE}       CV BUILDER - SERVER STARTUP MODES${NC}"
echo -e "${BLUE}===============================================${NC}"

# Function to kill any running servers
kill_servers() {
  echo -e "${YELLOW}Stopping any running Node.js processes...${NC}"
  
  # Find node processes related to our app
  node_pids=$(ps -ef | grep -E "node.*index.js|node.*dev" | grep -v grep | awk '{print $2}')
  
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
  
  # Free up ports
  echo -e "${YELLOW}Freeing up ports...${NC}"
  ports="3005 3006 3007 3008 3009"
  for port in $ports; do
    pid=$(lsof -ti:$port)
    if [ ! -z "$pid" ]; then
      echo -e "${YELLOW}Freeing port $port (PID: $pid)${NC}"
      kill -9 $pid 2>/dev/null || true
    fi
  done
  
  # Wait to ensure ports are released
  echo -e "${GREEN}All ports should be cleared. Waiting for system to release resources...${NC}"
  sleep 2
}

# Function to start server in standard mode
start_standard() {
  echo -e "${BLUE}Starting server in standard mode...${NC}"
  cd server
  npm run dev &
  SERVER_PID=$!
  echo -e "${GREEN}Server started with PID $SERVER_PID${NC}"
  cd ..
}

# Function to start server in development mode with auth bypass
start_dev_mode() {
  echo -e "${BLUE}Starting server in development mode with auth bypass...${NC}"
  cd server
  SKIP_AUTH_CHECK=true npm run dev &
  SERVER_PID=$!
  echo -e "${GREEN}Server started with PID $SERVER_PID${NC}"
  cd ..
}

# Function to start server with mock data
start_mock_data() {
  echo -e "${BLUE}Starting server with mock subscription data...${NC}"
  cd server
  MOCK_SUBSCRIPTION_DATA=true SKIP_AUTH_CHECK=true npm run dev &
  SERVER_PID=$!
  echo -e "${GREEN}Server started with PID $SERVER_PID${NC}"
  cd ..
}

# Display the menu
show_menu() {
  echo -e "\n${CYAN}Select a server startup mode:${NC}"
  echo -e "${CYAN}1)${NC} Standard Mode (Normal server operation)"
  echo -e "${CYAN}2)${NC} Development Mode (Auth bypass for easy testing)"
  echo -e "${CYAN}3)${NC} Mock Data Mode (Mock subscription data + auth bypass)"
  echo -e "${CYAN}4)${NC} Clean Kill (Stop all servers without starting new ones)"
  echo -e "${CYAN}5)${NC} Exit"
  echo -e "${YELLOW}Enter your choice [1-5]:${NC} "
}

# Main function
main() {
  show_menu
  read choice
  
  case $choice in
    1)
      kill_servers
      start_standard
      ;;
    2)
      kill_servers
      start_dev_mode
      ;;
    3)
      kill_servers
      start_mock_data
      ;;
    4)
      kill_servers
      echo -e "${GREEN}All servers have been stopped.${NC}"
      ;;
    5)
      echo -e "${BLUE}Exiting...${NC}"
      exit 0
      ;;
    *)
      echo -e "${RED}Invalid choice. Please enter a number between 1 and 5.${NC}"
      main
      ;;
  esac
  
  # Ask if user wants to start the frontend
  if [[ $choice -ge 1 && $choice -le 3 ]]; then
    echo -e "\n${YELLOW}Do you want to start the frontend as well? (y/n)${NC}"
    read start_frontend
    
    if [[ "$start_frontend" =~ ^[Yy]$ ]]; then
      echo -e "${BLUE}Starting frontend...${NC}"
      npm run dev &
      FRONTEND_PID=$!
      echo -e "${GREEN}Frontend started with PID $FRONTEND_PID${NC}"
      
      echo -e "\n${GREEN}===============================================${NC}"
      echo -e "${GREEN}All services started successfully!${NC}"
      echo -e "${GREEN}Server: http://localhost:3005${NC}"
      echo -e "${GREEN}Frontend: http://localhost:5173${NC}"
      echo -e "${GREEN}===============================================${NC}"
    else
      echo -e "${BLUE}Frontend not started. You can start it manually with 'npm run dev'${NC}"
    fi
  fi
}

# Run the main function
main 