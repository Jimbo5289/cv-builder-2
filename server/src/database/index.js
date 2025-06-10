const logger = require('../config/logger');
const MockDatabase = require('../config/database').MockDatabase;
const DatabaseAdapter = require('./adapter');

let dbClient = null;
let adapter = null;

// Initialize the database connection
const initDatabase = async () => {
  if (dbClient) {
    logger.info('Database already connected');
    return dbClient;
  }

  // Check if we're using the mock database
  const useMockDb = process.env.MOCK_DATABASE === 'true' || process.env.NODE_ENV === 'development';
  
  if (useMockDb) {
    logger.info('Using mock database as configured by ' + 
      (process.env.MOCK_DATABASE === 'true' ? 'MOCK_DATABASE=true' : 'NODE_ENV=development'));
    
    // Create mock database client
    logger.info('Creating mock database client');
    const mockDb = new MockDatabase();
    await mockDb.connect();
    dbClient = mockDb;
  } else {
    try {
      // For real database, import Prisma client
      logger.info('Connecting to real database');
      const { PrismaClient } = require('@prisma/client');
      dbClient = new PrismaClient();
    } catch (error) {
      logger.error('Failed to import PrismaClient:', error);
      throw new Error('Database client import failed');
    }
  }
  
  // Create adapter with the appropriate client
  adapter = new DatabaseAdapter(dbClient);
  
  return dbClient;
};

// Close the database connection
const disconnect = async () => {
  if (!dbClient) {
    logger.info('No active database connection to close');
    return true;
  }
  
  try {
    await dbClient.disconnect();
    logger.info('Database connection closed successfully');
    dbClient = null;
    adapter = null;
    return true;
  } catch (error) {
    logger.error('Error closing database connection:', error);
    return false;
  }
};

// User operations
const findUserById = async (id) => {
  if (!adapter) await initDatabase();
  return adapter.user_findUnique({
    where: { id }
  });
};

const findUserByEmail = async (email) => {
  if (!adapter) await initDatabase();
  return adapter.user_findUnique({
    where: { email }
  });
};

const createUser = async (userData) => {
  if (!adapter) await initDatabase();
  return adapter.user_create({
    data: userData
  });
};

const updateUser = async (id, userData) => {
  if (!adapter) await initDatabase();
  return adapter.user_update({
    where: { id },
    data: userData
  });
};

// CV operations
const findCvById = async (id, userId = null) => {
  if (!adapter) await initDatabase();
  const where = { id };
  if (userId) where.userId = userId;
  
  return adapter.CV_findUnique({
    where
  });
};

const findCvsByUserId = async (userId) => {
  if (!adapter) await initDatabase();
  return adapter.CV_findMany({
    where: { userId }
  });
};

const createCv = async (cvData) => {
  if (!adapter) await initDatabase();
  return adapter.CV_create({
    data: cvData
  });
};

const updateCv = async (id, cvData) => {
  if (!adapter) await initDatabase();
  return adapter.CV_update({
    where: { id },
    data: cvData
  });
};

const deleteCv = async (id) => {
  if (!adapter) await initDatabase();
  return adapter.CV_delete({
    where: { id }
  });
};

// Template operations
const findAllTemplates = async () => {
  if (!adapter) await initDatabase();
  return adapter.template_findMany();
};

// Subscription operations
const findSubscriptionByUserId = async (userId) => {
  if (!adapter) await initDatabase();
  return adapter.subscription_findUnique({
    where: { userId }
  });
};

const createSubscription = async (subscriptionData) => {
  if (!adapter) await initDatabase();
  return adapter.subscription_create({
    data: subscriptionData
  });
};

const updateSubscription = async (userId, subscriptionData) => {
  if (!adapter) await initDatabase();
  return adapter.subscription_update({
    where: { userId },
    data: subscriptionData
  });
};

// Payment operations
const createPayment = async (paymentData) => {
  if (!adapter) await initDatabase();
  return adapter.payment_create({
    data: paymentData
  });
};

const findPaymentsByUserId = async (userId) => {
  if (!adapter) await initDatabase();
  return adapter.payment_findMany({
    where: { userId }
  });
};

module.exports = {
  initDatabase,
  disconnect,
  findUserById,
  findUserByEmail,
  createUser,
  updateUser,
  findCvById,
  findCvsByUserId,
  createCv,
  updateCv,
  deleteCv,
  findAllTemplates,
  findSubscriptionByUserId,
  createSubscription,
  updateSubscription,
  createPayment,
  findPaymentsByUserId
}; 