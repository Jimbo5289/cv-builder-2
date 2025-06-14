const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { z } = require('zod');
const { logger } = require('../config/logger');

// Import auth middleware
const auth = require('../middleware/auth');

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

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    // In development mode, return mock user data
    if (process.env.NODE_ENV === 'development' || process.env.MOCK_DATABASE === 'true') {
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
    const { name, email, phone } = req.body;
    
    // Log the profile update request
    if (process.env.NODE_ENV === 'development') {
      logger.info('Profile update request received on /api/users/profile:', {
        userId: req.user?.id,
        hasData: !!req.body,
        hasPhone: !!phone,
        phoneValue: phone
      });
    }
    
    // Parse and validate the data
    let validatedData = {};
    try {
      validatedData = updateProfileSchema.parse({
        name: name || undefined,
        email: email || undefined,
        phone: phone || undefined
      });
    } catch (validationError) {
      logger.warn('Profile update validation failed', {
        error: validationError.errors,
        userId: req.user?.id
      });
      return res.status(400).json({
        error: 'Validation error',
        details: validationError.errors
      });
    }

    // Check if user is authenticated
    if (!req.user?.id) {
      logger.error('Profile update failed: No user ID in request');
      return res.status(401).json({ error: 'Authentication required' });
    }

    // In development mode, return mock success
    if (process.env.NODE_ENV === 'development' || process.env.MOCK_DATABASE === 'true') {
      logger.info('Development mode: Simulating successful profile update', {
        data: validatedData
      });
      
      return res.json({
        success: true,
        message: 'Profile updated successfully (development mode)',
        user: {
          id: req.user.id,
          email: req.user.email || 'dev@example.com',
          name: validatedData.name || req.user.name || 'Development User',
          phone: validatedData.phone || req.user.phone || '',
          createdAt: new Date()
        }
      });
    }

    // Update the user profile in the database
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: validatedData,
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
      updatedFields: Object.keys(validatedData)
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

module.exports = router;
