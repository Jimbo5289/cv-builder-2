const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { logger } = require('../config/logger');

// Create an auth rate limiter to prevent brute force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    logger.warn('Rate limit exceeded:', { 
      ip: req.ip, 
      path: req.path 
    });
    res.status(429).json({
      error: 'Too many login attempts. Please try again later.'
    });
  }
});

const setupSecurity = (app) => {
  // Basic security headers with Helmet
  app.use(helmet());

  // Content Security Policy - configured for development
  app.use(helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", "http://localhost:*"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "http://localhost:*"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https:', "http://localhost:*"],
      imgSrc: ["'self'", 'data:', 'https:', "http://localhost:*"],
      connectSrc: ["'self'", 'https://api.stripe.com', "http://localhost:*"],
      fontSrc: ["'self'", 'https:', 'data:', "http://localhost:*"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'", "http://localhost:*"],
      frameSrc: ["'self'", 'https://js.stripe.com', "http://localhost:*"],
    },
  }));

  // XSS Protection
  app.use(helmet.xssFilter());
  app.use(helmet.noSniff());

  // Prevent clickjacking
  app.use(helmet.frameguard({ action: 'deny' }));

  // Disable X-Powered-By header
  app.disable('x-powered-by');

  // Additional security headers
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });

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
  authLimiter
}; 