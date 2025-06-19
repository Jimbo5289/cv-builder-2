const axios = require('axios');
const crypto = require('crypto');
const { logger } = require('../config/logger');

// Configuration validation
const requiredVars = ['MAILCHIMP_API_KEY', 'MAILCHIMP_SERVER_PREFIX', 'MAILCHIMP_LIST_ID'];
const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  logger.warn(`Missing Mailchimp configuration: ${missingVars.join(', ')}. Auto-subscription will use mock mode.`);
}

// Helper function to create MD5 hash (used by Mailchimp for subscriber ID)
const getMd5Hash = (email) => {
  return crypto.createHash('md5').update(email.toLowerCase()).digest('hex');
};

/**
 * Adds a new user to the Mailchimp mailing list
 * 
 * @param {Object} user - User object containing email and name
 * @param {boolean} [doubleOptIn=false] - Whether to use double opt-in (sends confirmation email)
 * @returns {Promise<Object>} - Result of the operation
 */
const addUserToMailingList = async (user, doubleOptIn = false) => {
  try {
    // Validate user object
    if (!user || !user.email) {
      logger.error('Invalid user object provided for Mailchimp subscription');
      return { success: false, error: 'Invalid user data' };
    }
    
    // Log attempt to add user to mailing list
    logger.info('Attempting to add user to Mailchimp mailing list:', { 
      email: user.email, 
      name: user.name,
      doubleOptIn
    });
    
    // Check if Mailchimp is configured
    if (missingVars.length > 0) {
      logger.info('Using mock Mailchimp subscription for new user:', { email: user.email });
      
      // Return success in development/mock mode
      return { 
        success: true, 
        message: 'Mock subscription successful', 
        mock: true 
      };
    }
    
    // Prepare API endpoint
    const apiKey = process.env.MAILCHIMP_API_KEY;
    const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX;
    const listId = process.env.MAILCHIMP_LIST_ID;
    const url = `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${listId}/members`;
    
    // Prepare request data
    const memberData = {
      email_address: user.email,
      status: doubleOptIn ? 'pending' : 'subscribed', // pending for double opt-in, subscribed for direct
      merge_fields: {}
    };
    
    // Add name field if provided
    if (user.name) {
      // Split name into first and last name
      const nameParts = user.name.split(' ');
      if (nameParts.length > 1) {
        memberData.merge_fields.FNAME = nameParts[0];
        memberData.merge_fields.LNAME = nameParts.slice(1).join(' ');
      } else {
        memberData.merge_fields.FNAME = user.name;
      }
    }
    
    // Add marketing permissions and tags
    memberData.tags = ['cv-builder-user'];
    memberData.marketing_permissions = [
      {
        marketing_permission_id: 'email',
        enabled: true
      }
    ];
    
    // Make request to Mailchimp API
    const response = await axios.post(url, memberData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`apikey:${apiKey}`).toString('base64')}`
      }
    });
    
    logger.info('Successfully subscribed new user to newsletter:', { 
      email: user.email,
      status: response.data.status
    });
    
    return {
      success: true,
      message: 'User successfully added to mailing list',
      status: response.data.status
    };
  } catch (error) {
    // Handle Mailchimp API errors
    if (error.response && error.response.data) {
      const { status, title, detail } = error.response.data;
      
      // Check if email already exists
      if (error.response.status === 400 && title === 'Member Exists') {
        // User is already on the list, which is fine
        logger.info('User already subscribed to mailing list:', { email: user.email });
        
        return {
          success: true,
          message: 'User already in mailing list',
          alreadySubscribed: true
        };
      }
      
      // Check for invalid/fake email addresses (common during testing)
      if (error.response.status === 400 && title === 'Invalid Resource' && 
          detail && detail.includes('looks fake or invalid')) {
        // This is expected for test emails like debug@test.com
        logger.info('Mailchimp rejected test/invalid email address:', { 
          email: user.email,
          reason: detail
        });
        
        return {
          success: true,
          message: 'Email not added to mailing list (test/invalid email)',
          testEmail: true
        };
      }
      
      // Log other API errors as warnings (not errors) since registration still succeeded
      logger.warn('Mailchimp API warning - user registration still completed:', { 
        email: user.email,
        status: error.response.status,
        title,
        detail
      });
    } else {
      logger.warn('Mailchimp service unavailable - user registration still completed:', {
        email: user.email,
        error: error.message
      });
    }
    
    // Don't fail the whole registration just because Mailchimp failed
    return {
      success: false,
      message: 'Failed to add user to mailing list, but user registration completed',
      error: error.message
    };
  }
};

/**
 * Checks if a user is already subscribed to the mailing list
 * 
 * @param {string} email - User's email address
 * @returns {Promise<Object>} - Result with subscription status
 */
const checkSubscriptionStatus = async (email) => {
  try {
    // Check if Mailchimp is configured
    if (missingVars.length > 0) {
      return { subscribed: false, mock: true };
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
    
    return {
      success: true,
      subscribed: response.data.status === 'subscribed',
      status: response.data.status
    };
  } catch (error) {
    // If 404, the email is not subscribed
    if (error.response && error.response.status === 404) {
      return { success: true, subscribed: false };
    }
    
    logger.error('Error checking subscription status:', {
      error: error.message,
      email
    });
    
    return {
      success: false,
      message: 'Failed to check subscription status',
      error: error.message
    };
  }
};

module.exports = {
  addUserToMailingList,
  checkSubscriptionStatus
}; 