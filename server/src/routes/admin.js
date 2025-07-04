/**
 * Admin Routes
 * 
 * This module provides endpoints for administrative operations.
 * These endpoints are restricted to admin users only.
 */

const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { auth: authMiddleware } = require('../middleware/auth');
const { adminLimiter } = require('../middleware/security');
const { logger } = require('../config/logger');

// Initialize Prisma client
const prisma = new PrismaClient();

// Apply strict rate limiting to all admin routes
router.use(adminLimiter);

/**
 * Enhanced admin authentication middleware
 * Checks if the authenticated user has admin privileges with additional security
 */
const adminAuth = async (req, res, next) => {
  try {
    // Skip admin check in development mode if configured
    if (process.env.SKIP_AUTH_CHECK === 'true' && process.env.NODE_ENV === 'development') {
      logger.warn('Admin authentication check skipped in development mode', {
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        path: req.path
      });
      return next();
    }
    
    // Check if user exists and is an admin
    const userId = req.user?.id;
    if (!userId) {
      logger.warn('Admin access attempt without authentication', {
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        path: req.path
      });
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        id: true, 
        email: true, 
        role: true,
        isActive: true 
      }
    });
    
    // Enhanced admin privilege checking - role-based system
    const isAuthorizedAdmin = user && (
      user.role === 'superuser' || 
      user.role === 'admin' ||
      user.email === 'jamesingleton1971@gmail.com' // Fallback for compatibility
    );
    
    if (!user) {
      logger.warn('Admin access attempt with invalid user', {
        userId,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        path: req.path
      });
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (!user.isActive) {
      logger.warn('Admin access attempt with inactive user', {
        userId,
        userEmail: user.email,
        ip: req.ip,
        path: req.path
      });
      return res.status(403).json({ error: 'Account is inactive' });
    }
    
    if (!isAuthorizedAdmin) {
      logger.error('Unauthorized admin access attempt', {
        userId,
        userEmail: user.email,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        path: req.path,
        timestamp: new Date().toISOString()
      });
      return res.status(403).json({ error: 'Admin privileges required' });
    }
    
    // Log successful admin access for audit trail
    logger.info('Admin access granted', {
      userId,
      userEmail: user.email,
      ip: req.ip,
      path: req.path,
      timestamp: new Date().toISOString()
    });
    
    // Add user info to request for further use
    req.adminUser = user;
    next();
  } catch (error) {
    logger.error('Admin authentication error', {
      error: error.message,
      stack: error.stack,
      ip: req.ip,
      path: req.path
    });
    res.status(500).json({ error: 'Admin authentication failed' });
  }
};

/**
 * @route GET /api/admin/dashboard
 * @desc Get admin dashboard data
 * @access Admin only
 */
router.get('/dashboard', authMiddleware, adminAuth, async (req, res) => {
  try {
    // Get user statistics
    const userCount = await prisma.user.count();
    const activeUsers = await prisma.user.count({
      where: { isActive: true }
    });
    
    // Get CV statistics
    const cvCount = await prisma.cV.count();
    
    // Get subscription statistics
    const activeSubscriptions = await prisma.subscription.count({
      where: { status: 'active' }
    });
    
    res.status(200).json({
      users: {
        total: userCount,
        active: activeUsers
      },
      cvs: {
        total: cvCount
      },
      subscriptions: {
        active: activeSubscriptions
      }
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ error: 'Failed to retrieve admin dashboard data' });
  }
});

/**
 * @route GET /api/admin/users
 * @desc Get all users (paginated)
 * @access Admin only
 */
router.get('/users', authMiddleware, adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const users = await prisma.user.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        isActive: true,
        lastLogin: true,
        marketingConsent: true,
        _count: {
          select: {
            cvs: true,
            subscriptions: true
          }
        }
      }
    });
    
    const totalUsers = await prisma.user.count();
    
    res.status(200).json({
      users,
      pagination: {
        total: totalUsers,
        page,
        limit,
        pages: Math.ceil(totalUsers / limit)
      }
    });
  } catch (error) {
    console.error('Admin users list error:', error);
    res.status(500).json({ error: 'Failed to retrieve users list' });
  }
});

