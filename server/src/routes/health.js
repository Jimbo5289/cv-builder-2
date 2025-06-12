const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const os = require('os');

// Create Prisma client with error handling
let prisma;
try {
  prisma = new PrismaClient();
} catch (e) {
  console.error('Failed to initialize Prisma client in health routes:', e);
}

// Basic health check endpoint
router.get('/', async (req, res) => {
  try {
    return res.status(200).json({
      status: 'ok',
      message: 'Server is running',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in health check:', error);
    return res.status(500).json({ error: 'Health check failed' });
  }
});

// Detailed health status
router.get('/status', async (req, res) => {
  try {
    let dbStatus = 'unknown';
    
    // Check database connection if Prisma is available
    if (prisma) {
      try {
        // Run a simple query to check if the database is working
        await prisma.$queryRaw`SELECT 1`;
        dbStatus = 'connected';
      } catch (dbError) {
        console.error('Database health check failed:', dbError);
        dbStatus = 'disconnected';
      }
    }
    
    // Get some basic system info
    const systemInfo = {
      uptime: Math.floor(process.uptime()),
      memory: {
        free: os.freemem(),
        total: os.totalmem()
      },
      cpu: os.cpus().length,
      hostname: os.hostname(),
      platform: os.platform(),
      nodeVersion: process.version
    };
    
    return res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: dbStatus,
      environment: process.env.NODE_ENV || 'development',
      system: systemInfo
    });
  } catch (error) {
    console.error('Error in detailed health check:', error);
    return res.status(500).json({ error: 'Detailed health check failed' });
  }
});

// Database connectivity test
router.get('/db', async (req, res) => {
  try {
    if (!prisma) {
      return res.status(500).json({ error: 'Prisma client not initialized' });
    }
    
    // Attempt a simple database query
    const result = await prisma.$queryRaw`SELECT NOW() as server_time`;
    
    return res.status(200).json({
      status: 'ok',
      message: 'Database connection successful',
      serverTime: result[0]?.server_time || new Date().toISOString()
    });
  } catch (error) {
    console.error('Database health check failed:', error);
    return res.status(503).json({
      status: 'error',
      message: 'Database connection failed',
      error: error.message
    });
  }
});

module.exports = router; 