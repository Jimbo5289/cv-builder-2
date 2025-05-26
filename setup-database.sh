#!/bin/bash

# CV Builder Database Setup Script
echo "===== CV Builder Database Setup ====="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Docker not found. Please install Docker Desktop from https://www.docker.com/products/docker-desktop/"
    echo "After installing Docker Desktop, run this script again."
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "Docker is not running. Please start Docker Desktop and run this script again."
    exit 1
fi

# Create environment file if it doesn't exist
ENV_FILE="server/.env"
if [ ! -f "$ENV_FILE" ]; then
    echo "Creating .env file in server directory..."
    cat > "$ENV_FILE" << EOL
# Database Configuration
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
FRONTEND_URL=http://localhost:5173

# Stripe Settings (Mock for development)
STRIPE_PUBLISHABLE_KEY=pk_test_mock_key
STRIPE_SECRET_KEY=sk_test_mock_key
STRIPE_PRICE_MONTHLY=price_monthly
STRIPE_PRICE_ANNUAL=price_annual
CORS_ALLOW_ORIGIN=*
EOL
    echo ".env file created successfully."
else
    echo ".env file already exists."
fi

# Start Docker containers
echo "Starting PostgreSQL and pgAdmin containers..."
docker-compose up -d

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to start..."
sleep 10

# Set up database schema using Prisma
echo "Setting up database schema with Prisma..."
cd server
npx prisma generate
npx prisma migrate dev --name initial-migration

# Initialize the database with seed data
echo "Initializing database with seed data..."
node src/scripts/db-init.js

echo "===== Database Setup Complete ====="
echo "PostgreSQL is running on localhost:5432"
echo "pgAdmin is available at http://localhost:5050"
echo "Login to pgAdmin with:"
echo "  Email: admin@example.com"
echo "  Password: admin" 