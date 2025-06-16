const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

// Use the ENCRYPTED database URL that the production server is actually using
const DATABASE_URL = 'postgresql://postgres:reqvip-ciftag-2Qizgo@cvbuilder-db-encrypted.c1augguy6rx8.eu-central-1.rds.amazonaws.com:5432/cvbuilder-db?sslmode=require';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL
    }
  }
});

async function fixEncryptedDbAccess() {
  try {
    console.log('🔍 Connecting to ENCRYPTED database...');
    console.log('🔗 Database: cvbuilder-db-encrypted.c1augguy6rx8.eu-central-1.rds.amazonaws.com');
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: 'jamesingleton1971@gmail.com'
      },
      include: {
        temporaryAccess: true
      }
    });
    
    if (existingUser) {
      console.log('✅ User already exists in encrypted database!');
      console.log('   - ID:', existingUser.id);
      console.log('   - Email:', existingUser.email);
      console.log('   - Temporary Access Records:', existingUser.temporaryAccess.length);
      
      // Check temporary access
      existingUser.temporaryAccess.forEach((access, index) => {
        const daysLeft = Math.ceil((access.endTime - new Date()) / (1000 * 60 * 60 * 24));
        console.log(`   - Access ${index + 1}: ${access.type}, expires ${access.endTime.toLocaleDateString()}, ${daysLeft} days left`);
      });
      
      // Just update the password
      console.log('🔑 Updating password...');
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
    } else {
      console.log('❌ User not found in encrypted database. Creating account...');
      
      // Create the user account
      const newPassword = 'CVBuilder2025!';
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      
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
      const endTime = new Date();
      endTime.setDate(endTime.getDate() + 30);
      
      const temporaryAccess = await prisma.temporaryAccess.create({
        data: {
          userId: newUser.id,
          type: '30day-access',
          endTime: endTime
        }
      });
      
      console.log('🎉 30-day access granted successfully!');
      console.log('📅 Access expires on:', endTime.toLocaleDateString());
      console.log('🔑 Access ID:', temporaryAccess.id);
      
      const daysLeft = Math.ceil((endTime - new Date()) / (1000 * 60 * 60 * 24));
      console.log(`⏰ Days remaining: ${daysLeft}`);
    }
    
    console.log('');
    console.log('🔑 CORRECT LOGIN CREDENTIALS:');
    console.log('   Email: jamesingleton1971@gmail.com');
    console.log('   Password: CVBuilder2025!');
    console.log('');
    console.log('🌐 Login at: https://cv-builder-2-f0sp86jor-jimbo5289s-projects.vercel.app/');
    console.log('   (Backend: https://cv-builder-backend-zjax.onrender.com)');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixEncryptedDbAccess(); 