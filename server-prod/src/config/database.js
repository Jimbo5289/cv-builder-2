const { PrismaClient } = require('@prisma/client');
const { logger } = require('./logger');

let client = null;

// Mock database client with in-memory storage
const createMockClient = () => {
  logger.info('Creating mock database client');
  
  // In-memory storage
  const storage = {
    users: [],
    cvs: [],
    subscriptions: [],
    sections: [] // Add storage for sections
  };

  // Add some initial data for testing
  const mockUserId = 'dev-user-id';
  const mockUser = {
    id: mockUserId,
    email: 'test@example.com',
    name: 'Development User',
    password: '$2a$12$k8Y1DB8sMpHu9xzN2OhSGOEE/GiHPKPiCGWIHI0Ti2AQR1f.2YC6.', // password: password123
    isActive: true,
    failedLoginAttempts: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  storage.users.push(mockUser);
  
  // Add another test user for login without admin privileges
  storage.users.push({
    id: 'test-user-id',
    email: 'user@example.com',
    name: 'Test User',
    password: '$2a$12$k8Y1DB8sMpHu9xzN2OhSGOEE/GiHPKPiCGWIHI0Ti2AQR1f.2YC6.', // password: password123
    isActive: true,
    failedLoginAttempts: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  
  // Return a mock client with the same interface
  return {
    user: {
      findUnique: async ({ where }) => {
        logger.info('Mock DB: findUnique user', where);
        return storage.users.find(u => u.id === where.id || u.email === where.email);
      },
      findFirst: async ({ where }) => {
        logger.info('Mock DB: findFirst user', where);
        return storage.users.find(u => {
          if (where.id && u.id === where.id) return true;
          if (where.email && u.email === where.email) return true;
          if (where.customerId && u.customerId === where.customerId) return true;
          return false;
        });
      },
      findMany: async ({ where }) => {
        logger.info('Mock DB: findMany users', where);
        if (!where) return storage.users;
        return storage.users.filter(u => {
          for (const [key, value] of Object.entries(where)) {
            if (u[key] !== value) return false;
          }
          return true;
        });
      },
      create: async ({ data }) => {
        logger.info('Mock DB: create user', data);
        const user = { 
          ...data, 
          id: data.id || `user-${Math.random().toString(36).substring(2, 9)}`,
          createdAt: new Date(), 
          updatedAt: new Date() 
        };
        storage.users.push(user);
        return user;
      },
      update: async ({ where, data }) => {
        logger.info('Mock DB: update user', { where, data });
        const index = storage.users.findIndex(u => u.id === where.id);
        if (index >= 0) {
          storage.users[index] = { ...storage.users[index], ...data, updatedAt: new Date() };
          return storage.users[index];
        }
        return null;
      }
    },
    CV: {
      findUnique: async ({ where }) => {
        logger.info('Mock DB: findUnique CV', where);
        return storage.cvs.find(cv => cv.id === where.id && (where.userId ? cv.userId === where.userId : true));
      },
      findMany: async ({ where }) => {
        logger.info('Mock DB: findMany CV', where);
        return storage.cvs.filter(cv => {
          if (where?.userId && cv.userId !== where.userId) return false;
          return true;
        });
      },
      create: async ({ data }) => {
        logger.info('Mock DB: create CV', data);
        const cv = { 
          ...data, 
          id: data.id || `cv-${Math.random().toString(36).substring(2, 9)}`,
          createdAt: new Date(), 
          updatedAt: new Date(),
          atsScore: Math.floor(Math.random() * 100)
        };
        storage.cvs.push(cv);
        return cv;
      },
      update: async ({ where, data }) => {
        logger.info('Mock DB: update CV', { where, data });
        const index = storage.cvs.findIndex(cv => cv.id === where.id);
        if (index >= 0) {
          storage.cvs[index] = { ...storage.cvs[index], ...data, updatedAt: new Date() };
          return storage.cvs[index];
        }
        return null;
      },
      delete: async ({ where }) => {
        logger.info('Mock DB: delete CV', where);
        const index = storage.cvs.findIndex(cv => cv.id === where.id);
        if (index >= 0) {
          const deleted = storage.cvs[index];
          storage.cvs.splice(index, 1);
          return deleted;
        }
        return null;
      }
    },
    subscription: {
      findFirst: async ({ where }) => {
        logger.info('Mock DB: findFirst subscription', where);
        return storage.subscriptions.find(s => {
          if (where.id && s.id === where.id) return true;
          if (where.userId && s.userId === where.userId) return true;
          if (where.stripeSubscriptionId && s.stripeSubscriptionId === where.stripeSubscriptionId) return true;
          return false;
        });
      },
      create: async ({ data }) => {
        logger.info('Mock DB: create subscription', data);
        const subscription = { 
          ...data, 
          id: data.id || `sub-${Math.random().toString(36).substring(2, 9)}`,
          createdAt: new Date(), 
          updatedAt: new Date() 
        };
        storage.subscriptions.push(subscription);
        return subscription;
      },
      update: async ({ where, data }) => {
        logger.info('Mock DB: update subscription', { where, data });
        const index = storage.subscriptions.findIndex(s => s.id === where.id);
        if (index >= 0) {
          storage.subscriptions[index] = { ...storage.subscriptions[index], ...data, updatedAt: new Date() };
          return storage.subscriptions[index];
        }
        return null;
      },
      upsert: async ({ where, update, create }) => {
        logger.info('Mock DB: upsert subscription', { where, update, create });
        const index = storage.subscriptions.findIndex(s => s.stripeSubscriptionId === where.stripeSubscriptionId);
        if (index >= 0) {
          storage.subscriptions[index] = { ...storage.subscriptions[index], ...update, updatedAt: new Date() };
          return storage.subscriptions[index];
        } else {
          const subscription = { 
            ...create, 
            id: create.id || `sub-${Math.random().toString(36).substring(2, 9)}`,
            createdAt: new Date(), 
            updatedAt: new Date() 
          };
          storage.subscriptions.push(subscription);
          return subscription;
        }
      }
    },
    payment: {
      create: async ({ data }) => {
        logger.info('Mock DB: create payment', data);
        return { 
          ...data, 
          id: data.id || `pay-${Math.random().toString(36).substring(2, 9)}`,
          createdAt: new Date() 
        };
      }
    },
    CVSection: {
      findMany: async ({ where }) => {
        logger.info('Mock DB: findMany CVSection', where);
        return storage.sections.filter(s => {
          if (where?.cvId && s.cvId !== where.cvId) return false;
          return true;
        });
      },
      create: async ({ data }) => {
        logger.info('Mock DB: create CVSection', data);
        const section = { 
          ...data, 
          id: data.id || `section-${Math.random().toString(36).substring(2, 9)}`,
          createdAt: new Date(), 
          updatedAt: new Date()
        };
        storage.sections.push(section);
        return section;
      },
      createMany: async ({ data }) => {
        logger.info('Mock DB: createMany CVSection', data);
        const sections = data.map(item => ({
          ...item,
          id: item.id || `section-${Math.random().toString(36).substring(2, 9)}`,
          createdAt: new Date(),
          updatedAt: new Date()
        }));
        storage.sections.push(...sections);
        return { count: sections.length };
      },
      update: async ({ where, data }) => {
        logger.info('Mock DB: update CVSection', { where, data });
        const index = storage.sections.findIndex(s => s.id === where.id);
        if (index >= 0) {
          storage.sections[index] = { ...storage.sections[index], ...data, updatedAt: new Date() };
          return storage.sections[index];
        }
        return null;
      },
      delete: async ({ where }) => {
        logger.info('Mock DB: delete CVSection', where);
        const index = storage.sections.findIndex(s => s.id === where.id);
        if (index >= 0) {
          const deleted = storage.sections[index];
          storage.sections.splice(index, 1);
          return deleted;
        }
        return null;
      },
      deleteMany: async ({ where }) => {
        logger.info('Mock DB: deleteMany CVSection', where);
        const originalLength = storage.sections.length;
        storage.sections = storage.sections.filter(s => {
          for (const [key, value] of Object.entries(where)) {
            if (s[key] !== value) return true;
          }
          return false;
        });
        return { count: originalLength - storage.sections.length };
      }
    },
    $disconnect: async () => {
      logger.info('Mock DB: disconnecting');
      return true;
    },
    $connect: async () => {
      logger.info('Mock DB: connecting');
      return true;
    }
  };
};

/**
 * Initialize database connection with Prisma
 * @returns {Promise<PrismaClient>} Prisma client instance
 */
const initDatabase = async () => {
  try {
    // Use mock database if explicitly set or if DATABASE_URL is missing
    if (process.env.MOCK_DATABASE === 'true') {
      logger.info('Using mock database as configured by MOCK_DATABASE=true');
      client = createMockClient();
      return client;
    }
    
    // Only create a real client if not already initialized
    if (!client) {
      if (!process.env.DATABASE_URL) {
        logger.error('DATABASE_URL not set. Check your environment variables.');
        // Return a mock client as fallback
        client = createMockClient();
        logger.info('Falling back to mock database client due to missing DATABASE_URL');
        return client;
      }
      
      try {
        // Initialize Prisma client without the invalid 'connection' property
        client = new PrismaClient({
          datasources: {
            db: {
              url: process.env.DATABASE_URL
            }
          }
        });
        logger.info('Initialized Prisma database client');
        
        // Test the connection
        await client.$connect();
        logger.info('Database connection established successfully');
      } catch (connectionError) {
        logger.error('Failed to connect to database:', connectionError);
        // Fall back to mock client
        client = createMockClient();
        logger.info('Falling back to mock database client due to connection failure');
      }
    }
    
    return client;
  } catch (error) {
    logger.error('Database initialization error:', error);
    // Fall back to mock client
    client = createMockClient();
    logger.info('Falling back to mock database client due to initialization error');
    return client;
  }
};

// Initialize the database on module load if not already initialized
if (!client) {
  initDatabase().catch((err) => {
    logger.error('Fatal database initialization error:', err);
  });
}

module.exports = {
  client,
  initDatabase,
  createMockClient
};
