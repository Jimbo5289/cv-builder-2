/**
 * Database Initialization Script
 * 
 * This script initializes the database with default data
 * and ensures all necessary tables are created.
 */

const { logger } = require('../config/logger');
const database = require('../config/database');
const { initializeDefaultTemplates } = require('../services/templateService');
const bcrypt = require('bcryptjs');

/**
 * Main initialization function
 */
async function initialize() {
  try {
    logger.info('Starting database initialization');
    
    // Make sure database client is available
    if (!database.client) {
      logger.error('Database client not initialized');
      return;
    }
    
    // Create default admin user if it doesn't exist
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    
    const adminExists = await database.client.user.findUnique({
      where: { email: adminEmail }
    });
    
    if (!adminExists) {
      logger.info(`Creating admin user: ${adminEmail}`);
      
      // Hash the password
      const hashedPassword = await bcrypt.hash(adminPassword, 12);
      
      await database.client.user.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
          name: 'Administrator',
          isActive: true
        }
      });
      
      logger.info('Admin user created successfully');
    }
    
    // Initialize default templates
    await initializeDefaultTemplates();
    
    logger.info('Database initialization completed successfully');
  } catch (error) {
    logger.error('Database initialization failed:', error);
    throw error;
  }
}

// Run the initialization if this script is executed directly
if (require.main === module) {
  initialize().catch(err => {
    logger.error('Unhandled error during initialization:', err);
    process.exit(1);
  });
}

module.exports = { initialize }; 