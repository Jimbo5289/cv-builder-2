#!/bin/bash

echo "Running CV Builder Database Migration"
echo "===================================="

# Navigate to server directory
cd "$(dirname "$0")"

# Check if prisma is installed
if ! command -v npx &> /dev/null; then
    echo "Error: npx is not installed. Please install Node.js and npm."
    exit 1
fi

# Run migration
echo "Applying database migrations..."
npx prisma migrate deploy

# Generate prisma client
echo "Generating Prisma client..."
npx prisma generate

echo ""
echo "Migration completed successfully!"
echo "You may need to restart your server for changes to take effect." 