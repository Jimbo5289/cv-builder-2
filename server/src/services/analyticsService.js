const Sentry = require('@sentry/node');
const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const Anonymizer = require('../utils/anonymizer');
const winston = require('winston');
const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logs/analytics-error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/analytics-combined.log' })
  ]
});

// Input validation schemas
const performanceMetricSchema = z.object({
  type: z.enum(['api', 'database']),
  duration: z.number().positive(),
  details: z.record(z.unknown()).optional()
});

const errorSchema = z.object({
  name: z.string(),
  message: z.string(),
  stack: z.string().optional(),
  code: z.string().optional()
});

class AnalyticsService {
  constructor() {
    // Initialize Prisma client
    this.prisma = new PrismaClient();

    // Initialize Sentry
    if (process.env.SENTRY_DSN) {
      Sentry.init({
        dsn: process.env.SENTRY_DSN,
        environment: process.env.NODE_ENV || 'development',
        tracesSampleRate: 1.0,
        integrations: [
          new Sentry.Integrations.Http({ tracing: true }),
          new Sentry.Integrations.Express(),
          new Sentry.Integrations.Prisma()
        ],
        beforeSend(event) {
          // Anonymize sensitive data before sending to Sentry
          if (event.user) {
            event.user = Anonymizer.anonymizeUserData(event.user);
          }
          return event;
        }
      });
      logger.info('Sentry initialized successfully');
    } else {
      logger.warn('Sentry DSN not provided, error tracking will be limited');
    }

    // Initialize Google Analytics if credentials are provided
    if (process.env.GOOGLE_ANALYTICS_CREDENTIALS) {
      try {
        this.analyticsClient = new BetaAnalyticsDataClient({
          credentials: JSON.parse(process.env.GOOGLE_ANALYTICS_CREDENTIALS),
        });
        logger.info('Google Analytics client initialized successfully');
      } catch (error) {
        logger.error('Failed to initialize Google Analytics client:', error);
      }
    } else {
      logger.warn('Google Analytics credentials not provided, analytics will be limited');
    }

    // Initialize in-memory metrics
    this.metrics = {
      activeUsers: new Set(),
      pageViews: {},
      errors: {},
      performance: {
        apiLatency: [],
        databaseQueries: [],
      },
    };

    // Start cleanup and persistence tasks
    this.startCleanup();
    this.startPersistence();
  }

  /**
   * Track a page view
   * @param {Object} req - Express request object
   * @returns {Object} Anonymized request data
   */
  async trackPageView(req) {
    try {
      const anonymizedData = Anonymizer.anonymizeRequestData(req);
      const { url, userId } = anonymizedData;

      // Update page view metrics
      this.pageViews[url] = (this.pageViews[url] || 0) + 1;

      // Track active users
      if (userId) {
        this.metrics.activeUsers.add(userId);
      }

      // Persist to database
      await this.prisma.pageView.create({
        data: {
          url,
          userId: userId || null,
          timestamp: new Date(),
          userAgent: req.headers['user-agent'],
          referrer: req.headers.referer || null
        }
      });

      // Send to Sentry for user session tracking
      if (process.env.SENTRY_DSN) {
        Sentry.addBreadcrumb({
          category: 'pageview',
          message: `Page visited: ${url}`,
          level: 'info',
          data: anonymizedData,
        });
      }

      // Send to Google Analytics if available
      if (this.analyticsClient) {
        try {
          await this.analyticsClient.runReport({
            property: `properties/${process.env.GA_PROPERTY_ID}`,
            dateRanges: [{
              startDate: 'today',
              endDate: 'today'
            }],
            metrics: [{
              name: 'screenPageViews'
            }],
            dimensions: [{
              name: 'pagePath'
            }]
          });
        } catch (error) {
          logger.error('Failed to send data to Google Analytics:', error);
        }
      }

      return anonymizedData;
    } catch (error) {
      logger.error('Error tracking page view:', error);
      throw error;
    }
  }

  /**
   * Track an error
   * @param {Error} error - Error object
   * @param {Object} req - Express request object
   * @returns {Object} Anonymized error data
   */
  async trackError(error, req) {
    try {
      const validatedError = errorSchema.parse(error);
      const anonymizedError = Anonymizer.anonymizeError(validatedError);
      const errorKey = `${validatedError.name}: ${validatedError.message}`;
      
      // Update error metrics
      this.metrics.errors[errorKey] = (this.metrics.errors[errorKey] || 0) + 1;

      // Persist to database
      await this.prisma.errorLog.create({
        data: {
          name: validatedError.name,
          message: validatedError.message,
          stack: validatedError.stack,
          code: validatedError.code,
          userId: req?.user?.id || null,
          timestamp: new Date(),
          url: req?.url,
          method: req?.method
        }
      });

      // Send to Sentry
      if (process.env.SENTRY_DSN) {
        Sentry.withScope((scope) => {
          if (req) {
            scope.setUser(Anonymizer.anonymizeRequestData(req));
            scope.setExtra('request', {
              method: req.method,
              url: req.url,
              headers: Anonymizer.anonymizeHeaders(req.headers)
            });
          }
          Sentry.captureException(validatedError);
        });
      }

      return anonymizedError;
    } catch (error) {
      logger.error('Error tracking error:', error);
      throw error;
    }
  }

