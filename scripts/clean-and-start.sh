#!/bin/bash

# CV Builder Clean & Start Script
# This script thoroughly kills all processes on relevant ports,
# checks for port availability, and starts both servers properly

# Text colors for better readability
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}CV Builder - Clean Start Script${NC}"
echo -e "${BLUE}=====================================${NC}"

# Create logs directory at the start to ensure it exists
mkdir -p logs

# Function to check if a port is in use
check_port() {
  local port=$1
  lsof -i :$port >/dev/null 2>&1
  return $?
}

# Function to completely stop all processes on all relevant ports
kill_all_processes() {
  echo -e "${YELLOW}Terminating ALL processes on relevant ports...${NC}"
  
  # Kill processes on frontend ports (Vite)
  for port in $(seq 5173 5183); do
    if check_port $port; then
      pid=$(lsof -ti :$port)
      if [ -n "$pid" ]; then
        echo -e "Killing process on port $port (PID: $pid)"
        kill -9 $pid
      fi
    fi
  done
  
  # Kill processes on backend ports (Node/Express)
  for port in $(seq 3005 3010); do
    if check_port $port; then
      pid=$(lsof -ti :$port)
      if [ -n "$pid" ]; then
        echo -e "Killing process on port $port (PID: $pid)"
        kill -9 $pid
      fi
    fi
  done
  
  # Also kill any Node.js processes related to our app
  pkill -f "node.*vite" || true
  pkill -f "node.*server/src" || true
  
  # Wait a moment for processes to fully terminate
  sleep 1
  
  echo -e "${GREEN}All processes terminated.${NC}"
}

# Verify critical files exist
check_files() {
  echo -e "${BLUE}Checking for critical files...${NC}"
  
  # Check for localStorage.js
  if [ ! -f "src/utils/localStorage.js" ]; then
    echo -e "${RED}Missing localStorage.js utility! Creating it...${NC}"
    cat > src/utils/localStorage.js << 'EOL'
/**
 * localStorage utility functions for the CV Builder application
 * Provides consistent access patterns, error handling, and fallbacks
 */

// Check if localStorage is available
const isLocalStorageAvailable = () => {
  try {
    const testKey = '__test_storage__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    console.warn('localStorage is not available:', e);
    return false;
  }
};

// Memory fallback when localStorage is unavailable
const memoryStorage = new Map();

/**
 * Get an item from localStorage with proper error handling
 * @param {string} key - The key to retrieve
 * @param {any} defaultValue - Default value if key doesn't exist
 * @returns {any} The value from localStorage or defaultValue
 */
export const getItem = (key, defaultValue = null) => {
  try {
    if (!isLocalStorageAvailable()) {
      return memoryStorage.get(key) || defaultValue;
    }
    
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    
    try {
      // Try to parse as JSON
      return JSON.parse(item);
    } catch (e) {
      // If not valid JSON, return as is
      return item;
    }
  } catch (e) {
    console.error(`Error getting localStorage item: ${key}`, e);
    return defaultValue;
  }
};

/**
 * Set an item in localStorage with proper error handling
 * @param {string} key - The key to set
 * @param {any} value - The value to store
 * @returns {boolean} Success status
 */
export const setItem = (key, value) => {
  try {
    if (!isLocalStorageAvailable()) {
      memoryStorage.set(key, value);
      return true;
    }
    
    const valueToStore = typeof value === 'object' ? JSON.stringify(value) : value;
    localStorage.setItem(key, valueToStore);
    return true;
  } catch (e) {
    console.error(`Error setting localStorage item: ${key}`, e);
    return false;
  }
};

/**
 * Remove an item from localStorage
 * @param {string} key - The key to remove
 * @returns {boolean} Success status
 */
export const removeItem = (key) => {
  try {
    if (!isLocalStorageAvailable()) {
      memoryStorage.delete(key);
      return true;
    }
    
    localStorage.removeItem(key);
    return true;
  } catch (e) {
    console.error(`Error removing localStorage item: ${key}`, e);
    return false;
  }
};

/**
 * Clear all localStorage items
 * @returns {boolean} Success status
 */
export const clearAll = () => {
  try {
    if (!isLocalStorageAvailable()) {
      memoryStorage.clear();
      return true;
    }
    
    localStorage.clear();
    return true;
  } catch (e) {
    console.error('Error clearing localStorage', e);
    return false;
  }
};

/**
 * Safely reset ALL localStorage data
 * This is used as a last resort to fix corruption issues
 */
export const resetAllLocalStorage = () => {
  try {
    if (isLocalStorageAvailable()) {
      localStorage.clear();
    }
    memoryStorage.clear();
    return true;
  } catch (e) {
    console.error('Failed to reset localStorage:', e);
    return false;
  }
};

/**
 * Clean up potentially corrupted localStorage data
 * @param {boolean} preserveAuth - If true, preserve authentication data
 */
export const cleanupLocalStorage = (preserveAuth = true) => {
  try {
    if (!isLocalStorageAvailable()) {
      // Only preserve auth data if requested
      if (preserveAuth) {
        const authData = memoryStorage.get('auth');
        const userProfile = memoryStorage.get('userProfile');
        memoryStorage.clear();
        if (authData) memoryStorage.set('auth', authData);
        if (userProfile) memoryStorage.set('userProfile', userProfile);
      } else {
        memoryStorage.clear();
      }
      return true;
    }
    
    // Get the items to preserve before clearing
    let authData = null;
    let userProfile = null;
    
    if (preserveAuth) {
      try {
        const authItem = localStorage.getItem('auth');
        if (authItem) authData = authItem;
        
        const profileItem = localStorage.getItem('userProfile');
        if (profileItem) userProfile = profileItem;
      } catch (e) {
        console.warn('Failed to preserve auth data during cleanup', e);
      }
    }
    
    // Clear everything
    localStorage.clear();
    
    // Restore preserved items
    if (preserveAuth) {
      if (authData) localStorage.setItem('auth', authData);
      if (userProfile) localStorage.setItem('userProfile', userProfile);
    }
    
    return true;
  } catch (e) {
    console.error('Error during localStorage cleanup:', e);
    
    // Last resort - try to clear everything if cleanup fails
    try {
      localStorage.clear();
    } catch (clearError) {
      console.error('Critical: Failed to clear localStorage:', clearError);
    }
    
    return false;
  }
};

/**
 * Get all localStorage keys
 * @returns {string[]} Array of keys
 */
export const getAllKeys = () => {
  try {
    if (!isLocalStorageAvailable()) {
      return Array.from(memoryStorage.keys());
    }
    
    return Object.keys(localStorage);
  } catch (e) {
    console.error('Error getting localStorage keys', e);
    return [];
  }
};

export default {
  getItem,
  setItem,
  removeItem,
  clearAll,
  cleanupLocalStorage,
  resetAllLocalStorage,
  isAvailable: isLocalStorageAvailable
};
EOL
    echo -e "${GREEN}Created localStorage.js utility file${NC}"
  else
    echo -e "${GREEN}localStorage.js exists${NC}"
  fi
}

