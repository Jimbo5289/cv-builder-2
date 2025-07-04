// Fix James's role to superuser
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

async function fixJamesRole() {
  try {
    console.log('🔧 Fixing James\'s role to superuser...');
    
    // First check current role
    const user = await prisma.user.findUnique({
      where: { email: 'james@mycvbuilder.co.uk' },
      select: { id: true, email: true, role: true, name: true }
    });
    
    if (!user) {
      console.log('❌ User james@mycvbuilder.co.uk not found');
      return;
    }
    
    console.log('Current user details:', user);
    
    if (user.role === 'superuser') {
      console.log('✅ User already has superuser role');
      return;
    }
    
    // Update to superuser
    const updatedUser = await prisma.user.update({
      where: { email: 'james@mycvbuilder.co.uk' },
      data: { role: 'superuser' },
      select: { id: true, email: true, role: true, name: true }
    });
    
    console.log('✅ Successfully updated user role:');
    console.log('Updated user details:', updatedUser);
    
  } catch (error) {
    console.error('❌ Error fixing role:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

fixJamesRole(); 