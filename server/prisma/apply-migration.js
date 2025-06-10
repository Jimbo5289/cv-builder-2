/**
 * Script to apply Prisma migrations
 * Run with: node apply-migration.js
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Simple logger
const logger = {
  info: (...args) => console.log('[INFO]', ...args),
  error: (...args) => console.error('[ERROR]', ...args),
  success: (...args) => console.log('[SUCCESS]', ...args)
};

// Migration directory
const migrationsDir = path.join(__dirname, 'migrations');

// Check if migrations directory exists
if (!fs.existsSync(migrationsDir)) {
  logger.error(`Migrations directory not found at: ${migrationsDir}`);
  process.exit(1);
}

// Run the migration
logger.info('Applying migrations...');
exec('npx prisma migrate deploy', (error, stdout, stderr) => {
  if (error) {
    logger.error('Migration failed:', error.message);
    logger.error(stderr);
    process.exit(1);
  }
  
  logger.success('Migration applied successfully!');
  logger.info(stdout);
  
  // Generate Prisma client
  logger.info('Generating Prisma client...');
  exec('npx prisma generate', (genError, genStdout, genStderr) => {
    if (genError) {
      logger.error('Client generation failed:', genError.message);
      logger.error(genStderr);
      process.exit(1);
    }
    
    logger.success('Prisma client generated successfully!');
    logger.info(genStdout);
  });
}); 