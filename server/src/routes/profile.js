/**
 * User Profile Routes
 * 
 * API endpoints for managing user profiles
 */

const express = require('express');
const router = express.Router();
const userProfileService = require('../services/userProfileService');
const authMiddleware = require('../middleware/auth');
const { logger } = require('../config/logger');

/**
 * @route GET /api/profile
 * @desc Get user profile
 * @access Private
 */
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const profile = await userProfileService.getProfileByUserId(userId);
    
    res.json(profile || {});
  } catch (error) {
    logger.error(`Error fetching profile for user ${req.user.id}:`, error);
    next(error);
  }
});

/**
 * @route GET /api/profile/complete
 * @desc Get complete user profile with related data
 * @access Private
 */
router.get('/complete', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const completeProfile = await userProfileService.getCompleteUserProfile(userId);
    
    // Remove sensitive information
    if (completeProfile) {
      delete completeProfile.password;
      delete completeProfile.resetToken;
      delete completeProfile.resetTokenExpiry;
      delete completeProfile.twoFactorSecret;
    }
    
    res.json(completeProfile || {});
  } catch (error) {
    logger.error(`Error fetching complete profile for user ${req.user.id}:`, error);
    next(error);
  }
});

/**
 * @route PUT /api/profile
 * @desc Update user profile
 * @access Private
 */
router.put('/', authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const updatedProfile = await userProfileService.updateProfile(userId, req.body);
    
    res.json(updatedProfile);
  } catch (error) {
    logger.error(`Error updating profile for user ${req.user.id}:`, error);
    next(error);
  }
});

module.exports = router; 