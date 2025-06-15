// Get expiration notifications
router.get('/notifications', auth, async (req, res) => {
  try {
    const notifications = [];
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000));

    // Only use mock mode in local development, never in production
    if (process.env.NODE_ENV === 'development' && process.env.MOCK_DATABASE === 'true') {
      // Return mock notification for development
      return res.json({ 
        notifications: [{
          type: 'subscription',
          title: 'Subscription Expiring Soon',
          message: 'Your Monthly Subscription will expire in 5 days.',
          daysRemaining: 5,
          expiryDate: new Date(now.getTime() + (5 * 24 * 60 * 60 * 1000)),
          severity: 'warning'
        }]
      });
    }

    // Check for expiring subscriptions
    const activeSubscriptions = await prisma.subscription.findMany({
      where: {
        userId: req.user.id,
        status: { in: ['active', 'trialing'] },
        currentPeriodEnd: {
          gt: now,
          lte: sevenDaysFromNow
        }
      }
    });

    for (const subscription of activeSubscriptions) {
      const daysRemaining = Math.ceil((subscription.currentPeriodEnd - now) / (1000 * 60 * 60 * 24));
      const severity = daysRemaining <= 3 ? 'error' : 'warning';
      
      notifications.push({
        type: 'subscription',
        title: 'Subscription Expiring Soon',
        message: `Your ${subscription.planId || 'subscription'} will ${subscription.cancelAtPeriodEnd ? 'end' : 'renew'} in ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}.`,
        daysRemaining,
        expiryDate: subscription.currentPeriodEnd,
        severity,
        autoRenew: !subscription.cancelAtPeriodEnd
      });
    }

    // Check for expiring temporary access
    const temporaryAccess = await prisma.temporaryAccess.findMany({
      where: {
        userId: req.user.id,
        endTime: {
          gt: now,
          lte: sevenDaysFromNow
        }
      }
    });

    for (const access of temporaryAccess) {
      const daysRemaining = Math.ceil((access.endTime - now) / (1000 * 60 * 60 * 24));
      const severity = daysRemaining <= 3 ? 'error' : 'warning';
      
      let accessTypeName = 'Premium Access';
      if (access.type === '30day-access') {
        accessTypeName = '30-Day Access Pass';
      } else if (access.type === 'pay-per-cv') {
        accessTypeName = 'Pay-Per-CV Access';
      }
      
      notifications.push({
        type: 'temporary_access',
        title: 'Premium Access Expiring Soon',
        message: `Your ${accessTypeName} will expire in ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}.`,
        daysRemaining,
        expiryDate: access.endTime,
        severity,
        accessType: access.type
      });
    }

    res.json({ notifications });
  } catch (error) {
    logger.error('Get notifications error:', { error: error.message, stack: error.stack });
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 