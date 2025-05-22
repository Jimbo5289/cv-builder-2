const { PrismaClient } = require('@prisma/client');
const { logger } = require('./logger');

class Database {
  constructor() {
    if (!Database.instance) {
      // Configure prisma logging based on environment
      const logLevels = process.env.NODE_ENV === 'development' 
        ? ['query', 'info', 'warn', 'error'] 
        : ['warn', 'error'];
      
      this.prisma = new PrismaClient({
        log: logLevels,
        errorFormat: 'pretty'
      });
      
      this.isConnected = false;
      this.connectionAttempts = 0;
      this.maxRetries = 5;
      this.retryDelay = 5000; // 5 seconds
      this._initConnectionTimeout = null;
      Database.instance = this;
    }
    return Database.instance;
  }

  async connect() {
    if (this.isConnected) {
      return;
    }

    // Clear any existing timeout to prevent memory leaks
    if (this._initConnectionTimeout) {
      clearTimeout(this._initConnectionTimeout);
      this._initConnectionTimeout = null;
    }

    while (this.connectionAttempts < this.maxRetries) {
      try {
        // Validate DATABASE_URL
        if (!process.env.DATABASE_URL) {
          throw new Error('DATABASE_URL is not set in environment variables');
        }

        // Test connection
        await this.prisma.$connect();
        
        // Verify connection with a simple query
        await this.prisma.$queryRaw`SELECT 1`;
        
        this.isConnected = true;
        this.connectionAttempts = 0;
        logger.info('Database connected successfully');
        return;
      } catch (error) {
        this.connectionAttempts++;
        logger.error(`Database connection attempt ${this.connectionAttempts} failed:`, error);
        
        // Always try to disconnect if connection failed to clean up
        try {
          await this.prisma.$disconnect();
        } catch (disconnectError) {
          logger.error('Failed to clean up database connection:', disconnectError);
        }
        
        if (this.connectionAttempts >= this.maxRetries) {
          throw new Error(`Failed to connect to database after ${this.maxRetries} attempts: ${error.message}`);
        }

        // Wait before retrying
        await new Promise(resolve => {
          this._initConnectionTimeout = setTimeout(resolve, this.retryDelay);
        });
      }
    }
  }

  async disconnect() {
    // Clear any pending connection timeout
    if (this._initConnectionTimeout) {
      clearTimeout(this._initConnectionTimeout);
      this._initConnectionTimeout = null;
    }

    if (!this.isConnected) {
      return;
    }

    try {
      await this.prisma.$disconnect();
      this.isConnected = false;
      logger.info('Database disconnected successfully');
    } catch (error) {
      logger.error('Database disconnection error:', error);
      // Don't throw the error, just log it to ensure we don't crash during cleanup
    } finally {
      this.isConnected = false;
    }
  }

  get client() {
    if (!this.isConnected) {
      logger.warn('Accessing database client before connection established');
      // Auto-connect for convenience, but log a warning
      this.connect().catch(err => {
        logger.error('Auto-connection failed:', err);
      });
    }
    return this.prisma;
  }

  // Helper method to check connection status
  async checkConnection() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      logger.warn('Database connection check failed:', error.message);
      this.isConnected = false;
      return false;
    }
  }

  // Method to handle reconnection with a timeout to prevent hanging
  async handleReconnection() {
    if (!this.isConnected) {
      logger.info('Attempting to reconnect to database...');
      
      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Reconnection timed out after 10 seconds')), 10000);
      });
      
      // Race connection against timeout
      try {
        await Promise.race([this.connect(), timeoutPromise]);
      } catch (error) {
        logger.error('Database reconnection failed:', error.message);
        throw error;
      }
    }
  }
}

// Create a singleton instance
const database = new Database();

// We don't need process termination handlers here since they are in index.js
// This prevents duplicate handlers and potential memory leaks

module.exports = database; 