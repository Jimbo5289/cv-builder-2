/* eslint-disable */
// Script to ensure development database has proper user setup
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const cuid = require('cuid');
const bcrypt = require('bcrypt');

// Create a custom logger to avoid circular dependency issues
// This avoids requiring the ../utils/logger module which can cause issues
const logger = {
  info: (...args) => console.log('[info] :', ...args),
  warn: (...args) => console.warn('[warn] :', ...args),
  error: (...args) => console.error('[error] :', ...args)
};

// Create a new Prisma client instance
const prisma = new PrismaClient();

/**
 * Ensures a development user exists with proper ID format
 */
async function ensureDevUser() {
  logger.info('Starting database initialization for development...');
  
  try {
    // Check if dev user exists
    const existingUser = await prisma.user.findFirst({
      where: { 
        email: 'dev@example.com'
      }
    });
    
    if (existingUser) {
      logger.info(`Development user already exists with ID: ${existingUser.id}`);
      
      // Check if ID seems like a valid CUID
      const hasValidFormat = existingUser.id.startsWith('c') && existingUser.id.length >= 20;
      
      if (hasValidFormat) {
        // Update the dev env file with this ID
        updateDevEnvFile(existingUser.id);
        
        // Create 2FA test user
        await create2FATestUser();
        
        await prisma.$disconnect();
        return existingUser;
      }
      
      logger.info('Development user has invalid ID format. Creating a new user with proper format...');
      
      try {
        // Try to delete the existing user first
        await prisma.user.delete({
          where: { id: existingUser.id }
        });
      } catch (deleteError) {
        logger.warn('Could not delete existing user:', deleteError.message);
        // Continue anyway, we'll just create a new one
      }
    }
    
    // Create a new user with CUID format ID
    const newId = cuid();
    logger.info(`Creating new development user with ID: ${newId}`);
    
    const newUser = await prisma.user.create({
      data: {
        id: newId,
        email: 'dev@example.com',
        password: 'dev-password-hash', // This would normally be hashed
        firstName: 'Development',
        lastName: 'User',
        role: 'USER'
      }
    });
    
    logger.info('Development user created successfully');
    
    // Update the dev env file with this ID
    updateDevEnvFile(newUser.id);
    
    // Create other test users
    await createTestUsers();
    
    // Create a 2FA test user
    await create2FATestUser();
    
    logger.info('Development database initialized successfully');
    await prisma.$disconnect();
    return newUser;
  } catch (error) {
    logger.error('Error initializing development database:', error);
    await prisma.$disconnect();
    throw error;
  }
}

// Empty implementation of createTestUsers to fix the undefined reference
const createTestUsers = async () => {
  // This function is a placeholder for creating test users
  // Implementation will be added later if needed
  logger.info('Test users creation skipped');
  return Promise.resolve();
};

/**
 * Updates the development.env file with the given user ID
 */
function updateDevEnvFile(userId) {
  try {
    const envPath = path.resolve(__dirname, '../../development.env');
    
    // Read existing content or create new file
    let content = '';
    if (fs.existsSync(envPath)) {
      content = fs.readFileSync(envPath, 'utf8');
    }
    
    // Replace or add DEV_USER_ID
    if (content.includes('DEV_USER_ID=')) {
      content = content.replace(/DEV_USER_ID=.*/g, `DEV_USER_ID=${userId}`);
    } else {
      content += `\nDEV_USER_ID=${userId}\n`;
    }
    
    // Write back to the file
    fs.writeFileSync(envPath, content, 'utf8');
    logger.info(`Updated development.env with DEV_USER_ID=${userId}`);
  } catch (error) {
    logger.error('Failed to update development.env file:', error.message);
  }
}

// Create a test user with 2FA for testing
const create2FATestUser = async () => {
  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        email: '2fa-test@example.com'
      }
    });

    if (!existingUser) {
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash('Test@123', salt);
      
      // Create a new test user with 2FA
      const twoFAUser = await prisma.user.create({
        data: {
          id: cuid(),
          name: '2FA Test User',
          email: '2fa-test@example.com',
          password: hashedPassword,
          isActive: true,
          twoFactorEnabled: true,
          // This is a test secret that corresponds to TOTP code 123456 for testing
          twoFactorSecret: 'JBSWY3DPEHPK3PXP', // Test secret, don't use in production
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
      
      logger.info('Created 2FA test user', { userId: twoFAUser.id });
    } else {
      logger.info('2FA test user already exists', { userId: existingUser.id });
    }
  } catch (error) {
    logger.error('Error creating 2FA test user:', error);
  }
};

// Export for use in other modules
  module.exports = { ensureDevUser };