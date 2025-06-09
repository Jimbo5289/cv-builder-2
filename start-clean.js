/**
 * Enhanced Clean Start Script
 * This script kills all existing processes, cleans up resources, and starts the application
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Logging helper
function log(message) {
  console.log(message);
}

// Kill all processes on development ports
log('Killing all existing development processes...');
try {
  execSync('lsof -ti:3005-3010,5173-5190 | xargs kill -9 2>/dev/null || true');
} catch (error) {
  // Ignore errors if no processes were found
  }
  
// Check for .env file in server directory
const serverEnvPath = path.join(__dirname, 'server', '.env');
if (!fs.existsSync(serverEnvPath)) {
  log('Warning: No .env file found in server directory. Creating a basic one...');
    
  // Create a basic .env file with JWT secrets
  const envContent = `
PORT=3005
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
DATABASE_URL="file:./dev.db"
MOCK_DATABASE=true

# JWT Configuration
JWT_SECRET=bDf7uX2pQz9KvRn6JsEyMhT8c4wA5gL3
JWT_EXPIRY=1d
JWT_REFRESH_SECRET=y8vH5eA2jL7xF9pK3dR1qW6zB4mN0cS5
JWT_REFRESH_EXPIRY=7d

# Development User ID
DEV_USER_ID=cmbf77t3q00007oc968e068ws
  `;
  
  fs.writeFileSync(serverEnvPath, envContent.trim());
  log('Created basic .env file in server directory');
}

// Start backend server
log('Starting backend server...');
const backendProcess = spawn('npm', ['run', 'server:dev'], {
  stdio: 'inherit',
  shell: true
    });
    
// Give the backend a moment to start
setTimeout(() => {
  // Start frontend server
  log('Starting frontend server...');
  const frontendProcess = spawn('npm', ['run', 'frontend:dev'], {
    stdio: 'inherit',
    shell: true
  });

  log('✅ Development environment is running!');
  log('Frontend: http://localhost:5173');
  log('Backend: http://localhost:3005');
  log('Press Ctrl+C to stop all servers');
    
  // Handle process exit
    process.on('SIGINT', () => {
    log('Shutting down development environment...');
    backendProcess.kill();
    frontendProcess.kill();
    
    // Additional cleanup
    try {
      execSync('lsof -ti:3005-3010,5173-5190 | xargs kill -9 2>/dev/null || true');
    } catch (error) {
      // Ignore errors
    }
    
    log('Development environment shut down');
        process.exit(0);
  });
}, 2000);

// Handle backend process exit
backendProcess.on('exit', (code) => {
  log(`Backend process exited with code ${code}`);
  process.exit(code);
}); 