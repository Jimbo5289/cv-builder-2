# CV Builder Setup Guide

This document provides instructions for setting up and running the CV Builder application with improved reliability.

## Connection Issues Fixed

We've implemented several improvements to address connection issues between the frontend and backend:

1. **Server Status Indicator** - Visual indicator showing connection status in the bottom right corner
2. **Server Context** - A global context to manage server connections across the application
3. **Automatic Port Detection** - The app now automatically detects which port the server is running on
4. **Reliable Scripts** - New scripts to reliably start and stop the application

## Installation

First, install dependencies for both the frontend and backend:

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

## Running the Application

We've added several new ways to run the application with improved reliability:

### Option 1: All-in-One Reliable Script (Recommended)

This script kills any existing processes and starts both the frontend and backend:

```bash
npm run dev:reliable
```

Or directly:

```bash
./start-reliable.sh
```

### Option 2: Quick Development Mode with Mock Data

This starts both the backend (with mock data) and the frontend:

```bash
npm run dev:mock
```

**Note:** To stop both processes, you'll need to manually terminate them using Ctrl+C and possibly kill any lingering processes.

### Option 3: Run Frontend and Backend Separately

#### Start the backend with mock data:

```bash
npm run server:mock
```

#### Start the frontend (in a separate terminal):

```bash
npm run dev
```

### Option 4: Restart a Problematic Server

If the server is having issues, you can restart it using:

```bash
npm run server:restart
```

## Troubleshooting Connection Issues

If you experience connection issues:

1. Check the server status indicator in the bottom right corner of the application
2. If the status is "disconnected", click the "Retry" button
3. If that doesn't work, try restarting the server with `npm run server:restart`
4. For a complete restart, use `npm run dev:reliable`

## Development Notes

- The application now automatically detects which port the server is running on (3005-3009)
- Mock subscription data and auth bypass are enabled in development mode
- The server status indicator will automatically retry connections every 10 seconds

## Port Configuration

- Frontend: Default port 5173, will increment if busy (5174, 5175, etc.)
- Backend: Default port 3005, will increment if busy (3006, 3007, etc.)

## Environment Variables

For advanced configuration, you can set these environment variables:

- `MOCK_SUBSCRIPTION_DATA=true` - Use mock subscription data
- `SKIP_AUTH_CHECK=true` - Bypass authentication checks
- `PORT=3005` - Specify the server port manually

## Manual Process Management

If you need to manually kill processes on specific ports:

### macOS/Linux:
```bash
# Kill process on port 3005
lsof -ti:3005 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Windows:
```cmd
# Find process on port 3005
netstat -ano | findstr :3005

# Kill the process by PID (replace XXXX with the PID)
taskkill /F /PID XXXX
``` 