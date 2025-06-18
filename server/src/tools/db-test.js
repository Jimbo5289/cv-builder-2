/**
 * Database connection test script
 * 
 * Run this script to test your database connection:
 * node src/tools/db-test.js
 */

const { PrismaClient } = require('@prisma/client');
const net = require('net');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file if it exists
const envPath = path.resolve(__dirname, '../../.env');
try {
  dotenv.config({ path: envPath });
  console.log(`Loaded environment from ${envPath}`);
} catch (err) {
  console.log('No .env file found or error loading it, using system environment variables');
}

// Get database URL from environment
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('ERROR: DATABASE_URL environment variable is not set.');
  process.exit(1);
}

// Parse the database URL to get host, port, etc.
const urlParts = new URL(databaseUrl);
const host = urlParts.hostname;
const port = urlParts.port || 5432;
const database = urlParts.pathname.substring(1);
const user = urlParts.username;

console.log('Database connection test');
console.log('=======================');
console.log(`Host: ${host}`);
console.log(`Port: ${port}`);
console.log(`Database: ${database}`);
console.log(`User: ${user}`);
console.log('Password: [hidden]');
console.log('');

// First test TCP connectivity to verify network access
console.log(`1. Testing TCP connectivity to ${host}:${port}...`);

const testTcpConnection = () => {
  return new Promise((resolve, reject) => {
    const socket = new net.Socket();
    
    // Set timeout to 10 seconds
    socket.setTimeout(10000);
    
    socket.on('connect', () => {
      console.log(`  ✅ TCP connection successful!`);
      socket.end();
      resolve(true);
    });
    
    socket.on('timeout', () => {
      console.error(`  ❌ Connection timed out after 10 seconds`);
      socket.destroy();
      resolve(false);
    });
    
    socket.on('error', (err) => {
      console.error(`  ❌ TCP connection failed: ${err.message}`);
      resolve(false);
    });
    
    // Try to connect
    socket.connect(port, host);
  });
};

// Then try Prisma connection
const testPrismaConnection = async () => {
  console.log('2. Testing Prisma database connection...');
  
  const prismaConfig = {
    datasources: {
      db: {
        url: databaseUrl
      }
    }
  };
  
  // Add SSL if connecting to AWS RDS
  if (host.includes('amazonaws.com') && !databaseUrl.includes('sslmode=')) {
    console.log('  Adding sslmode=require for AWS RDS connection');
    prismaConfig.datasources.db.url = `${databaseUrl}?sslmode=require`;
  }
  
  const prisma = new PrismaClient(prismaConfig);
  
  try {
    console.log('  Connecting to database...');
    await prisma.$connect();
    console.log('  ✅ Prisma connection successful!');
    
    // Try a simple query
    console.log('  Testing simple query...');
    // Just get the current timestamp from the database
    const result = await prisma.$queryRaw`SELECT NOW()`;
    console.log(`  ✅ Query successful! Database time: ${result[0].now}`);
    
    return true;
  } catch (err) {
    console.error(`  ❌ Prisma connection failed: ${err.message}`);
    if (err.meta && err.meta.details) {
      console.error(`  Error details: ${err.meta.details}`);
    }
    return false;
  } finally {
    await prisma.$disconnect();
  }
};

// Run the tests
(async () => {
  try {
    const tcpSuccess = await testTcpConnection();
    
    if (tcpSuccess) {
      const prismaSuccess = await testPrismaConnection();
      
      console.log('\nTest Results:');
      console.log('============');
      console.log(`TCP Connectivity: ${tcpSuccess ? '✅ PASS' : '❌ FAIL'}`);
      console.log(`Prisma Connection: ${prismaSuccess ? '✅ PASS' : '❌ FAIL'}`);
      
      if (tcpSuccess && prismaSuccess) {
        console.log('\n✅ All tests passed! Your database connection is working properly.');
      } else {
        console.log('\n❌ Some tests failed. Please check the error messages above.');
        
        if (tcpSuccess && !prismaSuccess) {
          console.log('\nTroubleshooting tips:');
          console.log('1. Check your database credentials (username/password)');
          console.log('2. Verify the database exists and the user has access permissions');
          console.log('3. Check if SSL configuration is required for your database');
        }
      }
    } else {
      console.log('\nTest Results:');
      console.log('============');
      console.log(`TCP Connectivity: ❌ FAIL`);
      console.log(`Prisma Connection: ⏭️ SKIPPED (TCP connection failed)`);
      
      console.log('\nTroubleshooting tips for TCP connection failures:');
      console.log('1. Check if the database server is running');
      console.log('2. Verify the hostname and port are correct');
      console.log('3. Check firewall/security group settings (allow port 5432)');
      console.log('4. For AWS RDS, verify the instance is publicly accessible');
      console.log('5. For AWS RDS, check VPC and subnet settings');
    }
  } catch (err) {
    console.error('Unexpected error during tests:', err);
  }
})(); 