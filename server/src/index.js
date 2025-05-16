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
const { getSentry } = require('./config/sentry');
const authMiddleware = require('./middleware/auth');
const { execSync } = require('child_process');

// Initialize Sentry
const Sentry = getSentry();

// Validate environment variables
validateEnv();

const app = express();

// Initialize Sentry request handler (must be the first middleware)
if (Sentry) {
  app.use(Sentry.Handlers.requestHandler({
    // Include user information in errors
    user: ['id', 'email'],
    // Extract request data
    request: true,
  }));
  
  // Remove the tracing handler since it requires additional setup
  // app.use(Sentry.Handlers.tracingHandler());
}

// Configure CORS
const corsOptions = {
  origin: process.env.CORS_ALLOW_ORIGIN === '*' 
    ? '*' // Allow all origins if explicitly configured
    : (process.env.NODE_ENV === 'production' 
       ? process.env.FRONTEND_URL 
       : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:5176', 'http://localhost:5177']),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept', 'X-Requested-With'],
  exposedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400, // 24 hours
  // Add better Safari support
  optionsSuccessStatus: 200,
  preflightContinue: false
};

// Parse application/json but NOT multipart/form-data
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    const contentType = req.headers['content-type'] || '';
    // Skip raw body parsing for multipart/form-data and webhook endpoints
    if (contentType.includes('multipart/form-data') || req.url.includes('/webhook')) {
      req.rawBody = null;
    } else {
      req.rawBody = buf.toString();
    }
  }
}));

// Parse application/x-www-form-urlencoded but NOT multipart/form-data
app.use(express.urlencoded({ 
  extended: true, 
  limit: '10mb',
  verify: (req, res, buf) => {
    const contentType = req.headers['content-type'] || '';
    // Skip raw body parsing for multipart/form-data
    if (!contentType.includes('multipart/form-data')) {
      req.rawBody = buf.toString();
    }
  }
}));

// Configure CORS
app.use(cors(corsOptions));

// Security setup (after CORS)
setupSecurity(app);

// Log services initialization
if (stripe) {
  logger.info('Stripe service initialized successfully');
} else {
  logger.warn('Stripe service not initialized - payment features will be limited');
}

// Set global middleware options
app.use((req, res, next) => {
  // Make environment variables available to middleware
  req.skipAuthCheck = process.env.SKIP_AUTH_CHECK === 'true';
  req.mockSubscription = process.env.MOCK_SUBSCRIPTION_DATA === 'true';
  next();
});

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

// Simple health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Also add an /api/health endpoint for consistency
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Status endpoint with auth for testing authentication
app.get('/status', authMiddleware, (req, res) => {
  res.json({ 
    status: 'authenticated',
    user: req.user,
    subscriptionStatus: req.user.subscription?.status || 'none',
    environment: process.env.NODE_ENV,
    mockSubscriptionData: process.env.MOCK_SUBSCRIPTION_DATA === 'true'
  });
});

// Sentry error handler (must come before any other error middleware and after all controllers)
if (Sentry) {
  app.use(Sentry.Handlers.errorHandler({
    shouldHandleError(error) {
      // Only report errors with status code >= 400
      return error.status >= 400 || !error.status;
    }
  }));
}

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

// Server startup and port management
const startServer = async () => {
  try {
    // Get the default port from environment or fallback to 3005
    const defaultPort = parseInt(process.env.PORT || '3005');
    
    // Check if port is available, and if not, forcefully free it
    let port = defaultPort;
    let isPortAvailable = await checkPort(port);
    
    // If DISABLE_PORT_FALLBACK=true, force free the port rather than trying alternatives
    if (!isPortAvailable && process.env.DISABLE_PORT_FALLBACK === 'true') {
      logger.warn(`Port ${port} is already in use. Forcefully terminating processes...`);
      
      try {
        // Forcefully kill the process holding this port
        execSync(`lsof -ti:${port} | xargs kill -9 2>/dev/null || true`, { stdio: 'inherit' });
        logger.info(`Terminated process using port ${port}`);
        
        // Wait for the port to be released
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check again if port is available
        isPortAvailable = await checkPort(port);
        if (!isPortAvailable) {
          logger.error(`Failed to free port ${port} after attempting to kill processes`);
        }
      } catch (error) {
        logger.error(`Error freeing port ${port}: ${error.message}`);
      }
    } 
    // Else, try to find an alternative port if fallback is allowed
    else if (!isPortAvailable && process.env.DISABLE_PORT_FALLBACK !== 'true') {
      logger.warn(`Port ${port} is in use. Attempting to find an available port...`);
      
      try {
        port = await findAvailablePort(defaultPort);
        logger.info(`Found available port: ${port}`);
      } catch (error) {
        logger.error(`Could not find available port: ${error.message}`);
        throw error;
      }
    }
    
    // Create HTTP server
    const server = app.listen(port, () => {
      logger.info('Server started successfully', {
        port,
        url: `http://localhost:${port}`,
        environment: process.env.NODE_ENV || 'development',
        frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173'
      });
      
      if (port !== defaultPort) {
        console.log(`⚠️  Port ${defaultPort} was already in use.`);
        console.log(`   Server is running on port ${port} instead.`);
      } else {
        console.log(`🚀 Server running on port ${port}`);
      }
      console.log(`   Access your API at: http://localhost:${port}`);
    });
    
    // Register graceful shutdown handlers
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', { 
        error: error.message,
        stack: error.stack,
        code: error.code,
        errno: error.errno,
        syscall: error.syscall,
        address: error.address,
        port: error.port
      });
      shutdown('uncaughtException');
    });
  } catch (error) {
    logger.error('Startup error', { error: error.message });
    process.exit(1);
  }
};

// Function to check if a specific port is available
const checkPort = (port) => {
  return new Promise((resolve) => {
    const tester = net.createServer()
      .once('error', () => {
        // Port is in use
        resolve(false);
      })
      .once('listening', () => {
        // Port is available, close the server
        tester.close(() => resolve(true));
      })
      .listen(port);
  });
};

// Function to find an available port starting from the given port
const findAvailablePort = async (startPort, maxAttempts = 5) => {
  let port = startPort + 1; // Start with the next port
  let attempts = 0;
  
  // Try up to maxAttempts ports
  while (attempts < maxAttempts) {
    const isAvailable = await checkPort(port);
    if (isAvailable) {
      if (port !== startPort) {
        logger.info(`Original port ${startPort} was busy, using alternative port ${port}`);
      }
      return port;
    }
    
    port++;
    attempts++;
  }
  
  throw new Error(`Could not find available port after ${maxAttempts} attempts`);
};

// Flag to track if shutdown has been initiated
let isShuttingDown = false;

// Graceful shutdown function
const shutdown = async (signal) => {
  // Prevent multiple shutdown attempts
  if (isShuttingDown) {
    logger.info(`Additional shutdown signal received: ${signal} (already shutting down)`);
    return;
  }
  
  isShuttingDown = true;
  logger.info(`Initiating graceful shutdown... (Signal: ${signal})`);
  
  try {
    // Disconnect from database
    if (database.client) {
      await database.client.$disconnect();
      logger.info('Database disconnected successfully');
    }
    
    // Add any other cleanup tasks here
    
    logger.info('Server shut down successfully');
    
    // Exit process with appropriate code
    if (signal === 'uncaughtException') {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (error) {
    logger.error('Error during shutdown:', { error: error.message });
    process.exit(1);
  }
};

startServer();

module.exports = app; 