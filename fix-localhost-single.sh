#!/bin/bash

echo "🔧 CV Builder - Localhost Fix"
echo "============================"

# Kill all existing processes
echo "1️⃣ Killing existing processes..."
lsof -ti:3005,3006,3007,3008,3009,5173,5174,5175,5176,5177 | xargs kill -9 2>/dev/null || true
pkill -f "node src/index.js" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true
pkill -f "nodemon" 2>/dev/null || true
echo "✅ All existing processes killed"

# Wait for ports to be released
echo "⏳ Waiting for ports to be released..."
sleep 3

# Install express if missing
echo "2️⃣ Checking backend dependencies..."
cd server
if ! npm list express &>/dev/null; then
  echo "Installing express..."
  npm install express --save
fi
cd ..
echo "✅ Dependencies verified"

# Copy required files if they're missing
echo "3️⃣ Checking required files..."
if [ ! -d "src/context" ]; then
  echo "Creating context directory..."
  mkdir -p src/context
fi

if [ ! -f "src/context/ThemeContext.jsx" ]; then
  echo "Creating ThemeContext.jsx..."
  cat > src/context/ThemeContext.jsx << 'EOL'
import React, { createContext, useState, useEffect, useContext } from 'react';

// Define theme options
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto'
};

// Create the theme context
export const ThemeContext = createContext();

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

const ThemeProvider = ({ children }) => {
  // Initialize theme from localStorage or default to LIGHT
  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme || THEMES.LIGHT;
    } catch (e) {
      console.error('Error reading theme from localStorage:', e);
      return THEMES.LIGHT;
    }
  });

  // Function to change the theme
  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    try {
      localStorage.setItem('theme', newTheme);
    } catch (e) {
      console.error('Error saving theme to localStorage:', e);
    }
  };

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove(THEMES.LIGHT, THEMES.DARK);
    
    let effectiveTheme = theme;
    
    // Handle auto theme based on user's system preference
    if (theme === THEMES.AUTO) {
      effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? THEMES.DARK
        : THEMES.LIGHT;
    }
    
    root.classList.add(effectiveTheme);
    document.body.dataset.theme = effectiveTheme;
    
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
EOL
fi

if [ ! -d "src/utils" ]; then
  echo "Creating utils directory..."
  mkdir -p src/utils
fi

if [ ! -f "src/utils/errorHandler.js" ]; then
  echo "Creating errorHandler.js..."
  cat > src/utils/errorHandler.js << 'EOL'
/**
 * Error handler utilities for CV Builder application
 */

// Global error handler to prevent app crashes
export const setupErrorHandler = () => {
  // Capture unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', event.reason);
    // Prevent the default browser behavior which might show error dialogs
    event.preventDefault();
  });

  // Capture uncaught exceptions
  window.addEventListener('error', (event) => {
    console.error('Uncaught Exception:', event.error || event.message);
    // Prevent the default browser behavior which might show error dialogs
    event.preventDefault();
  });

  // Replace console.error to add custom handling if needed
  const originalConsoleError = console.error;
  console.error = (...args) => {
    // Log to original console.error
    originalConsoleError.apply(console, args);
  };
  
  console.log('Error handlers initialized successfully');
};

// Function to handle API errors
export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  // Determine appropriate error message
  let errorMessage = 'An unexpected error occurred. Please try again.';
  
  if (error.response) {
    // Server responded with an error status
    if (error.response.status === 401 || error.response.status === 403) {
      errorMessage = 'Authentication error. Please log in again.';
    } else if (error.response.status === 404) {
      errorMessage = 'The requested resource was not found.';
    } else if (error.response.status === 500) {
      errorMessage = 'Server error. Please try again later.';
    } else if (error.response.data && error.response.data.message) {
      // Use server-provided error message if available
      errorMessage = error.response.data.message;
    }
  } else if (error.request) {
    // Request was made but no response received
    errorMessage = 'No response from server. Please check your internet connection.';
  }
  
  return errorMessage;
};

// Function to log errors with additional context
export const logErrorWithContext = (error, context = {}) => {
  console.error('Error:', error, 'Context:', context);
};
EOL
fi
echo "✅ Required files verified"

# Start backend server in the background
echo "4️⃣ Starting backend server..."
cd server
MOCK_SUBSCRIPTION_DATA=true SKIP_AUTH_CHECK=true node src/index.js > backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "⏳ Waiting for backend to initialize..."
sleep 5

# Verify backend is running
if kill -0 $BACKEND_PID 2>/dev/null; then
  echo "✅ Backend server running on http://localhost:3005 (PID: $BACKEND_PID)"
else
  echo "❌ Backend server failed to start. Check server/backend.log for details."
  exit 1
fi

# Start vite directly with explicit host binding
echo "5️⃣ Starting frontend with localhost binding..."
echo "Opening browser when ready..."
VITE_DEV_MODE=true npx vite --host localhost --open

# The script will continue running with the Vite server in the foreground
# When the user terminates Vite with Ctrl+C, we'll clean up
echo "Shutting down backend server..."
kill $BACKEND_PID 2>/dev/null

echo "🏁 All servers stopped" 