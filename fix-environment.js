#!/usr/bin/env node
/**
 * Script to fix environment configuration for the CV Builder application.
 * This script creates both server and client environment files with proper configuration.
 */

import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Fixing environment configuration for CV Builder...');

// Kill existing processes
try {
  console.log('Terminating existing processes...');
  execSync('pkill -f node || true');
  execSync('lsof -ti:3005,3006,3007,5173,5174,5175,5176,5177 | xargs kill -9 2>/dev/null || true');
  console.log('✅ All processes terminated');
} catch (err) {
  console.log('⚠️ Could not terminate all processes, continuing anyway');
}

// Create server environment file
console.log('Creating server environment file...');
const serverEnvContent = `NODE_ENV=development
PORT=3005
DISABLE_PORT_FALLBACK=true
SKIP_AUTH_CHECK=true
MOCK_SUBSCRIPTION_DATA=true
FRONTEND_URL=http://localhost:5173
JWT_SECRET=use-a-more-secure-secret-in-production
JWT_EXPIRES_IN=86400
ALLOW_SAFARI_CONNECTIONS=true
DEBUG_CORS=true

# Database configuration (default PostgreSQL)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/cvbuilder?schema=public"

# OpenAI API key for AI features
OPENAI_API_KEY=your_openai_api_key

# Mock mode settings
MOCK_DATABASE=true

# Email configuration
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=user@example.com
EMAIL_PASSWORD=your_email_password
EMAIL_FROM="CV Builder <noreply@example.com>"

# Stripe configuration for payments
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret
STRIPE_PRICE_MONTHLY=price_monthly_id
STRIPE_PRICE_ANNUAL=price_annual_id`;

try {
  writeFileSync(path.join(__dirname, 'server', '.env'), serverEnvContent);
  console.log('✅ Server environment file created');
} catch (err) {
  console.log('⚠️ Could not create server environment file', err.message);
}

// Create frontend environment file
console.log('Creating frontend environment file...');
const frontendEnvContent = `VITE_API_URL=http://localhost:3005
VITE_DEV_MODE=true
VITE_SKIP_AUTH=true`;

try {
  writeFileSync(path.join(__dirname, '.env.local'), frontendEnvContent);
  console.log('✅ Frontend environment file created');
} catch (err) {
  console.log('⚠️ Could not create frontend environment file', err.message);
}

// Create a development.env file
console.log('Creating development.env file...');
const developmentEnvContent = `# Development environment settings
NODE_ENV=development
MOCK_SUBSCRIPTION_DATA=true
MOCK_DATABASE=true
SKIP_AUTH_CHECK=true
STRIPE_PUBLISHABLE_KEY=pk_test_mock_key
STRIPE_SECRET_KEY=sk_test_mock_key
STRIPE_PRICE_MONTHLY=price_monthly
STRIPE_PRICE_ANNUAL=price_annual
FRONTEND_URL=http://localhost:5173`;

try {
  writeFileSync(path.join(__dirname, 'server', 'development.env'), developmentEnvContent);
  console.log('✅ Development environment file created');
} catch (err) {
  console.log('⚠️ Could not create development environment file', err.message);
}

// Make the script executable
try {
  execSync(`chmod +x "${__filename}"`);
  console.log('✅ Made script executable');
} catch (err) {
  console.log('⚠️ Could not make script executable', err.message);
}

// Create a test user creation script
console.log('Creating test user creation script...');
const testUserContent = `const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

// Initialize Prisma client
const prisma = new PrismaClient();

async function createTestUser() {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: 'test@example.com',
      },
    });

    if (existingUser) {
      console.log('Test user already exists:', existingUser.email);
      return existingUser;
    }

    // Create a user
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: hashedPassword,
        name: 'Test User',
      },
    });

    console.log(\`✅ Created test user: \${user.email}\`);
    
    return user;
  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
createTestUser();
`;

try {
  writeFileSync(path.join(__dirname, 'create-test-user.js'), testUserContent);
  console.log('✅ Test user creation script created');
} catch (err) {
  console.log('⚠️ Could not create test user script', err.message);
}

// Create startup script
console.log('Creating fixed startup script...');
const startupScript = `#!/usr/bin/env node
/**
 * Fixed startup script for CV Builder that properly handles paths with spaces
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Starting CV Builder application...');

// First, create necessary environment files if they don't exist
const serverEnvPath = resolve(__dirname, 'server', '.env');
const frontendEnvPath = resolve(__dirname, '.env.local');

if (!fs.existsSync(serverEnvPath)) {
  console.log('⚠️ Server .env file not found, creating it...');
  
  const serverEnvContent = \`NODE_ENV=development
PORT=3005
DISABLE_PORT_FALLBACK=true
SKIP_AUTH_CHECK=true
MOCK_SUBSCRIPTION_DATA=true
FRONTEND_URL=http://localhost:5173
JWT_SECRET=use-a-more-secure-secret-in-production
JWT_EXPIRES_IN=86400
ALLOW_SAFARI_CONNECTIONS=true
DEBUG_CORS=true
MOCK_DATABASE=true
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/cvbuilder?schema=public"\`;

  fs.writeFileSync(serverEnvPath, serverEnvContent);
  console.log('✅ Server .env file created');
}

if (!fs.existsSync(frontendEnvPath)) {
  console.log('⚠️ Frontend .env.local file not found, creating it...');
  
  const frontendEnvContent = \`VITE_API_URL=http://localhost:3005
VITE_DEV_MODE=true
VITE_SKIP_AUTH=true\`;

  fs.writeFileSync(frontendEnvPath, frontendEnvContent);
  console.log('✅ Frontend .env.local file created');
}

// Start the backend server
console.log('Starting backend server...');
const serverProcess = spawn('node', ['src/index.js'], {
  cwd: resolve(__dirname, 'server'),
  stdio: 'inherit',
  env: {
    ...process.env,
    MOCK_DATABASE: 'true',
    SKIP_AUTH_CHECK: 'true'
  }
});

// Start the frontend Vite dev server
console.log('Starting frontend application...');
const frontendProcess = spawn('npx', ['vite'], {
  cwd: __dirname,
  stdio: 'inherit',
  env: {
    ...process.env,
    VITE_API_URL: 'http://localhost:3005',
    VITE_DEV_MODE: 'true'
  }
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\\n🛑 Shutting down...');
  serverProcess.kill();
  frontendProcess.kill();
  
  setTimeout(() => {
    console.log('✅ All processes terminated');
    process.exit(0);
  }, 1000);
});

// Log messages
console.log('\\n✨ Application started successfully!');
console.log('📡 Backend running at: http://localhost:3005');
console.log('🌐 Frontend running at: http://localhost:5173');
console.log('\\nPress Ctrl+C to stop all processes');
`;

try {
  writeFileSync(path.join(__dirname, 'start-fixed.js'), startupScript);
  execSync(`chmod +x "${path.join(__dirname, 'start-fixed.js')}"`);
  console.log('✅ Fixed startup script created and made executable');
} catch (err) {
  console.log('⚠️ Could not create fixed startup script', err.message);
}

console.log('\n🎉 Environment setup complete!');
console.log('\nTo start the application with the fixed configuration, run:');
console.log('node start-fixed.js'); 