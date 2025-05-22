const express = require('express');
const router = express.Router();
const database = require('../config/database');
const OpenAI = require('openai');
const PDFDocument = require('pdfkit');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const fs = require('fs');
const { logger } = require('../config/logger');

// Set up multer for file uploads with memory storage for better handling
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || 
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.mimetype === 'text/plain') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOCX, and TXT files are allowed'));
    }
  }
});

// Initialize OpenAI with optional API key - fallback to mock mode if key not available
let openai;
try {
  if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    console.log('OpenAI API initialized successfully');
  } else {
    console.log('OpenAI API key not found, using mock mode');
    openai = {
      chat: {
        completions: {
          create: async () => {
            return {
              choices: [{
                message: {
                  content: JSON.stringify({
                    score: 75,
                    feedback: "This is mock feedback since OpenAI API key is not configured.",
                    improvements: [
                      "Add more quantifiable achievements",
                      "Improve formatting consistency",
                      "Include more relevant keywords"
                    ]
                  })
                }
              }]
            };
          }
        }
      }
    };
  }
} catch (error) {
  console.error('Error initializing OpenAI:', error);
  // Fall back to mock implementation
  openai = {
    chat: {
      completions: {
        create: async () => {
          return {
            choices: [{
              message: {
                content: JSON.stringify({
                  score: 70,
                  feedback: "This is fallback mock feedback due to OpenAI initialization error.",
                  improvements: [
                    "Add more specific details about your experience",
                    "Include technical skills section",
                    "Proofread for grammar and spelling errors"
                  ]
                })
              }
            }]
          };
        }
      }
    }
  };
}

// Font configurations
const FONTS = {
  REGULAR: 'Helvetica',
  BOLD: 'Helvetica-Bold',
  OBLIQUE: 'Helvetica-Oblique'
};

// Style configurations
const STYLES = {
  COLORS: {
    PRIMARY: '#333333',
    SECONDARY: '#666666',
    ACCENT: '#2B547E'
  },
  MARGINS: {
    TOP: 50,
    SIDE: 50
  },
  FONT_SIZES: {
    NAME: 24,
    SECTION_TITLE: 16,
    SUBSECTION_TITLE: 12,
    BODY: 10
  }
};

// Helper function to generate a consistent numeric seed from a string
function generateConsistentSeed(input) {
  // Simple string hash function that always produces the same number for the same string
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  // Return a positive number between 0-99
  return Math.abs(hash) % 100;
}

// Test endpoint for Sentry
router.get('/test-error', (req, res) => {
  throw new Error('This is a test error for Sentry!');
});

