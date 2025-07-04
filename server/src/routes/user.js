const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');
const { logger } = require('../config/logger');

// Import auth middleware
const { auth } = require('../middleware/auth');


// Production log filtering - suppress debug output in production
const originalConsoleLog = console.log;
if (process.env.NODE_ENV === 'production') {
  console.log = (...args) => {
    const message = args.join(' ');
    // Suppress DEBUG messages in production
    if (message.includes('[DEBUG]') || 
        message.includes('About to call prisma') ||
        message.includes('prisma is: object') ||
        message.includes('prisma.subscription exists')) {
      return; // Suppress in production
    }
    originalConsoleLog.apply(console, args);
  };
}
// Initialize Prisma client
const prisma = new PrismaClient();

// Input validation schema for profile update
const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email format').optional(),
  phone: z.string()
    .optional()
    .refine(val => val === undefined || val === null || val === '' || /^[+\d\s()-]{7,20}$/.test(val), 
      { message: 'Phone number format is invalid' })
});

// Input validation schema for consent update
const updateConsentSchema = z.object({
  marketingConsent: z.boolean(),
  cookieConsent: z.string().optional(),
  consentTimestamp: z.string().optional()
});

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    // Only use mock mode in local development, never in production
    if (process.env.NODE_ENV === 'development' && process.env.MOCK_DATABASE === 'true') {
      const mockUser = {
        id: req.user.id,
        email: req.user.email || 'dev@example.com',
        name: req.user.name || 'Development User',
        phone: req.user.phone || '',
        createdAt: new Date()
      };
      return res.json({ user: mockUser });
    }
    
    // Otherwise query the database
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        createdAt: true
      }
    });

    if (!user) {
      logger.warn('Get profile failed: User not found', { userId: req.user.id });
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    logger.error('Get profile error:', { error: error.message, stack: error.stack });
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    // Only use mock mode in local development, never in production
    if (process.env.NODE_ENV === 'development' && process.env.MOCK_DATABASE === 'true') {
      const mockUser = {
        id: req.user.id,
        email: req.user.email || 'dev@example.com',
        name: req.body.name || req.user.name || 'Development User',
        phone: req.body.phone || req.user.phone || '',
        createdAt: new Date()
      };
      return res.json({
        success: true,
        message: 'Profile updated successfully (mock mode)',
        user: mockUser
      });
    }

    // Validate input
    const validatedData = updateProfileSchema.parse(req.body);
    
    // Remove undefined values
    const updateData = {};
    if (validatedData.name !== undefined) updateData.name = validatedData.name;
    if (validatedData.email !== undefined) updateData.email = validatedData.email;
    if (validatedData.phone !== undefined) updateData.phone = validatedData.phone;

    // If no valid fields to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    // Check if email is being changed and if it already exists
    if (updateData.email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: updateData.email,
          NOT: { id: req.user.id }
        }
      });

      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use' });
      }
    }

    // Update the user profile in the database
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        createdAt: true
      }
    });

    logger.info('User profile updated successfully', {
      userId: req.user.id,
      updatedFields: Object.keys(updateData)
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    logger.error('Update profile error:', { 
      error: error.message, 
      stack: error.stack,
      userId: req.user?.id
    });
    
    res.status(500).json({ 
      error: 'Failed to update profile',
      message: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred'
    });
  }
});

// Update user consent preferences
router.put('/consent', auth, async (req, res) => {
  try {
    // Validate input
    const validatedData = updateConsentSchema.parse(req.body);
    
    logger.info('Consent update requested', {
      userId: req.user.id,
      marketingConsent: validatedData.marketingConsent,
      cookieConsent: validatedData.cookieConsent
    });

    // Only use mock mode in local development, never in production
    if (process.env.NODE_ENV === 'development' && process.env.MOCK_DATABASE === 'true') {
      return res.json({
        success: true,
        message: 'Consent updated successfully (mock mode)',
        marketingConsent: validatedData.marketingConsent,
        cookieConsent: validatedData.cookieConsent
      });
    }

    // Update the user's marketing consent in the database
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { 
        marketingConsent: validatedData.marketingConsent,
        updatedAt: new Date()
      },
      select: {
        id: true,
        email: true,
        name: true,
        marketingConsent: true,
        updatedAt: true
      }
    });

    logger.info('User consent updated successfully', {
      userId: req.user.id,
      marketingConsent: validatedData.marketingConsent,
      timestamp: validatedData.consentTimestamp
    });

    res.json({
      success: true,
      message: 'Consent preferences updated successfully',
      marketingConsent: updatedUser.marketingConsent,
      cookieConsent: validatedData.cookieConsent,
      user: updatedUser
    });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ 
        error: 'Invalid consent data',
        details: error.errors
      });
    }

    logger.error('Update consent error:', { 
      error: error.message, 
      stack: error.stack,
      userId: req.user?.id
    });
    
    res.status(500).json({ 
      error: 'Failed to update consent preferences',
      message: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred'
    });
  }
});

