/**
 * Simple RDS Connection Test for Render
 * Standalone script that only tests the database connection
 */

const { Client } = require('pg');
const axios = require('axios');

// Get IP address and test DB connection
async function testConnection() {
  console.log('========= RENDER RDS CONNECTION TEST =========');
  console.log('Started at:', new Date().toISOString());

  // Step 1: Get Render's outbound IP
  console.log('\nStep 1: Checking outbound IP address...');
  let ip = 'unknown';
  
  try {
    const services = [
      'https://api.ipify.org',
      'https://ifconfig.me/ip',
      'https://icanhazip.com'
    ];
    
    for (const service of services) {
      try {
        const response = await axios.get(service, { timeout: 5000 });
        ip = response.data.trim();
        console.log(`✅ Outbound IP address: ${ip}`);
        break;
      } catch (err) {
        console.log(`Could not get IP from ${service}: ${err.message}`);
      }
    }
  } catch (err) {
    console.log('❌ Could not determine IP address:', err.message);
  }
  
  // Step 2: Test database connection
  console.log('\nStep 2: Testing database connection...');
  
  const dbUrl = process.env.DATABASE_URL || 
    'postgresql://postgres:reqvip-ciftag-2Qizgo@cvbuilder-db.c1augguy6rx8.eu-central-1.rds.amazonaws.com:5432/cvbuilder-db?sslmode=require';
  
  // Parse the connection string
  const match = dbUrl.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)(\?.*)?/);
  if (!match) {
    console.log('❌ Invalid database URL format');
    return;
  }
  
  const config = {
    user: match[1],
    password: match[2],
    host: match[3],
    port: parseInt(match[4], 10),
    database: match[5],
    ssl: dbUrl.includes('sslmode=require') ? { rejectUnauthorized: false } : false,
    connectionTimeoutMillis: 10000 // 10 second timeout
  };
  
  console.log(`Database host: ${config.host}`);
  console.log(`Database port: ${config.port}`);
  console.log(`Database name: ${config.database}`);
  console.log(`Using SSL: ${config.ssl ? 'Yes' : 'No'}`);
  
  const client = new Client(config);
  
  try {
    console.log('Attempting to connect to database...');
    await client.connect();
    console.log('✅ DATABASE CONNECTION SUCCESSFUL!');
    
    // Run test query
    console.log('Running test query...');
    const result = await client.query('SELECT NOW() as time');
    console.log(`✅ Database query successful! Server time: ${result.rows[0].time}`);
    
    await client.end();
    
    console.log('\n========= TEST SUMMARY =========');
    console.log(`Your Render outbound IP is: ${ip}`);
    console.log('AWS RDS database connection: SUCCESSFUL');
    console.log('Make sure this IP is allowed in your AWS RDS security group:');
    console.log(`- ${ip}/32`);
    
  } catch (err) {
    console.log('❌ DATABASE CONNECTION FAILED');
    console.log('Error:', err.message);
    
    console.log('\n========= TROUBLESHOOTING =========');
    console.log('1. Make sure this IP is allowed in your AWS RDS security group:');
    console.log(`   - ${ip}/32`);
    console.log('2. Verify your RDS instance is publicly accessible');
    console.log('3. Check that your AWS VPC Network ACLs allow the connection');
    console.log('4. Verify that database credentials are correct');
  }
}

// Run the test
testConnection().catch(err => {
  console.error('Unexpected error:', err);
}); 