# Check for port conflicts
check_port_conflicts() {
  echo -e "${BLUE}Checking for port conflicts...${NC}"
  
  local frontend_port=5173
  local backend_port=3005
  
  if check_port $frontend_port; then
    echo -e "${YELLOW}Warning: Port $frontend_port is already in use${NC}"
  else
    echo -e "${GREEN}Frontend port $frontend_port is available${NC}"
  fi
  
  if check_port $backend_port; then
    echo -e "${YELLOW}Warning: Port $backend_port is already in use${NC}"
  else
    echo -e "${GREEN}Backend port $backend_port is available${NC}"
  fi
}

# Start the backend server
start_backend() {
  echo -e "${BLUE}Starting backend server...${NC}"
  cd server
  npm run dev > ../logs/backend.log 2>&1 &
  echo $! > ../logs/backend.pid
  cd ..
  echo -e "${GREEN}Backend server started (PID: $(cat logs/backend.pid))${NC}"
  echo -e "${GREEN}Backend logs available at: logs/backend.log${NC}"
  
  # Wait for backend to start
  echo -e "${BLUE}Waiting for backend to initialize...${NC}"
  sleep 3
}

# Start the frontend server
start_frontend() {
  echo -e "${BLUE}Starting frontend server...${NC}"
  npm run dev > logs/frontend.log 2>&1 &
  echo $! > logs/frontend.pid
  echo -e "${GREEN}Frontend server started (PID: $(cat logs/frontend.pid))${NC}"
  echo -e "${GREEN}Frontend logs available at: logs/frontend.log${NC}"
  
  # Wait for frontend to start
  echo -e "${BLUE}Waiting for frontend to initialize...${NC}"
  sleep 3
}

# Main execution flow
main() {
  # Step 1: Kill all running processes
  kill_all_processes
  
  # Step 2: Check for critical files
  check_files
  
  # Step 3: Check for port conflicts
  check_port_conflicts
  
  # Step 4: Start backend server
  start_backend
  
  # Step 5: Start frontend server
  start_frontend
  
  # Step 6: Report status
  echo -e "${GREEN}Both servers should now be running:${NC}"
  echo -e "${GREEN}Frontend: http://localhost:5173${NC}"
  echo -e "${GREEN}Backend: http://localhost:3005${NC}"
  echo -e "${BLUE}If you encounter any issues, check the log files in the logs directory.${NC}"
}

# Run the script
main 