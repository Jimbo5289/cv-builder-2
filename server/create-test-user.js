const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const cuid = require('cuid');

async function createUser() {
  try {
    // First check if the user already exists
    const existingUser = await prisma.user.findFirst({
      where: { email: 'stripe-test@example.com' }
    });
    
    if (existingUser) {
      console.log('Test user already exists:', existingUser);
      
      // Update the user with the test customer ID if needed
      if (!existingUser.customerId) {
        await prisma.user.update({
          where: { id: existingUser.id },
          data: { customerId: 'cus_SHLcWUxJK2qaUA' }
        });
        console.log('Updated test user with customer ID');
      }
    } else {
      // Create a new test user
      const user = await prisma.user.create({
        data: {
          id: cuid(),
          name: 'Stripe Test User',
          email: 'stripe-test@example.com',
          password: 'hashed_password',
          customerId: 'cus_SHLcWUxJK2qaUA',
          updatedAt: new Date()
        }
      });
      console.log('Created test user:', user);
    }
  } catch (e) {
    console.error('Error creating/updating user:', e);
  } finally {
    await prisma.$disconnect();
  }
}

createUser(); 