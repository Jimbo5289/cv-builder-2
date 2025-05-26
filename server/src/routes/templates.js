/**
 * Template Routes
 * 
 * API endpoints for CV templates
 */

const express = require('express');
const router = express.Router();
const templateService = require('../services/templateService');
const authMiddleware = require('../middleware/auth');
const { logger } = require('../config/logger');
const { checkSubscription } = require('../middleware/subscription');

/**
 * @route GET /api/templates
 * @desc Get all available templates
 * @access Public
 */
router.get('/', async (req, res, next) => {
  try {
    const { premium } = req.query;
    const isPremium = premium === 'true';
    
    const templates = await templateService.getAllTemplates({ 
      isPremium: premium !== undefined ? isPremium : undefined 
    });
    
    res.json(templates);
  } catch (error) {
    logger.error('Error fetching templates:', error);
    next(error);
  }
});

/**
 * @route GET /api/templates/:id
 * @desc Get template by ID
 * @access Public
 */
router.get('/:id', async (req, res, next) => {
  try {
    const template = await templateService.getTemplateById(req.params.id);
    
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }
    
    res.json(template);
  } catch (error) {
    logger.error(`Error fetching template ${req.params.id}:`, error);
    next(error);
  }
});

/**
 * @route POST /api/templates
 * @desc Create a new template (admin only)
 * @access Private/Admin
 */
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    // Simple admin check - can be improved in production
    if (!req.user || req.user.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    const template = await templateService.createTemplate(req.body);
    res.status(201).json(template);
  } catch (error) {
    logger.error('Error creating template:', error);
    next(error);
  }
});

/**
 * @route PUT /api/templates/:id
 * @desc Update a template (admin only)
 * @access Private/Admin
 */
router.put('/:id', authMiddleware, async (req, res, next) => {
  try {
    // Simple admin check - can be improved in production
    if (!req.user || req.user.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    const template = await templateService.updateTemplate(req.params.id, req.body);
    res.json(template);
  } catch (error) {
    logger.error(`Error updating template ${req.params.id}:`, error);
    next(error);
  }
});

/**
 * @route DELETE /api/templates/:id
 * @desc Delete a template (admin only)
 * @access Private/Admin
 */
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    // Simple admin check - can be improved in production
    if (!req.user || req.user.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    await templateService.deleteTemplate(req.params.id);
    res.status(204).end();
  } catch (error) {
    logger.error(`Error deleting template ${req.params.id}:`, error);
    next(error);
  }
});

module.exports = router; 