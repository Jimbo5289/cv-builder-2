/* eslint-disable */
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { logger } = require('../config/logger');

// Enhanced authentication rate limiter with progressive delays
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Reduce from 20 to 5 attempts per window
  message: {
    error: 'Too many login attempts',
    message: 'Please try again in 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip successful requests to avoid penalizing legitimate users
  skipSuccessfulRequests: true,
  handler: (req, res) => {
    const clientIP = req.ip || req.connection.remoteAddress;
    logger.warn(`Authentication rate limit exceeded`, {
      ip: clientIP,
      userAgent: req.headers['user-agent'],
      path: req.path,
      timestamp: new Date().toISOString()
    });
    res.status(429).json({
      error: 'Too many login attempts',
      message: 'Please try again in 15 minutes',
      retryAfter: 15 * 60 // seconds
    });
  }
});

// Stricter password reset rate limiter
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 2, // Reduce from 3 to 2 attempts per hour
  message: {
    error: 'Too many password reset attempts',
    message: 'Please try again in 1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    const clientIP = req.ip || req.connection.remoteAddress;
    logger.warn(`Password reset rate limit exceeded`, {
      ip: clientIP,
      email: req.body?.email || 'unknown',
      timestamp: new Date().toISOString()
    });
    res.status(429).json({
      error: 'Too many password reset attempts',
      message: 'Please try again in 1 hour',
      retryAfter: 60 * 60 // seconds
    });
  }
});

// Registration rate limiter
const registrationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Reduce from 5 to 3 registrations per hour
  message: {
    error: 'Too many registration attempts',
    message: 'Please try again in 1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    const clientIP = req.ip || req.connection.remoteAddress;
    logger.warn(`Registration rate limit exceeded`, {
      ip: clientIP,
      email: req.body?.email || 'unknown',
      timestamp: new Date().toISOString()
    });
    res.status(429).json({
      error: 'Too many registration attempts',
      message: 'Please try again in 1 hour',
      retryAfter: 60 * 60 // seconds
    });
  }
});

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 minutes per IP
  message: {
    error: 'Too many API requests',
    message: 'Please slow down and try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip static assets and health checks
  skip: (req) => {
    return req.path.includes('/health') || 
           req.path.includes('/static/') ||
           req.path.includes('.css') ||
           req.path.includes('.js') ||
           req.path.includes('.png') ||
           req.path.includes('.jpg') ||
           req.path.includes('.ico');
  }
});

// Admin panel rate limiter - very strict
const adminLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // Only 10 requests per 5 minutes for admin endpoints
  message: {
    error: 'Admin rate limit exceeded',
    message: 'Please wait before making more admin requests'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    const clientIP = req.ip || req.connection.remoteAddress;
    logger.error(`Admin rate limit exceeded - potential attack`, {
      ip: clientIP,
      userAgent: req.headers['user-agent'],
      path: req.path,
      user: req.user?.id || 'unknown',
      timestamp: new Date().toISOString()
    });
    res.status(429).json({
      error: 'Admin rate limit exceeded',
      message: 'Please wait before making more admin requests',
      retryAfter: 5 * 60 // seconds
    });
  }
});

// Function to get CSP directives based on environment
const getCspDirectives = () => {
  if (process.env.NODE_ENV === 'production') {
    return {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'https://js.stripe.com'],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", 'https://api.stripe.com'],
      fontSrc: ["'self'", 'https:', 'data:', 'https://fonts.gstatic.com'],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'self'", 'https://js.stripe.com'],
      upgradeInsecureRequests: []
    };
  } else {
    return {
      defaultSrc: ["'self'", "http://localhost:*"],
      scriptSrc: ["'self'", "'unsafe-inline'", 'https://js.stripe.com', "http://localhost:*"],
      styleSrc: ["'self'", "'unsafe-inline'", "http://localhost:*"],
      imgSrc: ["'self'", 'data:', "http://localhost:*"],
      connectSrc: ["'self'", 'https://api.stripe.com', "http://localhost:*"],
      fontSrc: ["'self'", 'https:', 'data:', "http://localhost:*"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'", "http://localhost:*"],
      frameSrc: ["'self'", 'https://js.stripe.com', "http://localhost:*"],
    };
  }
};

const setupSecurity = (app) => {
  // Trust proxy for accurate IP addresses
  app.set('trust proxy', 1);

  // Apply general API rate limiting first
  app.use('/api/', apiLimiter);

  // Basic security headers for all responses
  app.use((req, res, next) => {
    // Remove X-Powered-By header
    res.removeHeader('X-Powered-By');
    
    // Set security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // Enhanced Content Security Policy
    if (process.env.NODE_ENV === 'production') {
      res.setHeader('Content-Security-Policy', 
        "default-src 'self'; " +
        "script-src 'self' https://js.stripe.com; " +
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
        "img-src 'self' data: https:; " +
        "font-src 'self' data: https://fonts.gstatic.com; " +
        "connect-src 'self' https://api.stripe.com; " +
        "frame-src 'self' https://js.stripe.com; " +
        "object-src 'none';"
      );
      
      // HSTS for production
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    } else {
      // More relaxed policy in development
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.setHeader(
        'Content-Security-Policy',
        `default-src 'self' ${frontendUrl}; ` +
        `script-src 'self' 'unsafe-inline' ${frontendUrl}; ` +
        `style-src 'self' 'unsafe-inline' ${frontendUrl}; ` +
        `img-src 'self' data: ${frontendUrl}; ` +
        `font-src 'self' data: ${frontendUrl}; ` +
        `connect-src 'self' ${frontendUrl} ws: wss:`
      );
    }
    
    next();
  });

  // Basic security headers with Helmet
  app.use(helmet({
    // Disable default contentSecurityPolicy since we're setting it manually
    contentSecurityPolicy: false,
    // Configure specific helmet features
    crossOriginEmbedderPolicy: false, // Disable for compatibility
    crossOriginResourcePolicy: { policy: "cross-origin" }
  }));

  // Disable X-Powered-By header
  app.disable('x-powered-by');

  // Set secure cookie flags in production
  if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
      // Set secure cookie defaults
      const originalCookie = res.cookie;
      res.cookie = function(name, value, options = {}) {
        const secureOptions = {
          ...options,
          secure: true, // Require HTTPS
          httpOnly: true, // Prevent client-side JS from reading cookie
          sameSite: 'strict' // CSRF protection
        };
        return originalCookie.call(this, name, value, secureOptions);
      };
      next();
    });
  }

  // Enhanced request logging for security monitoring
  app.use((req, res, next) => {
    const startTime = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const logLevel = res.statusCode >= 400 ? 'warn' : 'info';
      
      logger[logLevel]('Request completed', {
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        referer: req.headers.referer || 'none',
        contentLength: res.get('content-length') || 0
      });
      
      // Log suspicious activity
      if (res.statusCode === 429) {
        logger.error('Rate limit exceeded', {
          ip: req.ip,
          path: req.path,
          userAgent: req.headers['user-agent'],
          timestamp: new Date().toISOString()
        });
      }
    });
    
    next();
  });
};

module.exports = {
  setupSecurity,
  authLimiter,
  passwordResetLimiter,
  registrationLimiter,
  apiLimiter,
  adminLimiter
}; 