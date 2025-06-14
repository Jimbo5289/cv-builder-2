#!/bin/bash

# Script for starting the service on Render.com
echo "====================================================="
echo "STARTING CV BUILDER SERVER ON RENDER"
echo "====================================================="

# Print current directory and Node version
echo "Current directory: $(pwd)"
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# Let Render set the PORT - don't override it
echo "Using PORT from Render environment: $PORT"

echo "==================================================="
echo "RUNNING RDS CONNECTION TEST"
echo "==================================================="

# Run the RDS connection test first
npm run render:test-rds

echo "==================================================="
echo "UPDATING AWS RDS SECURITY GROUP WITH RENDER IP"
echo "==================================================="

# Run the IP update script if AWS credentials are available
if [ -n "$AWS_ACCESS_KEY_ID" ] && [ -n "$AWS_SECRET_ACCESS_KEY" ] && [ -n "$AWS_RDS_SECURITY_GROUP_ID" ]; then
  echo "AWS credentials found, updating security group..."
  npm run update-render-ips
else
  echo "AWS credentials not set, skipping security group update."
  echo "Make sure you've added the current Render IP to your AWS RDS security group."
fi

echo "==================================================="
echo "STARTING SERVER"
echo "==================================================="

# Start the server
node src/index.js 