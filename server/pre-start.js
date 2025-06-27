/**
 * Pre-start script for the CV Builder server
 * This script ensures all required environment variables are set before the server starts.
 */

// Ensure we have the required environment variables
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
process.env.PORT = process.env.PORT || '3005';
console.log('[info] : Using PORT:', process.env.PORT);

// Validate JWT secrets - require them to be set properly
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.includes('secure_jwt_secret_for_production')) {
  console.warn('[warning] : JWT_SECRET not properly set - using fallback (NOT for production)');
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'secure_jwt_secret_for_production';
}

if (!process.env.JWT_REFRESH_SECRET || process.env.JWT_REFRESH_SECRET.includes('secure_refresh_token_secret_for_production')) {
  console.warn('[warning] : JWT_REFRESH_SECRET not properly set - using fallback (NOT for production)');
  process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'secure_refresh_token_secret_for_production';
}

process.env.FRONTEND_URL = process.env.FRONTEND_URL || 'https://cv-builder-2-git-main-jimbo5289s-projects.vercel.app';

// Check if DATABASE_URL is properly configured
if (!process.env.DATABASE_URL) {
  console.warn('[warning] : DATABASE_URL not set in environment variables');
  console.warn('[warning] : Please set DATABASE_URL environment variable for production database access');
  console.warn('[warning] : Falling back to mock database mode');
  process.env.MOCK_DATABASE = 'true';
} else {
  // Validate that DATABASE_URL doesn't contain placeholder values
  if (process.env.DATABASE_URL.includes('password') || process.env.DATABASE_URL.includes('localhost')) {
    console.warn('[warning] : DATABASE_URL appears to contain placeholder values');
    console.warn('[warning] : Please ensure DATABASE_URL is properly configured');
  }
  
  // If using AWS RDS, ensure we have proper configuration
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('amazonaws.com')) {
    console.log('[info] : AWS RDS database detected');
    process.env.MOCK_DATABASE = 'false';
    
    // Disable mock database fallback - we want to fix the real issue
    process.env.ALLOW_MOCK_DB_FALLBACK = 'false';
    
    // Log the database connection info (with masked password for security)
    const dbUrl = process.env.DATABASE_URL;
    const maskedUrl = dbUrl.replace(/\/\/([^:]+):([^@]+)@/, '//[username]:[MASKED]@');
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
      console.log('[info] : Please check that security groups allow connections from Render IP ranges');
      
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
    console.log('[info] : Non-AWS database detected');
    process.env.MOCK_DATABASE = 'false';
  }
}

// Handle fallback to mock database if no valid DATABASE_URL
if (process.env.MOCK_DATABASE === 'true') {
  console.log('[info] : Using mock database mode - ensure DATABASE_URL is set for production');
  
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

// Security validation warnings
if (process.env.NODE_ENV === 'production') {
  const securityChecks = [];
  
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    securityChecks.push('JWT_SECRET should be at least 32 characters');
  }
  
  if (!process.env.JWT_REFRESH_SECRET || process.env.JWT_REFRESH_SECRET.length < 32) {
    securityChecks.push('JWT_REFRESH_SECRET should be at least 32 characters');
  }
  
  if (!process.env.DATABASE_URL || process.env.MOCK_DATABASE === 'true') {
    securityChecks.push('DATABASE_URL should be properly configured for production');
  }
  
  if (securityChecks.length > 0) {
    console.warn('[security] : Security recommendations:');
    securityChecks.forEach(check => console.warn(`  - ${check}`));
  }
}

// Start the actual server
console.log('[info] : Environment prepared, starting server...');
require('./src/index.js'); 