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
const { getSentry } = require('./config/sentry');
const authMiddleware = require('./middleware/auth');

// Try to import fix-database, but don't fail if it's not available
let ensureDevUser;
try {
  // First try the simplified version
  const fixDatabase = require('./config/fix-database.simple');
  ensureDevUser = fixDatabase.ensureDevUser;
  logger.info('Loaded simplified fix-database module');
} catch (err1) {
  try {
    // Then try the regular version
    const fixDatabase = require('./config/fix-database');
    ensureDevUser = fixDatabase.ensureDevUser;
    logger.info('Loaded standard fix-database module');
  } catch (err2) {
    // If both fail, create a placeholder function
    logger.warn('Could not load fix-database module, using placeholder');
    ensureDevUser = async () => {
      logger.info('Using placeholder for ensureDevUser function');
      return { id: process.env.DEV_USER_ID || 'dev-user-id' };
    };
  }
}

// Initialize Sentry
const Sentry = getSentry();

// Validate environment variables
validateEnv();

// Initialize development database if needed
if (process.env.NODE_ENV === 'development' && process.env.SKIP_AUTH_CHECK === 'true') {
  logger.info('Development mode detected with SKIP_AUTH_CHECK. Initializing development database...');
  // Will run asynchronously - we'll await the connection in the startServer function
  ensureDevUser().catch(err => {
    logger.error('Error initializing development database:', err);
  });
}

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
  origin: '*', // Allow all origins for development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept', 'X-Requested-With'],
  exposedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400, // 24 hours
  // Add better Safari support
  optionsSuccessStatus: 200,
  preflightContinue: false
};

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
app.use((err, req, res, _next) => {
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
    // Get the port from environment - this will be set by our port manager
    const port = parseInt(process.env.PORT || '3005');
    
    // Initialize database connection
    await database.initDatabase();
    
    // Create HTTP server
    app.listen(port, () => {
      logger.info('Server started successfully', {
        port,
        url: `http://localhost:${port}`,
        environment: process.env.NODE_ENV || 'development',
        frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173'
      });
      
        console.log(`🚀 Server running on port ${port}`);
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
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Modify the shutdown function to only focus on clean termination
const shutdown = async (signal) => {
  logger.info(`Initiating graceful shutdown... (Signal: ${signal})`);
  
  try {
    // Disconnect from the database
    await database.disconnectDatabase();
      logger.info('Database disconnected successfully');
    
    // Close any other resources here if needed
    
    logger.info('Server shut down successfully');
      process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown:', error);
    process.exit(1);
  }
};

// Initialize and start the server
startServer();

module.exports = app; 