/**
 * @route GET /api/admin/users/:id
 * @desc Get detailed user information
 * @access Admin only
 */
router.get('/users/:id', authMiddleware, adminAuth, async (req, res) => {
  try {
    const userId = req.params.id;
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
        lastLogin: true,
        isActive: true,
        marketingConsent: true,
        customerId: true,
        cvs: {
          select: {
            id: true,
            title: true,
            createdAt: true,
            updatedAt: true
          }
        },
        subscriptions: {
          select: {
            id: true,
            status: true,
            currentPeriodStart: true,
            currentPeriodEnd: true,
            cancelAtPeriodEnd: true
          }
        },
        temporaryAccess: {
          select: {
            id: true,
            endTime: true,
            createdAt: true
          }
        }
      }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(200).json({ user });
  } catch (error) {
    console.error('Admin user detail error:', error);
    res.status(500).json({ error: 'Failed to retrieve user details' });
  }
});

/**
 * @route PUT /api/admin/users/:id
 * @desc Update user information
 * @access Admin only
 */
router.put('/users/:id', authMiddleware, adminAuth, async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, isActive, marketingConsent } = req.body;
    
    // Validate input
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }
      
      // Check if email is already taken by another user
      const existingUser = await prisma.user.findFirst({
        where: { 
          email: email,
          NOT: { id: userId }
        }
      });
      
      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use by another user' });
      }
    }
    
    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(typeof isActive === 'boolean' && { isActive }),
        ...(typeof marketingConsent === 'boolean' && { marketingConsent }),
        updatedAt: new Date()
      },
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true,
        marketingConsent: true,
        updatedAt: true
      }
    });
    
    logger.info('User updated by admin', {
      adminUserId: req.user.id,
      targetUserId: userId,
      changes: { name, email, isActive, marketingConsent }
    });
    
    res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.error('Admin user update error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

/**
 * @route POST /api/admin/users/:id/export
 * @desc Export all user data (GDPR Right to Portability)
 * @access Admin only
 */
router.post('/users/:id/export', authMiddleware, adminAuth, async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Get complete user data
    const userData = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        cvs: {
          include: {
            sections: true
          }
        },
        subscriptions: true,
        temporaryAccess: true
      }
    });
    
    if (!userData) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Remove sensitive data before export
    const { password, twoFactorSecret, ...exportData } = userData;
    
    // Add export metadata
    const dataExport = {
      exportDate: new Date().toISOString(),
      exportedBy: 'admin',
      dataSubject: exportData.email,
      userData: exportData
    };
    
    logger.info('User data exported', {
      adminUserId: req.user.id,
      targetUserId: userId,
      exportDate: dataExport.exportDate
    });
    
    res.status(200).json(dataExport);
  } catch (error) {
    console.error('Admin user export error:', error);
    res.status(500).json({ error: 'Failed to export user data' });
  }
});

/**
 * @route DELETE /api/admin/users/:id
 * @desc Permanently delete user and all associated data (GDPR Right to Erasure)
 * @access Admin only
 */
