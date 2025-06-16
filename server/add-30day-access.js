const { PrismaClient } = require('@prisma/client');

// Use the ENCRYPTED database URL that the production server is actually using
const DATABASE_URL = 'postgresql://postgres:reqvip-ciftag-2Qizgo@cvbuilder-db-encrypted.c1augguy6rx8.eu-central-1.rds.amazonaws.com:5432/cvbuilder-db?sslmode=require';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL
    }
  }
});

async function add30DayAccess() {
  try {
    console.log('🔍 Finding user and adding 30-day access...');
    
    // Find the user
    const user = await prisma.user.findUnique({
      where: {
        email: 'jamesingleton1971@gmail.com'
      }
    });
    
    if (!user) {
      console.log('❌ User not found!');
      return;
    }
    
    console.log('✅ User found:', user.id);
    
    // Grant 30-day access
    const endTime = new Date();
    endTime.setDate(endTime.getDate() + 30);
    
    const temporaryAccess = await prisma.temporaryAccess.create({
      data: {
        userId: user.id,
        type: '30day-access',
        endTime: endTime
      }
    });
    
    console.log('🎉 30-day access granted successfully!');
    console.log('📅 Access expires on:', endTime.toLocaleDateString());
    console.log('🔑 Access ID:', temporaryAccess.id);
    
    const daysLeft = Math.ceil((endTime - new Date()) / (1000 * 60 * 60 * 24));
    console.log(`⏰ Days remaining: ${daysLeft}`);
    
    console.log('');
    console.log('✅ ALL SET! Your account now has:');
    console.log('   - Valid login credentials');
    console.log('   - 30-day premium access');
    console.log('   - Connected to the correct encrypted database');
    console.log('');
    console.log('🌐 Try logging in now at:');
    console.log('   https://cv-builder-2-f0sp86jor-jimbo5289s-projects.vercel.app/');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

add30DayAccess(); 