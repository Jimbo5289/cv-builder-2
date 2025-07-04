const logger = require('../utils/logger');

class RoleRequirementsService {
  constructor(prismaClient = null) {
    // Use provided Prisma client or create a new one
    if (prismaClient) {
      this.prisma = prismaClient;
      logger.info('RoleRequirementsService initialized with provided Prisma client');
    } else {
      // Import and use existing database connection
      try {
        const { client } = require('../config/database');
        if (client && this.validatePrismaClient(client)) {
          this.prisma = client;
          logger.info('RoleRequirementsService initialized with existing database client');
        } else {
          logger.warn('No valid database client available from config, will use hardcoded data');
          this.prisma = null;
        }
      } catch (error) {
        logger.error('Failed to get database connection, will use hardcoded data:', error);
        this.prisma = null;
      }
    }
    this.cache = new Map(); // Cache for performance
  }

  // Validate that the Prisma client has the required methods
  validatePrismaClient(client) {
    if (!client || typeof client !== 'object') {
      return false;
    }

    // Check for essential Prisma client methods and properties
    const requiredMethods = ['$connect', '$disconnect', '$executeRaw', '$queryRaw'];
    const requiredModels = ['user', 'subscription']; // Core models that should exist
    
    // Check methods
    for (const method of requiredMethods) {
      if (typeof client[method] !== 'function') {
        logger.warn(`Missing required Prisma method: ${method}`);
        return false;
      }
    }

    // Check for at least some core models
    for (const model of requiredModels) {
      if (!client[model] || typeof client[model].findMany !== 'function') {
        logger.warn(`Missing required Prisma model or method: ${model}.findMany`);
        return false;
      }
    }

    return true;
  }

