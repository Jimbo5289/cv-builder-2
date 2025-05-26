// Script to seed templates
const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const prisma = new PrismaClient();

// Generate unique ID
const templateId = crypto.randomUUID();

async function main() {
  console.log('Seeding templates...');
  
  try {
    // Create a template
    const template = await prisma.cVTemplate.create({
      data: {
        id: templateId,
        name: 'Professional Template',
        description: 'A clean and professional CV template',
        thumbnail: 'https://example.com/templates/professional-thumbnail.png',
        isPremium: false,
        isDefault: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
    
    console.log('Created template:', template.name);
    console.log('Template seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding templates:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 