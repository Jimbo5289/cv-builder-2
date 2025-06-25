/* eslint-disable */
// Set up warning suppression FIRST, before any modules are loaded
const originalConsoleWarn = console.warn;
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

// Suppress canvas warnings across all console methods
const isCanvasWarning = (message) => {
  return typeof message === 'string' && 
    (message.includes('@napi-rs/canvas') || 
     message.includes('canvas package') ||
     message.includes('Failed to load native binding') ||
     message.includes('Cannot load "@napi-rs/canvas"') ||
     message.includes('napi-rs/canvas') ||
     message.includes('native binding'));
};

console.warn = function(...args) {
  const message = args[0] || '';
  if (isCanvasWarning(message)) {
    return; // Suppress these warnings
  }
  return originalConsoleWarn.apply(console, args);
};

console.log = function(...args) {
  const message = args[0] || '';
  if (typeof message === 'string' && message.startsWith('Warning:') && isCanvasWarning(message)) {
    return; // Suppress canvas warnings that might appear as logs
  }
  return originalConsoleLog.apply(console, args);
};

console.error = function(...args) {
  const message = args[0] || '';
  if (isCanvasWarning(message)) {
    return; // Suppress canvas errors that aren't critical
  }
  return originalConsoleError.apply(console, args);
};

// Load environment variables as early as possible
require('dotenv').config();

// Now load other modules
const express = require('express');
const cors = require('cors');
const { validateEnv } = require('./config/env');
const { logger } = require('./config/logger');
const database = require('./config/database');
const { setupSecurity } = require('./middleware/security');
const { createCorsMiddleware, handlePreflight, addCorsHeaders } = require('./middleware/cors');
const authRoutes = require('./routes/auth');
const cvRoutes = require('./routes/cv');
const checkoutRoutes = require('./routes/checkout');
const webhookRoutes = require('./routes/webhook');
const contactRoutes = require('./routes/contact');
const paymentRoutes = require('./routes/payment');
const subscriptionRoutes = require('./routes/subscription');
const twoFactorRoutes = require('./routes/twoFactor');
const newsletterRoutes = require('./routes/newsletter');
const { getSentry } = require('./config/sentry');
const { auth: authMiddleware } = require('./middleware/auth');
const path = require('path');
const fs = require('fs');
const http = require('http');
const net = require('net');
const { exec } = require('child_process');
const userRoutes = require('./routes/user');
const unsubscribeRoutes = require('./routes/unsubscribe');
const healthRoutes = require('./routes/health');
const adminRoutes = require('./routes/admin');
const debugRoutes = require('./routes/debug');
const analysisRoutes = require('./routes/analysis');

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

// Use the PORT provided by Render's environment variable
const PORT = process.env.PORT || 10000;

// Log the port we're using
logger.info(`Using PORT from environment: ${process.env.PORT || 'fallback to 10000'}`);

// Use regular require instead of dynamic import for express-ws
let expressWs;
try {
  expressWs = require('express-ws');
  if (expressWs && typeof expressWs === 'function') {
    expressWs(app, server);
    logger.info('WebSocket support initialized successfully');
  } else {
    logger.warn('expressWs is not a function, WebSocket features may be limited');
  }
} catch (error) {
  logger.error('Failed to initialize expressWs:', error);
}

// Initialize Sentry request handler (must be the first middleware)
if (Sentry && Sentry.Handlers && Sentry.Handlers.requestHandler) {
  app.use(Sentry.Handlers.requestHandler({
    // Include user information in errors
    user: ['id', 'email'],
    // Extract request data
    request: true,
  }));
  
  // Remove the tracing handler since it requires additional setup
  // app.use(Sentry.Handlers.tracingHandler());
} else {
  logger.info('Sentry handlers not available, skipping request handler setup');
}

