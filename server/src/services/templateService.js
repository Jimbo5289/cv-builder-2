/**
 * Template Service
 * 
 * Handles operations related to CV templates
 */

const database = require('../config/database');
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
    // Ensure database client is initialized
    if (!database.client) {
      logger.error('Database client not initialized');
      return [];
    }
    
    const where = {};
    
    // Filter by premium status if specified
    if (options.isPremium !== undefined) {
      where.isPremium = options.isPremium;
    }
    
    // Mock implementation for mock database
    if (process.env.MOCK_DATABASE === 'true') {
      // Return mock data
      return [
        {
          id: '1',
          name: 'Professional',
          description: 'Clean, minimal design for corporate roles',
          thumbnail: '/images/templates/photos/professional.jpg',
          isDefault: true,
          isPremium: false
        },
        {
          id: '2',
          name: 'Creative',
          description: 'Modern layout with visual elements for creative industries',
          thumbnail: '/images/templates/photos/creative.jpg',
          isDefault: false,
          isPremium: false
        },
        {
          id: '3',
          name: 'Executive',
          description: 'Sophisticated layout for senior leadership positions',
          thumbnail: '/images/templates/photos/executive.jpg',
          isDefault: false,
          isPremium: true
        },
        {
          id: '4',
          name: 'Academic',
          description: 'Research-focused template with publication formatting',
          thumbnail: '/images/templates/photos/academic.jpg',
          isDefault: false,
          isPremium: true
        }
      ].filter(template => {
        if (options.isPremium !== undefined) {
          return template.isPremium === options.isPremium;
        }
        return true;
      });
    }
    
    return await database.client.cVTemplate.findMany({
      where,
      orderBy: [
        { isDefault: 'desc' },  // Default templates first
        { createdAt: 'asc' }    // Then oldest templates
      ]
    });
  } catch (error) {
    logger.error('Error fetching templates:', error);
    return [];
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
    // Mock implementation for mock database
    if (process.env.MOCK_DATABASE === 'true') {
      const templates = [
        {
          id: '1',
          name: 'Professional',
          description: 'Clean, minimal design for corporate roles',
          thumbnail: '/images/templates/photos/professional.jpg',
          isDefault: true,
          isPremium: false
        },
        {
          id: '2',
          name: 'Creative',
          description: 'Modern layout with visual elements for creative industries',
          thumbnail: '/images/templates/photos/creative.jpg',
          isDefault: false,
          isPremium: false
        },
        {
          id: '3',
          name: 'Executive',
          description: 'Sophisticated layout for senior leadership positions',
          thumbnail: '/images/templates/photos/executive.jpg',
          isDefault: false,
          isPremium: true
        },
        {
          id: '4',
          name: 'Academic',
          description: 'Research-focused template with publication formatting',
          thumbnail: '/images/templates/photos/academic.jpg',
          isDefault: false,
          isPremium: true
        }
      ];
      return templates.find(t => t.id === id) || null;
    }
    
    return await database.client.cVTemplate.findUnique({
      where: { id }
    });
  } catch (error) {
    logger.error(`Error fetching template with ID ${id}:`, error);
    return null;
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
    return await database.client.cVTemplate.create({
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
    return await database.client.cVTemplate.update({
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
    return await database.client.cVTemplate.delete({
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
    // Skip for mock database
    if (process.env.MOCK_DATABASE === 'true') {
      logger.info('Using mock database - skipping template initialization');
      return;
    }
    
    if (!database.client) {
      logger.error('Database client not initialized');
      return;
    }
    
    const count = await database.client.cVTemplate.count();
    
    // Only create default templates if none exist
    if (count === 0) {
      logger.info('Creating default templates');
      
      await database.client.cVTemplate.createMany({
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