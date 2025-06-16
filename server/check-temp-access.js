const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkTemporaryAccess() {
  try {
    console.log('Checking TemporaryAccess table...');
    
    const temporaryAccess = await prisma.temporaryAccess.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    });
    
    console.log(`Found ${temporaryAccess.length} temporary access records:`);
    
    temporaryAccess.forEach((access, index) => {
      console.log(`\n${index + 1}. User: ${access.user.name} (${access.user.email})`);
      console.log(`   Type: ${access.type}`);
      console.log(`   Status: ${access.status}`);
      console.log(`   Created: ${access.createdAt}`);
      console.log(`   Ends: ${access.endTime}`);
      console.log(`   Active: ${access.endTime > new Date() ? 'YES' : 'NO'}`);
    });
    
    if (temporaryAccess.length === 0) {
      console.log('No temporary access records found. Checking if there are any users...');
      
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true
        }
      });
      
      console.log(`\nFound ${users.length} users in database:`);
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name} (${user.email}) - Created: ${user.createdAt}`);
      });
    }
    
  } catch (error) {
    console.error('Error checking temporary access:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTemporaryAccess(); 