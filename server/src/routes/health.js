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

// Function to add CORS headers
function addCorsHeaders(req, res) {
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

// Basic health check endpoint
router.get('/', async (req, res) => {
  addCorsHeaders(req, res);
  try {
    return res.status(200).json({
      status: 'ok',
      message: 'Server is running',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in health check:', error);
    addCorsHeaders(req, res);
    return res.status(500).json({ error: 'Health check failed' });
  }
});

// CORS diagnostic endpoint - helps debug CORS issues
router.get('/cors', async (req, res) => {
  try {
    // Get all headers for debugging
    const headers = {
      ...req.headers,
      // Mask any sensitive headers
      authorization: req.headers.authorization ? '[MASKED]' : undefined
    };
    
    return res.status(200).json({
      status: 'ok',
      message: 'CORS is working correctly for this endpoint',
      origin: req.headers.origin || 'No origin header provided',
      requestHeaders: headers,
      responseHeaders: {
        'Access-Control-Allow-Origin': res.getHeader('Access-Control-Allow-Origin') || 'Not set',
        'Access-Control-Allow-Credentials': res.getHeader('Access-Control-Allow-Credentials') || 'Not set',
        'Access-Control-Allow-Methods': res.getHeader('Access-Control-Allow-Methods') || 'Not set',
        'Access-Control-Allow-Headers': res.getHeader('Access-Control-Allow-Headers') || 'Not set'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in CORS diagnostic:', error);
    return res.status(500).json({ error: 'CORS diagnostic failed' });
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