#!/bin/bash

echo "🧹 CV Builder - Clean Environment and Start"
echo "==========================================="

# Function to check for port availability
check_port() {
  PORT=$1
  lsof -i:$PORT >/dev/null 2>&1
  if [ $? -eq 0 ]; then
    echo "❌ Port $PORT is still in use after cleanup."
    echo "   Run this command to see what's using it: lsof -i:$PORT"
    return 1
  else
    echo "✅ Port $PORT is available"
    return 0
  fi
}

# Step 1: Kill all processes
echo "⏱️  Step 1/5: Stopping all processes..."
# Stop processes by port
for PORT in 3005 3006 3007 3008 3009 5173 5174 5175 5176 5177 5178 5179 5180 5181 5182; do
  PIDS=$(lsof -ti:$PORT 2>/dev/null)
  if [ ! -z "$PIDS" ]; then
    echo "   Stopping processes on port $PORT: $PIDS"
    kill -15 $PIDS 2>/dev/null || true
    sleep 1
    kill -9 $PIDS 2>/dev/null || true
  fi
done

# Stop processes by name
echo "   Stopping processes by name..."
pkill -f "node src/index.js" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true
pkill -f "nodemon" 2>/dev/null || true
pkill -f "npm run dev" 2>/dev/null || true

# Remove PID files if they exist
rm -f logs/backend.pid 2>/dev/null || true
rm -f logs/frontend.pid 2>/dev/null || true

echo "✅ Process cleanup complete"

# Step 2: Verify port availability
echo "⏱️  Step 2/5: Verifying port availability..."
sleep 2 # Give OS time to release ports

# Check primary ports
PRIMARY_PORTS_OK=true
check_port 3005 || PRIMARY_PORTS_OK=false
check_port 5173 || PRIMARY_PORTS_OK=false

if [ "$PRIMARY_PORTS_OK" = false ]; then
  echo "⚠️  Warning: Primary ports are still in use. Continuing anyway, but the app may use alternative ports."
fi

# Step 3: Verify file integrity
echo "⏱️  Step 3/5: Verifying file integrity..."

# Check for localStorage.js
if [ ! -f "src/utils/localStorage.js" ]; then
  echo "❌ Missing src/utils/localStorage.js file."
  echo "   Creating default version..."
  
  mkdir -p src/utils
  cat > src/utils/localStorage.js << 'EOL'
/**
 * Utility functions for localStorage management
 */

/**
 * Clean up potentially corrupt localStorage data
 * @param {boolean} preserveAuth - Whether to preserve authentication data
 */
export const cleanupLocalStorage = (preserveAuth = false) => {
  try {
    // Keys that should be preserved if preserveAuth is true
    const authKeys = ['token', 'user', 'auth', 'session'];
    
    // Store auth items temporarily if needed
    const preservedItems = {};
    
    if (preserveAuth) {
      for (const key of authKeys) {
        try {
          const value = localStorage.getItem(key);
          if (value) {
            preservedItems[key] = value;
          }
        } catch (e) {
          console.error(`Error preserving ${key}:`, e);
        }
      }
    }
    
    // Clear localStorage
    localStorage.clear();
    
    // Restore preserved items
    if (preserveAuth) {
      for (const [key, value] of Object.entries(preservedItems)) {
        try {
          localStorage.setItem(key, value);
        } catch (e) {
          console.error(`Error restoring ${key}:`, e);
        }
      }
    }
    
    console.log('localStorage cleaned up successfully');
    return true;
  } catch (e) {
    console.error('Error cleaning up localStorage:', e);
    return false;
  }
};

/**
 * Reset all localStorage data
 */
export const resetAllLocalStorage = () => {
  try {
    localStorage.clear();
    console.log('All localStorage data cleared successfully');
    return true;
  } catch (e) {
    console.error('Error clearing localStorage:', e);
    return false;
  }
};

/**
 * Get an item from localStorage with error handling
 * @param {string} key - The key to retrieve
 * @param {any} defaultValue - Default value if key doesn't exist or on error
 * @returns {any} The parsed value or defaultValue
 */
