// Simple database test script
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Testing database connection...');
  
  try {
    // Check if we can query the User table
    const userCount = await prisma.user.count();
    console.log(`User count: ${userCount}`);
    
    // Check if we can query the CVTemplate table
    const templateCount = await prisma.cVTemplate.count();
    console.log(`Template count: ${templateCount}`);
    
    console.log('Database connection test successful!');
  } catch (error) {
    console.error('Error testing database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 