// Enhance CORS middleware to handle preflight requests correctly
const corsMiddleware = createCorsMiddleware({
  origin: [
    'https://cv-builder-2-qkccpu31f-jimbo5289s-projects.vercel.app',
    'http://localhost:5173',
    'https://cv-builder-backend-zjax.onrender.com'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept', 'X-Requested-With'],
  credentials: true
});

// Apply CORS middleware
app.use(corsMiddleware);

// Add dedicated preflight handler for better OPTIONS request handling
app.options('*', handlePreflight);

// Add CORS headers to error responses
app.use((err, req, res, next) => {
  addCorsHeaders(req, res);
  next(err);
});

// Security setup (after CORS)
setupSecurity(app);

// Import Stripe configuration
try {
  const stripeConfig = require('../config/stripe.cjs');
  if (stripeConfig && stripeConfig.stripe) {
    logger.info('Stripe service initialized successfully');
    global.stripeService = stripeConfig; // Make it available globally
  } else {
    logger.warn('Stripe service not initialized - payment features will be limited');
  }
} catch (error) {
  logger.error('Failed to initialize Stripe service:', error);
}

// Set global middleware options
app.use((req, res, next) => {
  // Make environment variables available to middleware
  req.skipAuthCheck = process.env.SKIP_AUTH_CHECK === 'true';
  req.mockSubscription = process.env.MOCK_SUBSCRIPTION_DATA === 'true';
  
  // Skip logging for health checks and frequent requests to reduce noise
  const isHealthCheck = req.path.includes('/health') || req.path === '/';
  const isCommonRequest = req.path.includes('/api/health') || req.path === '/status';
  
  // Only log actual API requests (not health checks or static files) and only once per minute per path
  if (process.env.NODE_ENV === 'production' && !isHealthCheck && !isCommonRequest) {
    // Use a simplified path for logging (remove query parameters and IDs)
    const simplifiedPath = req.path.replace(/\/[0-9a-f-]{36}/g, '/:id').split('?')[0];
    
    // Log requests with rate limiting (once per minute per path)
    const cacheKey = `${simplifiedPath}-${Math.floor(Date.now() / 60000)}`;
    if (!global.requestLogCache) global.requestLogCache = new Set();
    
    if (!global.requestLogCache.has(cacheKey)) {
      global.requestLogCache.add(cacheKey);
      logger.info(`Request: ${req.method} ${simplifiedPath} from ${req.headers.origin || 'unknown'}`);
      
      // Clean up old cache entries (keep only the last 100)
      if (global.requestLogCache.size > 100) {
        const iterator = global.requestLogCache.values();
        global.requestLogCache.delete(iterator.next().value);
      }
    }
  }
  
  next();
});

// --- Apply body parsers for JSON and urlencoded BEFORE mounting routes ---
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    const contentType = req.headers['content-type'] || '';
    // For Stripe webhooks, preserve the raw buffer for signature verification
    if (req.url.includes('/webhook')) {
      req.rawBody = buf; // Keep as Buffer for Stripe signature verification
    } else if (contentType.includes('multipart/form-data')) {
      req.rawBody = null; // Skip raw body parsing for multipart/form-data
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
    // For Stripe webhooks, preserve the raw buffer for signature verification
    if (req.url.includes('/webhook')) {
      req.rawBody = buf; // Keep as Buffer for Stripe signature verification
    } else if (!contentType.includes('multipart/form-data')) {
      req.rawBody = buf.toString();
    }
  }
}));

// Now mount routes after body parsers are set up
app.use('/api/cv', cvRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/unsubscribe', unsubscribeRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/2fa', twoFactorRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/debug', debugRoutes);
app.use('/api/analysis', analysisRoutes);

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
  res.status(200).json({ 
    status: 'ok',
    port: PORT,
    timestamp: Date.now()
  });
});

// Also add an /api/health endpoint for consistency
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    port: PORT,
    timestamp: Date.now()
  });
});

// Add a simple root route handler
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'CV Builder API Server',
    status: 'running',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api',
      docs: '/api-docs'
    },
    timestamp: new Date().toISOString()
  });
});

// Status endpoint with auth for testing authentication
app.get('/status', authMiddleware, (req, res) => {
  res.json({ 
    status: 'authenticated',
    user: req.user,
    subscriptionStatus: req.user.subscriptions?.find(sub => 
      sub.status === 'active' && new Date(sub.currentPeriodEnd) > new Date()
    )?.status || 'none',
  });
});