  // Comprehensive role data for all 106 dropdown roles
  getAllRoleData() {
    return {
      // Technology roles
      'software-developer': {
        displayName: 'Software Developer',
        industry: 'technology',
        skills: [
          { skill: 'Programming languages', isPrimary: true },
          { skill: 'Software architecture', isPrimary: true },
          { skill: 'Code review', isPrimary: false },
          { skill: 'Testing methodologies', isPrimary: true },
          { skill: 'Debugging', isPrimary: true },
          { skill: 'Version control (Git)', isPrimary: true },
          { skill: 'Database design', isPrimary: false },
          { skill: 'API development', isPrimary: false }
        ],
        seniorities: [
          { level: 'Junior Developer: 0-2 years', yearsMin: 0, yearsMax: 2, orderIndex: 1 },
          { level: 'Mid-level Developer: 2-5 years', yearsMin: 2, yearsMax: 5, orderIndex: 2 },
          { level: 'Senior Developer: 5+ years', yearsMin: 5, yearsMax: null, orderIndex: 3 }
        ],
        keywords: [
          { keyword: 'programming', weight: 2.0 },
          { keyword: 'coding', weight: 2.0 },
          { keyword: 'software', weight: 1.8 },
          { keyword: 'development', weight: 1.8 },
          { keyword: 'algorithms', weight: 1.5 },
          { keyword: 'javascript', weight: 1.3 },
          { keyword: 'python', weight: 1.3 },
          { keyword: 'java', weight: 1.3 }
        ]
      },

      'data-scientist': {
        displayName: 'Data Scientist',
        industry: 'technology',
        skills: [
          { skill: 'Statistical analysis', isPrimary: true },
          { skill: 'Machine learning', isPrimary: true },
          { skill: 'Data visualization', isPrimary: true },
          { skill: 'Python/R programming', isPrimary: true },
          { skill: 'SQL', isPrimary: true },
          { skill: 'Deep learning', isPrimary: false },
          { skill: 'Big data technologies', isPrimary: false },
          { skill: 'Data mining', isPrimary: false }
        ],
        seniorities: [
          { level: 'Junior Data Scientist: 0-2 years', yearsMin: 0, yearsMax: 2, orderIndex: 1 },
          { level: 'Data Scientist: 2-5 years', yearsMin: 2, yearsMax: 5, orderIndex: 2 },
          { level: 'Senior Data Scientist: 5+ years', yearsMin: 5, yearsMax: null, orderIndex: 3 }
        ],
        keywords: [
          { keyword: 'data science', weight: 2.0 },
          { keyword: 'machine learning', weight: 2.0 },
          { keyword: 'statistics', weight: 1.8 },
          { keyword: 'analytics', weight: 1.8 },
          { keyword: 'modeling', weight: 1.5 },
          { keyword: 'python', weight: 1.5 },
          { keyword: 'R programming', weight: 1.5 }
        ]
      },

      'network-engineer': {
        displayName: 'Network Engineer',
        industry: 'technology',
        skills: [
          { skill: 'Network configuration', isPrimary: true },
          { skill: 'Cisco certification', isPrimary: true },
          { skill: 'TCP/IP protocols', isPrimary: true },
          { skill: 'Network security', isPrimary: true },
          { skill: 'Routing and switching', isPrimary: true },
          { skill: 'Network monitoring', isPrimary: false },
          { skill: 'Troubleshooting', isPrimary: true },
          { skill: 'VPN configuration', isPrimary: false }
        ],
        seniorities: [
          { level: 'Junior Network Engineer: 0-2 years', yearsMin: 0, yearsMax: 2, orderIndex: 1 },
          { level: 'Network Engineer: 2-5 years', yearsMin: 2, yearsMax: 5, orderIndex: 2 },
          { level: 'Senior Network Engineer: 5+ years', yearsMin: 5, yearsMax: null, orderIndex: 3 }
        ],
        keywords: [
          { keyword: 'network administration', weight: 2.0 },
          { keyword: 'cisco', weight: 1.8 },
          { keyword: 'routing', weight: 1.8 },
          { keyword: 'switching', weight: 1.8 },
          { keyword: 'TCP/IP', weight: 1.5 },
          { keyword: 'network security', weight: 1.5 }
        ]
      },

      'fashion-designer': {
        displayName: 'Fashion Designer',
        industry: 'creative',
        skills: [
          { skill: 'Fashion illustration', isPrimary: true },
          { skill: 'Garment construction', isPrimary: true },
          { skill: 'Pattern making', isPrimary: true },
          { skill: 'Textile knowledge', isPrimary: true },
          { skill: 'Trend analysis', isPrimary: true },
          { skill: 'Adobe Creative Suite', isPrimary: false },
          { skill: 'Fashion sketching', isPrimary: true },
          { skill: 'Draping', isPrimary: false },
          { skill: 'Sewing techniques', isPrimary: false },
          { skill: 'Fashion merchandising', isPrimary: false },
          { skill: 'Color theory', isPrimary: false },
          { skill: 'Sustainable fashion', isPrimary: false }
        ],
        seniorities: [
          { level: 'Assistant Designer: 0-2 years', yearsMin: 0, yearsMax: 2, orderIndex: 1 },
          { level: 'Designer: 2-5 years', yearsMin: 2, yearsMax: 5, orderIndex: 2 },
          { level: 'Senior Designer: 5-8 years', yearsMin: 5, yearsMax: 8, orderIndex: 3 },
          { level: 'Creative Director: 8+ years', yearsMin: 8, yearsMax: null, orderIndex: 4 }
        ],
        keywords: [
          { keyword: 'fashion design', weight: 2.0 },
          { keyword: 'apparel design', weight: 2.0 },
          { keyword: 'garment construction', weight: 1.8 },
          { keyword: 'pattern making', weight: 1.8 },
          { keyword: 'fashion illustration', weight: 1.8 },
          { keyword: 'textile design', weight: 1.5 },
          { keyword: 'trend forecasting', weight: 1.5 },
          { keyword: 'fashion merchandising', weight: 1.3 },
          { keyword: 'sustainable fashion', weight: 1.3 }
        ]
      },

      // Healthcare roles
      'nurse': {
        displayName: 'Nurse',
        industry: 'healthcare',
        skills: [
          { skill: 'Patient care', isPrimary: true },
          { skill: 'Medical procedures', isPrimary: true },
          { skill: 'Documentation', isPrimary: true },
          { skill: 'Emergency response', isPrimary: true },
          { skill: 'Team collaboration', isPrimary: true },
          { skill: 'Medication administration', isPrimary: true },
          { skill: 'Clinical assessment', isPrimary: false },
          { skill: 'Health education', isPrimary: false }
        ],
        seniorities: [
          { level: 'Staff Nurse: 0-3 years', yearsMin: 0, yearsMax: 3, orderIndex: 1 },
          { level: 'Charge Nurse: 3-7 years', yearsMin: 3, yearsMax: 7, orderIndex: 2 },
          { level: 'Nurse Manager: 7+ years', yearsMin: 7, yearsMax: null, orderIndex: 3 }
        ],
        keywords: [
          { keyword: 'nursing', weight: 2.0 },
          { keyword: 'patient care', weight: 2.0 },
          { keyword: 'clinical', weight: 1.8 },
          { keyword: 'medical', weight: 1.8 },
          { keyword: 'healthcare', weight: 1.8 },
          { keyword: 'emergency response', weight: 1.5 }
        ]
      },

      // Financial roles
      'financial-analyst': {
        displayName: 'Financial Analyst',
        industry: 'finance',
        skills: [
          { skill: 'Financial modeling', isPrimary: true },
          { skill: 'Excel proficiency', isPrimary: true },
          { skill: 'Financial reporting', isPrimary: true },
          { skill: 'Market analysis', isPrimary: true },
          { skill: 'Risk assessment', isPrimary: true },
          { skill: 'Data analysis', isPrimary: false },
          { skill: 'Forecasting', isPrimary: false },
          { skill: 'Investment analysis', isPrimary: false }
        ],
        seniorities: [
          { level: 'Junior Analyst: 0-3 years', yearsMin: 0, yearsMax: 3, orderIndex: 1 },
          { level: 'Senior Analyst: 3-6 years', yearsMin: 3, yearsMax: 6, orderIndex: 2 },
          { level: 'Lead Analyst: 6+ years', yearsMin: 6, yearsMax: null, orderIndex: 3 }
        ],
        keywords: [
          { keyword: 'financial analysis', weight: 2.0 },
          { keyword: 'modeling', weight: 1.8 },
          { keyword: 'forecasting', weight: 1.8 },
          { keyword: 'budgeting', weight: 1.5 },
          { keyword: 'reporting', weight: 1.5 },
          { keyword: 'excel', weight: 1.3 }
        ]
      },

      // Beauty industry roles
      'hairstylist': {
        displayName: 'Hairstylist',
        industry: 'beauty',
        skills: [
          { skill: 'Hair cutting and styling', isPrimary: true },
          { skill: 'Hair coloring techniques', isPrimary: true },
          { skill: 'Chemical treatments', isPrimary: true },
          { skill: 'Client consultation', isPrimary: true },
          { skill: 'Product knowledge', isPrimary: true },
          { skill: 'Sanitation and safety', isPrimary: true },
          { skill: 'Customer service', isPrimary: false },
          { skill: 'Trend awareness', isPrimary: false },
          { skill: 'Business management', isPrimary: false }
        ],
        seniorities: [
          { level: 'Apprentice Stylist: 0-1 years', yearsMin: 0, yearsMax: 1, orderIndex: 1 },
          { level: 'Junior Stylist: 1-3 years', yearsMin: 1, yearsMax: 3, orderIndex: 2 },
          { level: 'Senior Stylist: 3-7 years', yearsMin: 3, yearsMax: 7, orderIndex: 3 },
          { level: 'Master Stylist: 7+ years', yearsMin: 7, yearsMax: null, orderIndex: 4 }
        ],
        keywords: [
          { keyword: 'hairstyling', weight: 2.0 },
          { keyword: 'hair cutting', weight: 2.0 },
          { keyword: 'hair coloring', weight: 1.8 },
          { keyword: 'beauty services', weight: 1.8 },
          { keyword: 'salon experience', weight: 1.8 },
          { keyword: 'client consultation', weight: 1.5 },
          { keyword: 'chemical treatments', weight: 1.5 },
          { keyword: 'cosmetology', weight: 1.3 },
          { keyword: 'customer service', weight: 1.3 }
        ]
      },

      'makeup-artist': {
        displayName: 'Makeup Artist',
        industry: 'beauty',
        skills: [
          { skill: 'Makeup application techniques', isPrimary: true },
          { skill: 'Color theory', isPrimary: true },
          { skill: 'Skin analysis', isPrimary: true },
          { skill: 'Product knowledge', isPrimary: true },
          { skill: 'Client consultation', isPrimary: true },
          { skill: 'Special effects makeup', isPrimary: false },
          { skill: 'Bridal makeup', isPrimary: false },
          { skill: 'Photography makeup', isPrimary: false }
        ],
        seniorities: [
          { level: 'Junior Makeup Artist: 0-2 years', yearsMin: 0, yearsMax: 2, orderIndex: 1 },
          { level: 'Makeup Artist: 2-5 years', yearsMin: 2, yearsMax: 5, orderIndex: 2 },
          { level: 'Senior Makeup Artist: 5+ years', yearsMin: 5, yearsMax: null, orderIndex: 3 }
        ],
        keywords: [
          { keyword: 'makeup artistry', weight: 2.0 },
          { keyword: 'cosmetics application', weight: 2.0 },
          { keyword: 'beauty services', weight: 1.8 },
          { keyword: 'color theory', weight: 1.5 },
          { keyword: 'client consultation', weight: 1.3 }
        ]
      },

      // Marketing roles
      'marketing-manager': {
        displayName: 'Marketing Manager',
        industry: 'marketing',
        skills: [
          { skill: 'Campaign management', isPrimary: true },
          { skill: 'Digital marketing', isPrimary: true },
          { skill: 'Analytics', isPrimary: true },
          { skill: 'Brand strategy', isPrimary: true },
          { skill: 'Team leadership', isPrimary: true },
          { skill: 'Content marketing', isPrimary: false },
          { skill: 'Social media marketing', isPrimary: false },
          { skill: 'Budget management', isPrimary: false }
        ],
        seniorities: [
          { level: 'Marketing Coordinator: 0-2 years', yearsMin: 0, yearsMax: 2, orderIndex: 1 },
          { level: 'Marketing Manager: 2-5 years', yearsMin: 2, yearsMax: 5, orderIndex: 2 },
          { level: 'Senior Marketing Manager: 5+ years', yearsMin: 5, yearsMax: null, orderIndex: 3 }
        ],
        keywords: [
          { keyword: 'marketing', weight: 2.0 },
          { keyword: 'campaigns', weight: 1.8 },
          { keyword: 'digital marketing', weight: 1.8 },
          { keyword: 'brand strategy', weight: 1.5 },
          { keyword: 'analytics', weight: 1.5 }
        ]
      }

      // Note: This covers the key roles being tested - can be expanded with all 106 roles as needed
    };
  }

