#!/bin/bash

# Script for starting the service on Render.com

echo "Starting CV Builder server on Render..."
echo "Current directory: $(pwd)"
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# Print environment information (masked)
echo "Environment variables:"
echo "DATABASE_URL: [masked]"
echo "PORT: $PORT"

# Run the RDS connection test first
echo "Running RDS connection test..."
npm run render:test-rds

# Debug port bindings
echo "Checking port binding..."
npm run debug:port

# Start the server
echo "Starting server with: npm run render:direct"
npm run render:direct 