router.delete('/users/:id', authMiddleware, adminAuth, async (req, res) => {
  try {
    const userId = req.params.id;
    const { confirmEmail } = req.body;
    
    // Get user to verify existence and email
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Require email confirmation for safety
    if (confirmEmail !== user.email) {
      return res.status(400).json({ 
        error: 'Email confirmation required',
        message: 'Please provide the user\'s email address to confirm deletion'
      });
    }
    
    // Don't allow regular admins to delete admin/superuser users
    // Check if current user is superuser
    const currentUser = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { role: true }
    });
    
    const isSuperuser = currentUser?.role === 'superuser';
    
    // Protect admin and superuser accounts from regular admin deletion
    if (!isSuperuser && (user.email === 'jamesingleton1971@gmail.com' || user.role === 'admin' || user.role === 'superuser')) {
      return res.status(403).json({ 
        error: 'Cannot delete admin or superuser accounts',
        message: 'Only superusers can delete admin or superuser accounts. Use the superuser interface.'
      });
    }
    
    logger.info('Starting user deletion process', {
      adminUserId: req.user.id,
      targetUserId: userId,
      targetEmail: user.email
    });
    
    // Delete in correct order due to foreign key constraints
    try {
      // 1. Delete CV sections first (they reference CVs)
      await prisma.cVSection.deleteMany({
        where: {
          cv: {
            userId: userId
          }
        }
      });
      
      // 2. Delete CVs
      await prisma.cV.deleteMany({
        where: { userId: userId }
      });
      
      // 3. Delete subscriptions
      await prisma.subscription.deleteMany({
        where: { userId: userId }
      });
      
      // 4. Delete temporary access records
      await prisma.temporaryAccess.deleteMany({
        where: { userId: userId }
      });
      
      // 5. Finally delete the user
      await prisma.user.delete({
        where: { id: userId }
      });
      
      logger.info('User deletion completed successfully', {
        adminUserId: req.user.id,
        deletedUserId: userId,
        deletedUserEmail: user.email
      });
      
      res.status(200).json({
        success: true,
        message: 'User and all associated data has been permanently deleted',
        deletedUser: {
          id: user.id,
          email: user.email,
          name: user.name
        },
        deletionDate: new Date().toISOString()
      });
      
    } catch (dbError) {
      logger.error('Database error during user deletion', {
        adminUserId: req.user.id,
        targetUserId: userId,
        error: dbError.message
      });
      
      res.status(500).json({
        error: 'Failed to delete user data',
        message: 'A database error occurred during deletion. Please try again.'
      });
    }
    
  } catch (error) {
    console.error('Admin user deletion error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

/**
 * @route POST /api/admin/users/:id/deactivate
 * @desc Deactivate user account (reversible)
 * @access Admin only
 */
router.post('/users/:id/deactivate', authMiddleware, adminAuth, async (req, res) => {
  try {
    const userId = req.params.id;
    
    const user = await prisma.user.update({
      where: { id: userId },
      data: { 
        isActive: false,
        updatedAt: new Date()
      },
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true
      }
    });
    
    logger.info('User deactivated by admin', {
      adminUserId: req.user.id,
      targetUserId: userId
    });
    
    res.status(200).json({
      success: true,
      message: 'User account has been deactivated',
      user
    });
  } catch (error) {
    console.error('Admin user deactivation error:', error);
    res.status(500).json({ error: 'Failed to deactivate user' });
  }
});

/**
 * @route POST /api/admin/users/:id/reactivate
 * @desc Reactivate user account
 * @access Admin only
 */
router.post('/users/:id/reactivate', authMiddleware, adminAuth, async (req, res) => {
  try {
    const userId = req.params.id;
    
    const user = await prisma.user.update({
      where: { id: userId },
      data: { 
        isActive: true,
        updatedAt: new Date()
      },
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true
      }
    });
    
    logger.info('User reactivated by admin', {
      adminUserId: req.user.id,
      targetUserId: userId
    });
    
    res.status(200).json({
      success: true,
      message: 'User account has been reactivated',
      user
    });
  } catch (error) {
    console.error('Admin user reactivation error:', error);
    res.status(500).json({ error: 'Failed to reactivate user' });
  }
});

/**
 * Superuser-only middleware
 * Only allows users with 'superuser' role
 */
const superuserAuth = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, role: true, isActive: true }
    });
    
    if (!user || !user.isActive) {
      return res.status(403).json({ error: 'Account is inactive' });
    }
    
    if (user.role !== 'superuser') {
      logger.warn('Unauthorized superuser access attempt', {
        userId,
        userEmail: user.email,
        userRole: user.role,
        ip: req.ip,
        path: req.path
      });
      return res.status(403).json({ error: 'Superuser privileges required' });
    }
    
    logger.info('Superuser access granted', {
      userId,
      userEmail: user.email,
      ip: req.ip,
      path: req.path
    });
    
    req.superuser = user;
    next();
  } catch (error) {
    logger.error('Superuser authentication error', {
      error: error.message,
      ip: req.ip,
      path: req.path
    });
    res.status(500).json({ error: 'Superuser authentication failed' });
  }
};

/**
 * @route PUT /api/admin/superuser/users/:id/role
 * @desc Change user role (superuser only)
 * @access Superuser only
 */
