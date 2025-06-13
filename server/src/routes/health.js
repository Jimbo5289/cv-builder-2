/**
 * Health Check Routes
 * 
 * This module provides endpoints for health checking and status monitoring.
 * These endpoints are used by monitoring tools and load balancers to verify
 * that the application is running correctly.
 */

const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const os = require('os');

// Initialize Prisma client
const prisma = new PrismaClient();

// Function to add CORS headers
function addCorsHeaders(req, res) {
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

/**
 * @route GET /health
 * @desc Basic health check endpoint
 * @access Public
 */
router.get('/', async (req, res) => {
  addCorsHeaders(req, res);
  try {
    // Return simple OK response
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('Health check error:', error);
    addCorsHeaders(req, res);
    res.status(500).json({ status: 'error', message: 'Health check failed' });
  }
});

/**
 * @route GET /health/db
 * @desc Database connection health check
 * @access Public
 */
router.get('/db', async (req, res) => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ 
      status: 'ok', 
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database health check error:', error);
    res.status(500).json({ 
      status: 'error', 
      database: 'disconnected',
      message: 'Database connection failed',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * @route GET /health/full
 * @desc Comprehensive health check of all system components
 * @access Public
 */
router.get('/full', async (req, res) => {
  try {
    // Check database connection
    let dbStatus = 'error';
    try {
      await prisma.$queryRaw`SELECT 1`;
      dbStatus = 'ok';
    } catch (dbError) {
      console.error('Database health check error:', dbError);
    }

    // Return comprehensive health status
    res.status(dbStatus === 'ok' ? 200 : 500).json({
      status: dbStatus === 'ok' ? 'ok' : 'error',
      components: {
        server: 'ok',
        database: dbStatus,
      },
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  } catch (error) {
    console.error('Full health check error:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Health check failed',
      timestamp: new Date().toISOString()
    });
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

module.exports = router;