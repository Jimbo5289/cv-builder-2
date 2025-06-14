const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const logger = require('../utils/logger');

// Debug endpoint to check environment and database status
router.get('/environment', auth, (req, res) => {
  try {
    const debugInfo = {
      timestamp: new Date().toISOString(),
      user: {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name,
        phone: req.user.phone || 'NOT_SET'
      },
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        MOCK_DATABASE: process.env.MOCK_DATABASE,
        DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT_SET',
        FRONTEND_URL: process.env.FRONTEND_URL || 'NOT_SET'
      },
      database: {
        usingMockDatabase: process.env.NODE_ENV === 'development' && process.env.MOCK_DATABASE === 'true',
        shouldUseMockDatabase: process.env.MOCK_DATABASE === 'true',
        hasRealDatabase: !!process.env.DATABASE_URL
      },
      conditions: {
        mockConditionOld: process.env.NODE_ENV === 'development' || process.env.MOCK_DATABASE === 'true',
        mockConditionNew: process.env.NODE_ENV === 'development' && process.env.MOCK_DATABASE === 'true',
        willUseMockDatabase: (process.env.NODE_ENV === 'development' && process.env.MOCK_DATABASE === 'true')
      }
    };

    logger.info('Debug environment check', debugInfo);
    
    res.json(debugInfo);
  } catch (error) {
    logger.error('Debug environment check failed', { error: error.message });
    res.status(500).json({
      error: 'Debug check failed',
      message: error.message
    });
  }
});

// Debug endpoint to test profile update
router.post('/test-profile-update', auth, async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    
    const debugInfo = {
      timestamp: new Date().toISOString(),
      requestData: { name, email, phone },
      currentUser: {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name,
        phone: req.user.phone || 'NOT_SET'
      },
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        MOCK_DATABASE: process.env.MOCK_DATABASE,
        usingMockDatabase: process.env.NODE_ENV === 'development' && process.env.MOCK_DATABASE === 'true'
      }
    };

    // Check if we would use mock database
    if (process.env.NODE_ENV === 'development' && process.env.MOCK_DATABASE === 'true') {
      debugInfo.result = 'WOULD_USE_MOCK_DATABASE';
      debugInfo.message = 'This request would use mock database and not persist to real database';
    } else {
      debugInfo.result = 'WOULD_USE_REAL_DATABASE';
      debugInfo.message = 'This request would use real database and persist data';
    }

    logger.info('Debug profile update test', debugInfo);
    
    res.json(debugInfo);
  } catch (error) {
    logger.error('Debug profile update test failed', { error: error.message });
    res.status(500).json({
      error: 'Debug test failed',
      message: error.message
    });
  }
});

module.exports = router; 