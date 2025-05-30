const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { logger } = require('../config/logger');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Import rate limiters from rateLimiter.js
const { 
  authLimiter: dbAuthLimiter, 
  passwordResetLimiter, 
  registrationLimiter 
} = require('./rateLimiter');

// Define environment-specific CSP directives
const getCspDirectives = () => {
  if (process.env.NODE_ENV === 'production') {
    return {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'https://js.stripe.com'],
      styleSrc: ["'self'", 'https:'],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", 'https://api.stripe.com'],
      fontSrc: ["'self'", 'https:', 'data:'],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'self'", 'https://js.stripe.com'],
      upgradeInsecureRequests: []
    };
  } else {
    // Development environment - less restrictive
    return {
      defaultSrc: ["'self'", "http://localhost:*"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "http://localhost:*"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https:', "http://localhost:*"],
      imgSrc: ["'self'", 'data:', 'https:', "http://localhost:*"],
      connectSrc: ["'self'", 'https://api.stripe.com', "http://localhost:*"],
      fontSrc: ["'self'", 'https:', 'data:', "http://localhost:*"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'", "http://localhost:*"],
      frameSrc: ["'self'", 'https://js.stripe.com', "http://localhost:*"],
    };
  }
};

const setupSecurity = (app) => {
  // Basic security headers with Helmet
  app.use(helmet());

  // Content Security Policy 
  app.use(helmet.contentSecurityPolicy({
    directives: getCspDirectives()
  }));

  // XSS Protection
  app.use(helmet.xssFilter());
  app.use(helmet.noSniff());

  // Prevent clickjacking
  app.use(helmet.frameguard({ action: 'deny' }));

  // Disable X-Powered-By header
  app.disable('x-powered-by');

  // Set secure cookie flags in production
  if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1); // Trust first proxy
    app.use((req, res, next) => {
      res.cookie('secure', true); // Require HTTPS
      res.cookie('httpOnly', true); // Prevent client-side JS from reading cookie
      res.cookie('sameSite', 'strict'); // CSRF protection
      next();
    });
  }

  // Basic request logging
  app.use((req, res, next) => {
    res.on('finish', () => {
      if (res.statusCode >= 400) {
        logger.warn('Request error:', {
          method: req.method,
          path: req.path,
          statusCode: res.statusCode,
          ip: req.ip
        });
      }
    });
    next();
  });
};

module.exports = {
  setupSecurity,
  authLimiter: dbAuthLimiter, // Use the more comprehensive auth limiter
  passwordResetLimiter,
  registrationLimiter
}; 