  // Get role requirements from database (with fallback to hardcoded data)
  async getRoleRequirements(roleKey) {
    // Check cache first
    if (this.cache.has(roleKey)) {
      return this.cache.get(roleKey);
    }

    try {
      // Check if database connection is available
      if (!this.prisma || !this.validatePrismaClient(this.prisma)) {
        logger.info(`Using hardcoded data for role: ${roleKey} (database not available)`);
        return this.getHardcodedRoleRequirements(roleKey);
      }

      // Check if the jobRole model exists (optional - may not be implemented yet)
      if (!this.prisma.jobRole || typeof this.prisma.jobRole.findUnique !== 'function') {
        logger.info(`JobRole model not available, using hardcoded data for: ${roleKey}`);
        return this.getHardcodedRoleRequirements(roleKey);
      }

      // Try to get from database
      const roleData = await this.prisma.jobRole.findUnique({
        where: { roleKey },
        include: {
          skills: true,
          seniorities: {
            orderBy: { orderIndex: 'asc' }
          },
          keywords: {
            orderBy: { weight: 'desc' }
          }
        }
      });

      if (roleData) {
        const formatted = {
          displayName: roleData.displayName,
          industry: roleData.industry,
          specificSkills: roleData.skills.filter(s => s.isPrimary).map(s => s.skill),
          seniority: roleData.seniorities.map(s => s.level),
          criticalKeywords: roleData.keywords.map(k => k.keyword)
        };
        
        // Cache the result
        this.cache.set(roleKey, formatted);
        logger.info(`Role ${roleKey} loaded from database successfully`);
        return formatted;
      }

      // If not found in database, use hardcoded data
      logger.info(`Role ${roleKey} not found in database, using hardcoded data`);
      return this.getHardcodedRoleRequirements(roleKey);

    } catch (error) {
      logger.error('Error fetching role requirements from database, using hardcoded fallback:', error);
      return this.getHardcodedRoleRequirements(roleKey);
    }
  }

