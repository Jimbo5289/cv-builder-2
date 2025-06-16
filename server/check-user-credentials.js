const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

// Use production database URL
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:reqvip-ciftag-2Qizgo@cvbuilder-db.c1augguy6rx8.eu-central-1.rds.amazonaws.com:5432/cvbuilder-db?sslmode=require';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL
    }
  }
});

async function checkAndFixCredentials() {
  try {
    console.log('🔍 Checking user account: jamesingleton1971@gmail.com');
    
    // Find the user
    const user = await prisma.user.findUnique({
      where: {
        email: 'jamesingleton1971@gmail.com'
      },
      include: {
        temporaryAccess: true
      }
    });
    
    if (!user) {
      console.log('❌ User not found!');
      return;
    }
    
    console.log('✅ User found:');
    console.log('   - ID:', user.id);
    console.log('   - Email:', user.email);
    console.log('   - Name:', user.name);
    console.log('   - Phone:', user.phone);
    console.log('   - Created:', user.createdAt);
    console.log('   - Temporary Access Records:', user.temporaryAccess.length);
    
    // Check temporary access
    user.temporaryAccess.forEach((access, index) => {
      const daysLeft = Math.ceil((access.endTime - new Date()) / (1000 * 60 * 60 * 24));
      console.log(`   - Access ${index + 1}: ${access.type}, expires ${access.endTime.toLocaleDateString()}, ${daysLeft} days left`);
    });
    
    // Reset password to something simpler
    const newPassword = 'CVBuilder2025!';
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    await prisma.user.update({
      where: {
        email: 'jamesingleton1971@gmail.com'
      },
      data: {
        password: hashedPassword
      }
    });
    
    console.log('✅ Password updated successfully!');
    console.log('');
    console.log('🔑 LOGIN CREDENTIALS:');
    console.log('   Email: jamesingleton1971@gmail.com');
    console.log('   Password: CVBuilder2025!');
    console.log('');
    console.log('🌐 Login at: https://cv-builder-2.onrender.com');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAndFixCredentials(); 