/* eslint-disable */
const { logger } = require('./logger');

// Define request handler that logs requests
const requestHandler = (req, res, next) => {
    logger.debug('Request received:', {
        method: req.method,
        path: req.path,
        query: req.query,
        body: req.body
    });
    next();
};

// Define tracing handler for performance monitoring
const tracingHandler = (req, res, next) => {
    const startTime = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        logger.debug('Request completed:', {
            method: req.method,
            path: req.path,
            status: res.statusCode,
            duration: `${duration}ms`
        });
    });
    next();
};

// Define error handler
const errorHandler = (err, req, res, next) => {
    logger.error('Error in request:', {
        error: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        path: req.path,
        method: req.method,
        body: req.body
    });
    next(err);
};

// Fallback error handler
const fallbackErrorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : err.message;

    res.status(statusCode).json({
        status: 'error',
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = {
    requestHandler,
    tracingHandler,
    errorHandler,
    fallbackErrorHandler
}; 