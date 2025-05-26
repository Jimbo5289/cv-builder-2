#!/bin/bash

echo "===== CV Builder Database Setup ====="

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "Docker is not running. Please start Docker Desktop and run this script again."
    exit 1
fi

# Start Docker containers
echo "Starting PostgreSQL and pgAdmin containers..."
docker-compose up -d

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to start (10 seconds)..."
sleep 10

# Navigate to server directory
cd server

# Update .env for proper database connection
echo "Setting up database configuration..."
echo "# Database Configuration
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/cv_builder

# Server Configuration
NODE_ENV=development
PORT=3005

# JWT Auth
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRY=1d
JWT_REFRESH_SECRET=your_refresh_secret_key_here
JWT_REFRESH_EXPIRY=7d

# Admin User
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123

# Development Settings
SKIP_AUTH_CHECK=true
MOCK_SUBSCRIPTION_DATA=true
MOCK_DATABASE=false
FRONTEND_URL=http://localhost:5173

# Stripe Settings (Mock for development)
STRIPE_PUBLISHABLE_KEY=pk_test_mock_key
STRIPE_SECRET_KEY=sk_test_mock_key
STRIPE_PRICE_MONTHLY=price_monthly
STRIPE_PRICE_ANNUAL=price_annual
CORS_ALLOW_ORIGIN=*" > .env

# Set up database schema using Prisma
echo "Setting up database schema with Prisma..."
npx prisma generate
npx prisma migrate dev --name initial-setup

# Initialize the database with seed data
echo "Initializing database with seed data..."
node src/scripts/db-init.js

echo "===== Database Setup Complete ====="
echo "PostgreSQL is running on localhost:5432"
echo "pgAdmin is available at http://localhost:5050"
echo "Login to pgAdmin with:"
echo "  Email: admin@example.com"
echo "  Password: admin" 

echo ""
echo "To start the application, run:"
echo "node start-reliable.js" 