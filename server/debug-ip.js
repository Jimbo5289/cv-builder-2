const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { logger } = require('./src/config/logger');

// This script will log IP address information to help debug RDS connection issues

async function checkIpAddress() {
  logger.info('Starting IP address check for AWS RDS debugging');
  
  try {
    // Create a log directory if it doesn't exist
    const logDir = path.join(__dirname, 'logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    
    // Log file for IP information
    const logFile = path.join(logDir, 'ip-debug.log');
    
    // Get public IP address using a service
    logger.info('Checking public IP address...');
    
    // Call multiple IP services to get more reliable results
    const ipServices = [
      'https://api.ipify.org?format=json',
      'https://ifconfig.me/all.json',
      'https://ipinfo.io/json'
    ];
    
    const results = [];
    
    for (const service of ipServices) {
      try {
        const response = await axios.get(service, { timeout: 5000 });
        results.push({
          service,
          response: response.data,
          timestamp: new Date().toISOString()
        });
        logger.info(`IP check from ${service} successful`);
      } catch (error) {
        logger.error(`Error checking IP with ${service}:`, error.message);
        results.push({
          service,
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    }
    
    // Log results to file
    fs.writeFileSync(
      logFile,
      JSON.stringify({
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'unknown',
        platform: process.env.RENDER ? 'render' : 'local',
        results
      }, null, 2)
    );
    
    logger.info(`IP information logged to ${logFile}`);
    logger.info('Please check this file to see what IP address Render is using');
    logger.info('Then update your AWS RDS security group to include this IP');
    
    // Log known Render IPs
    logger.info('Known Render IP addresses to add to AWS RDS security group:');
    logger.info('- 35.180.39.82/32');
    logger.info('- 35.181.114.243/32');
    logger.info('- 35.181.155.97/32');
    
    return true;
  } catch (error) {
    logger.error('Error in IP check script:', error);
    return false;
  }
}

// Run the check
checkIpAddress()
  .then(success => {
    if (success) {
      logger.info('IP address check completed');
    } else {
      logger.error('IP address check failed');
    }
  })
  .catch(error => {
    logger.error('Unexpected error in IP check:', error);
  });

// Export for use in other scripts
module.exports = { checkIpAddress }; 