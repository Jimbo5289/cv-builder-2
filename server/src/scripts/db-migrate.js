/**
 * Database Migration Script
 * 
 * This script runs Prisma migrations to update the database schema.
 * It should be run after schema changes are made to server/prisma/schema.prisma
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const { logger } = require('../config/logger');

// Path to the Prisma schema
const SCHEMA_PATH = path.resolve(__dirname, '../../prisma/schema.prisma');

/**
 * Main migration function
 */
async function migrate() {
  try {
    logger.info('Starting database migration');
    
    // Check if schema file exists
    if (!fs.existsSync(SCHEMA_PATH)) {
      throw new Error(`Schema file not found at ${SCHEMA_PATH}`);
    }
    
    // Generate migration files
    logger.info('Generating migration files');
    execSync('npx prisma migrate dev --name cv-builder-update', {
      stdio: 'inherit',
      cwd: path.resolve(__dirname, '../../')
    });
    
    // Generate Prisma client
    logger.info('Generating Prisma client');
    execSync('npx prisma generate', {
      stdio: 'inherit',
      cwd: path.resolve(__dirname, '../../')
    });
    
    logger.info('Migration completed successfully');
  } catch (error) {
    logger.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration if this script is executed directly
if (require.main === module) {
  migrate().catch(err => {
    logger.error('Unhandled error during migration:', err);
    process.exit(1);
  });
}

module.exports = { migrate }; 