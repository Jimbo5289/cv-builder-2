const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function setupAnalysisDatabase() {
  console.log('🚀 Setting up enhanced CV analysis database...');

  try {
    // Create Industries
    const industries = [
      {
        name: 'technology',
        displayName: 'Technology & Software',
        description: 'Software development, IT, cybersecurity, and technology roles',
        keywords: ['programming', 'software', 'development', 'coding', 'IT', 'cloud', 'agile', 'devops', 'API', 'database'],
        requiredSkills: ['Programming', 'Problem-solving', 'Technical analysis', 'System design', 'Testing'],
        transferableFrom: ['engineering', 'mathematics', 'data-analysis']
      },
      {
        name: 'building_safety',
        displayName: 'Building Safety & Fire Safety',
        description: 'Building safety management, fire safety, regulatory compliance',
        keywords: ['building safety', 'fire safety', 'building regulations', 'safety compliance', 'risk assessment', 'NEBOSH', 'IOSH', 'building control'],
        requiredSkills: ['Safety management', 'Risk assessment', 'Regulatory compliance', 'Building inspection', 'Fire safety knowledge'],
        transferableFrom: ['construction', 'emergency-services', 'engineering']
      },
      {
        name: 'healthcare',
        displayName: 'Healthcare & Medical',
        description: 'Medical, clinical, patient care, and healthcare administration',
        keywords: ['patient care', 'medical', 'clinical', 'healthcare', 'diagnosis', 'treatment', 'EMR', 'HIPAA'],
        requiredSkills: ['Patient communication', 'Clinical decision-making', 'Medical documentation', 'Empathy'],
        transferableFrom: ['emergency-services', 'social-work', 'psychology']
      },
      {
        name: 'finance',
        displayName: 'Finance & Accounting',
        description: 'Financial analysis, accounting, investment, and financial services',
        keywords: ['financial analysis', 'accounting', 'budgeting', 'forecasting', 'audit', 'investment', 'Excel'],
        requiredSkills: ['Analytical thinking', 'Financial modeling', 'Risk assessment', 'Regulatory compliance'],
        transferableFrom: ['mathematics', 'economics', 'data-analysis']
      },
      {
        name: 'marketing',
        displayName: 'Marketing & Communications',
        description: 'Digital marketing, brand management, content creation, and communications',
        keywords: ['marketing', 'digital marketing', 'social media', 'content creation', 'SEO', 'analytics', 'branding'],
        requiredSkills: ['Creative thinking', 'Data analysis', 'Communication', 'Brand strategy'],
        transferableFrom: ['communications', 'sales', 'journalism']
      }
    ];

    console.log('📊 Creating industries...');
    for (const industry of industries) {
      await prisma.industry.upsert({
        where: { name: industry.name },
        update: industry,
        create: industry
      });
    }

    // Create Roles
    const roles = [
      // Building Safety Roles
      {
        name: 'building-safety-manager',
        displayName: 'Building Safety Manager',
        industry: 'building_safety',
        description: 'Oversees building safety compliance and risk management',
        keywords: ['building safety manager', 'fire safety', 'building regulations', 'safety compliance', 'risk assessment', 'building control'],
        requiredSkills: ['Building safety expertise', 'Risk assessment', 'Regulatory compliance', 'Team management', 'Report writing'],
        experienceLevel: 'Senior'
      },
      {
        name: 'fire-safety-engineer',
        displayName: 'Fire Safety Engineer',
        industry: 'building_safety',
        description: 'Designs and implements fire safety systems and assessments',
        keywords: ['fire safety engineer', 'fire engineering', 'fire risk assessment', 'building regulations', 'fire prevention'],
        requiredSkills: ['Fire engineering', 'Fire risk assessment', 'Building safety act', 'Technical analysis', 'Fire prevention'],
        experienceLevel: 'Mid'
      },
      // Technology Roles
      {
        name: 'software-developer',
        displayName: 'Software Developer',
        industry: 'technology',
        description: 'Develops and maintains software applications',
        keywords: ['software developer', 'programming', 'coding', 'development', 'software engineering'],
        requiredSkills: ['Programming languages', 'Software design', 'Testing', 'Version control', 'Problem-solving'],
        experienceLevel: 'Mid'
      },
      {
        name: 'data-analyst',
        displayName: 'Data Analyst',
        industry: 'technology',
        description: 'Analyzes data to provide business insights',
        keywords: ['data analyst', 'data analysis', 'SQL', 'Python', 'statistics', 'reporting'],
        requiredSkills: ['Data analysis', 'Statistical analysis', 'SQL', 'Data visualization', 'Business intelligence'],
        experienceLevel: 'Mid'
      }
    ];

    console.log('👔 Creating roles...');
    for (const roleData of roles) {
      const industry = await prisma.industry.findUnique({
        where: { name: roleData.industry }
      });

      if (industry) {
        await prisma.role.upsert({
          where: {
            name_industryId: {
              name: roleData.name,
              industryId: industry.id
            }
          },
          update: {
            displayName: roleData.displayName,
            description: roleData.description,
            keywords: roleData.keywords,
            requiredSkills: roleData.requiredSkills,
            experienceLevel: roleData.experienceLevel
          },
          create: {
            name: roleData.name,
            displayName: roleData.displayName,
            industryId: industry.id,
            description: roleData.description,
            keywords: roleData.keywords,
            requiredSkills: roleData.requiredSkills,
            experienceLevel: roleData.experienceLevel
          }
        });
      }
    }

    // Create Course Recommendations
    const courses = [
      // Building Safety Courses
      {
        title: 'NEBOSH Fire Safety Certificate',
        provider: 'NEBOSH',
        description: 'Comprehensive fire safety certificate for building safety professionals',
        url: 'https://www.nebosh.org.uk/qualifications/health-and-safety/nebosh-certificate-fire-safety/',
        duration: '5 days',
        level: 'Professional',
        cost: 'Paid',
        rating: 4.8,
        skillTags: ['fire safety', 'building safety', 'risk assessment', 'safety management'],
        industry: 'building_safety',
        priority: 10
      },
      {
        title: 'Building Safety Act 2022 Overview',
        provider: 'CIOB',
        description: 'Essential overview of the Building Safety Act 2022 requirements',
        url: 'https://www.ciob.org/learning',
        duration: '2 days',
        level: 'Professional',
        cost: 'Paid',
        rating: 4.5,
        skillTags: ['building safety act', 'building regulations', 'compliance', 'building safety'],
        industry: 'building_safety',
        priority: 9
      },
      {
        title: 'Institute of Fire Engineers Membership',
        provider: 'IFE',
        description: 'Professional membership providing ongoing development in fire engineering',
        url: 'https://www.ife.org.uk/Membership',
        duration: 'Ongoing',
        level: 'Professional',
        cost: 'Subscription',
        rating: 4.9,
        skillTags: ['fire engineering', 'professional development', 'fire safety', 'networking'],
        industry: 'building_safety',
        priority: 8
      },
      {
        title: 'IOSH Managing Safety',
        provider: 'IOSH',
        description: 'Essential health and safety management training',
        url: 'https://www.iosh.com/training-and-skills/',
        duration: '4 days',
        level: 'Professional',
        cost: 'Paid',
        rating: 4.7,
        skillTags: ['health and safety', 'safety management', 'risk assessment', 'compliance'],
        industry: 'building_safety',
        priority: 7
      },
      // Technology Courses
      {
        title: 'Python for Data Analysis',
        provider: 'Coursera',
        description: 'Comprehensive Python programming for data analysis and visualization',
        url: 'https://www.coursera.org/specializations/data-science-python',
        duration: '6 months',
        level: 'Intermediate',
        cost: 'Subscription',
        rating: 4.6,
        skillTags: ['python', 'data analysis', 'programming', 'data visualization'],
        industry: 'technology',
        priority: 8
      },
      {
        title: 'AWS Cloud Practitioner',
        provider: 'Amazon Web Services',
        description: 'Foundation level certification for cloud computing',
        url: 'https://aws.amazon.com/certification/certified-cloud-practitioner/',
        duration: '3 months',
        level: 'Beginner',
        cost: 'Paid',
        rating: 4.5,
        skillTags: ['cloud computing', 'AWS', 'cloud architecture', 'DevOps'],
        industry: 'technology',
        priority: 7
      }
    ];

    console.log('📚 Creating course recommendations...');
    for (const courseData of courses) {
      let industryId = null;
      if (courseData.industry) {
        const industry = await prisma.industry.findUnique({
          where: { name: courseData.industry }
        });
        industryId = industry?.id;
      }

      await prisma.courseRecommendation.upsert({
        where: {
          id: `${courseData.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${courseData.provider.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
        },
        update: {
          title: courseData.title,
          provider: courseData.provider,
          description: courseData.description,
          url: courseData.url,
          duration: courseData.duration,
          level: courseData.level,
          cost: courseData.cost,
          rating: courseData.rating,
          skillTags: courseData.skillTags,
          priority: courseData.priority,
          industryId
        },
        create: {
          id: `${courseData.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${courseData.provider.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
          title: courseData.title,
          provider: courseData.provider,
          description: courseData.description,
          url: courseData.url,
          duration: courseData.duration,
          level: courseData.level,
          cost: courseData.cost,
          rating: courseData.rating,
          skillTags: courseData.skillTags,
          priority: courseData.priority,
          industryId
        }
      });
    }

    // Create Analysis Templates
    const templates = [
      {
        name: 'Building Safety Analysis',
        industry: 'building_safety',
        scoringWeights: {
          keywords: 0.3,
          experience: 0.25,
          qualifications: 0.25,
          skills: 0.15,
          format: 0.05
        },
        keywordPatterns: [
          'building safety', 'fire safety', 'risk assessment', 'building regulations',
          'NEBOSH', 'IOSH', 'building control', 'safety compliance', 'fire risk assessment'
        ],
        strenghtIndicators: [
          'Relevant safety qualifications (NEBOSH, IOSH)',
          'Experience in building safety or fire safety',
          'Knowledge of building regulations',
          'Risk assessment experience',
          'Professional memberships (IFE, IOSH)'
        ],
        improvementAreas: [
          'Add specific safety qualifications',
          'Include quantifiable safety achievements',
          'Highlight building regulations knowledge',
          'Mention relevant professional memberships',
          'Include fire safety experience'
        ]
      },
      {
        name: 'Technology Analysis',
        industry: 'technology',
        scoringWeights: {
          skills: 0.35,
          experience: 0.25,
          projects: 0.2,
          keywords: 0.15,
          format: 0.05
        },
        keywordPatterns: [
          'programming', 'software development', 'coding', 'technology',
          'Python', 'JavaScript', 'cloud', 'agile', 'devops'
        ],
        strenghtIndicators: [
          'Programming language proficiency',
          'Software development experience',
          'Technical project portfolio',
          'Problem-solving skills',
          'Continuous learning'
        ],
        improvementAreas: [
          'Add specific programming languages',
          'Include technical project examples',
          'Highlight problem-solving achievements',
          'Mention relevant certifications',
          'Include technology stack experience'
        ]
      }
    ];

    console.log('📋 Creating analysis templates...');
    for (const templateData of templates) {
      let industryId = null;
      if (templateData.industry) {
        const industry = await prisma.industry.findUnique({
          where: { name: templateData.industry }
        });
        industryId = industry?.id;
      }

      await prisma.analysisTemplate.upsert({
        where: {
          industryId_roleId: {
            industryId: industryId,
            roleId: null
          }
        },
        update: {
          name: templateData.name,
          scoringWeights: templateData.scoringWeights,
          keywordPatterns: templateData.keywordPatterns,
          strenghtIndicators: templateData.strenghtIndicators,
          improvementAreas: templateData.improvementAreas
        },
        create: {
          name: templateData.name,
          industryId,
          scoringWeights: templateData.scoringWeights,
          keywordPatterns: templateData.keywordPatterns,
          strenghtIndicators: templateData.strenghtIndicators,
          improvementAreas: templateData.improvementAreas
        }
      });
    }

    console.log('✅ Enhanced CV analysis database setup complete!');
    console.log(`
📊 Created:
- ${industries.length} Industries
- ${roles.length} Roles  
- ${courses.length} Course Recommendations
- ${templates.length} Analysis Templates

🚀 The system now supports:
- Database-driven course recommendations
- Industry-specific analysis templates
- Improved scoring algorithms
- Better analysis tracking
`);

  } catch (error) {
    console.error('❌ Error setting up analysis database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the setup if this file is executed directly
if (require.main === module) {
  setupAnalysisDatabase()
    .then(() => {
      console.log('✅ Database setup completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Database setup failed:', error);
      process.exit(1);
    });
}

module.exports = { setupAnalysisDatabase }; 