#!/bin/bash

# Script for starting the service on Render.com
echo "==================================================="
echo "STARTING CV BUILDER SERVER ON RENDER"
echo "==================================================="
echo "Current directory: $(pwd)"
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# First, run the RDS connection test
echo "==================================================="
echo "RUNNING RDS CONNECTION TEST"
echo "==================================================="
node test-rds-render.js

# Check if we should run in debug mode
if [ "$DEBUG" = "true" ]; then
  echo "==================================================="
  echo "STARTING IN DEBUG MODE"
  echo "==================================================="
  node debug-render.js
else
  # Start the server directly without using npm run render:direct
  # This ensures we bypass any issues with how Render interprets the command
  echo "==================================================="
  echo "STARTING SERVER DIRECTLY"
  echo "==================================================="
  PORT=$PORT node src/index.js
fi 