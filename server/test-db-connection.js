/**
 * Database Connection Test Script
 * 
 * This script tests the connection to your AWS RDS PostgreSQL database.
 * Run it with: node test-db-connection.js
 */

const { PrismaClient } = require('@prisma/client');

// Database connection URL
const databaseUrl = 'postgresql://postgres:reqvip-ciftag-2Qizgo@cvbuilder-db.c1augguy6rx8.eu-central-1.rds.amazonaws.com:5432/cvbuilder-db?sslmode=require';

async function testConnection() {
  console.log('Testing connection to database...');
  console.log(`Database URL: ${databaseUrl.replace(/postgresql:\/\/[^:]+:[^@]+@/, 'postgresql://[username]:[password]@')}`);
  
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl
      }
    }
  });

  try {
    // Try to connect to the database
    console.log('Attempting to connect...');
    await prisma.$connect();
    console.log('✅ Connection successful!');
    
    // Try a simple query
    console.log('Attempting to run a simple query...');
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Query successful!', result);
    
    return true;
  } catch (error) {
    console.error('❌ Connection failed!');
    console.error('Error details:', error);
    
    // Provide more specific error troubleshooting based on error message
    if (error.message.includes("Can't reach database server")) {
      console.log('\nPossible causes:');
      console.log('1. The database server is not running');
      console.log('2. Your IP address is not allowed in the database security group');
      console.log('3. The database endpoint is incorrect');
      console.log('\nTry:');
      console.log('- Check if the database is running in AWS RDS console');
      console.log('- Add your IP address to the security group');
      console.log('- Verify the database endpoint, port, and credentials');
    } else if (error.message.includes('password authentication failed')) {
      console.log('\nPossible causes:');
      console.log('1. Incorrect username or password');
      console.log('2. The user does not have permission to connect');
      console.log('\nTry:');
      console.log('- Double-check the username and password');
      console.log('- Make sure the user has the necessary permissions');
    } else if (error.message.includes('database') && error.message.includes('does not exist')) {
      console.log('\nPossible causes:');
      console.log('1. The database name does not exist');
      console.log('\nTry:');
      console.log('- Create the database');
      console.log('- Check the database name in the connection string');
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
      console.log('\nDatabase connection test completed successfully!');
    } else {
      console.log('\nDatabase connection test failed. See errors above.');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
  }); 