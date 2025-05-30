const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const cuid = require('cuid');

async function createAdminUser() {
  const prisma = new PrismaClient();
  try {
    const hashedPassword = await bcrypt.hash('admin', 10);
    
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: { 
        password: hashedPassword, 
        isActive: true, 
        name: 'Admin User',
        customerId: 'admin_customer' 
      },
      create: { 
        id: cuid(),
        email: 'admin@example.com', 
        password: hashedPassword, 
        isActive: true, 
        name: 'Admin User',
        customerId: 'admin_customer' 
      }
    });
    
    console.log('Admin user created successfully:', adminUser);
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser(); 