export const getItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    
    try {
      return JSON.parse(item);
    } catch (e) {
      // If not valid JSON, return as string
      return item;
    }
  } catch (e) {
    console.error(`Error getting item ${key} from localStorage:`, e);
    return defaultValue;
  }
};

/**
 * Set an item in localStorage with error handling
 * @param {string} key - The key to set
 * @param {any} value - The value to store (will be JSON stringified)
 * @returns {boolean} Success status
 */
export const setItem = (key, value) => {
  try {
    const stringValue = typeof value === 'string' 
      ? value 
      : JSON.stringify(value);
    
    localStorage.setItem(key, stringValue);
    return true;
  } catch (e) {
    console.error(`Error setting item ${key} in localStorage:`, e);
    return false;
  }
};

/**
 * Remove an item from localStorage with error handling
 * @param {string} key - The key to remove
 * @returns {boolean} Success status
 */
export const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (e) {
    console.error(`Error removing item ${key} from localStorage:`, e);
    return false;
  }
};

/**
 * Check if localStorage is available
 * @returns {boolean} Whether localStorage is available
 */
export const isAvailable = () => {
  try {
    const testKey = '__test__';
    localStorage.setItem(testKey, testKey);
    const result = localStorage.getItem(testKey) === testKey;
    localStorage.removeItem(testKey);
    return result;
  } catch (e) {
    return false;
  }
};
EOL
  echo "✅ Created localStorage.js file"
fi

# Fix ESLint config
if grep -q "jsx: true," eslint.config.js; then
  echo "⚠️  Found invalid 'jsx: true' property in eslint.config.js"
  echo "   Fixing the ESLint configuration..."
  sed -i '' 's/jsx: true,//' eslint.config.js
  echo "✅ ESLint configuration fixed"
else
  echo "✅ ESLint configuration looks good"
fi

echo "✅ File integrity check complete"

# Step 4: Start the backend
echo "⏱️  Step 4/5: Starting backend server..."
cd server || { echo "❌ Server directory not found!"; exit 1; }

# Create logs directory if it doesn't exist
mkdir -p ../logs

# Start backend with environment variables for testing
echo "   Starting backend server on port 3005..."
MOCK_SUBSCRIPTION_DATA=true SKIP_AUTH_CHECK=true PORT=3005 node src/index.js > ../logs/backend.log 2>&1 & 
echo $! > ../logs/backend.pid
cd ..

# Give the backend time to start
echo "   Waiting for backend to initialize..."
sleep 5

# Check if backend started successfully
if ps -p $(cat logs/backend.pid 2>/dev/null) > /dev/null; then
  echo "✅ Backend server started successfully"
else
  echo "❌ Backend server failed to start. Check logs/backend.log for details."
  echo "   You may need to restart this script."
fi

# Step 5: Start the frontend
echo "⏱️  Step 5/5: Starting frontend server..."
echo "   Starting frontend server on port 5173..."
VITE_DEV_MODE=true VITE_MOCK_SUBSCRIPTION_DATA=true npm run dev -- --port 5173 --host localhost --force > logs/frontend.log 2>&1 &
echo $! > logs/frontend.pid

# Give the frontend time to start
echo "   Waiting for frontend to initialize..."
sleep 5

# Check if frontend started successfully
if ps -p $(cat logs/frontend.pid 2>/dev/null) > /dev/null; then
  echo "✅ Frontend server started successfully"
else
  echo "❌ Frontend server failed to start. Check logs/frontend.log for details."
  echo "   You may need to restart this script."
fi

# Final message
echo ""
echo "✨ CV Builder should now be running!"
echo "==============================================="
echo "🔗 Backend: http://localhost:3005"
echo "🔗 Frontend: http://localhost:5173"
echo ""
echo "📊 Logs are available in the logs directory:"
echo "   - logs/backend.log"
echo "   - logs/frontend.log"
echo ""
echo "⚙️  To stop the servers, run: ./stop-servers.sh"
echo "   Or restart with this script: ./clean-and-start.sh"
echo ""
echo "💡 If you encounter any issues, check the log files"
echo "   and try running the script again."
echo "" 