router.put('/superuser/users/:id/role', authMiddleware, superuserAuth, async (req, res) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;
    
    // Validate role
    const validRoles = ['user', 'admin', 'superuser'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ 
        error: 'Invalid role',
        validRoles 
      });
    }
    
    // Prevent self-demotion from superuser
    if (userId === req.user.id && role !== 'superuser') {
      return res.status(400).json({ 
        error: 'Cannot change your own superuser role',
        message: 'Use another superuser account to change your role'
      });
    }
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, role: true }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (user.role === role) {
      return res.status(200).json({ 
        message: 'User already has this role',
        user 
      });
    }
    
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        updatedAt: true
      }
    });
    
    logger.info('User role changed by superuser', {
      superuserId: req.user.id,
      superuserEmail: req.superuser.email,
      targetUserId: userId,
      targetEmail: user.email,
      previousRole: user.role,
      newRole: role
    });
    
    res.status(200).json({
      success: true,
      message: `User role changed from ${user.role} to ${role}`,
      user: updatedUser
    });
  } catch (error) {
    console.error('Superuser role change error:', error);
    res.status(500).json({ error: 'Failed to change user role' });
  }
});

/**
 * @route DELETE /api/admin/superuser/users/:id
 * @desc Force delete any user including admins (superuser only)
 * @access Superuser only
 */
router.delete('/superuser/users/:id', authMiddleware, superuserAuth, async (req, res) => {
  try {
    const userId = req.params.id;
    const { confirmEmail } = req.body;
    
    // Prevent self-deletion
    if (userId === req.user.id) {
      return res.status(400).json({ 
        error: 'Cannot delete your own account',
        message: 'Use another superuser account to delete your account'
      });
    }
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        id: true, 
        email: true, 
        name: true, 
        role: true,
        _count: {
          select: {
            cvs: true,
            subscriptions: true,
            payments: true
          }
        }
      }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Require email confirmation for safety
    if (confirmEmail !== user.email) {
      return res.status(400).json({ 
        error: 'Email confirmation required',
        message: 'Please provide the user\'s email address to confirm deletion'
      });
    }
    
    logger.warn('Superuser force deletion initiated', {
      superuserId: req.user.id,
      superuserEmail: req.superuser.email,
      targetUserId: userId,
      targetEmail: user.email,
      targetRole: user.role,
      targetCVs: user._count.cvs,
      targetSubscriptions: user._count.subscriptions,
      targetPayments: user._count.payments
    });
    
    try {
      // Delete all related data first
      await prisma.cVAnalysis.deleteMany({
        where: { userId: userId }
      });
      
      await prisma.cVSection.deleteMany({
        where: {
          cv: { userId: userId }
        }
      });
      
      await prisma.cV.deleteMany({
        where: { userId: userId }
      });
      
      await prisma.payment.deleteMany({
        where: { userId: userId }
      });
      
      await prisma.subscription.deleteMany({
        where: { userId: userId }
      });
      
      await prisma.temporaryAccess.deleteMany({
        where: { userId: userId }
      });
      
      // Finally delete the user
      await prisma.user.delete({
        where: { id: userId }
      });
      
      logger.info('Superuser force deletion completed', {
        superuserId: req.user.id,
        superuserEmail: req.superuser.email,
        deletedUserId: userId,
        deletedUserEmail: user.email,
        deletedUserRole: user.role
      });
      
      res.status(200).json({
        success: true,
        message: `User ${user.email} (${user.role}) and all associated data has been permanently deleted`,
        deletedUser: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        },
        deletionDate: new Date().toISOString()
      });
      
    } catch (dbError) {
      logger.error('Database error during superuser force deletion', {
        superuserId: req.user.id,
        targetUserId: userId,
        error: dbError.message
      });
      
      res.status(500).json({
        error: 'Failed to delete user data',
        message: 'A database error occurred during deletion. Please try again.'
      });
    }
    
  } catch (error) {
    console.error('Superuser force deletion error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

/**
 * @route POST /api/admin/superuser/create-staff
 * @desc Create new staff member (superuser only)
 * @access Superuser only
 */
router.post('/superuser/create-staff', authMiddleware, superuserAuth, async (req, res) => {
  try {
    const { name, email, phone, role, password } = req.body;
    
    // Validate required fields
    if (!name || !email || !password || !role) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['name', 'email', 'password', 'role']
      });
    }
    
    // Validate role
    if (!['admin', 'superuser'].includes(role)) {
      return res.status(400).json({ 
        error: 'Invalid role',
        validRoles: ['admin', 'superuser']
      });
    }
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true }
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        error: 'User already exists',
        message: `A user with email ${email} already exists`
      });
    }
    
    // Hash password
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Create new staff member
    const newStaff = await prisma.user.create({
      data: {
        name,
        email,
        phone: phone || null,
        password: hashedPassword,
        role,
        isActive: true,
        emailVerified: true, // Staff accounts are pre-verified
        marketingConsent: false
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    });
    
    logger.info('New staff member created by superuser', {
      superuserId: req.user.id,
      superuserEmail: req.superuser.email,
      newStaffId: newStaff.id,
      newStaffEmail: newStaff.email,
      newStaffRole: newStaff.role
    });
    
    res.status(201).json({
      success: true,
      message: 'Staff member created successfully',
      staff: newStaff
    });
  } catch (error) {
    console.error('Create staff error:', error);
    res.status(500).json({ error: 'Failed to create staff member' });
  }
});

