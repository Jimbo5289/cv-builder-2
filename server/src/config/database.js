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
  storage.users.push({
    id: mockUserId,
    email: 'dev@example.com',
    name: 'Development User'
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
      create: async ({ data }) => {
        logger.info('Mock DB: create user', data);
        const user = { ...data, createdAt: new Date(), updatedAt: new Date() };
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
      findUnique: async ({ where, include }) => {
        logger.info('Mock DB: findUnique CV', where);
        const cv = storage.cvs.find(cv => cv.id === where.id && (where.userId ? cv.userId === where.userId : true));
        
        // Handle includes if needed
        if (cv && include) {
          if (include.sections) {
            // Find sections related to this CV
            cv.sections = storage.sections.filter(s => s.cvId === cv.id);
          }
          if (include.user) {
            cv.user = storage.users.find(u => u.id === cv.userId);
          }
        }
        
        return cv;
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
        const id = 'cv-' + Math.random().toString(36).substring(2, 9);
        const cv = { 
          id,
          ...data, 
          createdAt: new Date(), 
          updatedAt: new Date(),
          atsScore: Math.floor(Math.random() * 100)
        };
        storage.cvs.push(cv);
        logger.info('Mock DB: CV created successfully', { id: cv.id });
        return cv;
      },
      update: async ({ where, data, include }) => {
        logger.info('Mock DB: update CV', { where, data });
        const index = storage.cvs.findIndex(cv => cv.id === where.id);
        if (index >= 0) {
          // Handle sections create/update operations in the data object
          if (data.sections) {
            if (data.sections.create) {
              const sectionData = data.sections.create;
              const sectionId = 'section-' + Math.random().toString(36).substring(2, 9);
              const newSection = {
                id: sectionId,
                cvId: where.id,
                ...sectionData,
                createdAt: new Date(),
                updatedAt: new Date()
              };
              storage.sections.push(newSection);
              logger.info('Mock DB: Created CV section', { sectionId, cvId: where.id });
            }
            
            if (data.sections.update) {
              const updateData = data.sections.update;
              // Handle different update formats
              if (Array.isArray(updateData)) {
                updateData.forEach(update => {
                  const sectionIndex = storage.sections.findIndex(s => s.id === update.where.id);
                  if (sectionIndex >= 0) {
                    storage.sections[sectionIndex] = {
                      ...storage.sections[sectionIndex],
                      ...update.data,
                      updatedAt: new Date()
                    };
                  }
                });
              } else if (updateData.where && updateData.data) {
                const sectionIndex = storage.sections.findIndex(s => s.id === updateData.where.id);
                if (sectionIndex >= 0) {
                  storage.sections[sectionIndex] = {
                    ...storage.sections[sectionIndex],
                    ...updateData.data,
                    updatedAt: new Date()
                  };
                }
              }
            }
            
            delete data.sections; // Remove sections from data to avoid storing it directly
          }
          
          storage.cvs[index] = { ...storage.cvs[index], ...data, updatedAt: new Date() };
          
          // Handle includes if needed
          if (include) {
            if (include.sections) {
              storage.cvs[index].sections = storage.sections.filter(s => s.cvId === storage.cvs[index].id);
            }
            if (include.user) {
              storage.cvs[index].user = storage.users.find(u => u.id === storage.cvs[index].userId);
            }
          }
          
          return storage.cvs[index];
        }
        return null;
      },
      upsert: async ({ where, update, create, include }) => {
        logger.info('Mock DB: upsert CV', { where, update, create });
        // Try to find the CV first
        let cv;
        if (where.id) {
          cv = storage.cvs.find(c => c.id === where.id);
        } else if (where.userId_title) {
          cv = storage.cvs.find(c => 
            c.userId === where.userId_title.userId && 
            c.title === where.userId_title.title
          );
        }
        
        if (cv) {
          // Update existing CV
          const index = storage.cvs.findIndex(c => c.id === cv.id);
          storage.cvs[index] = { ...storage.cvs[index], ...update, updatedAt: new Date() };
          
          // Handle includes
          if (include) {
            if (include.sections) {
              storage.cvs[index].sections = storage.sections.filter(s => s.cvId === storage.cvs[index].id);
            }
            if (include.user) {
              storage.cvs[index].user = storage.users.find(u => u.id === storage.cvs[index].userId);
            }
          }
          
          return storage.cvs[index];
        } else {
          // Create new CV
          const id = 'cv-' + Math.random().toString(36).substring(2, 9);
          const newCv = { 
            id, 
            ...create, 
            createdAt: new Date(), 
            updatedAt: new Date(),
            atsScore: Math.floor(Math.random() * 100)
          };
          storage.cvs.push(newCv);
          
          // Handle includes
          if (include) {
            if (include.sections) {
              newCv.sections = [];
            }
            if (include.user) {
              newCv.user = storage.users.find(u => u.id === newCv.userId);
            }
          }
          
          return newCv;
        }
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
          if (where.stripeSubscriptionId && s.stripeSubscriptionId === where.stripeSubscriptionId) return true;
          return false;
        });
      },
      create: async ({ data }) => {
        logger.info('Mock DB: create subscription', data);
        const subscription = { ...data, createdAt: new Date(), updatedAt: new Date() };
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
          const subscription = { ...create, createdAt: new Date(), updatedAt: new Date() };
          storage.subscriptions.push(subscription);
          return subscription;
        }
      }
    },
    payment: {
      create: async ({ data }) => {
        logger.info('Mock DB: create payment', data);
        return { ...data, createdAt: new Date() };
      }
    },
    $disconnect: async () => {
      logger.info('Mock DB: disconnecting');
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
    if (process.env.MOCK_DATABASE === 'true') {
      client = createMockClient();
      logger.info('Initialized mock database client');
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
      
      client = new PrismaClient();
      logger.info('Initialized Prisma database client');
      
      // Test the connection
      try {
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

// Initialize the database
initDatabase().catch((err) => {
  logger.error('Fatal database initialization error:', err);
  process.exit(1);
});

module.exports = {
  client,
  initDatabase
};