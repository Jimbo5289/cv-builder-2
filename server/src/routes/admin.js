const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// Require authentication for all admin routes
router.use(authMiddleware);

// Admin-only middleware
const requireAdmin = (req, res, next) => {
  // Check if the user is authenticated and has admin role
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  if (!req.user.isAdmin && req.user.email !== 'james@theideasworkshop.co.uk') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  
  next();
};

// Apply admin check for all routes
router.use(requireAdmin);

// Get server status and configuration
router.get('/status', async (req, res) => {
  try {
    return res.status(200).json({
      status: 'operational',
      version: process.env.npm_package_version || 'unknown',
      environment: process.env.NODE_ENV || 'development',
      serverTime: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting server status:', error);
    return res.status(500).json({ error: 'Failed to get server status' });
  }
});

// Update AWS security group with current Render IP
router.post('/update-security-group', async (req, res) => {
  try {
    // Dynamically import the update script
    let updateSecurityGroupWithRenderIPs;
    
    try {
      ({ updateSecurityGroupWithRenderIPs } = require('../../scripts/update-render-ips'));
    } catch (importError) {
      console.error('Error importing security group update script:', importError);
      return res.status(500).json({ 
        error: 'Security group update script not available', 
        message: importError.message 
      });
    }
    
    // Run the update
    await updateSecurityGroupWithRenderIPs();
    
    return res.status(200).json({ 
      success: true, 
      message: 'Security group update initiated. Check server logs for details.' 
    });
  } catch (error) {
    console.error('Error triggering security group update:', error);
    return res.status(500).json({ 
      error: 'Failed to update security group', 
      message: error.message 
    });
  }
});

module.exports = router; 