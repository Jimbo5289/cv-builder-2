const express = require('express');
const cors = require('cors');
const { validateEnv } = require('./config/env');
const { logger } = require('./config/logger');
const database = require('./config/database');
const { setupSecurity } = require('./middleware/security');
const { initialize: initializeDatabase } = require('./scripts/db-init');
const authRoutes = require('./routes/auth');
const cvRoutes = require('./routes/cv');
const checkoutRoutes = require('./routes/checkout');
const webhookRoutes = require('./routes/webhook');
const contactRoutes = require('./routes/contact');
const paymentRoutes = require('./routes/payment');
const subscriptionRoutes = require('./routes/subscription');
const twoFactorRoutes = require('./routes/twoFactor');
const templateRoutes = require('./routes/templates');
const profileRoutes = require('./routes/profile');
const newsletterRoutes = require('./routes/newsletter');
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
  origin: '*', // Allow all origins temporarily for debugging
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept', 'X-Requested-With'],
  exposedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400, // 24 hours
  optionsSuccessStatus: 200,
  preflightContinue: false
};

// Configure CORS
app.use(cors(corsOptions));

// Add additional middleware to ensure CORS headers are set correctly
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE,PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

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

// --- Apply body parsers for JSON and urlencoded BEFORE mounting routes ---
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

// Now mount routes after body parsers are set up
app.use('/api/cv', cvRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/2fa', twoFactorRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/newsletter', newsletterRoutes);

// Add users routes that map to profile routes for backward compatibility
app.use('/api/users/stats', (req, res, next) => {
  // Redirect to profile/stats endpoint
  req.url = '/stats'; // Remove /api/users from the URL
  profileRoutes(req, res, next);
});

// Fix missing /api prefix for cv/user/all endpoint
app.use('/user/all', (req, res, next) => {
  // Redirect to proper API endpoint
  req.url = '/user/all'; // Keep the same path
  cvRoutes(req, res, next);
});

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

// Add a /health endpoint for frontend connection checks
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: Date.now() });
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

// --- Global error handler for multer errors ---
app.use((err, req, res, next) => {
  if (err instanceof require('multer').MulterError) {
    logger.error('Multer error:', { error: err.message });
    return res.status(400).json({ error: 'File upload error', message: err.message });
  }
  next(err);
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
    const port = process.env.PORT || 3005;
    
    // Initialize database connection
    await database.initDatabase();
    logger.info('Database connection initialized');
    
    // Initialize database with default data
    await initializeDatabase();
    logger.info('Database initialized with default data');
    
    // Determine which port to use
    let serverPort = port;
    
    // If FORCE_PORT is not set to true, check if the port is available and find an alternative if needed
    if (process.env.FORCE_PORT !== 'true') {
      serverPort = await findAvailablePort(port);
    } else {
      logger.info('FORCE_PORT is set to true, attempting to use specified port only');
    }
    
    // Create HTTP server
    const server = app.listen(serverPort, () => {
      logger.info('Server started successfully', {
        port: serverPort,
        url: `http://localhost:${serverPort}`,
        environment: process.env.NODE_ENV || 'development',
        frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
        forcedPort: process.env.FORCE_PORT === 'true'
      });
      
      if (serverPort !== port && process.env.FORCE_PORT !== 'true') {
        console.log(`⚠️  Port ${port} was already in use.`);
        console.log(`   Server is running on port ${serverPort} instead.`);
      } else {
        console.log(`🚀 Server running on port ${serverPort}`);
      }
      console.log(`   Access your API at: http://localhost:${serverPort}`);
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
  // First check if the requested port is available
  if (await checkPort(startPort)) {
    return startPort;
  }
  
  // If not, try alternative ports
  let port = startPort + 1;
  let attempts = 0;
  
  // Try up to maxAttempts ports
  while (attempts < maxAttempts) {
    const isAvailable = await checkPort(port);
    if (isAvailable) {
      logger.info(`Original port ${startPort} was busy, using alternative port ${port}`);
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