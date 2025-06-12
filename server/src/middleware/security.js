/* eslint-disable */
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
  // Basic security headers for all responses
  app.use((req, res, next) => {
    // Remove X-Powered-By header
    res.removeHeader('X-Powered-By');
    
    // Set security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    
    // Set strict Content-Security-Policy in production
    if (process.env.NODE_ENV === 'production') {
      res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'");
    } else {
      // More relaxed policy in development
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.setHeader(
        'Content-Security-Policy',
        `default-src 'self' ${frontendUrl}; script-src 'self' 'unsafe-inline' ${frontendUrl}; style-src 'self' 'unsafe-inline' ${frontendUrl}; img-src 'self' data: ${frontendUrl}; font-src 'self' data: ${frontendUrl}; connect-src 'self' ${frontendUrl} ws: wss:`
      );
    }
    
    // Additional CORS headers for Safari and cross-origin fetch with credentials
    const origin = req.headers.origin;
    const allowedOrigins = [
      'http://localhost:5173', 
      'http://127.0.0.1:5173',
      'https://cv-builder-2-6jn6ti85z-jimbo5289s-projects.vercel.app',
      'https://cv-builder-2.vercel.app',
      'https://cv-builder-vercel.vercel.app',
      'https://cv-builder-2-git-main-jimbo5289s-projects.vercel.app',
      'https://cv-builder-2-hvz356vyk-jimbo5289s-projects.vercel.app'
    ];
    
    if (origin && allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Origin, Accept');
      
      // Handle preflight requests
      if (req.method === 'OPTIONS') {
        return res.status(200).end();
      }
    }
    
    next();
  });

  // Basic security headers with Helmet
  app.use(helmet({
    // Disable default contentSecurityPolicy since we're setting it manually
    contentSecurityPolicy: false
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