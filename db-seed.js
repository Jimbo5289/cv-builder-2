// Simple database seed script
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
const prisma = new PrismaClient();

// Generate unique IDs
const userId = crypto.randomUUID();
const templateId = crypto.randomUUID();

async function main() {
  console.log('Seeding database...');
  
  try {
    // Create an admin user
    const adminUser = await prisma.user.create({
      data: {
        id: userId,
        email: 'admin@example.com',
        password: 'hashed_password_123', // In production, this would be hashed
        name: 'Admin User',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
    
    console.log('Created admin user:', adminUser.email);
    
    // Create a template
    const template = await prisma.cVTemplate.create({
      data: {
        id: templateId,
        name: 'Professional Template',
        description: 'A clean and professional CV template',
        previewImageUrl: 'https://example.com/templates/professional.png',
        thumbnail: 'https://example.com/templates/professional-thumbnail.png',
        isPremium: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
    
    console.log('Created template:', template.name);
    
    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 