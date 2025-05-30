#!/bin/bash

# Function to stop a process by PID file
stop_process() {
  PID_FILE="$1"
  PROCESS_NAME="$2"
  
  if [ -f "$PID_FILE" ]; then
    PID=$(cat "$PID_FILE")
    echo "Stopping $PROCESS_NAME (PID: $PID)..."
    kill -15 $PID 2>/dev/null || true
    
    # Check if process is still running after 5 seconds
    sleep 2
    if kill -0 $PID 2>/dev/null; then
      echo "$PROCESS_NAME is still running, force killing it..."
      kill -9 $PID 2>/dev/null || true
    fi
    
    rm -f "$PID_FILE"
    echo "$PROCESS_NAME stopped."
  else
    echo "No PID file found for $PROCESS_NAME."
  fi
}

# Kill any processes on the specific ports
echo "Cleaning up processes on ports 3005 and 5173..."
lsof -ti:3005 | xargs kill -9 2>/dev/null || true
lsof -ti:5173 | xargs kill -9 2>/dev/null || true

# Stop processes by their PID files
stop_process "logs/backend.pid" "Backend server"
stop_process "logs/frontend.pid" "Frontend server"

# Extra cleanup for any remaining processes
pkill -f "node src/index.js" || true
pkill -f "vite" || true

echo "All servers have been stopped." 