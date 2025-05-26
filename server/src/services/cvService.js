/**
 * CV Service
 * 
 * Handles operations related to CV management
 */

const { prisma } = require('../config/database');
const { logger } = require('../config/logger');
const crypto = require('crypto');

/**
 * Get all CVs for a user
 * 
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - List of CVs
 */
async function getUserCVs(userId) {
  try {
    return await prisma.cV.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
        atsScore: true,
        templateId: true,
        isPublic: true,
        shareableLink: true
      }
    });
  } catch (error) {
    logger.error(`Error fetching CVs for user ${userId}:`, error);
    throw error;
  }
}

/**
 * Get CV by ID
 * 
 * @param {string} cvId - CV ID
 * @param {string} userId - User ID (optional, for authorization)
 * @returns {Promise<Object>} - CV details
 */
async function getCVById(cvId, userId = null) {
  try {
    const where = { id: cvId };
    
    // If userId is provided, ensure the CV belongs to this user
    if (userId) {
      where.userId = userId;
    }
    
    return await prisma.cV.findFirst({
      where,
      include: {
        sections: {
          orderBy: { order: 'asc' }
        }
      }
    });
  } catch (error) {
    logger.error(`Error fetching CV with ID ${cvId}:`, error);
    throw error;
  }
}

/**
 * Get CV by shareable link
 * 
 * @param {string} shareableLink - Shareable link token
 * @returns {Promise<Object>} - CV details
 */
async function getCVByShareableLink(shareableLink) {
  try {
    return await prisma.cV.findUnique({
      where: { 
        shareableLink,
        isPublic: true
      },
      include: {
        sections: {
          orderBy: { order: 'asc' }
        }
      }
    });
  } catch (error) {
    logger.error(`Error fetching CV with shareable link ${shareableLink}:`, error);
    throw error;
  }
}

/**
 * Create a new CV
 * 
 * @param {string} userId - User ID
 * @param {Object} data - CV data
 * @returns {Promise<Object>} - Created CV
 */
async function createCV(userId, data) {
  try {
    // Generate a title if not provided
    const title = data.title || `CV - ${new Date().toLocaleDateString()}`;
    
    return await prisma.cV.create({
      data: {
        title,
        content: data.content || '{}',
        templateId: data.templateId || '1', // Default template
        userId,
        isPublic: false
      }
    });
  } catch (error) {
    logger.error(`Error creating CV for user ${userId}:`, error);
    throw error;
  }
}

/**
 * Update an existing CV
 * 
 * @param {string} cvId - CV ID
 * @param {string} userId - User ID
 * @param {Object} data - Updated CV data
 * @returns {Promise<Object>} - Updated CV
 */
async function updateCV(cvId, userId, data) {
  try {
    return await prisma.cV.update({
      where: { 
        id: cvId,
        userId
      },
      data
    });
  } catch (error) {
    logger.error(`Error updating CV with ID ${cvId}:`, error);
    throw error;
  }
}

/**
 * Delete a CV
 * 
 * @param {string} cvId - CV ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Deleted CV
 */
async function deleteCV(cvId, userId) {
  try {
    return await prisma.cV.delete({
      where: { 
        id: cvId,
        userId
      }
    });
  } catch (error) {
    logger.error(`Error deleting CV with ID ${cvId}:`, error);
    throw error;
  }
}

/**
 * Generate a shareable link for a CV
 * 
 * @param {string} cvId - CV ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Updated CV with shareable link
 */
async function generateShareableLink(cvId, userId) {
  try {
    // Generate a random token for the shareable link
    const shareableLink = crypto.randomBytes(16).toString('hex');
    
    return await prisma.cV.update({
      where: { 
        id: cvId,
        userId
      },
      data: { 
        shareableLink,
        isPublic: true
      }
    });
  } catch (error) {
    logger.error(`Error generating shareable link for CV ${cvId}:`, error);
    throw error;
  }
}

/**
 * Disable sharing for a CV
 * 
 * @param {string} cvId - CV ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Updated CV with sharing disabled
 */
async function disableSharing(cvId, userId) {
  try {
    return await prisma.cV.update({
      where: { 
        id: cvId,
        userId
      },
      data: { 
        shareableLink: null,
        isPublic: false
      }
    });
  } catch (error) {
    logger.error(`Error disabling sharing for CV ${cvId}:`, error);
    throw error;
  }
}

module.exports = {
  getUserCVs,
  getCVById,
  getCVByShareableLink,
  createCV,
  updateCV,
  deleteCV,
  generateShareableLink,
  disableSharing
}; 