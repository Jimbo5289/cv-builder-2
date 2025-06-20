const { PrismaClient } = require('@prisma/client');
const { stripe } = require('./server-prod/src/config/stripe');
require('dotenv').config();

const prisma = new PrismaClient();

async function checkJamesAccount() {
  try {
    console.log('🔍 Checking James\'s account status...\n');
    
    // Find user by email
    const user = await prisma.user.findFirst({
      where: { 
        email: 'jamesingleton1971@gmail.com' 
      },
      include: {
        subscriptions: {
          orderBy: { createdAt: 'desc' }
        },
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    });
    
    if (!user) {
      console.log('❌ User not found with email: jamesingleton1971@gmail.com');
      return;
    }
    
    console.log('✅ User found:');
    console.log(`   ID: ${user.id}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Name: ${user.name || 'Not set'}`);
    console.log(`   Customer ID: ${user.customerId || 'Not set'}`);
    console.log(`   Created: ${user.createdAt}`);
    console.log('');
    
    // Check subscriptions
    console.log('📋 Subscriptions:');
    if (user.subscriptions.length === 0) {
      console.log('   No subscriptions found');
    } else {
      user.subscriptions.forEach((sub, index) => {
        console.log(`   ${index + 1}. ID: ${sub.id}`);
        console.log(`      Stripe ID: ${sub.stripeSubscriptionId}`);
        console.log(`      Status: ${sub.status}`);
        console.log(`      Period: ${sub.currentPeriodStart} → ${sub.currentPeriodEnd}`);
        console.log(`      Customer ID: ${sub.stripeCustomerId}`);
        console.log(`      Created: ${sub.createdAt}`);
        console.log('');
      });
    }
    
    // Check payments
    console.log('💳 Recent Payments:');
    if (user.payments.length === 0) {
      console.log('   No payments found');
    } else {
      user.payments.forEach((payment, index) => {
        console.log(`   ${index + 1}. ID: ${payment.id}`);
        console.log(`      Stripe ID: ${payment.stripePaymentId}`);
        console.log(`      Amount: £${payment.amount}`);
        console.log(`      Status: ${payment.status}`);
        console.log(`      Date: ${payment.createdAt}`);
        console.log('');
      });
    }
    
    // Check Stripe for any recent sessions or subscriptions
    if (user.customerId && stripe) {
      console.log('🔍 Checking Stripe for recent activity...');
      
      try {
        // Get customer's recent sessions
        const sessions = await stripe.checkout.sessions.list({
          customer: user.customerId,
          limit: 5
        });
        
        console.log(`   Found ${sessions.data.length} recent checkout sessions:`);
        sessions.data.forEach((session, index) => {
          console.log(`   ${index + 1}. Session: ${session.id}`);
          console.log(`      Mode: ${session.mode}`);
          console.log(`      Status: ${session.payment_status}`);
          console.log(`      Amount: £${(session.amount_total / 100).toFixed(2)}`);
          console.log(`      Discount: £${((session.total_details?.amount_discount || 0) / 100).toFixed(2)}`);
          console.log(`      Created: ${new Date(session.created * 1000)}`);
          console.log('');
        });
        
        // Get customer's subscriptions
        const subscriptions = await stripe.subscriptions.list({
          customer: user.customerId,
          limit: 5
        });
        
        console.log(`   Found ${subscriptions.data.length} subscriptions in Stripe:`);
        subscriptions.data.forEach((sub, index) => {
          console.log(`   ${index + 1}. Subscription: ${sub.id}`);
          console.log(`      Status: ${sub.status}`);
          console.log(`      Period: ${new Date(sub.current_period_start * 1000)} → ${new Date(sub.current_period_end * 1000)}`);
          console.log(`      Created: ${new Date(sub.created * 1000)}`);
          console.log('');
        });
        
      } catch (stripeError) {
        console.log(`   ⚠️  Error checking Stripe: ${stripeError.message}`);
      }
    } else {
      console.log('   No customer ID found or Stripe not available');
    }
    
  } catch (error) {
    console.error('❌ Error checking account:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkJamesAccount(); 