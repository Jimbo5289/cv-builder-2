const { PrismaClient } = require('@prisma/client');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const prisma = new PrismaClient();

async function fixSubscriptionPeriod() {
  try {
    console.log('🔍 Searching for user: jamesingleton1971@gmail.com');
    
    // Find the user by email with their subscriptions
    const user = await prisma.user.findUnique({
      where: { email: 'jamesingleton1971@gmail.com' },
      include: {
        subscriptions: true
      }
    });

    if (!user) {
      console.log('❌ User not found');
      return;
    }

    console.log(`✅ Found user: ${user.name} (${user.email})`);
    console.log(`📊 User has ${user.subscriptions?.length || 0} subscription(s)`);

    if (!user.subscriptions || user.subscriptions.length === 0) {
      console.log('❌ User has no subscriptions');
      return;
    }

    console.log('\n📋 Current subscriptions:');
    for (const sub of user.subscriptions) {
      const periodDays = Math.ceil((new Date(sub.currentPeriodEnd) - new Date(sub.currentPeriodStart)) / (1000 * 60 * 60 * 24));
      console.log(`  - ID: ${sub.id}`);
      console.log(`    Status: ${sub.status}`);
      console.log(`    Period: ${sub.currentPeriodStart.toISOString().split('T')[0]} to ${sub.currentPeriodEnd.toISOString().split('T')[0]}`);
      console.log(`    Duration: ${periodDays} days`);
      console.log(`    Stripe ID: ${sub.stripeSubscriptionId}`);
      
      // Check if this looks like an incorrect annual subscription (should be ~365 days, not ~30)
      if (periodDays < 350 && sub.status === 'active') {
        console.log(`\n🔧 Found potentially incorrect subscription period: ${periodDays} days (expected ~365 for annual)`);
        
        if (!sub.stripeSubscriptionId) {
          console.log('❌ No Stripe subscription ID found, cannot fetch correct period');
          continue;
        }

        try {
          console.log('📞 Fetching correct period from Stripe...');
          const stripeSubscription = await stripe.subscriptions.retrieve(sub.stripeSubscriptionId);
          
          const correctStart = new Date(stripeSubscription.current_period_start * 1000);
          const correctEnd = new Date(stripeSubscription.current_period_end * 1000);
          const correctDays = Math.ceil((correctEnd - correctStart) / (1000 * 60 * 60 * 24));
          
          console.log(`✅ Stripe shows correct period: ${correctStart.toISOString().split('T')[0]} to ${correctEnd.toISOString().split('T')[0]} (${correctDays} days)`);
          
          // Update the subscription with correct period
          const updatedSub = await prisma.subscription.update({
            where: { id: sub.id },
            data: {
              currentPeriodStart: correctStart,
              currentPeriodEnd: correctEnd,
              updatedAt: new Date()
            }
          });
          
          console.log('🎉 Successfully updated subscription period in database');
          
          // Verify the fix
          const verifyUser = await prisma.user.findUnique({
            where: { email: 'jamesingleton1971@gmail.com' },
            include: {
              subscriptions: true
            }
          });
          
          const updatedSubscription = verifyUser.subscriptions.find(s => s.id === sub.id);
          if (updatedSubscription) {
            const verifyDays = Math.ceil((new Date(updatedSubscription.currentPeriodEnd) - new Date(updatedSubscription.currentPeriodStart)) / (1000 * 60 * 60 * 24));
            console.log(`✅ Verification: Subscription now shows ${verifyDays} days`);
            console.log(`   New period: ${updatedSubscription.currentPeriodStart.toISOString().split('T')[0]} to ${updatedSubscription.currentPeriodEnd.toISOString().split('T')[0]}`);
          }
          
        } catch (stripeError) {
          console.error('❌ Error fetching from Stripe:', stripeError.message);
          
          // If Stripe fails, but we know this should be an annual subscription,
          // we can calculate the correct end date (1 year from start)
          if (stripeError.message.includes('No such subscription')) {
            console.log('🔧 Stripe subscription not found, calculating annual period from start date...');
            const annualEndDate = new Date(sub.currentPeriodStart);
            annualEndDate.setFullYear(annualEndDate.getFullYear() + 1);
            
            const updatedSub = await prisma.subscription.update({
              where: { id: sub.id },
              data: {
                currentPeriodEnd: annualEndDate,
                updatedAt: new Date()
              }
            });
            
            console.log(`✅ Updated subscription to end on: ${annualEndDate.toISOString().split('T')[0]}`);
          }
        }
      } else {
        console.log(`✅ Subscription period looks correct (${periodDays} days)`);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the fix
fixSubscriptionPeriod(); 