// Constants for serving frontend
const NODE_ENV = process.env.NODE_ENV || 'development';
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
if (Sentry && Sentry.Handlers && Sentry.Handlers.errorHandler) {
  app.use(Sentry.Handlers.errorHandler({
    shouldHandleError(error) {
      // Only report errors with status code >= 400
      return error.status >= 400 || !error.status;
    }
  }));
} else {
  logger.info('Sentry error handler not available, skipping error handler setup');
}

// Global error handler
app.use((err, req, res, _next) => {
  logger.error('Unhandled error:', {
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
    origin: req.headers.origin || 'unknown'
  });

  // Add CORS headers to error responses to prevent CORS errors
  addCorsHeaders(req, res);

  // Detect CORS errors and handle them specially
  if (err.message && (
    err.message.includes('CORS') || 
    err.message.includes('Access-Control-Allow-Origin') ||
    err.message.includes('not allowed by Origin')
  )) {
    return res.status(403).json({
      error: 'CORS Error',
      message: 'Cross-Origin Request Blocked',
      allowedOrigin: req.headers.origin || 'unknown',
      fixInstructions: 'Please ensure you are accessing the API from an allowed origin'
    });
  }

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

// Add a /diagnostics endpoint for comprehensive troubleshooting
app.get('/diagnostics', async (req, res) => {
  try {
    // 1. Basic server info
    const serverInfo = {
      timestamp: new Date().toISOString(),
      hostname: require('os').hostname(),
      platform: process.platform,
      nodeVersion: process.version,
      environment: process.env.NODE_ENV || 'unknown',
      port: PORT,
      render: process.env.RENDER ? true : false,
      memory: process.memoryUsage(),
      uptime: process.uptime()
    };
    
    // 2. Outbound IP detection
    let outboundIp = 'unknown';
    try {
      const services = [
        'https://api.ipify.org',
        'https://ifconfig.me/ip',
        'https://icanhazip.com'
      ];
      
      for (const service of services) {
        try {
          const response = await axios.get(service, { timeout: 5000 });
          outboundIp = response.data.trim();
          break;
        } catch (err) {
          console.log(`Could not get IP from ${service}: ${err.message}`);
        }
      }
    } catch (err) {
      console.error('Error determining outbound IP:', err.message);
    }
    
    // 3. Database connection test (brief)
    let dbStatus = 'not_tested';
    let dbError = null;
    
    try {
      // This won't re-establish a connection if one exists
      const db = await database.initDatabase();
      if (db && db.$queryRaw) {
        const result = await db.$queryRaw`SELECT 1 as connected`;
        dbStatus = result[0].connected === 1 ? 'connected' : 'error';
      } else {
        dbStatus = 'mock_database';
      }
    } catch (err) {
      dbStatus = 'error';
      dbError = err.message;
    }
    
    // 4. Network diagnostics
    const networkDiagnostics = {
      outboundIp,
      allowedIps: [
        '35.180.39.82/32',
        '35.181.114.243/32',
        '35.181.155.97/32',
        '52.59.103.54/32',
        '34.242.126.209/32',
        '52.19.145.128/32',
        '52.19.123.36/32'
      ],
      rdsHost: process.env.DATABASE_URL ? 
        new URL(process.env.DATABASE_URL).hostname : 
        'cvbuilder-db.c1augguy6rx8.eu-central-1.rds.amazonaws.com'
    };
    
    // 5. Environment variables (sanitized)
    const envVars = {
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
      RENDER: process.env.RENDER,
      DATABASE_URL: process.env.DATABASE_URL ? '[masked]' : undefined,
      FRONTEND_URL: process.env.FRONTEND_URL,
      SKIP_AUTH_CHECK: process.env.SKIP_AUTH_CHECK,
      MOCK_DATABASE: process.env.MOCK_DATABASE
    };
    
    // 6. Request information
    const requestInfo = {
      origin: req.headers.origin || 'unknown',
      userAgent: req.headers['user-agent'] || 'unknown',
      ip: req.ip || req.connection.remoteAddress || 'unknown',
      method: req.method,
      path: req.path,
      headers: {
        ...req.headers,
        // Mask any auth headers
        authorization: req.headers.authorization ? '[masked]' : undefined
      }
    };
    
    // Combine all diagnostics
    const diagnostics = {
      serverInfo,
      networkDiagnostics,
      database: {
        status: dbStatus,
        error: dbError
      },
      environment: envVars,
      request: requestInfo
    };
    
    res.json(diagnostics);
  } catch (error) {
    res.status(500).json({
      error: 'Diagnostics failed',
      message: error.message
    });
  }
});

// Add a special CORS test endpoint
app.get('/cors-test', (req, res) => {
  // Log all headers for debugging
  console.log('CORS test request received:');
  console.log('  Origin:', req.headers.origin);
  console.log('  User-Agent:', req.headers['user-agent']);
  
  // Send a simple response with the origin
  res.json({
    success: true,
    message: 'CORS test successful',
    origin: req.headers.origin || 'No origin header',
    timestamp: new Date().toISOString(),
    cors: {
      enabled: true,
      allowedOrigins: corsOptions.origin instanceof Function ? 
        'Dynamic function' : corsOptions.origin
    }
  });
});

// Add a special endpoint to check environment variables (with sensitive info masked)
app.get('/api/debug/env', (req, res) => {
  // Only allow in production for specific testing
  const environment = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    RENDER: process.env.RENDER === 'true',
    DATABASE_URL: process.env.DATABASE_URL ? '[MASKED]' : undefined,
    FRONTEND_URL: process.env.FRONTEND_URL,
    REQUEST_HEADERS: {
      origin: req.headers.origin,
      host: req.headers.host,
      referer: req.headers.referer,
      'user-agent': req.headers['user-agent'],
      'content-type': req.headers['content-type'],
      'accept': req.headers.accept,
    },
    CORS_ENABLED: true,
    SERVER_TIME: new Date().toISOString(),
    SERVER_UPTIME: process.uptime()
  };
  
  res.json(environment);
});

// Import modules for API documentation if available
let swaggerUi, YAML;
try {
  swaggerUi = require('swagger-ui-express');
  YAML = require('yamljs');
} catch (error) {
  logger.warn('API documentation dependencies not available. Docs will not be served.');
}

// Setup API documentation if dependencies are available
if (swaggerUi && YAML) {
  try {
    const swaggerDocument = YAML.load(path.join(__dirname, '../openapi.yaml'));
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'CV Builder API Documentation',
    }));
    logger.info('API documentation available at /api-docs');
  } catch (error) {
    logger.error('Failed to load API documentation:', error);
  }
}

