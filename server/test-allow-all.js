/**
 * AWS RDS Database Connection Test with All IPs Allowed
 * 
 * Use this script after you've temporarily set your AWS RDS security group to allow all IPs.
 * This will help confirm if the security group rules are the issue.
 * 
 * WARNING: After testing, remember to update your security group to only allow specific IPs.
 */

const { PrismaClient } = require('@prisma/client');
const { logger } = require('./src/config/logger');

// Database connection URL - using the standard one
const databaseUrl = process.env.DATABASE_URL || 
                    'postgresql://postgres:reqvip-ciftag-2Qizgo@cvbuilder-db.c1augguy6rx8.eu-central-1.rds.amazonaws.com:5432/cvbuilder-db?sslmode=require';

async function testConnection() {
  logger.info('Testing connection to database with all IPs allowed...');
  logger.info(`Database URL: ${databaseUrl.replace(/postgresql:\/\/[^:]+:[^@]+@/, 'postgresql://[username]:[password]@')}`);
  
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl
      }
    }
  });

  try {
    // Try to connect to the database
    logger.info('Attempting to connect...');
    await prisma.$connect();
    logger.info('✅ Connection successful!');
    
    // Try a simple query
    logger.info('Attempting to run a simple query...');
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    logger.info('✅ Query successful!', result);

    // Try a more complex query to check database permissions
    logger.info('Checking database schema...');
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    logger.info(`✅ Found ${tables.length} tables in the database`);
    
    return true;
  } catch (error) {
    logger.error('❌ Connection failed!');
    logger.error('Error details:', error);
    
    // Provide more specific error troubleshooting based on error message
    if (error.message.includes("Can't reach database server")) {
      logger.info('\nPossible causes:');
      logger.info('1. The database server is not running');
      logger.info('2. Your IP address is not allowed in the database security group');
      logger.info('3. The database endpoint is incorrect');
      logger.info('\nTry:');
      logger.info('- Check if the database is running in AWS RDS console');
      logger.info('- Make sure "all traffic" rule is correctly set in security group');
      logger.info('- Verify the database endpoint, port, and credentials');
    } else if (error.message.includes('password authentication failed')) {
      logger.info('\nPossible causes:');
      logger.info('1. Incorrect username or password');
      logger.info('2. The user does not have permission to connect');
      logger.info('\nTry:');
      logger.info('- Double-check the username and password');
      logger.info('- Make sure the user has the necessary permissions');
    }
    
    return false;
  } finally {
    // Disconnect from the database
    await prisma.$disconnect();
  }
}

// Run the test
testConnection()
  .then(success => {
    if (success) {
      logger.info('\nDatabase connection test with all IPs allowed completed successfully!');
      logger.info('This confirms that the issue is with the security group configuration.');
      logger.info('Please remember to update your security group to only allow specific IPs.');
    } else {
      logger.info('\nDatabase connection test with all IPs allowed failed.');
      logger.info('This suggests the issue might not be with the security group.');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    logger.error('Unexpected error:', error);
    process.exit(1);
  }); 