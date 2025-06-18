#!/bin/bash

# Production Render Startup Script
# This script runs the production server with Claude AI integration
echo "=====================================================
STARTING CV BUILDER PRODUCTION SERVER ON RENDER
====================================================="

# Print current directory and Node version
echo "Current directory: $(pwd)"
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# Navigate to production server directory
cd server-prod

echo "===================================================
RUNNING RDS CONNECTION TEST
==================================================="

# Run the RDS connection test first
npm run render:test-rds

echo "===================================================
UPDATING AWS RDS SECURITY GROUP WITH RENDER IP
==================================================="

# Run the IP update script if AWS credentials are available
if [ -n "$AWS_ACCESS_KEY_ID" ] && [ -n "$AWS_SECRET_ACCESS_KEY" ] && [ -n "$AWS_RDS_SECURITY_GROUP_ID" ]; then
  echo "AWS credentials found, updating security group..."
  npm run update-render-ips
else
  echo "AWS credentials not set, skipping security group update."
  echo "Make sure you've added the current Render IP to your AWS RDS security group."
fi

echo "===================================================
DEPLOYING DATABASE MIGRATIONS
==================================================="

# Deploy any pending migrations to production database
echo "Running database migrations..."
npx prisma migrate deploy
echo "Database migrations completed"

# Also ensure schema is in sync (important for database migration)
echo "Ensuring database schema is in sync..."
npx prisma db push --accept-data-loss --skip-generate
echo "Database schema sync completed"

echo "===================================================
GENERATING PRISMA CLIENT
==================================================="

# Generate Prisma client to ensure it's available
echo "Running Prisma client generation..."
npx prisma generate
echo "Prisma client generation completed"

echo "===================================================
STARTING PRODUCTION SERVER WITH CLAUDE AI INTEGRATION
==================================================="

# Start the production server with Claude integration
echo "Starting production server from server-prod directory..."
node src/index.js 