// Server startup function with improved error handling
const startServer = async () => {
  try {
    const PORT = process.env.PORT || 10000;
    const HOST = '0.0.0.0';

    logger.info(`Starting server with PORT=${PORT} and HOST=${HOST}`);
    console.log(`Starting server with PORT=${PORT} and HOST=${HOST}`);

    const server = app.listen(PORT, HOST, () => {
      const addr = server.address();
      logger.info('Server started successfully:', {
        port: addr.port,
        host: addr.address,
        url: `http://${HOST}:${PORT}`,
        environment: process.env.NODE_ENV,
        frontendUrl: process.env.FRONTEND_URL,
        render: process.env.RENDER ? 'true' : 'false'
      });

      console.log('===================================================');
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`   Bound to interface: ${HOST}`);
      console.log(`   Environment: ${process.env.NODE_ENV}`);
      if (process.env.NODE_ENV === 'production') {
        console.log(`   Access your API at: https://cv-builder-backend-zjax.onrender.com`);
        console.log(`   WebSocket available at: wss://cv-builder-backend-zjax.onrender.com/ws`);
      } else {
        console.log(`   Access your API at: http://${HOST}:${PORT}`);
        console.log(`   WebSocket available at: ws://${HOST}:${PORT}/ws`);
      }
      console.log('===================================================');
    });

    server.on('error', (error) => {
      logger.error('Server error:', error);
      console.error('Server error:', error);
    });

    return server;
  } catch (error) {
    logger.error('Failed to start server:', error);
    throw error;
  }
};

// Start the server
startServer();

module.exports = app;