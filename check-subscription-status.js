const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkSubscriptionStatus() {
  try {
    console.log('🔍 Checking subscription status for jamesingleton1971@gmail.com\n');

    const user = await prisma.user.findUnique({
      where: { email: 'jamesingleton1971@gmail.com' },
      include: {
        subscriptions: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!user) {
      console.log('❌ User not found');
      return;
    }

    console.log(`✅ Found user: ${user.name} (${user.email})`);
    console.log(`📊 Total subscriptions: ${user.subscriptions.length}`);

    // Count active vs canceled
    const activeSubscriptions = user.subscriptions.filter(sub => sub.status === 'active');
    const canceledSubscriptions = user.subscriptions.filter(sub => sub.status === 'canceled');

    console.log(`🟢 Active subscriptions: ${activeSubscriptions.length}`);
    console.log(`🔴 Canceled subscriptions: ${canceledSubscriptions.length}`);

    if (activeSubscriptions.length > 0) {
      console.log('\n📋 Active subscriptions:');
      activeSubscriptions.forEach((sub, index) => {
        const periodDays = Math.ceil((new Date(sub.currentPeriodEnd) - new Date(sub.currentPeriodStart)) / (1000 * 60 * 60 * 24));
        console.log(`  ${index + 1}. ID: ${sub.id.slice(-8)}`);
        console.log(`     Created: ${sub.createdAt.toISOString().split('T')[0]}`);
        console.log(`     Period: ${sub.currentPeriodStart.toISOString().split('T')[0]} to ${sub.currentPeriodEnd.toISOString().split('T')[0]} (${periodDays} days)`);
        console.log(`     Stripe ID: ${sub.stripeSubscriptionId}`);
        console.log('');
      });
    }

    console.log('\n' + '='.repeat(50));
    if (activeSubscriptions.length === 1) {
      console.log('🎉 PERFECT! You have exactly 1 active subscription');
    } else if (activeSubscriptions.length === 0) {
      console.log('⚠️  WARNING: No active subscriptions found');
    } else {
      console.log(`⚠️  WARNING: ${activeSubscriptions.length} active subscriptions (should be 1)`);
    }
    console.log('='.repeat(50));

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkSubscriptionStatus(); 