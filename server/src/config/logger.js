/* eslint-disable */
const { createLogger, format, transports } = require('winston');

// Determine log level based on environment
const getLogLevel = () => {
  if (process.env.NODE_ENV === 'production') {
    return process.env.LOG_LEVEL || 'warn'; // Less verbose in production
  }
  return process.env.LOG_LEVEL || 'info';
};

// Create custom format for production
const productionFormat = format.combine(
  format.timestamp(),
  format.errors({ stack: true }),
  format.json(),
  format.printf(({ timestamp, level, message, ...meta }) => {
    // Simplify production logs
    if (process.env.NODE_ENV === 'production') {
      // Only include essential information in production
      const essentialMeta = {};
      if (meta.userId) essentialMeta.userId = meta.userId;
      if (meta.method) essentialMeta.method = meta.method;
      if (meta.path) essentialMeta.path = meta.path;
      if (meta.statusCode) essentialMeta.statusCode = meta.statusCode;
      if (meta.error) essentialMeta.error = meta.error;
      
      return JSON.stringify({
        timestamp,
        level,
        message,
        ...essentialMeta
      });
    }
    
    // Full logging in development
    return JSON.stringify({
      timestamp,
      level,
      message,
      ...meta
    });
  })
);

const logger = createLogger({
  level: getLogLevel(),
  format: productionFormat,
  defaultMeta: { service: 'cv-builder-api' },
  transports: [
    new transports.Console({
      handleExceptions: true,
      handleRejections: true,
      format: format.combine(
        format.colorize(),
        format.simple()
      )
    })
  ],
  exitOnError: false
});

// Add file logging in production if needed
if (process.env.NODE_ENV === 'production' && process.env.LOG_TO_FILE === 'true') {
  logger.add(new transports.File({
    filename: 'logs/error.log',
    level: 'error',
    maxsize: 10485760, // 10MB
    maxFiles: 5
  }));
  
  logger.add(new transports.File({
    filename: 'logs/combined.log',
    maxsize: 10485760, // 10MB
    maxFiles: 5
  }));
}

module.exports = { logger }; 