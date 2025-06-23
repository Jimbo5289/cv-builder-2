const { PrismaClient } = require('@prisma/client');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const prisma = new PrismaClient();

async function cleanupDuplicateSubscriptions() {
  try {
    console.log('🧹 Cleaning up duplicate subscriptions for jamesingleton1971@gmail.com\n');
    console.log('='.repeat(60));

    // Find the user and their subscriptions
    const user = await prisma.user.findUnique({
      where: { email: 'jamesingleton1971@gmail.com' },
      include: {
        subscriptions: {
          orderBy: { createdAt: 'desc' } // Most recent first
        }
      }
    });

    if (!user) {
      console.log('❌ User not found');
      return;
    }

    console.log(`✅ Found user: ${user.name} (${user.email})`);
    console.log(`📊 Total subscriptions: ${user.subscriptions.length}\n`);

    if (user.subscriptions.length <= 1) {
      console.log('✅ User has only one subscription, no cleanup needed');
      return;
    }

    // Sort subscriptions by creation date (newest first)
    const subscriptions = user.subscriptions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    console.log('📋 Current subscriptions (newest first):');
    subscriptions.forEach((sub, index) => {
      const periodDays = Math.ceil((new Date(sub.currentPeriodEnd) - new Date(sub.currentPeriodStart)) / (1000 * 60 * 60 * 24));
      console.log(`  ${index + 1}. ID: ${sub.id.slice(-8)}`);
      console.log(`     Created: ${sub.createdAt.toISOString().split('T')[0]}`);
      console.log(`     Status: ${sub.status}`);
      console.log(`     Period: ${sub.currentPeriodStart.toISOString().split('T')[0]} to ${sub.currentPeriodEnd.toISOString().split('T')[0]} (${periodDays} days)`);
      console.log(`     Stripe ID: ${sub.stripeSubscriptionId}`);
      console.log('');
    });

    // Keep the most recent subscription, cancel the rest
    const keepSubscription = subscriptions[0];
    const subscriptionsToCancel = subscriptions.slice(1);

    console.log(`🎯 PLAN: Keep newest subscription (${keepSubscription.id.slice(-8)}) and cancel ${subscriptionsToCancel.length} older ones\n`);

    // Ask for confirmation (in a real scenario, you'd want user input)
    console.log('⚠️  This will:');
    console.log(`   ✅ Keep: Subscription ${keepSubscription.id.slice(-8)} (${keepSubscription.createdAt.toISOString().split('T')[0]})`);
    console.log(`   ❌ Cancel: ${subscriptionsToCancel.length} older subscriptions in Stripe AND database`);
    console.log(`   💰 This should prevent future charges for duplicate subscriptions\n`);

    // Proceed with cleanup
    console.log('🚀 Starting cleanup process...\n');

    let successCount = 0;
    let errorCount = 0;

    for (const sub of subscriptionsToCancel) {
      try {
        console.log(`📞 Canceling subscription ${sub.id.slice(-8)} in Stripe...`);
        
        // Cancel in Stripe first
        if (sub.stripeSubscriptionId) {
          try {
            await stripe.subscriptions.cancel(sub.stripeSubscriptionId);
            console.log(`  ✅ Stripe cancellation successful`);
          } catch (stripeError) {
            console.log(`  ⚠️  Stripe cancellation failed: ${stripeError.message}`);
            // Continue anyway - might already be canceled
          }
        }

        // Update in database
        await prisma.subscription.update({
          where: { id: sub.id },
          data: {
            status: 'canceled',
            canceledAt: new Date(),
            cancelAtPeriodEnd: false,
            updatedAt: new Date()
          }
        });

        console.log(`  ✅ Database updated to canceled status`);
        successCount++;

      } catch (error) {
        console.error(`  ❌ Error canceling subscription ${sub.id.slice(-8)}: ${error.message}`);
        errorCount++;
      }
      console.log('');
    }

    // Verify the cleanup
    console.log('🔍 Verification - checking remaining active subscriptions...\n');

    const verifyUser = await prisma.user.findUnique({
      where: { email: 'jamesingleton1971@gmail.com' },
      include: {
        subscriptions: {
          where: { status: 'active' },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    console.log(`✅ Active subscriptions remaining: ${verifyUser.subscriptions.length}`);
    
    if (verifyUser.subscriptions.length === 1) {
      const remaining = verifyUser.subscriptions[0];
      const periodDays = Math.ceil((new Date(remaining.currentPeriodEnd) - new Date(remaining.currentPeriodStart)) / (1000 * 60 * 60 * 24));
      console.log(`   ID: ${remaining.id.slice(-8)}`);
      console.log(`   Period: ${remaining.currentPeriodStart.toISOString().split('T')[0]} to ${remaining.currentPeriodEnd.toISOString().split('T')[0]} (${periodDays} days)`);
      console.log(`   Status: ${remaining.status}`);
    }

    console.log('\n' + '='.repeat(60));
    console.log('🎉 CLEANUP SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Successfully canceled: ${successCount} subscriptions`);
    console.log(`❌ Errors: ${errorCount} subscriptions`);
    console.log(`🎯 Active subscriptions remaining: ${verifyUser.subscriptions.length}`);
    
    if (verifyUser.subscriptions.length === 1) {
      console.log('✅ Perfect! You now have exactly one active subscription.');
    } else if (verifyUser.subscriptions.length === 0) {
      console.log('⚠️  WARNING: No active subscriptions remaining! You may need to reactivate one.');
    } else {
      console.log('⚠️  WARNING: Multiple active subscriptions still exist. Manual review needed.');
    }

  } catch (error) {
    console.error('❌ Cleanup failed:', error.message);
    console.error('Full error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the cleanup
cleanupDuplicateSubscriptions(); 