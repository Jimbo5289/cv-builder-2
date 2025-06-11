/* eslint-disable */
const { PrismaClient } = require('@prisma/client');
const { logger } = require('./logger');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

let client = null;

// Mock database for development environment
class MockDatabase {
  constructor() {
    this.data = {
      users: [],
      CV: [],
      templates: [],
      subscriptions: [],
      payments: []
    };
    this.isConnected = false;
    this.dataFile = path.join(__dirname, '../data/mock-db.json');
    
    // Create data directory if it doesn't exist
    const dataDir = path.join(__dirname, '../data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Add some initial data for testing
    const mockUserId = 'dev-user-id';
    const mockUser = {
      id: mockUserId,
      email: 'test@example.com',
      name: 'Development User',
      phone: '+1234567890', // Add default phone number
      password: '$2a$12$k8Y1DB8sMpHu9xzN2OhSGOEE/GiHPKPiCGWIHI0Ti2AQR1f.2YC6.', // password: password123
      isActive: true,
      failedLoginAttempts: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Add mock user to the users array if it doesn't exist yet
    this.data.users.push(mockUser);
    
    // Load persisted data if exists
    this.loadFromFile();
    
    // Setup auto-save
    this.setupAutoSave();
  }
  
  setupAutoSave() {
    // Save every 30 seconds and on certain operations
    this.saveInterval = setInterval(() => {
      this.saveToFile();
    }, 30000);
    
    // Ensure cleanup on process exit
    process.on('exit', () => {
      if (this.saveInterval) {
        clearInterval(this.saveInterval);
      }
      this.saveToFile();
    });
  }
  
  loadFromFile() {
    try {
      if (fs.existsSync(this.dataFile)) {
        const rawData = fs.readFileSync(this.dataFile, 'utf8');
        const savedData = JSON.parse(rawData);
        
        // Restore data with validation
        if (savedData && typeof savedData === 'object') {
          // Make sure we preserve structure
          this.data = {
            users: Array.isArray(savedData.users) ? savedData.users : [],
            CV: Array.isArray(savedData.CV) ? savedData.CV : [],
            templates: Array.isArray(savedData.templates) ? savedData.templates : [],
            subscriptions: Array.isArray(savedData.subscriptions) ? savedData.subscriptions : [],
            payments: Array.isArray(savedData.payments) ? savedData.payments : []
          };
          
          logger.info(`Mock database loaded from file: ${JSON.stringify({
            users: this.data.users.length,
            cvs: this.data.CV.length
          })}`);
        }
      }
    } catch (error) {
      logger.error('Error loading mock database from file:', error);
      // Continue with empty data
    }
  }
  
  saveToFile() {
    try {
      fs.writeFileSync(this.dataFile, JSON.stringify(this.data, null, 2), 'utf8');
      logger.info('Mock database saved to file');
    } catch (error) {
      logger.error('Error saving mock database to file:', error);
    }
  }

  async connect() {
    this.isConnected = true;
    logger.info('Mock database connected');
    return this;
  }

  async disconnect() {
    // Save data before disconnecting
    this.saveToFile();
    
    if (this.saveInterval) {
      clearInterval(this.saveInterval);
      this.saveInterval = null;
    }
    
    this.isConnected = false;
    logger.info('Mock database disconnected');
    return true;
  }

  // Create a record
  async create(collection, data) {
    logger.info(`Mock DB: create ${collection}:${JSON.stringify(data)}`);
    
    if (!data.id) {
      data.id = uuidv4();
    }
    
    this.data[collection].push(data);
    
    // Save to file after create
    this.saveToFile();
    
    return data;
  }

  // Find records by filter
  async find(collection, filter = {}) {
    logger.info(`Mock DB: find ${collection}:${JSON.stringify(filter)}`);
    
    if (!this.data[collection]) {
      return [];
    }
    
    return this.data[collection].filter(item => {
      // Check if all filter properties match
      return Object.keys(filter).every(key => {
        if (filter[key] === undefined) return true;
        return item[key] === filter[key];
      });
    });
  }

  // Find a single record
  async findUnique(collection, filter) {
    logger.info(`Mock DB: findUnique ${collection}:${JSON.stringify(filter)}`);
    
    if (!this.data[collection]) {
      return null;
    }
    
    // Handle nested where conditions
    if (filter.where) {
      const where = filter.where;
      return this.data[collection].find(item => {
        // Check if all filter properties match
        return Object.keys(where).every(key => {
          if (where[key] === undefined) return true;
          return item[key] === where[key];
        });
      }) || null;
    }
    
    // Regular filter without 'where'
    return this.data[collection].find(item => {
      // Check if all filter properties match
      return Object.keys(filter).every(key => {
        if (filter[key] === undefined) return true;
        return item[key] === filter[key];
      });
    }) || null;
  }

  // Update a record
  async update(collection, filter, updates) {
    logger.info(`Mock DB: update ${collection}:${JSON.stringify({ filter, updates })}`);
    
    if (!this.data[collection]) {
      return null;
    }
    
    // Find the index of the matching item
    const index = this.data[collection].findIndex(item => {
      return Object.keys(filter).every(key => item[key] === filter[key]);
    });
    
    if (index === -1) {
      return null;
    }
    
    // Create an updated item
    const updatedItem = {
      ...this.data[collection][index],
      ...updates
    };
    
    // Replace the old item with the updated one
    this.data[collection][index] = updatedItem;
    
    // Save to file after update
    this.saveToFile();
    
    return updatedItem;
  }

  // Delete a record
  async delete(collection, filter) {
    logger.info(`Mock DB: delete ${collection}:${JSON.stringify(filter)}`);
    
    if (!this.data[collection]) {
      return null;
    }
    
    // Find the index of the matching item
    const index = this.data[collection].findIndex(item => {
      return Object.keys(filter).every(key => item[key] === filter[key]);
    });
    
    if (index === -1) {
      return null;
    }
    
    // Remove the item
    const deletedItem = this.data[collection].splice(index, 1)[0];
    
    // Save to file after delete
    this.saveToFile();
    
    return deletedItem;
  }
}

/**
 * Initialize database connection with Prisma
 * @returns {Promise<PrismaClient>} Prisma client instance
 */
const initDatabase = async () => {
  try {
    // Use mock database if explicitly set or if DATABASE_URL is missing
    if (process.env.MOCK_DATABASE === 'true') {
      logger.info('Using mock database as configured by MOCK_DATABASE=true');
      client = new MockDatabase();
      return client;
    }
    
    // Only create a real client if not already initialized
    if (!client) {
      // Get database URL from environment or use a default for local development
      const databaseUrl = process.env.DATABASE_URL || (
        process.env.NODE_ENV === 'production' 
          ? null  // Don't use default in production
          : 'postgresql://postgres:postgres@localhost:5432/cvbuilder'
      );
      
      if (!databaseUrl) {
        logger.error('DATABASE_URL not set. Check your environment variables.');
        // Return a mock client as fallback
        client = new MockDatabase();
        logger.info('Falling back to mock database client due to missing DATABASE_URL');
        return client;
      }
      
      try {
        // Configure Prisma client with database URL for AWS PostgreSQL
        const prismaConfig = {
          datasources: {
            db: {
              url: databaseUrl
            }
          }
        };
        
        // If the URL doesn't already include sslmode=require, add it for AWS RDS
        if (databaseUrl.includes('amazonaws.com') && !databaseUrl.includes('sslmode=')) {
          logger.info('Adding sslmode=require for AWS RDS connection');
          prismaConfig.datasources.db.url = `${databaseUrl}?sslmode=require`;
        }
        
        logger.info('Attempting to connect to database with URL: ' + databaseUrl.replace(/postgresql:\/\/[^:]+:[^@]+@/, 'postgresql://[username]:[password]@'));
        
        // Initialize Prisma client
        client = new PrismaClient(prismaConfig);
        
        logger.info('Initialized Prisma database client');
        
        // Test the connection
        await client.$connect();
        logger.info('Database connection established successfully');
        
        // Apply migrations if in development mode
        if (process.env.NODE_ENV === 'development' && process.env.AUTO_APPLY_MIGRATIONS === 'true') {
          try {
            const { execSync } = require('child_process');
            logger.info('Attempting to run database migrations...');
            execSync('npx prisma migrate deploy', { stdio: 'inherit' });
            logger.info('Database migrations applied successfully');
          } catch (migrationError) {
            logger.error('Failed to apply migrations:', migrationError);
          }
        }
      } catch (connectionError) {
        logger.error('Failed to connect to database:', connectionError);
        // Fall back to mock client
        client = new MockDatabase();
        logger.info('Falling back to mock database client due to connection failure');
      }
    }
    
    return client;
  } catch (error) {
    logger.error('Database initialization error:', error);
    // Fall back to mock client
    client = new MockDatabase();
    logger.info('Falling back to mock database client due to initialization error');
    return client;
  }
};

/**
 * Disconnects from the database
 * @returns {Promise<void>}
 */
const disconnectDatabase = async () => {
  try {
    if (client) {
      logger.info('Disconnecting from database');
      await client.$disconnect();
      logger.info('Database disconnected successfully');
    } else {
      logger.info('No active database connection to disconnect');
    }
  } catch (error) {
    logger.error('Error disconnecting from database:', error);
    throw error;
  }
};

/**
 * Close database connection
 * @returns {Promise<void>}
 */
const closeDatabase = async () => {
  try {
    if (client && typeof client.$disconnect === 'function') {
      await client.$disconnect();
      logger.info('Database connection closed successfully');
    } else if (client && typeof client.disconnect === 'function') {
      await client.disconnect();
      logger.info('Mock database connection closed successfully');
    } else {
      logger.warn('No active database connection to close');
    }
  } catch (error) {
    logger.error('Error closing database connection:', error);
  } finally {
    client = null;
  }
};

// Initialize the database
if (!client) {
  initDatabase().catch((err) => {
    logger.error('Fatal database initialization error:', err);
  });
}

// Export the MockDatabase class
module.exports = {
  client,
  initDatabase,
  disconnectDatabase,
  closeDatabase,
  MockDatabase
};