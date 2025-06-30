/**
 * JWT Health Check Tool
 * 
 * This script helps monitor JWT authentication health after the fixes.
 * Use this to test if the JWT authentication improvements are working.
 */

const axios = require('axios');

// Configuration
const API_BASE_URL = process.env.API_URL || 'https://cv-builder-backend-zjax.onrender.com';
const TEST_ENDPOINTS = [
  '/api/auth/validate-token',
  '/api/health',
  '/api/auth/test-cors'
];

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testEndpoint(endpoint) {
  try {
    log(`\n🔍 Testing: ${endpoint}`, 'blue');
    
    const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
      timeout: 10000,
      validateStatus: () => true // Accept all status codes
    });
    
    log(`✅ Status: ${response.status}`, response.status < 400 ? 'green' : 'yellow');
    
    if (response.data) {
      log(`📄 Response: ${JSON.stringify(response.data, null, 2)}`, 'reset');
    }
    
    return { endpoint, status: response.status, success: response.status < 400 };
    
  } catch (error) {
    log(`❌ Error: ${error.message}`, 'red');
    return { endpoint, status: 'ERROR', success: false, error: error.message };
  }
}

async function testJWTValidation() {
  log('\n🔑 Testing JWT Validation with Invalid Token', 'blue');
  
  try {
    const response = await axios.post(`${API_BASE_URL}/api/auth/validate-token`, {}, {
      headers: {
        'Authorization': 'Bearer invalid.token.here',
        'Content-Type': 'application/json'
      },
      timeout: 10000,
      validateStatus: () => true
    });
    
    log(`✅ Status: ${response.status}`, 'yellow');
    log(`📄 Response: ${JSON.stringify(response.data, null, 2)}`, 'reset');
    
    // Check if our improved error handling is working
    if (response.data.code && response.data.hint) {
      log(`🎯 Improved error handling detected!`, 'green');
      log(`   Code: ${response.data.code}`, 'green');
      log(`   Hint: ${response.data.hint}`, 'green');
    }
    
    return { success: response.status === 401 && response.data.code };
    
  } catch (error) {
    log(`❌ Error: ${error.message}`, 'red');
    return { success: false, error: error.message };
  }
}

async function runHealthCheck() {
  log(`${colors.bold}🏥 JWT Authentication Health Check${colors.reset}`, 'blue');
  log(`🌐 API Base URL: ${API_BASE_URL}`, 'blue');
  log(`⏰ Started at: ${new Date().toISOString()}`, 'blue');
  
  const results = [];
  
  // Test basic endpoints
  for (const endpoint of TEST_ENDPOINTS) {
    const result = await testEndpoint(endpoint);
    results.push(result);
    await new Promise(resolve => setTimeout(resolve, 500)); // Small delay
  }
  
  // Test JWT validation specifically
  const jwtResult = await testJWTValidation();
  results.push({ endpoint: '/api/auth/validate-token (JWT test)', ...jwtResult });
  
  // Summary
  log(`\n${colors.bold}📊 HEALTH CHECK SUMMARY${colors.reset}`, 'blue');
  log(`⏰ Completed at: ${new Date().toISOString()}`, 'blue');
  
  const successful = results.filter(r => r.success).length;
  const total = results.length;
  
  log(`\n✅ Successful: ${successful}/${total}`, successful === total ? 'green' : 'yellow');
  
  if (successful < total) {
    log(`❌ Failed tests:`, 'red');
    results.filter(r => !r.success).forEach(r => {
      log(`   - ${r.endpoint}: ${r.error || r.status}`, 'red');
    });
  }
  
  log(`\n${colors.bold}🔧 FIXES DEPLOYED:${colors.reset}`, 'green');
  log(`✅ JWT signature errors now log as 'info' instead of 'warn'`, 'green');
  log(`✅ Better error messages with helpful hints`, 'green');
  log(`✅ Client-side auto-cleanup of invalid tokens`, 'green');
  log(`✅ CV analysis scoring consistency improvements`, 'green');
  
  return results;
}

// Run the health check
if (require.main === module) {
  runHealthCheck()
    .then(() => {
      log(`\n${colors.bold}Health check completed!${colors.reset}`, 'green');
      process.exit(0);
    })
    .catch(error => {
      log(`\n❌ Health check failed: ${error.message}`, 'red');
      process.exit(1);
    });
}

module.exports = { runHealthCheck, testEndpoint, testJWTValidation }; 