/**
 * @route PUT /api/admin/superuser/users/:id
 * @desc Update staff member information (superuser only)
 * @access Superuser only
 */
router.put('/superuser/users/:id', authMiddleware, superuserAuth, async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, phone, newPassword } = req.body;
    
    // Find the user to update
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        id: true, 
        email: true, 
        name: true, 
        phone: true, 
        role: true 
      }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Prepare update data
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone || null;
    
    // Handle password update if provided
    if (newPassword) {
      if (newPassword.length < 8) {
        return res.status(400).json({ 
          error: 'Password too short',
          message: 'Password must be at least 8 characters long'
        });
      }
      
      const bcrypt = require('bcrypt');
      updateData.password = await bcrypt.hash(newPassword, 12);
    }
    
    // Check if email is being changed and if it already exists
    if (email && email !== user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
        select: { id: true }
      });
      
      if (existingUser && existingUser.id !== userId) {
        return res.status(400).json({ 
          error: 'Email already exists',
          message: `A user with email ${email} already exists`
        });
      }
    }
    
    // Update the user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        isActive: true,
        updatedAt: true
      }
    });
    
    logger.info('Staff member updated by superuser', {
      superuserId: req.user.id,
      superuserEmail: req.superuser.email,
      updatedUserId: userId,
      updatedFields: Object.keys(updateData),
      passwordChanged: !!newPassword
    });
    
    res.status(200).json({
      success: true,
      message: 'Staff member updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update staff error:', error);
    res.status(500).json({ error: 'Failed to update staff member' });
  }
});

/**
 * @route GET /api/admin/superuser/users
 * @desc List all users with full role information (superuser only)
 * @access Superuser only
 */
router.get('/superuser/users', authMiddleware, superuserAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const roleFilter = req.query.role;
    const skip = (page - 1) * limit;
    
    const where = {};
    if (roleFilter && ['user', 'admin', 'superuser'].includes(roleFilter)) {
      where.role = roleFilter;
    }
    
    const users = await prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: [
        { role: 'desc' }, // superuser, admin, user
        { createdAt: 'desc' }
      ],
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        createdAt: true,
        lastLogin: true,
        marketingConsent: true,
        _count: {
          select: {
            cvs: true,
            subscriptions: true,
            payments: true
          }
        }
      }
    });
    
    const totalUsers = await prisma.user.count({ where });
    
    // Get role statistics
    const roleStats = await prisma.user.groupBy({
      by: ['role'],
      _count: {
        role: true
      }
    });
    
    const roleStatistics = roleStats.reduce((acc, stat) => {
      acc[stat.role] = stat._count.role;
      return acc;
    }, {});
    
    res.status(200).json({
      users,
      pagination: {
        total: totalUsers,
        page,
        limit,
        pages: Math.ceil(totalUsers / limit)
      },
      roleStatistics,
      filter: roleFilter || 'all'
    });
  } catch (error) {
    console.error('Superuser users list error:', error);
    res.status(500).json({ error: 'Failed to retrieve users list' });
  }
});

module.exports = router; 