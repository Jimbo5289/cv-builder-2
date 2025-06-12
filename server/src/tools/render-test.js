/**
 * Network testing script for Render
 * This script can be run on Render to test connectivity to your AWS RDS instance
 * 
 * To run: node render-test.js
 */

const net = require('net');
const dns = require('dns');
const { execSync } = require('child_process');

// Database connection details - update these if needed
const host = 'cvbuilder-db.c1augguy6rx8.eu-central-1.rds.amazonaws.com';
const port = 5432;

// DNS resolution test
console.log(`1. Testing DNS resolution for ${host}...`);
dns.lookup(host, (err, address) => {
  if (err) {
    console.error(`❌ DNS resolution failed: ${err.message}`);
  } else {
    console.log(`✅ DNS resolution successful! Resolved to: ${address}`);
  }
  
  // Continue with TCP test
  testTcpConnection();
});

// TCP connection test
function testTcpConnection() {
  console.log(`\n2. Testing TCP connection to ${host}:${port}...`);
  
  const socket = new net.Socket();
  let connectTimeout;
  
  socket.setTimeout(10000); // 10 second timeout
  
  socket.on('connect', () => {
    console.log(`✅ TCP connection successful!`);
    clearTimeout(connectTimeout);
    socket.end();
    
    // Continue with traceroute
    runTraceroute();
  });
  
  socket.on('timeout', () => {
    console.error(`❌ Connection timed out after 10 seconds`);
    socket.destroy();
    
    // Continue with traceroute
    runTraceroute();
  });
  
  socket.on('error', (err) => {
    console.error(`❌ TCP connection failed: ${err.message}`);
    
    // Continue with traceroute
    runTraceroute();
  });
  
  // Set additional timeout as a backup
  connectTimeout = setTimeout(() => {
    if (socket.connecting) {
      console.error(`❌ Connection attempt hanging, forcing timeout`);
      socket.destroy();
      
      // Continue with traceroute
      runTraceroute();
    }
  }, 12000);
  
  // Try to connect
  socket.connect(port, host);
}

// Run traceroute to the host
function runTraceroute() {
  console.log(`\n3. Running traceroute to ${host}...`);
  
  try {
    // Use traceroute on Linux/Mac or tracert on Windows
    const command = process.platform === 'win32' 
      ? `tracert ${host}`
      : `traceroute -m 15 ${host}`;
    
    const result = execSync(command, { timeout: 30000 }).toString();
    console.log(result);
  } catch (err) {
    console.error(`Error running traceroute: ${err.message}`);
    if (err.stdout) {
      console.log("Partial output:");
      console.log(err.stdout.toString());
    }
  }
  
  // Run telnet test
  runTelnetTest();
}

// Run telnet-like test for more detailed connection info
function runTelnetTest() {
  console.log(`\n4. Running detailed connection test to ${host}:${port}...`);
  
  try {
    // Try netcat if available
    const command = `nc -zv ${host} ${port}`;
    const result = execSync(command, { timeout: 10000 }).toString();
    console.log(result);
  } catch (err) {
    console.error(`Netcat test failed: ${err.message}`);
    if (err.stdout) {
      console.log("Partial output:");
      console.log(err.stdout.toString());
    }
  }
  
  // Print environment info
  console.log("\n5. Environment information:");
  try {
    console.log("IP Address information:");
    console.log(execSync('ip addr').toString());
    
    console.log("\nRouting table:");
    console.log(execSync('netstat -rn').toString());
  } catch (err) {
    console.error(`Error getting network info: ${err.message}`);
  }
  
  console.log("\nTests completed. If all tests failed, check the following:");
  console.log("1. Is your RDS instance in a VPC that allows public access?");
  console.log("2. Does the RDS security group allow connections from Render's IP addresses?");
  console.log("3. Is the database running and listening on the expected port?");
} 