/**
 * Pre-start script for the CV Builder server
 * This script ensures all required environment variables are set before the server starts.
 */

// Ensure we have the required environment variables
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
process.env.PORT = process.env.PORT || '3005';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'secure_jwt_secret_for_production';
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'secure_refresh_token_secret_for_production';
process.env.FRONTEND_URL = process.env.FRONTEND_URL || 'https://cv-builder-2-git-main-jimbo5289s-projects.vercel.app';

// Check if we have a DATABASE_URL
if (process.env.DATABASE_URL) {
  console.log('[info] : DATABASE_URL found, will attempt to connect to PostgreSQL database');
  
  // If using AWS RDS, ensure we have SSL mode set
  if (process.env.DATABASE_URL.includes('amazonaws.com') && !process.env.DATABASE_URL.includes('sslmode=')) {
    console.log('[info] : AWS RDS detected, ensuring SSL mode is configured');
    // Don't modify the original environment variable as it might cause issues with Prisma
  } else {
    console.log('[info] : Using provided DATABASE_URL configuration');
  }
  
  // Disable mock database when we have a real database URL
  process.env.MOCK_DATABASE = 'false';
} else {
  // No database URL, enable mock database
  process.env.MOCK_DATABASE = 'true';
  console.log('[info] : No DATABASE_URL found, enabling mock database');
  
  // Ensure the mock database directory exists
  const fs = require('fs');
  const path = require('path');
  const dataDir = path.join(__dirname, 'src', 'data');
  if (!fs.existsSync(dataDir)) {
    console.log('[info] : Creating data directory for mock database');
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

// Start the actual server
console.log('[info] : Environment prepared, starting server...');
require('./src/index.js'); 