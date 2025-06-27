// Simple Role Fix Script
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  try {
    console.log('Fixing user roles...');
    
    const users = await prisma.user.findMany({
      select: { id: true, email: true, role: true }
    });
    
    console.log(`Found ${users.length} users`);
    
    for (const user of users) {
      if (!user.role) {
        let newRole = 'user';
        
        if (user.email === 'jamesingleton1971@gmail.com') {
          newRole = 'superuser';
        } else if (user.email.includes('admin') || user.email.includes('test')) {
          newRole = 'admin';
        }
        
        await prisma.user.update({
          where: { id: user.id },
          data: { role: newRole }
        });
        
        console.log(`Updated ${user.email} to ${newRole}`);
      } else {
        console.log(`${user.email} already has role: ${user.role}`);
      }
    }
    
    console.log('Done!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
})(); 