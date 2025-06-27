/**
 * Simple Role Fix Script for Render
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixRoles() {
  try {
    console.log('🔍 Checking and fixing user roles...\n');
    
    // Get all users
    const users = await prisma.user.findMany({
      select: { id: true, email: true, role: true }
    });
    
    console.log(`Found ${users.length} users`);
    
    // Fix roles
    for (const user of users) {
      let newRole = user.role;
      
      if (!user.role) {
        if (user.email === 'jamesingleton1971@gmail.com') {
          newRole = 'superuser';
        } else if (user.email.includes('admin') || user.email.includes('test')) {
          newRole = 'admin';
        } else {
          newRole = 'user';
        }
        
        await prisma.user.update({
          where: { id: user.id },
          data: { role: newRole }
        });
        
        console.log(`✅ Updated ${user.email} to ${newRole}`);
      } else {
        console.log(`✓ ${user.email} already has role: ${user.role}`);
      }
    }
    
    console.log('\n🎉 Role fix completed!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixRoles(); 