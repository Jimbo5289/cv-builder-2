#!/bin/bash

# Script for starting the service on Render.com
echo "====================================================="
echo "STARTING CV BUILDER SERVER ON RENDER"
echo "====================================================="

# Print current directory and Node version
echo "Current directory: $(pwd)"
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# Set PORT back to what was working
export PORT=3005

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
echo "DEPLOYING DATABASE MIGRATIONS"
echo "==================================================="

# Deploy any pending migrations to production database
echo "Running database migrations..."
npx prisma migrate deploy
echo "Database migrations completed"

echo "==================================================="
echo "GENERATING PRISMA CLIENT"
echo "==================================================="

# Generate Prisma client to ensure it's available
echo "Running Prisma client generation..."
npx prisma generate
echo "Prisma client generation completed"

echo "==================================================="
echo "STARTING SERVER"
echo "==================================================="

# Start the server
node src/index.js 