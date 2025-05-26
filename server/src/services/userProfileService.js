/**
 * User Profile Service
 * 
 * Handles operations related to user profiles
 */

const { prisma } = require('../config/database');
const { logger } = require('../config/logger');

/**
 * Get user profile by user ID
 * 
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - User profile
 */
async function getProfileByUserId(userId) {
  try {
    return await prisma.userProfile.findUnique({
      where: { userId }
    });
  } catch (error) {
    logger.error(`Error fetching profile for user ${userId}:`, error);
    throw error;
  }
}

/**
 * Create or update user profile
 * 
 * @param {string} userId - User ID
 * @param {Object} data - Profile data
 * @returns {Promise<Object>} - Updated profile
 */
async function updateProfile(userId, data) {
  try {
    // Check if profile exists
    const existingProfile = await prisma.userProfile.findUnique({
      where: { userId }
    });
    
    if (existingProfile) {
      // Update existing profile
      return await prisma.userProfile.update({
        where: { userId },
        data
      });
    } else {
      // Create new profile
      return await prisma.userProfile.create({
        data: {
          ...data,
          userId
        }
      });
    }
  } catch (error) {
    logger.error(`Error updating profile for user ${userId}:`, error);
    throw error;
  }
}

/**
 * Get user profile with all related information
 * 
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - User profile with related data
 */
async function getCompleteUserProfile(userId) {
  try {
    // Get user with profile and other related data
    return await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        subscriptions: {
          where: {
            status: 'active'
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        },
        cvs: {
          select: {
            id: true,
            title: true,
            createdAt: true,
            updatedAt: true,
            atsScore: true
          },
          orderBy: {
            updatedAt: 'desc'
          }
        }
      }
    });
  } catch (error) {
    logger.error(`Error fetching complete profile for user ${userId}:`, error);
    throw error;
  }
}

module.exports = {
  getProfileByUserId,
  updateProfile,
  getCompleteUserProfile
}; 