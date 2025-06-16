const { PrismaClient } = require('@prisma/client');

// Use production database URL
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:reqvip-ciftag-2Qizgo@cvbuilder-db.c1augguy6rx8.eu-central-1.rds.amazonaws.com:5432/cvbuilder-db?sslmode=require';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL
    }
  }
});

async function fixUserAccess() {
  try {
    console.log('🔍 Searching for user: jamesingleton1971@gmail.com');
    
    // Find the user by email
    const user = await prisma.user.findUnique({
      where: {
        email: 'jamesingleton1971@gmail.com'
      },
      include: {
        temporaryAccess: true,
        subscriptions: true
      }
    });
    
    if (!user) {
      console.log('❌ User not found. Creating user account...');
      
      // Create the user account
      const bcrypt = require('bcrypt');
      const hashedPassword = await bcrypt.hash('tempPassword123!', 12);
      
      const newUser = await prisma.user.create({
        data: {
          email: 'jamesingleton1971@gmail.com',
          name: 'James Singleton',
          phone: '07850680317',
          password: hashedPassword
        }
      });
      
      console.log('✅ User account created:', newUser.id);
      
      // Grant 30-day access
      await grant30DayAccess(newUser.id);
    } else {
      console.log('✅ User found:', user.id);
      console.log('📊 Current access status:');
      console.log('   - Subscriptions:', user.subscriptions.length);
      console.log('   - Temporary Access:', user.temporaryAccess.length);
      
      // Check if user already has active temporary access
      const activeAccess = user.temporaryAccess.find(access => 
        access.endTime > new Date()
      );
      
      if (activeAccess) {
        console.log('ℹ️  User already has active 30-day access until:', activeAccess.endTime);
        const daysLeft = Math.ceil((activeAccess.endTime - new Date()) / (1000 * 60 * 60 * 24));
        console.log(`   Days remaining: ${daysLeft}`);
      } else {
        console.log('❌ No active 30-day access found. Granting access...');
        await grant30DayAccess(user.id);
      }
    }
    
  } catch (error) {
    console.error('❌ Error fixing user access:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function grant30DayAccess(userId) {
  try {
    // Calculate 30 days from now
    const endTime = new Date();
    endTime.setDate(endTime.getDate() + 30);
    
    // Create temporary access record
    const temporaryAccess = await prisma.temporaryAccess.create({
      data: {
        userId: userId,
        type: '30day-access',
        endTime: endTime
      }
    });
    
    console.log('🎉 30-day access granted successfully!');
    console.log('📅 Access expires on:', endTime.toLocaleDateString());
    console.log('🔑 Access ID:', temporaryAccess.id);
    
    const daysLeft = Math.ceil((endTime - new Date()) / (1000 * 60 * 60 * 24));
    console.log(`⏰ Days remaining: ${daysLeft}`);
    
  } catch (error) {
    console.error('❌ Error granting access:', error);
  }
}

// Run the fix
fixUserAccess(); 