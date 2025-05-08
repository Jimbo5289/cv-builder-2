const morgan = require('morgan');
const { logger } = require('../config/logger');
const analyticsService = require('../services/analyticsService');
const Anonymizer = require('../utils/anonymizer');

// Create custom Morgan token for user information
morgan.token('user-info', (req) => {
  if (!req.user) return 'Unauthenticated';
  return Anonymizer.maskUserId(req.user.id);
});

morgan.token('page-info', (req) => {
  const referer = req.headers.referer ? Anonymizer.hashData(req.headers.referer) : 'Direct visit';
  const userAgent = req.headers['user-agent'] || 'Unknown';
  return `Page: ${req.originalUrl}, Referer: ${referer}, User-Agent: ${userAgent}`;
});

// Performance monitoring
const startTime = Symbol('request-start-time');

// Create custom format
const morganFormat = ':remote-addr - :user-info [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :page-info';

// Create Morgan middleware with custom format
const requestLogger = morgan(morganFormat, {
  stream: {
    write: (message) => {
      const cleanMessage = message.trim();
      logger.http(cleanMessage);

      // Additional detailed logging for page visits
      if (message.includes('GET')) {
        const pageVisit = {
          url: message.match(/"GET ([^"]+)/)?.[1] || 'Unknown URL',
          timestamp: new Date().toISOString(),
          userInfo: message.match(/- ([^[]+)/)?.[1].trim() || 'Unknown User',
          referer: message.match(/"([^"]+)" "[^"]+" Page:/)?.[1] || 'Direct Visit'
        };
        
        logger.info('Page Visit', Anonymizer.anonymizeRequestData(pageVisit));
      }
    }
  }
});

// Middleware for tracking active users and performance
const pageTracker = (req, res, next) => {
  // Start timing the request
  req[startTime] = Date.now();

  // Track the page view
  analyticsService.trackPageView(req);

  // Track response time
  res.on('finish', () => {
    const duration = Date.now() - req[startTime];
    analyticsService.trackPerformance({
      type: 'api',
      duration,
      details: {
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode
      }
    });
  });

  next();
};

// Error tracking middleware
const errorTracker = (err, req, res, next) => {
  analyticsService.trackError(err, req);
  next(err);
};

module.exports = {
  requestLogger,
  pageTracker,
  errorTracker
}; 