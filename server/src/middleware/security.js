/* eslint-disable */
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { logger } = require('../config/logger');

// Standard rate limiter for authentication
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per windowMs
  message: {
    error: 'Too many requests',
    message: 'Please try again later'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: 'Too many requests',
      message: 'Please try again later'
    });
  }
});

// Specific rate limiter for password reset requests
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 requests per hour
  message: {
    error: 'Too many password reset attempts',
    message: 'Please try again later'
  }
});

// Specific rate limiter for registration attempts
const registrationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 registration attempts per hour
  message: {
    error: 'Too many registration attempts',
    message: 'Please try again later'
  }
});

// Function to get CSP directives based on environment
const getCspDirectives = () => {
  if (process.env.NODE_ENV === 'production') {
    return {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", 'https://js.stripe.com'],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:'],
      connectSrc: ["'self'", 'https://api.stripe.com'],
      fontSrc: ["'self'", 'https:', 'data:'],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'self'", 'https://js.stripe.com'],
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
  authLimiter, // Use the standard auth limiter
  passwordResetLimiter,
  registrationLimiter
}; 