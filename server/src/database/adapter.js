// Database adapter to provide a consistent interface
const logger = require('../config/logger');

// This adapter provides compatibility with both the mock database 
// and the real database, exposing a consistent API
class DatabaseAdapter {
  constructor(db) {
    this.db = db;
    this.isRealDb = !!db.user; // Check if this is the real Prisma client
  }

  async user_findUnique(params) {
    try {
      if (this.isRealDb) {
        return await this.db.user.findUnique(params);
      } else {
        // Map to our new interface
        const where = params.where || {};
        const filter = {};
        
        if (where.id) filter.id = where.id;
        if (where.email) filter.email = where.email;
        
        return await this.db.findUnique('users', filter);
      }
    } catch (error) {
      logger.error('Database error in user_findUnique:', error);
      return null;
    }
  }

  async user_findFirst(params) {
    try {
      if (this.isRealDb) {
        return await this.db.user.findFirst(params);
      } else {
        const where = params.where || {};
        const filter = {};
        
        if (where.email) filter.email = where.email;
        
        // Get all matching users and return first one
        const users = await this.db.find('users', filter);
        return users.length > 0 ? users[0] : null;
      }
    } catch (error) {
      logger.error('Database error in user_findFirst:', error);
      return null;
    }
  }

  async user_create(params) {
    try {
      if (this.isRealDb) {
        return await this.db.user.create(params);
      } else {
        const data = {
          ...params.data,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        return await this.db.create('users', data);
      }
    } catch (error) {
      logger.error('Database error in user_create:', error);
      throw error;
    }
  }

  async user_update(params) {
    try {
      if (this.isRealDb) {
        return await this.db.user.update(params);
      } else {
        const filter = { id: params.where.id };
        const updates = {
          ...params.data,
          updatedAt: new Date()
        };
        
        return await this.db.update('users', filter, updates);
      }
    } catch (error) {
      logger.error('Database error in user_update:', error);
      return null;
    }
  }

  async CV_findUnique(params) {
    try {
      if (this.isRealDb) {
        return await this.db.CV.findUnique(params);
      } else {
        const where = params.where || {};
        const filter = {};
        
        if (where.id) filter.id = where.id;
        if (where.userId) filter.userId = where.userId;
        
        return await this.db.findUnique('CV', filter);
      }
    } catch (error) {
      logger.error('Database error in CV_findUnique:', error);
      return null;
    }
  }

  async CV_findMany(params) {
    try {
      if (this.isRealDb) {
        return await this.db.CV.findMany(params);
      } else {
        const where = params?.where || {};
        const filter = {};
        
        if (where.userId) filter.userId = where.userId;
        
        return await this.db.find('CV', filter);
      }
    } catch (error) {
      logger.error('Database error in CV_findMany:', error);
      return [];
    }
  }

  async CV_create(params) {
    try {
      if (this.isRealDb) {
        return await this.db.CV.create(params);
      } else {
        const data = {
          ...params.data,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        return await this.db.create('CV', data);
      }
    } catch (error) {
      logger.error('Database error in CV_create:', error);
      throw error;
    }
  }

  async CV_update(params) {
    try {
      if (this.isRealDb) {
        return await this.db.CV.update(params);
      } else {
        const filter = { id: params.where.id };
        const updates = {
          ...params.data,
          updatedAt: new Date()
        };
        
        return await this.db.update('CV', filter, updates);
      }
    } catch (error) {
      logger.error('Database error in CV_update:', error);
      return null;
    }
  }

  async CV_delete(params) {
    try {
      if (this.isRealDb) {
        return await this.db.CV.delete(params);
      } else {
        const filter = { id: params.where.id };
        
        return await this.db.delete('CV', filter);
      }
    } catch (error) {
      logger.error('Database error in CV_delete:', error);
      return null;
    }
  }

  async template_findMany() {
    try {
      if (this.isRealDb) {
        return await this.db.template.findMany();
      } else {
        return await this.db.find('templates', {});
      }
    } catch (error) {
      logger.error('Database error in template_findMany:', error);
      return [];
    }
  }

  async subscription_findUnique(params) {
    try {
      if (this.isRealDb) {
        return await this.db.subscription.findUnique(params);
      } else {
        const filter = { userId: params.where.userId };
        
        return await this.db.findUnique('subscriptions', filter);
      }
    } catch (error) {
      logger.error('Database error in subscription_findUnique:', error);
      return null;
    }
  }

  async subscription_create(params) {
    try {
      if (this.isRealDb) {
        return await this.db.subscription.create(params);
      } else {
        const data = {
          ...params.data,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        return await this.db.create('subscriptions', data);
      }
    } catch (error) {
      logger.error('Database error in subscription_create:', error);
      throw error;
    }
  }

  async subscription_update(params) {
    try {
      if (this.isRealDb) {
        return await this.db.subscription.update(params);
      } else {
        const filter = { userId: params.where.userId };
        const updates = {
          ...params.data,
          updatedAt: new Date()
        };
        
        return await this.db.update('subscriptions', filter, updates);
      }
    } catch (error) {
      logger.error('Database error in subscription_update:', error);
      return null;
    }
  }

  async payment_create(params) {
    try {
      if (this.isRealDb) {
        return await this.db.payment.create(params);
      } else {
        const data = {
          ...params.data,
          createdAt: new Date()
        };
        
        return await this.db.create('payments', data);
      }
    } catch (error) {
      logger.error('Database error in payment_create:', error);
      throw error;
    }
  }

  async payment_findMany(params) {
    try {
      if (this.isRealDb) {
        return await this.db.payment.findMany(params);
      } else {
        const where = params?.where || {};
        const filter = {};
        
        if (where.userId) filter.userId = where.userId;
        
        return await this.db.find('payments', filter);
      }
    } catch (error) {
      logger.error('Database error in payment_findMany:', error);
      return [];
    }
  }
}

module.exports = DatabaseAdapter; 