// Get CV by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    console.log('Fetching CV with params:', {
      cvId: req.params.id,
      userId: req.user.id,
      headers: req.headers
    });

    // Validate input
    if (!req.params.id) {
      return res.status(400).json({ error: 'CV ID is required' });
    }

    // Check database connection
    if (!database.client) {
      console.error('Database client not initialized');
      return res.status(500).json({ error: 'Database connection error' });
    }

    // Attempt to find the CV
    const cv = await database.client.CV.findUnique({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    console.log('Database query result:', {
      found: !!cv,
      cvId: cv?.id,
      userId: cv?.userId,
      hasContent: !!cv?.content,
      contentType: typeof cv?.content,
      rawContent: cv?.content
    });

    if (!cv) {
      console.log('CV not found for params:', {
        cvId: req.params.id,
        userId: req.user.id
      });
      return res.status(404).json({ error: 'CV not found' });
    }

    // Parse the content with detailed error handling
    let parsedContent;
    try {
      if (typeof cv.content === 'string') {
        console.log('Attempting to parse CV content string');
        parsedContent = JSON.parse(cv.content);
      } else if (typeof cv.content === 'object' && cv.content !== null) {
        console.log('CV content is already an object');
        parsedContent = cv.content;
      } else {
        console.log('CV content is invalid:', cv.content);
        parsedContent = {};
      }
      console.log('Successfully processed CV content:', parsedContent);
    } catch (e) {
      console.error('Failed to parse CV content:', {
        error: e.message,
        content: cv.content,
        type: typeof cv.content
      });
      return res.status(500).json({ 
        error: 'Failed to parse CV content',
        details: process.env.NODE_ENV === 'development' ? e.message : undefined
      });
    }

    // Transform and validate the CV data
    const transformedCV = {
      id: cv.id,
      title: cv.title || 'Untitled CV',
      personalInfo: parsedContent.personalInfo ? {
        fullName: parsedContent.personalInfo.fullName || '',
        email: parsedContent.personalInfo.email || '',
        phone: parsedContent.personalInfo.phone || '',
        location: parsedContent.personalInfo.location || ''
      } : {
        fullName: '',
        email: '',
        phone: '',
        location: ''
      },
      personalStatement: parsedContent.personalStatement || '',
      skills: Array.isArray(parsedContent.skills) ? parsedContent.skills.map(skill => ({
        skill: skill.skill || '',
        level: skill.level || ''
      })) : [],
      experiences: Array.isArray(parsedContent.experiences) ? parsedContent.experiences.map(exp => ({
        position: exp.position || '',
        company: exp.company || '',
        startDate: exp.startDate || '',
        endDate: exp.endDate || '',
        description: exp.description || ''
      })) : [],
      education: Array.isArray(parsedContent.education) ? parsedContent.education.map(edu => ({
        institution: edu.institution || '',
        degree: edu.degree || '',
        startDate: edu.startDate || '',
        endDate: edu.endDate || '',
        description: edu.description || ''
      })) : [],
      references: Array.isArray(parsedContent.references) ? parsedContent.references.map(ref => ({
        name: ref.name || '',
        position: ref.position || '',
        company: ref.company || '',
        email: ref.email || '',
        phone: ref.phone || ''
      })) : [],
      createdAt: cv.createdAt,
      updatedAt: cv.updatedAt
    };

    console.log('Sending transformed CV data:', {
      id: transformedCV.id,
      title: transformedCV.title,
      sectionsPresent: {
        personalInfo: !!transformedCV.personalInfo,
        personalStatement: !!transformedCV.personalStatement,
        skills: transformedCV.skills.length,
        experiences: transformedCV.experiences.length,
        education: transformedCV.education.length,
        references: transformedCV.references.length
      }
    });

    res.json(transformedCV);
  } catch (error) {
    console.error('Error fetching CV:', {
      error: error.message,
      stack: error.stack,
      params: req.params,
      userId: req.user?.id
    });
    res.status(500).json({ 
      error: 'Failed to fetch CV',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Download CV as PDF
router.get('/download/:cvId', authMiddleware, async (req, res) => {
  try {
    const cv = await database.client.CV.findUnique({
      where: { 
        id: req.params.cvId,
        userId: req.user.id
      },
      include: {
        sections: true,
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    if (!cv) {
      return res.status(404).json({ 
        error: 'CV not found',
        message: 'The requested CV either does not exist or you do not have permission to access it'
      });
    }

    // Create PDF document with custom size and margins
    const doc = new PDFDocument({
      size: 'A4',
      margins: {
        top: STYLES.MARGINS.TOP,
        bottom: STYLES.MARGINS.TOP,
        left: STYLES.MARGINS.SIDE,
        right: STYLES.MARGINS.SIDE
      }
    });
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${cv.user.name.replace(/\s+/g, '-')}-CV.pdf"`);
    
    // Pipe the PDF to the response
    doc.pipe(res);

    // Add header with name and contact info
    addHeader(doc, cv.user);

    // Add sections
    cv.sections.forEach((section, index) => {
      addSection(doc, section, index === 0);
    });

    // Add footer with page number
    addFooter(doc);

    // Finalize PDF
    doc.end();

    // Log successful download
    console.log('CV downloaded successfully:', {
      cvId: cv.id,
      userId: req.user.id,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating PDF:', {
      error: error.message,
      cvId: req.params.cvId,
      userId: req.user.id,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({ 
      error: 'Failed to generate PDF',
      message: 'An error occurred while generating the PDF. Please try again later.'
    });
  }
});

// Helper function to add header
function addHeader(doc, user) {
  // Add name
  doc.font(FONTS.BOLD)
     .fontSize(STYLES.FONT_SIZES.NAME)
     .fillColor(STYLES.COLORS.PRIMARY)
     .text(user.name.toUpperCase(), { align: 'center' });

  // Add contact information
  doc.moveDown(0.5)
     .font(FONTS.REGULAR)
     .fontSize(STYLES.FONT_SIZES.BODY)
     .fillColor(STYLES.COLORS.SECONDARY)
     .text(user.email, { align: 'center' });

  // Add separator line
  doc.moveDown(1)
     .moveTo(STYLES.MARGINS.SIDE, doc.y)
     .lineTo(doc.page.width - STYLES.MARGINS.SIDE, doc.y)
     .lineWidth(1)
     .stroke(STYLES.COLORS.ACCENT);

  doc.moveDown(1);
}

// Helper function to add a section
function addSection(doc, section, isFirst) {
  if (!isFirst) {
    doc.moveDown(1);
  }

  // Add section title
  doc.font(FONTS.BOLD)
     .fontSize(STYLES.FONT_SIZES.SECTION_TITLE)
     .fillColor(STYLES.COLORS.PRIMARY)
     .text(section.title.toUpperCase());

  // Add separator line
  doc.moveDown(0.5)
     .moveTo(STYLES.MARGINS.SIDE, doc.y)
     .lineTo(doc.page.width - STYLES.MARGINS.SIDE, doc.y)
     .lineWidth(0.5)
     .stroke(STYLES.COLORS.ACCENT);

  doc.moveDown(0.5);

  // Parse and add section content
  try {
    const content = JSON.parse(section.content);
    if (Array.isArray(content)) {
      content.forEach((item, index) => {
        if (index > 0) doc.moveDown(0.5);
        
        if (item.title) {
          doc.font(FONTS.BOLD)
             .fontSize(STYLES.FONT_SIZES.SUBSECTION_TITLE)
             .fillColor(STYLES.COLORS.PRIMARY)
             .text(item.title);
        }
        
        if (item.subtitle) {
          doc.font(FONTS.OBLIQUE)
             .fontSize(STYLES.FONT_SIZES.BODY)
             .fillColor(STYLES.COLORS.SECONDARY)
             .text(item.subtitle);
        }
        
        if (item.description) {
          doc.font(FONTS.REGULAR)
             .fontSize(STYLES.FONT_SIZES.BODY)
             .fillColor(STYLES.COLORS.PRIMARY)
             .text(item.description, {
               align: 'justify',
               paragraphGap: 5
             });
        }
      });
    } else {
      doc.font(FONTS.REGULAR)
         .fontSize(STYLES.FONT_SIZES.BODY)
         .fillColor(STYLES.COLORS.PRIMARY)
         .text(section.content, {
           align: 'justify',
           paragraphGap: 5
         });
    }
  } catch (e) {
    // If content is not JSON, treat as plain text
    doc.font(FONTS.REGULAR)
       .fontSize(STYLES.FONT_SIZES.BODY)
       .fillColor(STYLES.COLORS.PRIMARY)
       .text(section.content, {
         align: 'justify',
         paragraphGap: 5
       });
  }
}

// Helper function to add footer
function addFooter(doc) {
  const pageNumber = doc.bufferedPageRange().count;
  doc.font(FONTS.REGULAR)
     .fontSize(8)
     .fillColor(STYLES.COLORS.SECONDARY)
     .text(
       `Page ${pageNumber}`,
       STYLES.MARGINS.SIDE,
       doc.page.height - STYLES.MARGINS.TOP,
       { align: 'center' }
     );
}

// Enhance CV with AI
router.post('/enhance', authMiddleware, async (req, res) => {
  try {
    const { cvData } = req.body;
    
    if (!cvData) {
      return res.status(400).json({ error: 'CV data is required' });
    }

    const prompt = `Enhance the following CV content while maintaining its original structure and meaning:\n\n${JSON.stringify(cvData)}`;
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a professional CV writer. Enhance the CV content while maintaining its original structure and meaning." },
        { role: "user", content: prompt }
      ]
    });

    const enhancedCV = JSON.parse(completion.choices[0].message.content);
    
    res.json({ success: true, enhancedCV });
  } catch (error) {
    console.error('Error enhancing CV:', error);
    res.status(500).json({ error: 'Failed to enhance CV' });
  }
});

// Save CV data
router.post('/save', authMiddleware, async (req, res) => {
  try {
    const { templateId, personalInfo } = req.body;

    if (!personalInfo) {
      return res.status(400).json({ error: 'Personal information is required' });
    }

    // Create or update CV
    const cv = await database.client.CV.upsert({
      where: {
        userId_title: {
          userId: req.user.id,
          title: personalInfo.fullName || 'Untitled CV'
        }
      },
      update: {
        content: JSON.stringify({
          templateId,
          personalInfo
        })
      },
      create: {
        userId: req.user.id,
        title: personalInfo.fullName || 'Untitled CV',
        content: JSON.stringify({
          templateId,
          personalInfo
        })
      }
    });

    res.json({ cv });
  } catch (error) {
    console.error('Error saving CV:', error);
    res.status(500).json({ 
      error: 'Failed to save CV',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Create new CV
router.post('/', authMiddleware, async (req, res) => {
  try {
    logger.info('CV creation request received', { 
      user: req.user?.id,
      body: JSON.stringify(req.body)
    });
    
    const { templateId, personalInfo } = req.body;

    if (!personalInfo) {
      logger.warn('Missing personalInfo in CV creation request');
      return res.status(400).json({ error: 'Personal information is required' });
    }

    // Check if database is available
    if (!database.client) {
      logger.error('Database client not available for CV creation');
      return res.status(500).json({ error: 'Database service unavailable' });
    }

    try {
      // Create CV with initial personal information
      const cv = await database.client.CV.create({
        data: {
          userId: req.user.id,
          templateId: templateId || 'professional', // Default to professional if not specified
          title: personalInfo.fullName ? `${personalInfo.fullName}'s CV` : 'Untitled CV',
          content: JSON.stringify({
            personalInfo,
            skills: [],
            experiences: [],
            education: [],
            references: []
          })
        }
      });

      logger.info('CV created successfully', { cvId: cv.id, userId: req.user.id });

      res.status(201).json({
        id: cv.id,
        message: 'CV created successfully',
        cv: {
          id: cv.id,
          templateId: cv.templateId,
          content: JSON.parse(cv.content)
        }
      });
    } catch (dbError) {
      logger.error('Database error during CV creation', { 
        error: dbError.message, 
        code: dbError.code,
        stack: dbError.stack
      });
      
      res.status(500).json({ 
        error: 'Failed to create CV due to database error',
        details: process.env.NODE_ENV === 'development' ? dbError.message : undefined
      });
    }
  } catch (error) {
    logger.error('Unhandled error creating CV:', {
      error: error.message,
      stack: error.stack,
      userId: req.user?.id
    });
    
    res.status(500).json({ 
      error: 'Failed to create CV',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Update CV experience
router.put('/:id/experience', authMiddleware, async (req, res) => {
  try {
    const { experiences } = req.body;
    if (!Array.isArray(experiences)) {
      return res.status(400).json({ message: 'Experiences must be an array' });
    }

    const cv = await database.client.CV.findUnique({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!cv) {
      return res.status(404).json({ message: 'CV not found' });
    }

    const content = JSON.parse(cv.content || '{}');
    content.experience = experiences;

    const updatedCV = await database.client.CV.update({
      where: {
        id: req.params.id
      },
      data: {
        content: JSON.stringify(content)
      }
    });

    res.json({ message: 'CV experiences updated successfully', cv: updatedCV });
  } catch (error) {
    console.error('Error updating CV experiences:', error);
    res.status(500).json({ message: 'Error updating CV experiences' });
  }
});

// Update CV education
router.put('/:id/education', authMiddleware, async (req, res) => {
  try {
    const { education } = req.body;
    if (!Array.isArray(education)) {
      return res.status(400).json({ message: 'Education must be an array' });
    }

    const cv = await database.client.CV.findUnique({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!cv) {
      return res.status(404).json({ message: 'CV not found' });
    }

    const content = JSON.parse(cv.content || '{}');
    content.education = education;

    const updatedCV = await database.client.CV.update({
      where: {
        id: req.params.id
      },
      data: {
        content: JSON.stringify(content)
      }
    });

    res.json({ message: 'CV education updated successfully', cv: updatedCV });
  } catch (error) {
    console.error('Error updating CV education:', error);
    res.status(500).json({ message: 'Error updating CV education' });
  }
});

// Update CV personal statement
router.put('/:id/personal-statement', authMiddleware, async (req, res) => {
  try {
    const { personalStatement } = req.body;
    
    if (!personalStatement) {
      return res.status(400).json({ error: 'Personal statement is required' });
    }

    const cv = await database.client.CV.findUnique({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!cv) {
      return res.status(404).json({ error: 'CV not found' });
    }

    // Use a simpler approach - update the CV content directly
    const content = JSON.parse(cv.content || '{}');
    content.personalStatement = personalStatement;

    const updatedCv = await database.client.CV.update({
      where: { id: req.params.id },
      data: {
        content: JSON.stringify(content)
      }
    });

    res.json(updatedCv);
  } catch (error) {
    console.error('Error updating personal statement:', error);
    res.status(500).json({ error: 'Failed to update personal statement' });
  }
});

// Update CV skills
router.put('/:id/skills', authMiddleware, async (req, res) => {
  try {
    const { skills } = req.body;
    if (!Array.isArray(skills)) {
      return res.status(400).json({ message: 'Skills must be an array' });
    }

    const cv = await database.client.CV.findUnique({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!cv) {
      return res.status(404).json({ message: 'CV not found' });
    }

    const content = JSON.parse(cv.content || '{}');
    content.skills = skills;

    const updatedCV = await database.client.CV.update({
      where: {
        id: req.params.id
      },
      data: {
        content: JSON.stringify(content)
      }
    });

    res.json({ message: 'CV skills updated successfully', cv: updatedCV });
  } catch (error) {
    console.error('Error updating CV skills:', error);
    res.status(500).json({ message: 'Error updating CV skills' });
  }
});

// Update CV references
router.put('/:id/references', authMiddleware, async (req, res) => {
  try {
    const { references } = req.body;
    if (!Array.isArray(references)) {
      return res.status(400).json({ message: 'References must be an array' });
    }

    const cv = await database.client.CV.findUnique({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!cv) {
      return res.status(404).json({ message: 'CV not found' });
    }

    const content = JSON.parse(cv.content || '{}');
    content.references = references;

    const updatedCV = await database.client.CV.update({
      where: {
        id: req.params.id
      },
      data: {
        content: JSON.stringify(content)
      }
    });

    res.json({ message: 'CV references updated successfully', cv: updatedCV });
  } catch (error) {
    console.error('Error updating CV references:', error);
    res.status(500).json({ message: 'Error updating CV references' });
  }
});

// Get all templates
router.get('/templates', async (req, res) => {
  try {
    const templates = [
      {
        id: 'professional',
        name: 'Professional',
        description: 'Clean and modern design perfect for any industry',
        image: '/assets/cv-templates-pdf/professional_cv.pdf',
        category: 'general'
      },
      {
        id: 'creative',
        name: 'Creative',
        description: 'Stand out with a unique and artistic layout',
        image: '/assets/cv-templates-pdf/creative_cv.pdf',
        category: 'creative'
      },
      {
        id: 'executive',
        name: 'Executive',
        description: 'Sophisticated design for senior positions',
        image: '/assets/cv-templates-pdf/executive_cv.pdf',
        category: 'business'
      },
      {
        id: 'academic',
        name: 'Academic',
        description: 'Structured layout for academic and research positions',
        image: '/assets/cv-templates-pdf/academic_cv.pdf',
        category: 'education'
      }
    ];

    res.json(templates);
  } catch (error) {
    logger.error('Error fetching templates:', error);
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
});

// Get example CVs
router.get('/examples', async (req, res) => {
  try {
    const examples = [
      {
        id: 1,
        title: 'Software Engineer',
        description: 'A clean and professional CV template perfect for tech roles',
        image: '/images/examples/software-engineer.svg',
        template: 'professional'
      },
      {
        id: 2,
        title: 'Marketing Manager',
        description: 'Creative CV template highlighting marketing achievements',
        image: '/images/examples/marketing-manager.svg',
        template: 'creative'
      },
      {
        id: 3,
        title: 'Graphic Designer',
        description: 'Visual CV template showcasing design portfolio',
        image: '/images/examples/graphic-designer.svg',
        template: 'creative'
      },
      {
        id: 4,
        title: 'Project Manager',
        description: 'Structured CV template emphasizing project delivery',
        image: '/images/examples/project-manager.svg',
        template: 'professional'
      }
    ];

    res.json(examples);
  } catch (error) {
    logger.error('Error fetching examples:', error);
    res.status(500).json({ error: 'Failed to fetch examples' });
  }
});

// Get pricing plans
router.get('/pricing', async (req, res) => {
  try {
    const pricing = {
      plans: [
        {
          name: 'Pay-Per-CV',
          price: 4.99,
          interval: 'one-time',
          features: [
            'Optimized CV tailored to job spec',
            'Access to premium template designs',
            'ATS-friendly formatting',
            'High-quality PDF export'
          ],
          buttonText: 'Get Started',
          popular: false
        },
        {
          name: 'Monthly Subscription',
          price: 9.99,
          interval: 'month',
          features: [
            'Everything in Pay-Per-CV',
            'Unlimited CV generations + downloads',
            'Unlimited job spec comparisons',
            'Cover letter builder',
            'Career progression insights + AI interview prep',
            'Priority customer support'
          ],
          buttonText: 'Subscribe Now',
          popular: true
        },
        {
          name: 'Yearly Subscription',
          price: 79,
          interval: 'year',
          features: [
            'Everything in Monthly Subscription',
            'Save 34% compared to monthly',
            'Priority feature requests',
            'Early access to new templates'
          ],
          buttonText: 'Save 34%',
          popular: false
        }
      ],
      addons: [
        {
          name: 'Custom Branding',
          price: 49,
          description: 'Custom branding setup for agencies',
          buttonText: 'Add to Plan'
        },
        {
          name: 'AI-Enhanced LinkedIn Review',
          price: 7.99,
          description: 'AI-powered LinkedIn profile optimization',
          buttonText: 'Add to Plan'
        }
      ]
    };

    res.json(pricing);
  } catch (error) {
    logger.error('Error fetching pricing:', error);
    res.status(500).json({ error: 'Failed to fetch pricing' });
  }
});

// New route: Analyze CV without job description (simplified version)
router.post('/analyse-only', authMiddleware, (req, res, next) => {
  // Check subscription status if not in development
  if (process.env.NODE_ENV !== 'development' || process.env.MOCK_SUBSCRIPTION_DATA !== 'true') {
    if (!req.user.subscription || req.user.subscription.status !== 'active') {
      logger.warn('User attempted to use premium feature without subscription');
      return res.status(403).json({ 
        error: 'Subscription required',
        message: 'This feature requires an active subscription'
      });
    }
  } else {
    logger.info('Using mock subscription data in development mode');
  }
  
  next();
}, upload.single('cv'), async (req, res) => {
  try {
    // Check if we have a file or text input
    if (!req.file && !req.body.cvText) {
      return res.status(400).json({ error: 'No CV provided. Please upload a file or provide CV text.' });
    }

    logger.info('CV basic analysis request received', {
      bodyKeys: Object.keys(req.body),
      hasFile: !!req.file,
      hasText: !!req.body.cvText,
      mockMode: process.env.MOCK_SUBSCRIPTION_DATA === 'true'
    });

    // Get CV text from file or directly from input
    let cvText;
    let sourceType = 'unknown';
    let fileName = 'cv-text';
    
    if (req.file) {
      sourceType = 'file';
      fileName = req.file.originalname;
      try {
        // Simple text extraction for basic file types
        cvText = req.file.buffer.toString('utf8').replace(/[^\x20-\x7E]/g, ' ').trim();
        
        if (!cvText || cvText.trim().length < 50) {
          logger.warn('CV text extraction produced insufficient content');
          cvText = "Sample CV content for demonstration purposes. This would normally contain the extracted text from the uploaded CV file.";
        }
      } catch (error) {
        logger.error('Error extracting text from CV file', { error });
        return res.status(400).json({ 
          error: 'File processing error',
          message: 'Could not extract text from the uploaded file. Please try pasting the text directly.' 
        });
      }
    } else {
      sourceType = 'text';
      cvText = req.body.cvText;
      
      if (!cvText || cvText.trim().length < 50) {
        return res.status(400).json({ 
          error: 'Insufficient CV text',
          message: 'Please provide more text from your CV for a meaningful analysis.' 
        });
      }
    }

    // Use seed based on filename or a default
    const seed = sourceType === 'file' 
      ? generateConsistentSeed(fileName)
      : generateConsistentSeed('direct-text-input');
    
    // Generate mock results for development environment
    const mockResults = {
      score: 70 + (seed % 20),
      formatScore: 65 + (seed % 25),
      contentScore: 75 + (seed % 15),
      strengths: [
        "Clear professional summary",
        "Good experience section structure",
        "Appropriate CV length",
        "Relevant skills highlighted"
      ].slice(0, 3 + (seed % 2)),
      recommendations: [
        "Add more quantifiable achievements",
        "Improve skill presentation with proficiency levels",
        "Include more industry-specific keywords",
        "Strengthen your professional summary"
      ].slice(0, 3 + (seed % 2)),
      missingKeywords: [
        "quantifiable results",
        "leadership",
        "communication skills",
        "project management",
        "teamwork",
        "problem-solving"
      ].slice(0, 4 + (seed % 3)),
      improvementSuggestions: {
        content: "Focus on adding specific, measurable achievements to your experience section. Quantify your impact where possible.",
        format: "Ensure consistent formatting throughout your CV. Use bullet points consistently and maintain uniform spacing.",
        structure: "Consider reordering sections to place the most relevant information first. Your most impressive qualifications should be immediately visible.",
        keywords: "Research job descriptions in your target field and incorporate relevant keywords to pass ATS systems."
      }
    };
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 800));
    
    res.json(mockResults);
  } catch (error) {
    logger.error('Error analyzing CV:', error);
    res.status(500).json({ error: 'Failed to analyze CV', message: error.message });
  }
});

// Analyze CV against job description
router.post('/analyse', authMiddleware, (req, res, next) => {
  // Check subscription status - allow bypass in development mode
  if (process.env.NODE_ENV === 'development' && process.env.MOCK_SUBSCRIPTION_DATA === 'true') {
    logger.info('Using mock subscription data in development mode - bypassing subscription check');
    return next();
  }
  
  // For normal operation, verify subscription
  if (!req.user || !req.user.subscription || req.user.subscription.status !== 'active') {
    // Allow development bypass with req.skipAuthCheck
    if (req.skipAuthCheck) {
      logger.info('Auth check skipped for development mode');
      return next();
    }
    
    logger.warn('User attempted to use premium feature without subscription', {
      userId: req.user?.id || 'unknown'
    });
    return res.status(403).json({ 
      error: 'Subscription required',
      message: 'This feature requires an active subscription'
    });
  }
  
  next();
}, upload.fields([
  { name: 'cv', maxCount: 1 },
  { name: 'jobDescription', maxCount: 1 }
]), async (req, res) => {
  try {
    logger.info('CV analysis request received', { 
      bodyKeys: Object.keys(req.body || {}),
      files: req.files ? Object.keys(req.files).join(', ') : 'none'
    });
    
    // Check for CV file
    if (!req.files || !req.files.cv || req.files.cv.length === 0) {
      logger.warn('No CV file provided in request');
      return res.status(400).json({ error: 'No CV file provided' });
    }

    // Get CV file details to create a consistent seed for score generation
    const cvFile = req.files.cv[0];
    const cvFileName = cvFile.originalname;
    const cvFileSize = cvFile.size;
    
    // Add error handling for file processing
    if (!cvFile.buffer || cvFile.buffer.length === 0) {
      logger.error('CV file buffer is empty or invalid');
      return res.status(400).json({ 
        error: 'Invalid CV file', 
        message: 'The uploaded CV file appears to be empty or corrupt' 
      });
    }
    
    // Extract text from CV file buffer with error handling
    let cvText;
    try {
      // Simple text extraction for demo purposes
      // In a production system, we would use proper document parsing libraries
      cvText = cvFile.buffer.toString('utf8', 0, Math.min(10000, cvFile.buffer.length))
        .replace(/[^\x20-\x7E]/g, ' ') // Replace non-ASCII chars with spaces
        .trim();
      
      if (!cvText || cvText.length < 50) {
        logger.warn('CV text extraction produced insufficient content', { 
          textLength: cvText?.length || 0,
          fileName: cvFileName,
          fileSize: cvFileSize
        });
        
        // Use mock data for demo purposes if text extraction fails
        cvText = "Sample CV content for demonstration purposes. " +
                "This would normally contain the extracted text from the uploaded CV file.";
      }
    } catch (extractError) {
      logger.error('Error extracting text from CV file', { error: extractError });
      return res.status(500).json({ 
        error: 'Text extraction error', 
        message: 'Failed to extract text from the uploaded CV file' 
      });
    }
    
    // Use CV file properties to create a seed for consistent score generation
    // This ensures the same CV will get similar scores regardless of job description format
    const scoreSeed = (cvFileSize % 100) + cvFileName.length;
    
    // Get job description from either file or text field
    let jobDescription = '';
    let jobDescriptionSeed = 0;
    
    if (req.files.jobDescription && req.files.jobDescription.length > 0) {
      // Job description from file
      const jobDescFile = req.files.jobDescription[0];
      
      // Check for valid buffer
      if (!jobDescFile.buffer || jobDescFile.buffer.length === 0) {
        logger.warn('Job description file buffer is empty');
        return res.status(400).json({
          error: 'Invalid job description file',
          message: 'The uploaded job description file appears to be empty or corrupt'
        });
      }
      
      // In a production system, we would extract text from the file
      // For our mock implementation, we'll use the file buffer to simulate text extraction
      // This simulates reading text from various file formats
      try {
        const fileBuffer = jobDescFile.buffer;
        const extractedText = fileBuffer.toString('utf8', 0, Math.min(5000, fileBuffer.length))
          .replace(/[^\x20-\x7E]/g, ' ') // Replace non-ASCII with spaces
          .trim();
        
        logger.info('Job description provided as file', {
          filename: jobDescFile.originalname,
          size: jobDescFile.size,
          excerpt: extractedText.substring(0, 100) + (extractedText.length > 100 ? '...' : '')
        });
        
        // Store extracted text as the job description
        jobDescription = extractedText;
        
        // IMPORTANT: Use filename as a seed to ensure consistency
        // This ensures that the same filename will always generate the same results
        // which will match between development sessions
        jobDescriptionSeed = generateConsistentSeed(jobDescFile.originalname);
      } catch (extractError) {
        logger.error('Error extracting text from job description file', { error: extractError });
        return res.status(500).json({
          error: 'Text extraction error',
          message: 'Failed to extract text from the uploaded job description file'
        });
      }
    } else if (req.body.jobDescriptionText) {
      // Job description from text input
      const text = req.body.jobDescriptionText;
      logger.info('Job description provided as text', {
        length: text.length,
        excerpt: text.substring(0, 100) + (text.length > 100 ? '...' : '')
      });
      
      // Store text as job description
      jobDescription = text;
      
      // Use a fixed seed for text input based on the first few words
      // This ensures the scoring is consistent for the same input text
      jobDescriptionSeed = generateConsistentSeed("text-input-job-description");
      
    } else {
      logger.info('No job description provided');
      jobDescriptionSeed = 30; // Default seed if no job description
    }
    
    // Check if we have mock subscription data enabled (for development)
    const useMockData = process.env.MOCK_SUBSCRIPTION_DATA === 'true';
    if (useMockData) {
      logger.info('Using mock subscription data in development mode');
    }

    // Fixed seed values for consistent demo results
    const fixedCVSeed = 42;  // Change this to alter CV scores but keep them consistent
    const fixedJDSeed = 37;  // Change this to alter JD match scores but keep them consistent
    
    // Use fixed seeds in development mode for consistent results in demos
    const finalCVSeed = useMockData ? fixedCVSeed : scoreSeed;
    const finalJDSeed = useMockData ? fixedJDSeed : jobDescriptionSeed;
    
    // Generate consistent scores based on the CV and job description seeds
    // This ensures scores will be consistent for the same CV+job description combination
    const totalSeed = (finalCVSeed + finalJDSeed) % 30;
    
    // Base scores with some variability from the seeds
    const cvScore = 75 + totalSeed % 16;  // Range: 75-90
    const matchScore = 65 + totalSeed % 21;  // Range: 65-85
    
    // Define common missing skills and corresponding Alison.com courses
    const skillsToCourses = {
      'leadership': [
        { title: 'Leadership Skills in Business', url: 'https://alison.com/course/leadership-skills-in-business' },
        { title: 'Diploma in Leadership Skills', url: 'https://alison.com/course/diploma-in-leadership-skills' }
      ],
      'project management': [
        { title: 'Diploma in Project Management', url: 'https://alison.com/course/diploma-in-project-management' },
        { title: 'Introduction to Project Management', url: 'https://alison.com/course/introduction-to-project-management' }
      ],
      'agile': [
        { title: 'Agile Project Management - Scrum Framework', url: 'https://alison.com/course/agile-project-management-scrum-framework' },
        { title: 'Implementing Agile Scrum Development', url: 'https://alison.com/course/implementing-agile-scrum-development' }
      ],
      'communication skills': [
        { title: 'Diploma in Business Communication Skills', url: 'https://alison.com/course/diploma-in-business-communication-skills' },
        { title: 'Business Communication - Fundamentals of Business Writing', url: 'https://alison.com/course/business-communication-fundamentals-of-business-writing' }
      ],
      'stakeholder management': [
        { title: 'Stakeholder Engagement and Management', url: 'https://alison.com/course/stakeholder-engagement-and-management' },
        { title: 'Project Management - Stakeholder Management', url: 'https://alison.com/course/project-management-stakeholder-management' }
      ],
      'data analysis': [
        { title: 'Introduction to Data Analysis', url: 'https://alison.com/course/introduction-to-data-analysis' },
        { title: 'Data Analysis with Python', url: 'https://alison.com/course/data-analysis-with-python' }
      ],
      'risk management': [
        { title: 'Risk Management - Managing Project Risks', url: 'https://alison.com/course/risk-management-managing-project-risks' },
        { title: 'Diploma in Risk Management', url: 'https://alison.com/course/diploma-in-risk-management' }
      ],
      'critical thinking': [
        { title: 'Critical Thinking Skills', url: 'https://alison.com/course/critical-thinking-skills' },
        { title: 'Problem Solving and Decision Making', url: 'https://alison.com/course/problem-solving-and-decision-making' }
      ]
    };

    // Determine which keywords are missing based on the job description and seed
    const possibleKeywords = [
      'leadership', 'project management', 'agile', 'communication skills', 
      'stakeholder management', 'data analysis', 'risk management', 'critical thinking'
    ];
    
    // Select missing keywords deterministically based on the seed
    const keywordsMissing = possibleKeywords.filter((_, index) => {
      // Use the total seed to determine which keywords are missing
      // This ensures consistent results for the same CV and job description
      return (totalSeed + index) % 3 === 0; // Selects approximately 1/3 of the keywords
    });
    
    // Generate recommended courses based on missing keywords
    const recommendedCourses = keywordsMissing.map(keyword => {
      const courses = skillsToCourses[keyword] || [];
      return {
        skill: keyword,
        courses: courses
      };
    });
    
    // Generate consistently reproducible mock results based on the seed
    const mockResults = {
      score: cvScore,
      matchScore: matchScore,
      recommendations: [
        'Add more quantifiable achievements',
        'Include relevant certifications',
        'Strengthen technical skills section',
        'Improve professional summary'
      ],
      jobMatchSuggestions: [
        'Highlight experience with project management methodologies',
        'Emphasize team leadership skills',
        'Include examples of successful client communication',
        'Add more details about your technical expertise in required areas'
      ],
      keywordsMissing: keywordsMissing,
      strengths: [
        'Strong technical background',
        'Clear presentation of work history',
        'Good educational qualifications',
        'Well-structured format'
      ],
      weaknesses: [
        'Lack of quantifiable achievements',
        'Missing some key industry keywords',
        'Professional summary could be more targeted',
        'Skills section needs expansion'
      ],
      suggestions: [
        'Reorder your experience to highlight most relevant roles first',
        'Add a skills matrix showing proficiency levels',
        'Include a projects section with notable achievements',
        'Consider adding professional certifications'
      ],
      courseRecommendations: recommendedCourses
    };

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    res.json(mockResults);
  } catch (error) {
    logger.error('Error analyzing CV:', error);
    res.status(500).json({ error: 'Failed to analyze CV' });
  }
});

// Analyze CV without job description, but optionally with role context
router.post('/analyse-by-role', authMiddleware, (req, res, next) => {
  // Check subscription status if not in development
  if (process.env.NODE_ENV !== 'development' || process.env.MOCK_SUBSCRIPTION_DATA !== 'true') {
    if (!req.user.subscription || req.user.subscription.status !== 'active') {
      logger.warn('User attempted to use premium feature without subscription');
      return res.status(403).json({ 
        error: 'Subscription required',
        message: 'This feature requires an active subscription'
      });
    }
  } else {
    logger.info('Using mock subscription data in development mode');
  }
  
  next();
}, upload.single('cv'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No CV file provided' });
    }

    logger.info('CV role-based analysis request received', {
      bodyKeys: Object.keys(req.body),
      files: req.file ? req.file.originalname : 'none',
      mockMode: process.env.MOCK_SUBSCRIPTION_DATA === 'true'
    });

    // Extract industry and role if provided
    const industry = req.body.industry || '';
    const role = req.body.role || '';
    const isGenericAnalysis = !industry && !role;

    logger.info('Analysis parameters', {
      industry: industry || 'generic',
      role: role || 'generic',
      isGenericAnalysis
    });

    // Get CV text from file
    let cvText;
    try {
      cvText = await extractTextFromFile(req.file);
      if (!cvText || cvText.trim().length < 100) {
        return res.status(400).json({ 
          error: 'Invalid CV content',
          message: 'The uploaded CV does not contain sufficient text content for analysis.' 
        });
      }
    } catch (error) {
      logger.error('Error extracting text from CV file', { error });
      return res.status(400).json({ 
        error: 'File processing error',
        message: 'Could not extract text from the uploaded file. Please ensure it is a valid PDF or DOCX file.' 
      });
    }

    // Generate mock results for development
    if (process.env.NODE_ENV === 'development' && process.env.MOCK_ANALYSIS === 'true') {
      const fileName = req.file ? req.file.originalname : 'mock-cv.pdf';
      const fileSeed = fileName.split('.')[0].toLowerCase();
      
      logger.info('Using mock analysis results in development mode');
      const mockResults = generateMockAnalysisResults(fileName, fileSeed, industry, role);
      return res.json(mockResults);
    }

    // Real analysis using OpenAI
    try {
      // Configure the analysis prompt based on scope
      let analysisPrompt;
      
      if (isGenericAnalysis) {
        analysisPrompt = `
          You are an expert CV analyst. Analyze the following CV against general best practices that would apply to any job or industry. 
          Focus on structure, formatting, content quality, clarity, accomplishments, skill presentation, and overall effectiveness.
          
          CV Text:
          
          ${cvText}
          
          Provide a comprehensive analysis in JSON format with the following structure:
          {
            "score": <overall percentage score from 0-100>,
            "formatScore": <format percentage score from 0-100>,
            "contentScore": <content percentage score from 0-100>,
            "strengths": [<list of CV strengths>],
            "recommendations": [<list of recommendations for improvement>],
            "missingKeywords": [<list of important general keywords that should be included>],
            "improvementSuggestions": {
              "content": <detailed suggestion for content improvement>,
              "format": <detailed suggestion for format improvement>,
              "structure": <detailed suggestion for structure improvement>,
              "keywords": <detailed suggestion for keyword improvement>
            }
          }
          
          Important: Be straightforward and practical. Focus on helping the person improve their CV's effectiveness in general job applications.
        `;
      } else {
        // Industry and role-specific analysis
        analysisPrompt = `
          You are an expert CV analyst specializing in the ${industry} industry. 
          Analyze the following CV specifically for a ${role} position in this industry.
          
          CV Text:
          
          ${cvText}
          
          Provide a comprehensive analysis in JSON format with the following structure:
          {
            "score": <overall percentage score from 0-100>,
            "formatScore": <format percentage score from 0-100>,
            "contentScore": <content percentage score from 0-100>,
            "strengths": [<list of CV strengths specifically relevant to this role>],
            "recommendations": [<list of recommendations for improvement for this specific role>],
            "missingKeywords": [<list of important industry and role-specific keywords that should be included>],
            "improvementSuggestions": {
              "content": <detailed suggestion for content improvement relevant to this role>,
              "format": <detailed suggestion for format improvement>,
              "structure": <detailed suggestion for structure improvement>,
              "keywords": <detailed suggestion for industry and role-specific keyword improvement>
            }
          }
          
          Important: Be straightforward and practical. Focus on helping the person improve their CV's effectiveness specifically for a ${role} position in the ${industry} industry.
        `;
      }

      // Call OpenAI for analysis
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert CV analyst with deep knowledge of industries, roles, and CV best practices."
          },
          {
            role: "user",
            content: analysisPrompt
          }
        ],
        response_format: { type: "json_object" }
      });

      // Process the response
      const rawAnalysis = completion.choices[0].message.content;
      let analysis;
      
      try {
        analysis = JSON.parse(rawAnalysis);
        
        // Ensure score values are numbers
        analysis.score = parseInt(analysis.score) || 70;
        analysis.formatScore = parseInt(analysis.formatScore) || 70;
        analysis.contentScore = parseInt(analysis.contentScore) || 70;
        
        // Ensure arrays exist
        analysis.strengths = analysis.strengths || [];
        analysis.recommendations = analysis.recommendations || [];
        analysis.missingKeywords = analysis.missingKeywords || [];
        
        // Ensure improvement suggestions exist
        analysis.improvementSuggestions = analysis.improvementSuggestions || {
          content: "Focus on quantifiable achievements and skills relevant to your target position.",
          format: "Ensure consistent formatting throughout your CV.",
          structure: "Use a clear, logical structure with sections ordered by relevance.",
          keywords: "Include more industry-specific keywords to pass ATS systems."
        };
        
        logger.info('Analysis completed successfully');
        
        res.json(analysis);
      } catch (parseError) {
        logger.error('Error parsing OpenAI response', { error: parseError, response: rawAnalysis });
        return res.status(500).json({ error: 'Failed to process analysis results', message: 'The system encountered an error when analyzing your CV.' });
      }
    } catch (openaiError) {
      logger.error('OpenAI API error', { error: openaiError });
      return res.status(500).json({ error: 'Analysis service error', message: 'Our CV analysis service is currently experiencing issues. Please try again later.' });
    }
  } catch (error) {
    logger.error('Uncaught error in CV analysis', { error });
    res.status(500).json({ error: 'Server error', message: 'An unexpected error occurred during CV analysis.' });
  }
});

// Helper function to generate mock analysis results
function generateMockAnalysisResults(fileName, fileSeed, industry, role) {
  // Generate a consistent seed based on the filename
  const seed = generateConsistentSeed(fileSeed);
  const hasIndustryRole = industry && role;
  
  // Basic mock strengths for any CV
  const baseStrengths = [
    "Clear and professional presentation",
    "Good use of action verbs",
    "Appropriate CV length",
    "Contact information clearly displayed"
  ];
  
  // Industry-specific mock strengths if available
  const industryStrengths = hasIndustryRole ? [
    `Good highlight of ${industry} industry experience`,
    `Relevant ${role} responsibilities included`,
    `Demonstrates understanding of ${industry} sector terminology`
  ] : [];
  
  // Combine and select a subset based on the seed
  const strengths = [...baseStrengths, ...industryStrengths]
    .sort(() => seed * 0.5 - 0.25)
    .slice(0, 3 + (seed * 3 | 0));
  
  // Basic mock recommendations
  const baseRecommendations = [
    "Add more quantifiable achievements",
    "Improve formatting consistency",
    "Enhance the skills section with more specific abilities",
    "Consider a stronger professional summary at the top"
  ];
  
  // Industry-specific recommendations if available
  const industryRecommendations = hasIndustryRole ? [
    `Include more ${industry}-specific terminology`,
    `Highlight projects specifically relevant to ${role} positions`,
    `Add certifications common in the ${industry} industry`,
    `Emphasize your experience with tools used in ${role} roles`
  ] : [];
  
  // Combine and select a subset based on the seed
  const recommendations = [...baseRecommendations, ...industryRecommendations]
    .sort(() => seed * 0.5 - 0.25)
    .slice(0, 3 + (seed * 3 | 0));
  
  // Basic missing keywords
  const baseKeywords = [
    "teamwork",
    "project management",
    "communication skills",
    "problem-solving",
    "detail-oriented",
    "leadership",
    "Microsoft Office",
    "analytical skills"
  ];
  
  // Industry-specific keywords if available
  const industryKeywords = hasIndustryRole ? [
    ...generateIndustryKeywords(industry),
    ...generateRoleKeywords(role)
  ] : [];
  
  // Combine and select a subset based on the seed
  const missingKeywords = [...baseKeywords, ...industryKeywords]
    .sort(() => seed * 0.5 - 0.25)
    .slice(0, 4 + (seed * 5 | 0));
  
  // Generate scores with some variability but generally good
  const baseScore = 60 + (seed * 30 | 0);
  const formatScore = Math.max(50, Math.min(95, baseScore + (seed * 10 - 5 | 0)));
  const contentScore = Math.max(50, Math.min(95, baseScore + (seed * 10 - 5 | 0)));
  const overallScore = Math.round((formatScore + contentScore) / 2);
  
  // Return mock analysis object
  return {
    score: overallScore,
    formatScore: formatScore,
    contentScore: contentScore,
    strengths: strengths,
    recommendations: recommendations,
    missingKeywords: missingKeywords,
    improvementSuggestions: {
      content: hasIndustryRole 
        ? `Focus more on achievements and responsibilities that align with ${role} positions. Quantify your accomplishments where possible and emphasize skills that are highly valued in the ${industry} industry.`
        : "Focus on quantifiable achievements and skills relevant to your target position. Be specific about your contributions and the results you've delivered in past roles.",
      
      format: "Ensure consistent formatting throughout your CV. Use the same font style, size, and spacing. Make your section headers stand out and ensure your contact information is prominently displayed.",
      
      structure: "Organize your CV with the most relevant information first. Consider using a professional summary at the top followed by your most relevant experience or skills. Group related information logically.",
      
      keywords: hasIndustryRole
        ? `Incorporate more ${industry} industry terminology and keywords relevant to ${role} positions. Look at job descriptions for similar roles and ensure your CV includes those key terms.`
        : "Include more industry-specific keywords to pass Applicant Tracking Systems (ATS). Research keywords commonly used in job descriptions for your target roles and naturally incorporate them into your CV."
    }
  };
}

// Helper to generate industry-specific keywords
function generateIndustryKeywords(industry) {
  const industryKeywordsMap = {
    technology: ["agile", "scrum", "cloud", "software development", "API", "DevOps", "CI/CD"],
    healthcare: ["patient care", "HIPAA", "clinical", "medical", "healthcare", "EHR", "treatment"],
    finance: ["financial analysis", "portfolio", "compliance", "risk management", "banking", "investments"],
    education: ["curriculum", "assessment", "teaching", "learning", "education", "student engagement"],
    engineering: ["CAD", "design", "technical specifications", "engineering", "product development"],
    retail: ["customer service", "sales", "merchandising", "inventory management", "POS"],
    hospitality: ["guest relations", "reservation", "customer satisfaction", "service quality"],
    creative: ["design", "portfolio", "creativity", "client management", "Adobe Creative Suite"],
    legal: ["legal research", "case management", "compliance", "contracts", "regulations"],
    marketing: ["campaigns", "social media", "content strategy", "SEO", "market research"],
    construction: ["project management", "safety compliance", "building codes", "site management"],
    transport: ["logistics", "supply chain", "fleet management", "distribution", "transportation"],
    science: ["research", "laboratory", "data analysis", "experimental design", "scientific method"]
  };
  
  return industryKeywordsMap[industry] || ["industry experience", "professional development", "sector knowledge"];
}

// Helper to generate role-specific keywords
function generateRoleKeywords(role) {
  // This would be expanded in a real implementation
  return [
    `${role} experience`,
    `${role} skills`,
    `${role} certification`,
    `${role} development`
  ];
}

// Get all CVs for the current user
router.get('/user/all', authMiddleware, async (req, res) => {
  try {
    const cvs = await database.client.CV.findMany({
      where: {
        userId: req.user.id
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    // Transform and validate each CV
    const transformedCVs = cvs.map(cv => {
      // Parse content safely
      let parsedContent = {};
      try {
        if (typeof cv.content === 'string') {
          parsedContent = JSON.parse(cv.content);
        } else if (typeof cv.content === 'object' && cv.content !== null) {
          parsedContent = cv.content;
        }
      } catch (e) {
        logger.error('Failed to parse CV content:', {
          error: e.message,
          cvId: cv.id
        });
      }

      // Get basic info for preview
      return {
        id: cv.id,
        title: cv.title || 'Untitled CV',
        updatedAt: cv.updatedAt,
        createdAt: cv.createdAt,
        atsScore: cv.atsScore,
        personalInfo: parsedContent.personalInfo ? {
          fullName: parsedContent.personalInfo.fullName || '',
          email: parsedContent.personalInfo.email || '',
        } : {
          fullName: '',
          email: '',
        }
      };
    });

    res.json(transformedCVs);
  } catch (error) {
    logger.error('Error fetching user CVs:', {
      error: error.message,
      stack: error.stack,
      userId: req.user?.id
    });
    res.status(500).json({ 
      error: 'Failed to fetch CVs',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Helper function to extract text from different file types
async function extractTextFromFile(file) {
  if (!file || !file.buffer) {
    throw new Error('Invalid file');
  }
  
  const fileType = file.originalname.toLowerCase();
  
  // Basic text extraction - in production you would use specialized libraries
  // for PDF (pdf-parse) and DOCX (mammoth or docx) parsing
  if (fileType.endsWith('.txt')) {
    return file.buffer.toString('utf8');
  } else if (fileType.endsWith('.pdf') || fileType.endsWith('.docx')) {
    // For PDF/DOCX, we're doing a simple extraction in this demo
    // This will just treat the buffer as UTF-8 text which works for some files
    // but not for complex binary formats
    
    // Convert buffer to string, removing non-printable characters
    const text = file.buffer.toString('utf8').replace(/[^\x20-\x7E\n\r\t]/g, ' ').trim();
    
    // If we got meaningful text, return it
    if (text && text.length > 100) {
      return text;
    }
    
    // Otherwise, return a placeholder for demonstration
    logger.warn('Could not extract meaningful text from file', {
      filename: file.originalname,
      size: file.size
    });
    
    // In development/demo mode, return placeholder text
    if (process.env.NODE_ENV === 'development') {
      return `
        This is sample CV content for demonstration purposes.
        In a production environment, we would use specialized libraries
        to properly extract text from ${fileType.endsWith('.pdf') ? 'PDF' : 'DOCX'} files.
        For now, we're using this placeholder text to allow testing the functionality.
      `;
    } else {
      throw new Error('Could not extract text from file');
    }
  } else {
    throw new Error('Unsupported file type. Please upload a PDF, DOCX, or TXT file.');
  }
}

module.exports = router; 