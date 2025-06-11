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

// Set DATABASE_URL if not already set
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'postgresql://postgres:reqvip-ciftag-2Qizgo@cvbuilder-db.c1augguy6rx8.eu-central-1.rds.amazonaws.com:5432/cvbuilder-db?sslmode=require';
  console.log('[info] : Setting DATABASE_URL from pre-start script');
}

// If using AWS RDS, ensure we're not using mock database
if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('amazonaws.com')) {
  console.log('[info] : AWS RDS database detected, disabling mock database');
  process.env.MOCK_DATABASE = 'false';
} else {
  // No valid database URL, enable mock database
  console.log('[info] : No valid DATABASE_URL found, enabling mock database');
  process.env.MOCK_DATABASE = 'true';
  
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