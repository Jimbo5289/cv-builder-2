const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Import auth middleware with a fallback
let auth, validateUserAccess;
try {
  const authModule = require('../middleware/auth');
  auth = authModule.auth;
  validateUserAccess = authModule.validateUserAccess;
} catch (error) {
  console.warn('Auth middleware not available, using fallback');
  // Fallback middleware
  auth = (req, res, next) => {
    console.warn('Using fallback auth middleware');
    req.user = { id: 'fallback-user-id' };
    next();
  };
  validateUserAccess = (req, res, next) => next();
}

// Get user profile (authenticated)
router.get('/profile', auth, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Update user profile (authenticated)
router.put('/profile', auth, async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { name, phone } = req.body;
    
    // Only allow updating certain fields
    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;

    const updatedUser = await prisma.user.update({
      where: {
        id: req.user.id
      },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 