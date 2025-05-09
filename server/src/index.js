const express = require('express');
const cors = require('cors');
const { validateEnv } = require('./config/env');
const { logger } = require('./config/logger');
const database = require('./config/database');
const { setupSecurity } = require('./middleware/security');
const authRoutes = require('./routes/auth');
const cvRoutes = require('./routes/cv');
const checkoutRoutes = require('./routes/checkout');
const webhookRoutes = require('./routes/webhook');
const contactRoutes = require('./routes/contact');
const paymentRoutes = require('./routes/payment');
const subscriptionRoutes = require('./routes/subscription');
const twoFactorRoutes = require('./routes/twoFactor');
const { stripe } = require('./config/stripe');
const net = require('net');

// Validate environment variables
validateEnv();

const app = express();

// Parse JSON bodies (except for webhook routes)
app.use((req, res, next) => {
  if (req.originalUrl === '/api/webhook/stripe') {
    express.raw({ type: 'application/json' })(req, res, next);
  } else {
    express.json()(req, res, next);
  }
});
app.use(express.urlencoded({ extended: true }));

// Configure CORS
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176', 'http://localhost:5177'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));

// Security setup (after CORS)
setupSecurity(app);

// Log services initialization
if (stripe) {
  logger.info('Stripe service initialized successfully');
} else {
  logger.warn('Stripe service not initialized - payment features will be limited');
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cv', cvRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/2fa', twoFactorRoutes);
app.use('/api/contact', contactRoutes);

// Webhook route must come after raw body parser
app.use('/api/webhook/stripe', webhookRoutes);

// Test endpoint for contact form
app.post('/api/contact/test', (req, res) => {
  logger.info('Contact test endpoint hit!');
  logger.debug('Request body:', req.body);
  res.json({
    success: true,
    message: 'Contact test endpoint working',
    received: req.body
  });
});

// Health check endpoint
app.get('/health', async (req, res) => {
  // Check database connection by trying a simple query
  let dbStatus = 'error';
  try {
    await database.client.$queryRaw`SELECT 1`;
    dbStatus = 'ok';
  } catch (err) {
    logger.error('Database health check failed:', err);
  }

  const services = {
    database: dbStatus,
    stripe: stripe ? 'ok' : 'not configured',
    email: process.env.EMAIL_HOST ? 'configured' : 'not configured'
  };

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    services
  });
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', {
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method
  });

  // Don't leak error details in production
  const response = {
    error: process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred' 
      : err.message
  };

  res.status(err.status || 500).json(response);
});

// 404 handler
app.use((req, res) => {
  logger.warn('Route not found:', {
    path: req.path,
    method: req.method
  });
  res.status(404).json({ error: 'Not found' });
});

// Function to check if a port is available
const isPortAvailable = (port) => {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        logger.warn(`Port ${port} is already in use`);
      } else {
        logger.error(`Error checking port ${port}:`, err);
      }
      resolve(false);
    });
    
    server.once('listening', () => {
      server.close();
      resolve(true);
    });
    
    server.listen(port);
  });
};

// Function to find an available port
const findAvailablePort = async (startPort, maxAttempts = 10) => {
  let port = startPort;
  let attempts = 0;
  
  while (!(await isPortAvailable(port))) {
    port++;
    attempts++;
    
    if (attempts >= maxAttempts) {
      throw new Error(`No available ports found in range ${startPort}-${startPort + maxAttempts}`);
    }
  }
  
  if (port !== startPort) {
    logger.info(`Original port ${startPort} was busy, using alternative port ${port}`);
  }
  
  return port;
};

// Start server safely without killing existing processes
const startServer = async () => {
  try {
    const requestedPort = parseInt(process.env.PORT) || 3005;
    
    // Check if the requested port is available
    let port = requestedPort;
    if (!(await isPortAvailable(requestedPort))) {
      logger.warn(`Port ${requestedPort} is in use. Attempting to find an available port...`);
      try {
        port = await findAvailablePort(requestedPort + 1);
        logger.info(`Found available port: ${port}`);
      } catch (error) {
        logger.error('Failed to find an available port:', error.message);
        throw new Error(`Cannot start server: ${error.message}`);
      }
    }
    
    // Initialize database connection before starting server
    await database.connect();
    
    const server = app.listen(port, () => {
      const serverUrl = `http://localhost:${port}`;
      logger.info('Server started successfully', {
        port: port, 
        url: serverUrl,
        environment: process.env.NODE_ENV,
        frontendUrl: process.env.FRONTEND_URL
      });
      
      if (port !== requestedPort) {
        console.log(`\n⚠️  Port ${requestedPort} was already in use.`);
        console.log(`   Server is running on port ${port} instead.`);
        console.log(`   Access your API at: ${serverUrl}\n`);
      } else {
        console.log(`\n🚀 Server running on port ${port}`);
        console.log(`   Access your API at: ${serverUrl}\n`);
      }
    });

    // Graceful shutdown
    const shutdown = async (signal) => {
      logger.info(`Initiating graceful shutdown... (Signal: ${signal || 'unknown'})`);
      
      // Set a timeout to force exit if graceful shutdown takes too long
      const forceExitTimeout = setTimeout(() => {
        logger.error('Graceful shutdown timed out after 10s, forcing exit');
        process.exit(1);
      }, 10000);
      
      server.close(async () => {
        clearTimeout(forceExitTimeout);
        await database.disconnect();
        logger.info('Server shut down successfully');
        process.exit(0);
      });
      
      // If server doesn't accept new connections within 5s, force close
      setTimeout(() => {
        if (server.listening) {
          logger.warn('Server still listening after 5s, forcing close');
          server.close();
        }
      }, 5000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    // Handle uncaught exceptions
    process.on('uncaughtException', async (error) => {
      logger.error('Uncaught Exception:', error);
      await shutdown('uncaughtException');
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', async (reason, promise) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
      await shutdown('unhandledRejection');
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    console.error('\n❌ Server failed to start:', error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app; 