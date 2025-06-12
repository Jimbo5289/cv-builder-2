/**
 * Pre-start script for the CV Builder server
 * This script ensures all required environment variables are set before the server starts.
 */

// Ensure we have the required environment variables
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
process.env.PORT = process.env.PORT || '3005';
console.log('[info] : Using PORT:', process.env.PORT);
process.env.JWT_SECRET = process.env.JWT_SECRET || 'secure_jwt_secret_for_production';
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'secure_refresh_token_secret_for_production';
process.env.FRONTEND_URL = process.env.FRONTEND_URL || 'https://cv-builder-2-git-main-jimbo5289s-projects.vercel.app';

// Set DATABASE_URL if not already set
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'postgresql://postgres:reqvip-ciftag-2Qizgo@cvbuilder-db.c1augguy6rx8.eu-central-1.rds.amazonaws.com:5432/cvbuilder-db?sslmode=require';
  console.log('[info] : Setting DATABASE_URL from pre-start script');
}

// If using AWS RDS, ensure we have proper configuration
if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('amazonaws.com')) {
  console.log('[info] : AWS RDS database detected');
  process.env.MOCK_DATABASE = 'false';
  
  // Disable mock database fallback - we want to fix the real issue
  process.env.ALLOW_MOCK_DB_FALLBACK = 'false';
  
  // Log the database connection info (with masked password)
  const dbUrl = process.env.DATABASE_URL;
  const maskedUrl = dbUrl.replace(/\/\/([^:]+):([^@]+)@/, '//[username]:[password]@');
  console.log('[info] : Using database URL:', maskedUrl);
  
  // Extract hostname from DATABASE_URL for IP lookup
  try {
    const urlMatch = dbUrl.match(/\/\/[^:]+:[^@]+@([^:]+):/);
    if (urlMatch && urlMatch[1]) {
      const hostname = urlMatch[1];
      console.log('[info] : Database hostname:', hostname);
    }
  } catch (err) {
    console.error('[error] : Failed to parse database URL:', err.message);
  }
  
  // If running on Render, provide more detailed connection info
  if (process.env.RENDER) {
    console.log('[info] : Running on Render - ensuring AWS RDS is accessible');
    console.log('[info] : Please check that security groups allow connections from Render IP: 52.59.103.54');
    console.log('[info] : And other Render IPs: 35.180.39.82, 35.181.114.243, 35.181.155.97');
    
    // Try to determine the current IP address
    try {
      const { execSync } = require('child_process');
      console.log('[info] : Attempting to determine outbound IP address...');
      
      const ipCommand = `curl -s https://api.ipify.org || curl -s https://ifconfig.me`;
      const ip = execSync(ipCommand).toString().trim();
      
      if (ip) {
        console.log('[info] : Current outbound IP address appears to be:', ip);
        console.log('[info] : Please add this IP to your AWS RDS security group if connection fails');
      }
    } catch (err) {
      console.error('[error] : Could not determine IP address:', err.message);
    }
  }
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

// Additional checks for Render deployment
console.log('[info] : Checking for Render deployment...');
if (process.env.RENDER) {
  console.log('[info] : Running on Render, ensuring correct port configuration');
  console.log('[info] : PORT environment variable is set to:', process.env.PORT);
}

// Start the actual server
console.log('[info] : Environment prepared, starting server...');
require('./src/index.js'); 