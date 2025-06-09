# Port Management Solution

This document explains the port management solution implemented in this project to prevent conflicts between multiple instances of the frontend and backend servers.

## Problem

The development environment faced several issues:

1. Multiple instances of the Vite development server trying to use the same ports (5173, 5174, etc.)
2. Multiple instances of the backend server trying to use the same ports (3005, 3006, etc.)
3. Zombie processes holding onto ports without properly releasing them
4. No coordination between frontend and backend servers regarding port usage

## Solution

We've implemented a centralized port management system that:

1. Tracks which ports are currently in use
2. Assigns consistent ports to services
3. Properly releases ports when services shut down
4. Prevents conflicts by using a coordination mechanism

## Implementation Details

### Core Components

1. **Port Manager (`scripts/port-manager.js`)**:
   - Central utility that manages port assignments
   - Tracks which ports are in use via a configuration file
   - Provides methods to acquire and release ports

2. **Unified Development Starter (`start-dev.js`)**:
   - Coordinates starting both frontend and backend servers
   - Ensures proper port assignment and cleanup
   - Handles process termination signals

3. **Backend Port Usage (`server/src/index.js`)**:
   - Modified to use the port provided by the environment variable
   - Simplified port management logic to rely on the port manager

### How It Works

1. When you run `npm run dev`:
   - The script first kills any potentially conflicting processes
   - It then starts both frontend and backend servers with coordinated port assignments
   - Each server is given a unique, available port
   - Port assignments are saved to `.port-config.json`

2. When you stop the servers:
   - Ports are properly released in the configuration
   - All child processes are terminated
   - Temporary files are cleaned up

## Usage

### Starting the Development Environment

```bash
npm run dev
```

This will start both the frontend and backend servers with proper port management.

### Killing Stuck Processes

If you encounter issues with ports still being in use:

```bash
npm run server:kill
```

This will forcefully terminate all processes using the development ports.

### Running Only Frontend or Backend

The original scripts are still available:

```bash
# Frontend only
npm run dev:vite

# Backend only (from the server directory)
cd server && npm run dev
```

However, these don't use the coordinated port management system.

## Troubleshooting

If you experience port conflicts:

1. Run `npm run server:kill` to kill all processes using development ports
2. Delete `.port-config.json` if it exists to reset port assignments
3. Restart with `npm run dev`

## Extending

To add more services to the port management system:

1. Add the service to the `DEFAULT_PORTS` object in `scripts/port-manager.js`
2. Update the start script to include the new service 