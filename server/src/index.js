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
const path = require('path');
const fs = require('fs');
const http = require('http');
const expressWs = require('express-ws');
const net = require('net');
const { exec } = require('child_process');

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

// Create Express app
const app = express();

// Setup WebSockets with Express
// Create HTTP server - must be created BEFORE expressWs is called
const server = http.createServer(app);

// Setup WebSockets with Express
const wsInstance = expressWs(app, server, {
  wsOptions: {
    // Keep connections alive with ping/pong
    perMessageDeflate: false,
    clientTracking: true
  }
});

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
  origin: function(origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173', 
      'http://127.0.0.1:5173', 
      'http://localhost:5174', 
      'http://127.0.0.1:5174',
      'https://cv-builder-vercel.vercel.app',
      'https://cv-builder-2-hvz356vyk-jimbo5289s-projects.vercel.app'
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
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
app.use('/api/users', authRoutes);
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
  });
});

// Constants for serving frontend
const NODE_ENV = process.env.NODE_ENV || 'development';
let PORT = process.env.PORT || 3005;
let FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const DIST_DIR = path.join(__dirname, '../../dist');

// Support automatic detection of the frontend port (5173 or 5174)
const checkFrontendPort = async (port) => {
  return new Promise((resolve) => {
    const client = net.connect({ port, host: 'localhost' }, () => {
      client.end();
      resolve(true);
    });
    client.on('error', () => {
      resolve(false);
    });
  });
};

// Check if port 5173 is available, if not use 5174
(async () => {
  // Only run this in development mode
  if (process.env.NODE_ENV !== 'production') {
    const port5173Available = await checkFrontendPort(5173);
    if (port5173Available) {
      FRONTEND_URL = 'http://localhost:5173';
    } else {
      const port5174Available = await checkFrontendPort(5174);
      if (port5174Available) {
        FRONTEND_URL = 'http://localhost:5174';
      }
    }
  } else if (process.env.FRONTEND_URL) {
    // In production, use the environment variable
    FRONTEND_URL = process.env.FRONTEND_URL;
    logger.info(`Using production frontend URL from environment: ${FRONTEND_URL}`);
  } else {
    // Default production URL if not specified
    FRONTEND_URL = 'https://cv-builder-2.onrender.com';
    logger.info(`Using default production frontend URL: ${FRONTEND_URL}`);
  }
  logger.info(`Using frontend URL: ${FRONTEND_URL}`);
})();

// Check if we have a built frontend 
const hasFrontendBuild = fs.existsSync(DIST_DIR) && fs.existsSync(path.join(DIST_DIR, 'index.html'));

// Serve static frontend files from the dist directory if available
if (hasFrontendBuild) {
  logger.info(`Serving static frontend files from ${DIST_DIR}`);
  app.use(express.static(DIST_DIR));
  
  // Handle all frontend routes - serve index.html for any non-API routes
  app.get(/^(?!\/api).*/, (req, res) => {
    logger.debug(`Serving index.html for frontend route: ${req.path}`);
    res.sendFile(path.join(DIST_DIR, 'index.html'));
  });
} else {
  // In development, redirect to the development server for frontend routes
  app.get(/^(?!\/api).*/, (req, res) => {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    logger.debug(`Redirecting to frontend dev server: ${frontendUrl}${req.path}`);
    res.redirect(`${frontendUrl}${req.path}`);
  });
}

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

// 404 handler for API routes only
app.use('/api/*', (req, res) => {
  logger.warn('API route not found:', {
    path: req.path,
    method: req.method
  });
  res.status(404).json({ error: 'API endpoint not found' });
});

// Server startup function with improved error handling
const startServer = async () => {
  try {
    // Add graceful shutdown handler
    const gracefulShutdown = (signal) => {
      logger.info(`Server shutting down due to ${signal}`);
      server.close(() => {
        logger.info('HTTP server closed');
        
        // Close database connection
        database.disconnect().then(() => {
          logger.info('Database connection closed');
          process.exit(0);
        }).catch(err => {
          logger.error('Error closing database connection:', err);
          process.exit(1);
        });
      });
    };

    // Handle termination signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('uncaughtException', (err) => {
      logger.error('Uncaught Exception:', { error: err.message, stack: err.stack });
      gracefulShutdown('UNCAUGHT_EXCEPTION');
    });

    // Check if port is in use before starting
    const checkPort = async (port) => {
      return new Promise((resolve) => {
        const tester = net.createServer()
          .once('error', err => {
            if (err.code === 'EADDRINUSE') {
              logger.warn(`Port ${port} is already in use, trying to close the process...`);
              // Try to kill the process using this port
              try {
                if (process.platform === 'win32') {
                  exec(`netstat -ano | findstr :${port} | findstr LISTENING`, (error, stdout) => {
                    if (!error && stdout) {
                      const pid = stdout.split(/\s+/).pop();
                      exec(`taskkill /F /PID ${pid}`);
                      setTimeout(() => resolve(true), 1000);
                    } else {
                      resolve(false);
                    }
                  });
                } else {
                  // Unix-like systems
                  exec(`lsof -i :${port} -t | xargs kill -9`, (error) => {
                    setTimeout(() => resolve(!error), 1000);
                  });
                }
              } catch (e) {
                logger.error('Failed to kill process:', e);
                resolve(false);
              }
            } else {
              resolve(false);
            }
          })
          .once('listening', () => {
            tester.once('close', () => resolve(true))
              .close();
          })
          .listen(port);
      });
    };

    // In production, don't check port or try to kill processes
    if (process.env.NODE_ENV === 'production') {
      // Start the server without port checking in production
      server.listen(PORT, () => {
        logger.info('Server started successfully:', { 
          port: PORT,
          url: `http://localhost:${PORT}`,
          environment: NODE_ENV,
          frontendUrl: FRONTEND_URL
        });
        
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`   Access your API at: http://localhost:${PORT}`);
        console.log(`   WebSocket available at: ws://localhost:${PORT}/ws`);
      });
    } else {
      // Try to start the server with port checking in development
      const portAvailable = await checkPort(PORT);
      if (!portAvailable) {
        logger.warn(`Could not free up port ${PORT}. Using alternative port ${PORT + 1}`);
        PORT = PORT + 1;
      }

      // Start the server
      server.listen(PORT, () => {
        logger.info('Server started successfully:', { 
          port: PORT,
          url: `http://localhost:${PORT}`,
          environment: NODE_ENV,
          frontendUrl: FRONTEND_URL
        });
        
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`   Access your API at: http://localhost:${PORT}`);
        console.log(`   WebSocket available at: ws://localhost:${PORT}/ws`);
      });
    }

    return server;
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

module.exports = app;