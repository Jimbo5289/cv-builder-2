#!/usr/bin/env node

/**
 * Server status check utility
 * This script checks if the server is running and on which port
 */

const http = require('http');
const fs = require('fs');
const { execSync } = require('child_process');

// Array of ports to check
const portsToCheck = [3005, 3006, 3007, 3008, 3009];

function checkPort(port) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${port}/api/health`, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const response = JSON.parse(data);
            if (response.status === 'ok') {
              resolve({ status: 'running', port });
              return;
            }
          } catch (e) {
            // Not a valid JSON response
          }
        }
        resolve({ status: 'error', port });
      });
    });
    
    req.on('error', () => {
      resolve({ status: 'not-running', port });
    });
    
    req.setTimeout(1000, () => {
      req.abort();
      resolve({ status: 'timeout', port });
    });
  });
}

async function checkAllPorts() {
  console.log('Checking server status...');
  
  const results = await Promise.all(portsToCheck.map(port => checkPort(port)));
  
  const runningServers = results.filter(r => r.status === 'running');
  
  if (runningServers.length > 0) {
    console.log('\n✅ Server is running on the following ports:');
    runningServers.forEach(server => {
      console.log(`   - Port ${server.port}: http://localhost:${server.port}`);
    });
    
    // Show running Node processes
    try {
      console.log('\nRunning Node processes:');
      const processes = execSync('ps aux | grep "node" | grep -v "grep"').toString();
      console.log(processes);
    } catch (e) {
      console.log('Could not determine running Node processes');
    }
    
  } else {
    console.log('\n❌ Server is not running on any of the checked ports.');
    console.log('   Run "./start-clean.sh" to start the server.');
  }
}

// Check for flags
const args = process.argv.slice(2);
if (args.includes('--kill') || args.includes('-k')) {
  try {
    console.log('Killing all Node processes...');
    execSync('pkill -f "node" || true');
    console.log('✅ All Node processes terminated.');
  } catch (e) {
    console.log('Error killing Node processes:', e.message);
  }
} else if (args.includes('--restart') || args.includes('-r')) {
  try {
    console.log('Restarting server...');
    execSync('pkill -f "node" || true');
    console.log('Starting server...');
    execSync('cd .. && ./start-clean.sh', { stdio: 'inherit' });
  } catch (e) {
    console.log('Error restarting server:', e.message);
  }
} else {
  checkAllPorts();
} 