// Debug endpoint to verify database data (development only)
router.get('/debug/database-check', auth, async (req, res) => {
  try {
    // Only allow in development mode for security
    if (process.env.NODE_ENV !== 'development') {
      return res.status(403).json({ error: 'Debug endpoint only available in development' });
    }

    logger.info('Database check requested for user:', { userId: req.user?.id });

    // In development mode with mock database
    if (process.env.MOCK_DATABASE === 'true') {
      return res.json({
        message: 'Mock database mode - data not persisted to AWS',
        mode: 'development',
        mockUser: req.user,
        note: 'In production, this would show real AWS RDS data'
      });
    }

    // Try to fetch user from actual database
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
        lastLogin: true
      }
    });

    if (!user) {
      return res.json({
        message: 'User not found in database',
        userId: req.user.id,
        status: 'not_found'
      });
    }

    res.json({
      message: 'User data successfully retrieved from AWS RDS database',
      status: 'found',
      userData: user,
      databaseConnection: 'AWS RDS PostgreSQL',
      lastUpdated: user.updatedAt
    });

  } catch (error) {
    logger.error('Database check error:', { 
      error: error.message, 
      stack: error.stack,
      userId: req.user?.id
    });
    
    res.json({
      message: 'Database check failed',
      error: error.message,
      status: 'error',
      note: 'This might indicate a database connection issue'
    });
  }
});

// Get user statistics
router.get('/stats', auth, async (req, res) => {
  try {
    // Only use mock mode in local development, never in production
    if (process.env.NODE_ENV === 'development' && process.env.MOCK_DATABASE === 'true') {
      return res.json({
        cvsCreated: 3,
        analyzesRun: 1,
        lastActive: new Date()
      });
    }

    const userId = req.user.id;
    
    // Get CV count
    const cvCount = await prisma.cV.count({
      where: { userId }
    });

    // Get analysis count (with fallback if table doesn't exist)
    let analysisCount = 0;
    try {
      analysisCount = await prisma.analysis.count({
        where: { userId }
      });
    } catch (error) {
      logger.warn('Analysis table may not exist, using count 0');
    }

    // Get last activity (most recent CV update)
    const lastCV = await prisma.cV.findFirst({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      select: { updatedAt: true }
    });

    res.json({
      cvsCreated: cvCount,
      analyzesRun: analysisCount,
      lastActive: lastCV?.updatedAt || null
    });
  } catch (error) {
    logger.error('Get user stats error:', { error: error.message, stack: error.stack });
    res.status(500).json({ error: 'Server error' });
  }
});

// Get expiration notifications
router.get('/notifications', auth, async (req, res) => {
  try {
    const notifications = [];
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000));

    // Only use mock mode in local development, never in production
    if (process.env.NODE_ENV === 'development' && process.env.MOCK_DATABASE === 'true') {
      // Return mock notification for development
      return res.json({ 
        notifications: [{
          type: 'subscription',
          title: 'Subscription Expiring Soon',
          message: 'Your Monthly Subscription will expire in 5 days.',
          daysRemaining: 5,
          expiryDate: new Date(now.getTime() + (5 * 24 * 60 * 60 * 1000)),
          severity: 'warning'
        }]
      });
    }

    // Check for expiring subscriptions
    const activeSubscriptions = await prisma.subscription.findMany({
      where: {
        userId: req.user.id,
        status: { in: ['active', 'trialing'] },
        currentPeriodEnd: {
          gt: now,
          lte: sevenDaysFromNow
        }
      }
    });

    for (const subscription of activeSubscriptions) {
      const daysRemaining = Math.ceil((subscription.currentPeriodEnd - now) / (1000 * 60 * 60 * 24));
      const severity = daysRemaining <= 3 ? 'error' : 'warning';
      
      notifications.push({
        type: 'subscription',
        title: 'Subscription Expiring Soon',
        message: `Your ${subscription.planId || 'subscription'} will ${subscription.cancelAtPeriodEnd ? 'end' : 'renew'} in ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}.`,
        daysRemaining,
        expiryDate: subscription.currentPeriodEnd,
        severity,
        autoRenew: !subscription.cancelAtPeriodEnd
      });
    }

    // Check for expiring temporary access
    const temporaryAccess = await prisma.temporaryAccess.findMany({
      where: {
        userId: req.user.id,
        endTime: {
          gt: now,
          lte: sevenDaysFromNow
        }
      }
    });

    for (const access of temporaryAccess) {
      const daysRemaining = Math.ceil((access.endTime - now) / (1000 * 60 * 60 * 24));
      const severity = daysRemaining <= 3 ? 'error' : 'warning';
      
      let accessTypeName = 'Premium Access';
      if (access.type === '30day-access') {
        accessTypeName = '30-Day Access Pass';
      } else if (access.type === 'pay-per-cv') {
        accessTypeName = 'Pay-Per-CV Access';
      }
      
      notifications.push({
        type: 'temporary_access',
        title: 'Premium Access Expiring Soon',
        message: `Your ${accessTypeName} will expire in ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}.`,
        daysRemaining,
        expiryDate: access.endTime,
        severity,
        accessType: access.type
      });
    }

    res.json({ notifications });
  } catch (error) {
    logger.error('Get notifications error:', { error: error.message, stack: error.stack });
    res.status(500).json({ error: 'Server error' });
  }
});