  /**
   * Track performance metrics
   * @param {Object} metric - Performance metric object
   */
  async trackPerformance(metric) {
    try {
      const validatedMetric = performanceMetricSchema.parse(metric);
      const { type, duration, details } = validatedMetric;
      
      if (type === 'api') {
        this.metrics.performance.apiLatency.push(duration);
      } else if (type === 'database') {
        this.metrics.performance.databaseQueries.push(duration);
      }

      // Persist to database
      await this.prisma.performanceMetric.create({
        data: {
          type,
          duration,
          details: details || {},
          timestamp: new Date()
        }
      });

      // Keep only last 1000 measurements in memory
      const maxMetrics = 1000;
      if (this.metrics.performance.apiLatency.length > maxMetrics) {
        this.metrics.performance.apiLatency.shift();
      }
      if (this.metrics.performance.databaseQueries.length > maxMetrics) {
        this.metrics.performance.databaseQueries.shift();
      }
    } catch (error) {
      logger.error('Error tracking performance:', error);
      throw error;
    }
  }

  /**
   * Get current metrics
   * @returns {Object} Current metrics
   */
  async getMetrics() {
    try {
      // Get metrics from database
      const [pageViews, errors, performance] = await Promise.all([
        this.prisma.pageView.groupBy({
          by: ['url'],
          _count: true,
          where: {
            timestamp: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
            }
          }
        }),
        this.prisma.errorLog.groupBy({
          by: ['name', 'message'],
          _count: true,
          where: {
            timestamp: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
            }
          }
        }),
        this.prisma.performanceMetric.findMany({
          where: {
            timestamp: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
            }
          }
        })
      ]);

      return {
        activeUsers: this.metrics.activeUsers.size,
        pageViews: pageViews.reduce((acc, curr) => {
          acc[curr.url] = curr._count;
          return acc;
        }, {}),
        errors: errors.reduce((acc, curr) => {
          acc[`${curr.name}: ${curr.message}`] = curr._count;
          return acc;
        }, {}),
        performance: {
          averageApiLatency: this.calculateAverage(
            performance
              .filter(p => p.type === 'api')
              .map(p => p.duration)
          ),
          averageDbQueryTime: this.calculateAverage(
            performance
              .filter(p => p.type === 'database')
              .map(p => p.duration)
          ),
        },
      };
    } catch (error) {
      logger.error('Error getting metrics:', error);
      throw error;
    }
  }

  /**
   * Calculate average of an array of numbers
   * @param {number[]} array - Array of numbers
   * @returns {number} Average value
   */
  calculateAverage(array) {
    if (!array.length) return 0;
    return array.reduce((a, b) => a + b, 0) / array.length;
  }

  /**
   * Start cleanup task
   */
  startCleanup() {
    setInterval(async () => {
      try {
        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
        
        // Clean up in-memory metrics
        this.metrics.activeUsers.clear();
        this.metrics.performance.apiLatency = [];
        this.metrics.performance.databaseQueries = [];

        // Clean up old database records
        await Promise.all([
          this.prisma.pageView.deleteMany({
            where: {
              timestamp: {
                lt: thirtyMinutesAgo
              }
            }
          }),
          this.prisma.errorLog.deleteMany({
            where: {
              timestamp: {
                lt: thirtyMinutesAgo
              }
            }
          }),
          this.prisma.performanceMetric.deleteMany({
            where: {
              timestamp: {
                lt: thirtyMinutesAgo
              }
            }
          })
        ]);

        logger.info('Cleanup completed successfully');
      } catch (error) {
        logger.error('Error during cleanup:', error);
      }
    }, 30 * 60 * 1000); // Run every 30 minutes
  }

  /**
   * Start persistence task
   */
  startPersistence() {
    setInterval(async () => {
      try {
        // Persist current metrics to database
        await Promise.all([
          this.prisma.metricsSnapshot.create({
            data: {
              activeUsers: this.metrics.activeUsers.size,
              pageViews: this.pageViews,
              errors: this.metrics.errors,
              performance: this.metrics.performance,
              timestamp: new Date()
            }
          })
        ]);

        logger.info('Metrics persisted successfully');
      } catch (error) {
        logger.error('Error persisting metrics:', error);
      }
    }, 5 * 60 * 1000); // Run every 5 minutes
  }
}

// Create singleton instance
const analyticsService = new AnalyticsService();

module.exports = analyticsService; 