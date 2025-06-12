#!/bin/bash

# This script is designed to work with Render's server/ $ prefix
# It runs diagnostics and then starts the server

cd "$(dirname "$0")" # Move to the directory where this script is located

echo "Running AWS RDS connection diagnostics..."
node debug-rds.js

echo "Starting server..."
npm run render:direct 