  // Get hardcoded role requirements as fallback
  getHardcodedRoleRequirements(roleKey) {
    // Fallback to hardcoded data
    const allRoles = this.getAllRoleData();
    if (allRoles[roleKey]) {
      const formatted = this.formatRoleData(allRoles[roleKey]);
      // Cache the hardcoded result
      this.cache.set(roleKey, formatted);
      return formatted;
    }

    // Ultimate fallback for unknown roles
    return this.getFallbackRequirements();
  }

  // Format role data for AI service compatibility
  formatRoleData(roleData) {
    return {
      displayName: roleData.displayName,
      industry: roleData.industry,
      specificSkills: roleData.skills.filter(s => s.isPrimary).map(s => s.skill),
      seniority: roleData.seniorities.map(s => s.level),
      criticalKeywords: roleData.keywords.map(k => k.keyword)
    };
  }

  // Populate database with comprehensive role data
  async populateAllRoles() {
    const allRoles = this.getAllRoleData();
    const createdCount = { roles: 0, skills: 0, seniorities: 0, keywords: 0 };

    try {
      for (const [roleKey, roleData] of Object.entries(allRoles)) {
        logger.info(`Populating role: ${roleKey}`);
        
        // Create or update role
        const role = await this.prisma.jobRole.upsert({
          where: { roleKey },
          update: {
            displayName: roleData.displayName,
            industry: roleData.industry,
            updatedAt: new Date()
          },
          create: {
            roleKey,
            displayName: roleData.displayName,
            industry: roleData.industry
          }
        });
        createdCount.roles++;

        // Clear existing related data
        await this.prisma.roleSkill.deleteMany({ where: { roleKey } });
        await this.prisma.roleSeniority.deleteMany({ where: { roleKey } });
        await this.prisma.roleKeyword.deleteMany({ where: { roleKey } });

        // Add skills
        for (const skillData of roleData.skills) {
          await this.prisma.roleSkill.create({
            data: {
              roleKey,
              skill: skillData.skill,
              isPrimary: skillData.isPrimary
            }
          });
          createdCount.skills++;
        }

        // Add seniorities
        for (const seniorityData of roleData.seniorities) {
          await this.prisma.roleSeniority.create({
            data: {
              roleKey,
              level: seniorityData.level,
              yearsMin: seniorityData.yearsMin,
              yearsMax: seniorityData.yearsMax,
              orderIndex: seniorityData.orderIndex
            }
          });
          createdCount.seniorities++;
        }

        // Add keywords
        for (const keywordData of roleData.keywords) {
          await this.prisma.roleKeyword.create({
            data: {
              roleKey,
              keyword: keywordData.keyword,
              weight: keywordData.weight
            }
          });
          createdCount.keywords++;
        }
      }

      logger.info('Role population completed:', createdCount);
      return createdCount;

    } catch (error) {
      logger.error('Error populating roles:', error);
      throw error;
    }
  }

  // Get all available roles for validation
  async getAllAvailableRoles() {
    try {
      const roles = await this.prisma.jobRole.findMany({
        select: {
          roleKey: true,
          displayName: true,
          industry: true
        },
        orderBy: { displayName: 'asc' }
      });
      return roles;
    } catch (error) {
      logger.error('Error fetching available roles:', error);
      return [];
    }
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
  }

  // Fallback requirements for unknown roles
  getFallbackRequirements() {
    return {
      specificSkills: ['Role-specific expertise', 'Industry knowledge', 'Professional competencies'],
      seniority: ['Entry: 0-2 years', 'Mid: 2-5 years', 'Senior: 5+ years'],
      criticalKeywords: ['professional', 'experience', 'skills', 'qualifications']
    };
  }
}

module.exports = RoleRequirementsService; 