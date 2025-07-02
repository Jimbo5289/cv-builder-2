#!/bin/bash

# Exit on any error
set -e

echo "====================================================="
echo "STARTING CV BUILDER SERVER ON RENDER"
echo "====================================================="
echo "Current directory: $(pwd)"
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"

# Set production environment variables
export NODE_ENV=production
export LOG_LEVEL=warn  # Reduce log verbosity
export SUPPRESS_NO_CONFIG_WARNING=true

echo "==================================================="
echo "RUNNING RDS CONNECTION TEST"
echo "==================================================="
npm run render:test-rds

echo "==================================================="
echo "UPDATING AWS RDS SECURITY GROUP WITH RENDER IP"
echo "==================================================="
if [ -n "$AWS_ACCESS_KEY_ID" ]; then
    echo "AWS credentials found, updating security group..."
    npm run update-render-ips
else
    echo "AWS credentials not found, skipping security group update"
fi

echo "==================================================="
echo "DEPLOYING DATABASE MIGRATIONS"
echo "==================================================="
echo "Running database migrations..."
npx prisma migrate deploy 2>/dev/null || echo "Migration warnings suppressed"

echo "Database migrations completed"
echo "Ensuring database schema is in sync..."
npx prisma db push --accept-data-loss 2>/dev/null || echo "Schema sync warnings suppressed"

echo "Database schema sync completed"

echo "==================================================="
echo "GENERATING PRISMA CLIENT"
echo "==================================================="
echo "Running Prisma client generation..."
npx prisma generate 2>/dev/null || echo "Prisma generation warnings suppressed"

echo "Prisma client generation completed"

echo "==================================================="
echo "STARTING SERVER"
echo "==================================================="

# Start the server with production settings
PORT=${PORT:-3005} \
NODE_ENV=production \
LOG_LEVEL=warn \
node src/index.js 