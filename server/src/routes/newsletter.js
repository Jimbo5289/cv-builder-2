const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../utils/responseHandler');
const { logger } = require('../config/logger');
const axios = require('axios');
const crypto = require('crypto');
const { z } = require('zod');

// Input validation schema
const subscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().optional(),
  lastName: z.string().optional()
});

// Configuration validation
const requiredVars = ['MAILCHIMP_API_KEY', 'MAILCHIMP_SERVER_PREFIX', 'MAILCHIMP_LIST_ID'];
const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  logger.warn(`Missing Mailchimp configuration: ${missingVars.join(', ')}. Newsletter signup will use mock mode.`);
}

// Helper function to create MD5 hash (used by Mailchimp for subscriber ID)
const getMd5Hash = (email) => {
  return crypto.createHash('md5').update(email.toLowerCase()).digest('hex');
};

// POST /api/newsletter/subscribe - Subscribe to newsletter
router.post('/subscribe', asyncHandler(async (req, res) => {
  try {
    // Validate input
    const data = subscribeSchema.parse(req.body);
    
    // Check if Mailchimp is configured
    if (missingVars.length > 0) {
      logger.info('Using mock Mailchimp subscription for:', { email: data.email });
      
      // Return success in development/mock mode
      return res.status(200).json({
        success: true,
        message: 'Mock subscription successful',
        mock: true
      });
    }
    
    // Prepare API endpoint
    const apiKey = process.env.MAILCHIMP_API_KEY;
    const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX;
    const listId = process.env.MAILCHIMP_LIST_ID;
    const url = `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${listId}/members`;
    
    // Prepare request data
    const memberData = {
      email_address: data.email,
      status: 'pending', // Use 'pending' for double opt-in
      merge_fields: {}
    };
    
    // Add name fields if provided
    if (data.name) memberData.merge_fields.FNAME = data.name;
    if (data.lastName) memberData.merge_fields.LNAME = data.lastName;
    
    // Make request to Mailchimp API
    const response = await axios.post(url, memberData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`apikey:${apiKey}`).toString('base64')}`
      }
    });
    
    logger.info('Successfully subscribed to newsletter:', { 
      email: data.email,
      status: response.data.status
    });
    
    return res.status(200).json({
      success: true,
      message: 'Subscription successful! Please check your email to confirm.'
    });
  } catch (error) {
    // Handle Mailchimp API errors
    if (error.response && error.response.data) {
      // Check if email already exists
      if (error.response.status === 400 && error.response.data.title === 'Member Exists') {
        logger.info('Attempted to subscribe existing email:', { email: req.body.email });
        
        return res.status(400).json({
          success: false,
          message: 'This email is already subscribed to our newsletter.'
        });
      }
      
      logger.error('Mailchimp API error:', { 
        status: error.response.status,
        title: error.response.data.title,
        detail: error.response.data.detail
      });
      
      return res.status(400).json({
        success: false,
        message: 'Failed to subscribe: ' + (error.response.data.detail || error.response.data.title)
      });
    }
    
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address'
      });
    }
    
    // Log other errors
    logger.error('Newsletter subscription error:', {
      error: error.message,
      stack: error.stack
    });
    
    return res.status(500).json({
      success: false,
      message: 'An unexpected error occurred. Please try again later.'
    });
  }
}));

// GET /api/newsletter/verify/:email - Check subscription status
router.get('/verify/:email', asyncHandler(async (req, res) => {
  try {
    const email = req.params.email;
    
    // Check if Mailchimp is configured
    if (missingVars.length > 0) {
      return res.status(200).json({
        subscribed: false,
        mock: true
      });
    }
    
    // Get subscriber hash
    const subscriberHash = getMd5Hash(email);
    
    // Prepare API endpoint
    const apiKey = process.env.MAILCHIMP_API_KEY;
    const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX;
    const listId = process.env.MAILCHIMP_LIST_ID;
    const url = `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${listId}/members/${subscriberHash}`;
    
    // Make request to Mailchimp API
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`apikey:${apiKey}`).toString('base64')}`
      }
    });
    
    return res.status(200).json({
      subscribed: response.data.status === 'subscribed',
      status: response.data.status
    });
  } catch (error) {
    // If 404, the email is not subscribed
    if (error.response && error.response.status === 404) {
      return res.status(200).json({
        subscribed: false
      });
    }
    
    logger.error('Error verifying subscription status:', {
      error: error.message,
      email: req.params.email
    });
    
    return res.status(500).json({
      success: false,
      message: 'Failed to verify subscription status'
    });
  }
}));

module.exports = router; 