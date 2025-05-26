/**
 * Template Service
 * 
 * Handles operations related to CV templates
 */

const { prisma } = require('../config/database');
const { logger } = require('../config/logger');

/**
 * Get all available templates
 * 
 * @param {Object} options - Filter options
 * @param {Boolean} options.isPremium - Filter for premium templates
 * @returns {Promise<Array>} - List of templates
 */
async function getAllTemplates(options = {}) {
  try {
    const where = {};
    
    // Filter by premium status if specified
    if (options.isPremium !== undefined) {
      where.isPremium = options.isPremium;
    }
    
    return await prisma.cVTemplate.findMany({
      where,
      orderBy: [
        { isDefault: 'desc' },  // Default templates first
        { createdAt: 'asc' }    // Then oldest templates
      ]
    });
  } catch (error) {
    logger.error('Error fetching templates:', error);
    throw error;
  }
}

/**
 * Get template by ID
 * 
 * @param {string} id - Template ID
 * @returns {Promise<Object>} - Template details
 */
async function getTemplateById(id) {
  try {
    return await prisma.cVTemplate.findUnique({
      where: { id }
    });
  } catch (error) {
    logger.error(`Error fetching template with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Create a new template
 * 
 * @param {Object} data - Template data
 * @returns {Promise<Object>} - Created template
 */
async function createTemplate(data) {
  try {
    return await prisma.cVTemplate.create({
      data
    });
  } catch (error) {
    logger.error('Error creating template:', error);
    throw error;
  }
}

/**
 * Update an existing template
 * 
 * @param {string} id - Template ID
 * @param {Object} data - Updated template data
 * @returns {Promise<Object>} - Updated template
 */
async function updateTemplate(id, data) {
  try {
    return await prisma.cVTemplate.update({
      where: { id },
      data
    });
  } catch (error) {
    logger.error(`Error updating template with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a template
 * 
 * @param {string} id - Template ID
 * @returns {Promise<Object>} - Deleted template
 */
async function deleteTemplate(id) {
  try {
    return await prisma.cVTemplate.delete({
      where: { id }
    });
  } catch (error) {
    logger.error(`Error deleting template with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Initialize default templates if none exist
 */
async function initializeDefaultTemplates() {
  try {
    const count = await prisma.cVTemplate.count();
    
    // Only create default templates if none exist
    if (count === 0) {
      logger.info('Creating default templates');
      
      await prisma.cVTemplate.createMany({
        data: [
          {
            name: 'Professional',
            description: 'Clean, minimal design for corporate roles',
            thumbnail: '/images/templates/photos/professional.jpg',
            isDefault: true,
            isPremium: false
          },
          {
            name: 'Creative',
            description: 'Modern layout with visual elements for creative industries',
            thumbnail: '/images/templates/photos/creative.jpg',
            isDefault: false,
            isPremium: false
          },
          {
            name: 'Executive',
            description: 'Sophisticated layout for senior leadership positions',
            thumbnail: '/images/templates/photos/executive.jpg',
            isDefault: false,
            isPremium: true
          },
          {
            name: 'Academic',
            description: 'Research-focused template with publication formatting',
            thumbnail: '/images/templates/photos/academic.jpg',
            isDefault: false,
            isPremium: true
          }
        ]
      });
      
      logger.info('Default templates created successfully');
    }
  } catch (error) {
    logger.error('Error initializing default templates:', error);
    throw error;
  }
}

module.exports = {
  getAllTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  initializeDefaultTemplates
}; 