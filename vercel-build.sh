#!/bin/bash
set -e

echo "Starting Vercel build process..."

# Install dependencies
echo "Installing dependencies..."
npm install --production=false

# Clean previous build if exists
if [ -d "dist" ]; then
  echo "Cleaning existing dist directory..."
  rm -rf dist
fi

# Run the build
echo "Running build command..."
npm run build

# Verify the build output
echo "Verifying build output..."
if [ ! -d "dist" ]; then
  echo "Build failed to generate dist directory"
  exit 1
fi

# Create a verification file
echo "Build completed successfully at $(date)" > dist/vercel-build-verification.txt

echo "Build completed successfully!"
echo "Dist directory contents:"
ls -la dist

exit 0 