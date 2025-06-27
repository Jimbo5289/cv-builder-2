/**
 * Direct Role Fix Script for Render
 * Run from project root: node fix-roles-direct.js
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixUserRoles() {
  try {
    console.log('🔍 Starting role fix process...\n');
    
    // Get all users with their current roles
    const users = await prisma.user.findMany({
      select: { 
        id: true, 
        email: true, 
        role: true 
      },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log(`📋 Found ${users.length} users in database`);
    
    let updatedCount = 0;
    
    // Process each user
    for (const user of users) {
      console.log(`\n👤 Processing: ${user.email}`);
      console.log(`   Current role: ${user.role || 'null'}`);
      
      if (!user.role) {
        let newRole;
        
        if (user.email === 'jamesingleton1971@gmail.com') {
          newRole = 'superuser';
          console.log(`   → Setting as SUPERUSER 👑`);
        } else if (user.email.includes('admin') || user.email.includes('test')) {
          newRole = 'admin';
          console.log(`   → Setting as ADMIN 🛡️`);
        } else {
          newRole = 'user';
          console.log(`   → Setting as USER 👤`);
        }
        
        // Update the user's role
        await prisma.user.update({
          where: { id: user.id },
          data: { role: newRole }
        });
        
        console.log(`   ✅ Updated successfully`);
        updatedCount++;
      } else {
        console.log(`   ✓ Already has role, skipping`);
      }
    }
    
    console.log(`\n🎉 Role fix completed!`);
    console.log(`📊 Summary:`);
    console.log(`   Total users: ${users.length}`);
    console.log(`   Updated: ${updatedCount}`);
    console.log(`   Already had roles: ${users.length - updatedCount}`);
    
    // Final verification
    console.log(`\n🔍 Final verification...`);
    const finalUsers = await prisma.user.findMany({
      select: { email: true, role: true },
      orderBy: { createdAt: 'desc' }
    });
    
    const roleDistribution = finalUsers.reduce((acc, user) => {
      const role = user.role || 'null';
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    }, {});
    
    console.log(`📈 Final role distribution:`);
    Object.entries(roleDistribution).forEach(([role, count]) => {
      const emoji = role === 'superuser' ? '👑' : role === 'admin' ? '🛡️' : '👤';
      console.log(`   ${emoji} ${role}: ${count} users`);
    });
    
    console.log(`\n✨ All done! Role badges should now display correctly in admin panel.`);
    
  } catch (error) {
    console.error('❌ Error during role fix:', error);
    console.error('Stack trace:', error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
fixUserRoles(); 