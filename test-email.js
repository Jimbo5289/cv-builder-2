const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Import the email service
const { sendSubscriptionConfirmation } = require('./server/src/services/emailService');

// Test user data
const testUser = {
  name: 'James Singleton',
  email: 'james@mycvbuilder.co.uk'
};

// Test subscription data
const testSubscription = {
  planId: 'Annual Professional Plan',
  status: 'active',
  currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
  amount: 79.00,
  currency: 'GBP'
};

async function sendTestEmail() {
  try {
    console.log('🚀 Sending test subscription confirmation email...');
    console.log('📧 To:', testUser.email);
    console.log('👤 User:', testUser.name);
    console.log('💰 Plan:', testSubscription.planId);
    
    await sendSubscriptionConfirmation(testUser, testSubscription);
    
    console.log('✅ Test email sent successfully!');
    console.log('📬 Check your inbox at', testUser.email);
    
  } catch (error) {
    console.error('❌ Failed to send test email:', error.message);
    console.error('Full error:', error);
  }
}

// Run the test
sendTestEmail(); 