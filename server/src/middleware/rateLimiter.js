/* eslint-disable */
const rateLimit = require('express-rate-limit');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Authentication rate limiter
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: 'Too many login attempts, please try again after 15 minutes',
  handler: async (req, res) => {
    const { email } = req.body;
    if (email) {
      try {
        const user = await prisma.user.findUnique({
          where: { email }
        });
        
        if (user) {
          // Increment failed login attempts
          await prisma.user.update({
            where: { id: user.id },
            data: {
              failedLoginAttempts: {
                increment: 1
              },
              lockedUntil: new Date(Date.now() + 15 * 60 * 1000) // Lock for 15 minutes
            }
          });
        }
      } catch (error) {
        console.error('Error updating failed login attempts:', error);
      }
    }
    
    res.status(429).json({
      error: 'Too many login attempts, please try again after 15 minutes'
    });
  }
});

// Password reset rate limiter
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 attempts per hour
  message: 'Too many password reset attempts, please try again after an hour'
});

// Registration rate limiter
const registrationLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 5, // 5 registrations per day per IP
  message: 'Too many accounts created from this IP, please try again after 24 hours'
});

module.exports = {
  authLimiter,
  passwordResetLimiter,
  registrationLimiter
}; 