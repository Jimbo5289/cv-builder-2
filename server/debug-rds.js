/**
 * AWS RDS Connection Debugging Script
 * This script runs specific tests to diagnose connectivity issues with AWS RDS from Render
 */

const { Client } = require('pg');
const axios = require('axios');
const dns = require('dns').promises;
const net = require('net');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get DATABASE_URL from environment or use the RDS URL
const DATABASE_URL = process.env.DATABASE_URL || 
  'postgresql://postgres:reqvip-ciftag-2Qizgo@cvbuilder-db.c1augguy6rx8.eu-central-1.rds.amazonaws.com:5432/cvbuilder-db?sslmode=require';

// Parse the connection details
function parseDbUrl(url) {
  const match = url.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)(\?.*)?/);
  if (!match) {
    throw new Error('Invalid database URL format');
  }
  
  return {
    user: match[1],
    password: match[2],
    host: match[3],
    port: parseInt(match[4], 10),
    database: match[5],
    ssl: url.includes('sslmode=require') ? { rejectUnauthorized: false } : false
  };
}

// Mask sensitive information
function maskDbUrl(url) {
  return url.replace(/\/\/([^:]+):([^@]+)@/, '//[username]:[password]@');
}

// Create log directory
const logDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logFile = path.join(logDir, 'rds-debug.log');
const logStream = fs.createWriteStream(logFile, { flags: 'a' });

// Helper to log both to console and file
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} - ${message}`;
  console.log(logMessage);
  logStream.write(logMessage + '\n');
}

// Test 1: Determine outbound IP address
async function determineOutboundIp() {
  log('STEP 1: Determining outbound IP address...');
  
  try {
    const services = [
      'https://api.ipify.org',
      'https://ifconfig.me/ip',
      'https://icanhazip.com'
    ];
    
    for (const service of services) {
      try {
        const response = await axios.get(service, { timeout: 5000 });
        const ip = response.data.trim();
        log(`✅ Outbound IP address detected: ${ip}`);
        log(`⚠️ IMPORTANT: Make sure this IP is allowed in your AWS RDS security group!`);
        return ip;
      } catch (err) {
        log(`❌ Failed to get IP from ${service}: ${err.message}`);
      }
    }
    
    log('❌ Could not determine outbound IP from any service');
    return null;
  } catch (err) {
    log(`❌ Error determining outbound IP: ${err.message}`);
    return null;
  }
}

// Test 2: Check DNS resolution for the RDS hostname
async function checkDns(host) {
  log(`STEP 2: Checking DNS resolution for ${host}...`);
  
  try {
    const addresses = await dns.resolve4(host);
    log(`✅ DNS resolution successful: ${host} resolves to ${addresses.join(', ')}`);
    return addresses;
  } catch (err) {
    log(`❌ DNS resolution failed: ${err.message}`);
    return null;
  }
}

// Test 3: Check direct TCP connectivity to the database
async function checkTcpConnection(host, port) {
  log(`STEP 3: Testing TCP connectivity to ${host}:${port}...`);
  
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let resolved = false;
    
    // Set a timeout for the connection attempt
    socket.setTimeout(5000);
    
    socket.on('connect', () => {
      log(`✅ TCP connection successful: Port ${port} is reachable on ${host}`);
      socket.end();
      resolved = true;
      resolve(true);
    });
    
    socket.on('timeout', () => {
      log(`❌ TCP connection timed out: Port ${port} on ${host} did not respond within 5 seconds`);
      socket.destroy();
      if (!resolved) {
        resolved = true;
        resolve(false);
      }
    });
    
    socket.on('error', (err) => {
      log(`❌ TCP connection failed: ${err.message}`);
      if (!resolved) {
        resolved = true;
        resolve(false);
      }
    });
    
    // Attempt to connect
    socket.connect(port, host);
  });
}

// Test 4: Try to connect to the database
async function testDatabaseConnection(config) {
  log(`STEP 4: Testing PostgreSQL connection...`);
  
  // Create a client with a 10 second timeout
  const client = new Client({
    ...config,
    connectionTimeoutMillis: 10000
  });
  
  try {
    await client.connect();
    log('✅ Database connection successful!');
    
    // Execute a simple query to ensure full connectivity
    const result = await client.query('SELECT NOW() as current_time');
    log(`✅ Database query successful: Server time is ${result.rows[0].current_time}`);
    
    await client.end();
    return true;
  } catch (err) {
    log(`❌ Database connection failed: ${err.message}`);
    
    if (err.message.includes('timeout')) {
      log('⚠️ Connection timeout may indicate a security group or network ACL issue');
    } else if (err.message.includes('password authentication')) {
      log('⚠️ Authentication failed - check your username and password');
    } else if (err.message.includes('no pg_hba.conf entry')) {
      log('⚠️ Server rejected the connection - check RDS security group and public accessibility settings');
    }
    
    return false;
  }
}

// Test 5: Check AWS RDS security group (informational only)
function checkSecurityGroup() {
  log(`STEP 5: AWS RDS Security Group Information...`);
  log(`⚠️ Please check your AWS RDS security group manually to ensure it allows inbound connections from the IP identified above.`);
  log(`⚠️ You should have at least the following IPs allowed for PostgreSQL (port 5432):`);
  log(`   - The outbound IP address shown above`);
  log(`   - All Render static IPs:`);
  log(`     - 35.180.39.82/32`);
  log(`     - 35.181.114.243/32`);
  log(`     - 35.181.155.97/32`);
  log(`     - 52.59.103.54/32 (This is likely the one Render is using)`);
  log(`     - 34.242.126.209/32`);
  log(`     - 52.19.145.128/32`);
  log(`     - 52.19.123.36/32`);
}

// Test 6: Check RDS instance public accessibility
function checkRdsSettings() {
  log(`STEP 6: AWS RDS Instance Settings...`);
  log(`⚠️ Make sure your RDS instance has "Publicly accessible" set to "Yes"`);
  log(`⚠️ Check if your RDS instance is in a VPC with restrictive Network ACLs`);
  log(`⚠️ Verify that your RDS instance is in the "Available" state`);
}

// Main function to run all tests
async function runTests() {
  try {
    log('========= AWS RDS Connection Debug Script =========');
    log(`Started at: ${new Date().toISOString()}`);
    log(`Running on: ${process.env.RENDER ? 'Render' : 'Local'} environment`);
    
    const maskedUrl = maskDbUrl(DATABASE_URL);
    log(`Database URL: ${maskedUrl}`);
    
    // Parse connection details
    const dbConfig = parseDbUrl(DATABASE_URL);
    log(`Host: ${dbConfig.host}, Port: ${dbConfig.port}, Database: ${dbConfig.database}, User: ${dbConfig.user}`);
    
    // Run tests in sequence
    const outboundIp = await determineOutboundIp();
    const ipAddresses = await checkDns(dbConfig.host);
    
    if (ipAddresses && ipAddresses.length > 0) {
      for (const ip of ipAddresses) {
        await checkTcpConnection(ip, dbConfig.port);
      }
    } else {
      await checkTcpConnection(dbConfig.host, dbConfig.port);
    }
    
    await testDatabaseConnection(dbConfig);
    checkSecurityGroup();
    checkRdsSettings();
    
    log('========= Tests Complete =========');
    log('Check the logs above for any issues that need to be addressed');
    
    if (process.env.RENDER) {
      log('⚠️ Remember that Render IPs can change - make sure all Render static IPs are allowed in your security group');
    }
    
  } catch (err) {
    log(`❌ Error running tests: ${err.message}`);
  } finally {
    logStream.end();
  }
}

// Run the tests
runTests(); 