# Server Reliability Improvements

This document outlines the improvements made to enhance the reliability of the CV Builder application's server connections and provides guidance on how to use the new server management tools.

## The Problem

The application was experiencing connection issues between the frontend and backend, primarily due to:

1. Multiple server instances running simultaneously
2. Port conflicts causing connection failures
3. No proper tracking of active server instances
4. No automatic reconnection logic in the frontend
5. Inadequate error handling for server connection issues

## Solutions Implemented

### 1. Enhanced Server Context

The `ServerContext` has been redesigned to:

- Automatically try multiple ports (3005-3009) to find the active server
- Handle reconnection attempts with exponential backoff
- Provide detailed status information (connected, disconnected, reconnecting)
- Keep track of the last successful connection time
- Support manual retries initiated by the user
- Expose connection errors for better feedback

### 2. Improved Server Port Management

The backend server now has more sophisticated port handling:

- Better detection of available ports
- More robust shutdown procedures to properly release ports
- Prevention of multiple shutdown attempts causing race conditions
- Proper handling of uncaught exceptions during startup and shutdown

### 3. Visual Server Status Indicator

The `ServerStatusIndicator` component has been enhanced to:

- Display the current connection status visually
- Show the active server port
- Provide a retry button for manual reconnection
- Display detailed connection information on hover
- Update in real-time based on the server status

### 4. Server Management Scripts

Several scripts have been created to help manage the server:

- `start-clean.sh`: Ensures a clean server start by killing existing processes
- `server-modes.sh`: Provides multiple server startup modes through a menu
- `check-server.js`: Utility to check server status on multiple ports

### 5. NPM Scripts

New npm scripts have been added for convenience:

- `npm run start`: Launch the server modes menu
- `npm run start:dev`: Start in development mode (mock data + auth bypass)
- `npm run start:mock`: Start with mock data only
- `npm run start:auth`: Start with auth bypass only
- `npm run server:check`: Check server status
- `npm run server:kill`: Kill all server processes
- `npm run dev:clean`: Start servers after cleaning up existing processes

## Usage Guide

### Starting the Application

You have several options to start the application:

#### Interactive Menu

```bash
npm run start
```

This will display a menu with various startup options:

1. Standard mode (normal operation)
2. Development mode (mock data + auth bypass)
3. Mock data mode (real auth)
4. Auth bypass mode (real data)
5. Backend only (standard)
6. Backend only (development mode)
7. Frontend only
0. Kill all servers and exit

#### Direct Commands

```bash
# For development mode (recommended for testing)
npm run start:dev

# For mock data mode
npm run start:mock

# For auth bypass mode
npm run start:auth

# For a clean start
npm run dev:clean
```

### Checking Server Status

To check which ports the server is running on:

```bash
npm run server:check
```

### Killing All Servers

To stop all running server instances:

```bash
npm run server:kill
```

## Troubleshooting

If you experience connection issues:

1. Check the server status indicator in the bottom-right corner of the application
2. Try clicking the "Retry" button to manually attempt reconnection
3. If that fails, run `npm run server:kill` to stop all servers
4. Then start again with `npm run start:dev`
5. If issues persist, check if any processes are still using the ports:
   ```
   lsof -i :3005-3009,5173-5177
   ```

## Technical Details

### Port Selection

The application tries to connect to the following ports in order:
- Backend: 3005, 3006, 3007, 3008, 3009
- Frontend: 5173, 5174, 5175, 5176, 5177

### Environment Variables

The following environment variables can be used to modify server behavior:

- `MOCK_SUBSCRIPTION_DATA=true`: Use mock subscription data
- `SKIP_AUTH_CHECK=true`: Bypass authentication checks

### Reconnection Logic

The frontend uses the following reconnection strategy:
- When disconnected, attempts reconnection with exponential backoff
- Initial retry after 2 seconds
- Each subsequent retry doubles the wait time (2s, 4s, 8s, etc.)
- Maximum backoff time capped at 10 seconds
- Resets backoff timer on successful connection

## Future Improvements

Potential future enhancements could include:

1. Persistent storage of the last known working port
2. Health monitoring dashboard for server status
3. Notification system for server events
4. Automatic server recovery for critical failures
5. Full offline mode with local storage synchronization 