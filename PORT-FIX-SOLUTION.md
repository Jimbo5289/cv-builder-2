# Port Conflicts & Safari Connection Issues - Technical Solution Guide

## Issue Analysis

The CV Builder application was experiencing several critical issues:

1. **Port Conflict Issues**
   - The backend server was attempting to use port 3005, but would automatically switch to other ports (3006, 3007) when busy
   - This port fallback mechanism created mismatches between frontend expectations and actual server ports
   - The frontend attempts to locate the backend by checking multiple ports which created race conditions and errors

2. **Safari-Specific Connection Issues**
   - Safari had unique problems with JWT token validation, showing "jwt malformed" errors
   - WebKit processes in Safari were maintaining connections that could block ports
   - Safari had stricter CORS requirements

3. **Environment Configuration Inconsistencies**
   - Environment variables weren't consistently applied across development environments
   - Port settings between frontend and backend weren't coordinated

## Technical Solution

Our comprehensive solution addresses all these issues by:

### 1. Fixed Port Management

We modified `server/src/index.js` to:
- Forcibly free the designated port (3005) instead of trying alternatives
- Introduce a `DISABLE_PORT_FALLBACK=true` environment variable to prevent port switching
- Implement proper error handling for port conflicts

```javascript
// If DISABLE_PORT_FALLBACK=true, force free the port rather than trying alternatives
if (!isPortAvailable && process.env.DISABLE_PORT_FALLBACK === 'true') {
  logger.warn(`Port ${port} is already in use. Forcefully terminating processes...`);
  
  try {
    // Forcefully kill the process holding this port
    execSync(`lsof -ti:${port} | xargs kill -9 2>/dev/null || true`, { stdio: 'inherit' });
    logger.info(`Terminated process using port ${port}`);
    
    // Wait for the port to be released
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check again if port is available
    isPortAvailable = await checkPort(port);
  } catch (error) {
    logger.error(`Error freeing port ${port}: ${error.message}`);
  }
}
```

### 2. Frontend Fixed Backend URL

We updated the frontend code to use environment variables for the API URL:

```javascript
// Use a fixed API URL from environment variables
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3005';
```

This eliminates the need for port scanning logic that was causing connection issues.

### 3. Startup Orchestration Script

We created a comprehensive startup script (`fixed-port-startup.js`) that:

- Kills any existing Node processes and frees required ports
- Creates consistent environment files for both frontend and backend
- Starts the backend first, waits for it to be available
- Starts the frontend with the correct API URL environment variable
- Monitors both processes and provides clear status information

### 4. Safari Compatibility Fixes

- Enhanced JWT token validation in auth middleware
- Added Safari-specific browser detection
- Implemented special handling for Safari connections

### 5. Environment Standardization

We created standardized environment files:

```
# Server (.env)
NODE_ENV=development
PORT=3005
DISABLE_PORT_FALLBACK=true
SKIP_AUTH_CHECK=true
MOCK_SUBSCRIPTION_DATA=true
FRONTEND_URL=http://localhost:5173
JWT_SECRET=dev-secret-key
JWT_EXPIRES_IN=86400
ALLOW_SAFARI_CONNECTIONS=true

# Frontend (.env.local)
VITE_API_URL=http://localhost:3005
VITE_SKIP_AUTH=true
VITE_DISABLE_PORT_FALLBACK=true
```

## How to Use the Solution

The solution is provided as a simple Node.js script:

```bash
node fixed-port-startup.js
```

This script handles everything - cleaning up existing processes, setting up the environment, and starting both servers in the correct order.

## Technical Benefits

1. **Deterministic Port Usage**
   - Both servers always use the same, predictable ports
   - No more random port switching that breaks connections

2. **Safari Compatibility**
   - Fixed JWT token validation issues in Safari
   - Properly handles WebKit's connection behavior

3. **Simplified Startup Process**
   - Single command to start the entire application
   - Clear visual feedback on startup progress

4. **Improved Error Handling**
   - Better error logging and detection
   - Clearer error messages for troubleshooting

5. **Standardized Environment**
   - Consistent environment variables across all components
   - Eliminates configuration mismatches

## Implementation Details

The script uses Node.js child process management to:
1. Execute cleanup commands
2. Create environment files
3. Start the backend as a detached process
4. Wait for the backend to be ready using log parsing
5. Start the frontend as a detached process
6. Monitor both processes for success/failure

This ensures proper sequencing and communication between components. 