// Test endpoint to debug Prisma client
router.get('/debug-prisma', auth, (req, res) => {
  res.json({
    prismaClientExists: !!prisma,
    prismaClientType: typeof prisma,
    hasSubscription: !!(prisma && prisma.subscription),
    hasTemporaryAccess: !!(prisma && prisma.temporaryAccess),
    timestamp: new Date().toISOString()
  });
});

// Get users with marketing consent (for marketing purposes - admin only)
router.get('/marketing-consent', auth, async (req, res) => {
  try {
    // Only allow admin users or specific authenticated access
    // You might want to add admin role checking here
    const isAdmin = req.user.role === 'admin' || req.user.email === 'james@mycvbuilder.co.uk';
    
    if (!isAdmin) {
      return res.status(403).json({ 
        error: 'Access denied',
        message: 'Only administrators can access marketing consent data'
      });
    }

    // Query parameters for filtering
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 50, 1000); // Max 1000 per request
    const skip = (page - 1) * limit;
    const consentFilter = req.query.consent; // 'true', 'false', or undefined for all

    // Build where clause
    const whereClause = {};
    if (consentFilter === 'true') {
      whereClause.marketingConsent = true;
    } else if (consentFilter === 'false') {
      whereClause.marketingConsent = false;
    }

    logger.info('Marketing consent query requested', {
      adminUserId: req.user.id,
      adminEmail: req.user.email,
      page,
      limit,
      consentFilter
    });

    // Only use mock mode in local development, never in production
    if (process.env.NODE_ENV === 'development' && process.env.MOCK_DATABASE === 'true') {
      const mockUsers = [
        {
          id: 'mock-user-1',
          email: 'user1@example.com',
          name: 'John Doe',
          marketingConsent: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'mock-user-2',
          email: 'user2@example.com',
          name: 'Jane Smith',
          marketingConsent: false,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      return res.json({
        success: true,
        users: mockUsers.filter(u => 
          consentFilter === undefined || 
          u.marketingConsent === (consentFilter === 'true')
        ),
        pagination: {
          page,
          limit,
          total: mockUsers.length,
          pages: 1
        },
        metadata: {
          queryTimestamp: new Date().toISOString(),
          consentFilter,
          mode: 'development'
        }
      });
    }

    // Get users with their consent status
    const users = await prisma.user.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        marketingConsent: true,
        createdAt: true,
        updatedAt: true,
        lastLogin: true
      }
    });

    // Get total count for pagination
    const totalUsers = await prisma.user.count({
      where: whereClause
    });

    logger.info('Marketing consent data retrieved', {
      adminUserId: req.user.id,
      totalUsersReturned: users.length,
      totalUsersMatching: totalUsers,
      consentFilter
    });

    res.json({
      success: true,
      users,
      pagination: {
        page,
        limit,
        total: totalUsers,
        pages: Math.ceil(totalUsers / limit)
      },
      metadata: {
        queryTimestamp: new Date().toISOString(),
        consentFilter,
        summary: {
          totalUsersReturned: users.length,
          usersWithConsent: users.filter(u => u.marketingConsent).length,
          usersWithoutConsent: users.filter(u => !u.marketingConsent).length
        }
      }
    });
  } catch (error) {
    logger.error('Marketing consent query error:', { 
      error: error.message, 
      stack: error.stack,
      adminUserId: req.user?.id
    });
    
    res.status(500).json({ 
      error: 'Failed to retrieve marketing consent data',
      message: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred'
    });
  }
});

// GET user preferences (for unsubscribe functionality)
router.get('/preferences', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        marketingConsent: true,
        email: true,
        name: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return preferences in format expected by frontend
    res.json({
      marketingEmails: user.marketingConsent,
      subscriptionUpdates: true, // These are always enabled for account security
      securityAlerts: true
    });
  } catch (error) {
    logger.error('Error fetching user preferences:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT update user preferences (for unsubscribe functionality)
router.put('/preferences', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { marketingEmails } = req.body;
    
    // Update marketing consent in database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        marketingConsent: marketingEmails
      },
      select: {
        marketingConsent: true
      }
    });

    logger.info(`User ${userId} updated marketing consent to: ${marketingEmails}`);

    res.json({
      marketingEmails: updatedUser.marketingConsent,
      subscriptionUpdates: true,
      securityAlerts: true
    });
  } catch (error) {
    logger.error('Error updating user preferences:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
