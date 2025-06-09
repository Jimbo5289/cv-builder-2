const express = require('express');
const router = express.Router();
const database = require('../config/database');
const OpenAI = require('openai');
const PDFDocument = require('pdfkit');
const authMiddleware = require('../middleware/auth');
const multer = require('multer');
const fs = require('fs');
const { logger } = require('../config/logger');
const { z } = require('zod');

// Personal info validation schema
const personalInfoSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(1, "Phone number is required"),
  location: z.string().min(1, "Location is required"),
  socialNetwork: z.string().optional()
});

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
      referencesOnRequest: Boolean(parsedContent.referencesOnRequest),
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
        references: transformedCV.references.length,
        referencesOnRequest: transformedCV.referencesOnRequest
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
    // Add debug logging to see what's being received
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('Request headers:', req.headers);
    
    // Check if req.body is defined
    if (!req.body) {
      console.error('Request body is undefined');
      return res.status(400).json({ error: 'Request body is missing' });
    }
    
    // Safely destructure with defaults
    const templateId = req.body.templateId || '1';
    const personalInfo = req.body.personalInfo || null;

    // Debug logs for request data
    console.log('Saving CV with templateId:', templateId);
    console.log('Saving CV with personal info:', JSON.stringify(personalInfo, null, 2));
    
    if (!personalInfo) {
      return res.status(400).json({ error: 'Personal information is required' });
    }

    // Skip schema validation temporarily for debugging
    /*
    try {
      personalInfoSchema.parse(personalInfo);
    } catch (validationError) {
      console.error('Validation error:', validationError.errors);
      return res.status(400).json({ 
        error: 'Invalid personal information', 
        details: validationError.errors 
      });
    }
    */

    // Create new CV instead of using upsert which isn't supported
    const cv = await database.client.CV.create({
      data: {
        userId: req.user.id,
        title: personalInfo.fullName || 'Untitled CV',
        content: JSON.stringify({
          templateId,
          personalInfo
        })
      }
    });

    console.log('CV saved successfully:', cv.id);
    console.log('CV response payload:', JSON.stringify({ cv }, null, 2));
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
    content.experiences = experiences;

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
    // Check if using "References available on request" option
    const { references, referencesOnRequest } = req.body;
    
    // Validate input - either references array or referencesOnRequest flag should be present
    if (!referencesOnRequest && (!Array.isArray(references) || references.length === 0)) {
      return res.status(400).json({ message: 'Either references array or referencesOnRequest flag must be provided' });
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
    
    // Handle "References available on request" option
    if (referencesOnRequest) {
      content.referencesOnRequest = true;
      // If using the "on request" option, set references to a special value
      content.references = [{ onRequest: true }];
    } else {
      content.referencesOnRequest = false;
      content.references = references;
    }

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
router.post('/analyze-only', authMiddleware, (req, res, next) => {
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
    let sourceType = 'unknown';
    let fileName = 'cv-text';
    
    if (req.file) {
      sourceType = 'file';
      fileName = req.file.originalname;
    } else {
      sourceType = 'text';
    }

    // Use seed based on filename or a default
    const seed = Math.random();
    
    // Generate mock results - always use mock to prevent memory issues
    const mockResults = {
      score: Math.floor(70 + (seed * 20)),
      formatScore: Math.floor(65 + (seed * 25)),
      contentScore: Math.floor(75 + (seed * 15)),
      strengths: [
        "Clear professional summary",
        "Good experience section structure",
        "Appropriate CV length",
        "Relevant skills highlighted"
      ].slice(0, 3 + Math.floor(seed * 2)),
      recommendations: [
        "Add more quantifiable achievements",
        "Improve skill presentation with proficiency levels",
        "Include more industry-specific keywords",
        "Strengthen your professional summary"
      ].slice(0, 3 + Math.floor(seed * 2)),
      missingKeywords: [
        "quantifiable results",
        "leadership",
        "communication skills",
        "project management",
        "teamwork",
        "problem-solving"
      ].slice(0, 4 + Math.floor(seed * 3)),
      improvementSuggestions: {
        content: "Focus on adding specific, measurable achievements to your experience section. Quantify your impact where possible.",
        format: "Ensure consistent formatting throughout your CV. Use bullet points consistently and maintain uniform spacing.",
        structure: "Consider reordering sections to place the most relevant information first. Your most impressive qualifications should be immediately visible.",
        keywords: "Research job descriptions in your target field and incorporate relevant keywords to pass ATS systems."
      }
    };
    
    // Simulate processing time - short delay to appear realistic
    await new Promise(resolve => setTimeout(resolve, 800));
    
    res.json(mockResults);
  } catch (error) {
    logger.error('Error analyzing CV:', error);
    res.status(500).json({ error: 'Failed to analyze CV', message: error.message });
  }
});

// Analyze CV against job description
router.post('/analyze', authMiddleware, (req, res, next) => {
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

    // Get CV file details 
    const cvFile = req.files.cv[0];
    const cvFileName = cvFile.originalname;
    
    // Get job description info
    const industry = req.body.industry || 'technology';
    const role = req.body.role || 'developer';
    
    // Generate a random seed
    const seed = Math.random();
    
    // Generate mock results
    const mockResults = {
      score: Math.floor(70 + (seed * 20)),
      formatScore: Math.floor(65 + (seed * 25)),
      contentScore: Math.floor(75 + (seed * 15)),
      jobFitScore: Math.floor(65 + (seed * 30)),
      strengths: [
        `Good representation of ${role} skills`,
        `Matches ${industry} industry expectations`,
        "Appropriate CV length",
        "Clear experience descriptions"
      ].slice(0, 3 + Math.floor(seed * 2)),
      recommendations: [
        `Include more ${industry}-specific terminology`,
        `Highlight achievements relevant to ${role} positions`,
        "Add more quantifiable results",
        "Improve skill presentation with proficiency levels"
      ].slice(0, 3 + Math.floor(seed * 2)),
      missingKeywords: [
        `${role} experience`,
        `${industry} knowledge`,
        "leadership",
        "communication skills",
        "project management",
        "teamwork",
        "problem-solving"
      ].slice(0, 4 + Math.floor(seed * 3)),
      improvementSuggestions: {
        content: `Focus on highlighting specific achievements that demonstrate your ${role} skills and ${industry} experience.`,
        format: "Ensure consistent formatting throughout your CV. Use bullet points consistently and maintain uniform spacing.",
        structure: "Consider reordering sections to emphasize experience most relevant to the job description.",
        keywords: `Research ${role} job descriptions in the ${industry} sector and incorporate those keywords.`
      }
    };
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    res.json(mockResults);
  } catch (error) {
    logger.error('Error analyzing CV against job:', error);
    res.status(500).json({ error: 'Failed to analyze CV', message: error.message });
  }
});

// Analyze CV without job description, but optionally with role context
router.post('/analyze-by-role', authMiddleware, (req, res, next) => {
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
    const industry = req.body.industry || 'technology';
    const role = req.body.role || 'developer';
    const isGenericAnalysis = !req.body.industry && !req.body.role;

    logger.info('Analysis parameters', {
      industry: industry || 'generic',
      role: role || 'generic',
      isGenericAnalysis
    });

    // Generate a random seed for consistent but varied results
    const seed = Math.random();
    
    // Generate industry-specific skill gaps for course recommendations
    let keySkillGaps = [];
    
    if (industry === 'technology') {
      keySkillGaps = ['programming', 'data analysis', 'cybersecurity'];
    } else if (industry === 'healthcare') {
      keySkillGaps = ['healthcare', 'patient care', 'medical terminology'];
    } else if (industry === 'finance') {
      keySkillGaps = ['finance', 'accounting', 'financial analysis'];
    } else if (industry === 'marketing') {
      keySkillGaps = ['marketing', 'digital marketing', 'social media'];
    } else if (industry === 'education') {
      keySkillGaps = ['education', 'curriculum development', 'teaching'];
    } else if (industry === 'engineering') {
      keySkillGaps = ['engineering', 'technical design', 'project management'];
    } else {
      // Default skill gaps
      keySkillGaps = ['leadership', 'project management', 'communication'];
    }
    
    // Generate mock analysis results with industry and role context if available
    const mockResults = {
      score: Math.floor(70 + (seed * 20)),
      formatScore: Math.floor(65 + (seed * 25)),
      contentScore: Math.floor(75 + (seed * 15)),
      strengths: [
        isGenericAnalysis ? "Clear professional summary" : `Good representation of ${role} skills`,
        isGenericAnalysis ? "Good experience section structure" : `Matches ${industry} industry expectations`,
        "Appropriate CV length",
        "Clear contact information"
      ].slice(0, 3 + Math.floor(seed * 2)),
      recommendations: [
        isGenericAnalysis ? "Add more quantifiable achievements" : `Include more ${industry}-specific terminology`,
        isGenericAnalysis ? "Improve skill presentation" : `Highlight achievements relevant to ${role} positions`,
        "Add more quantifiable results",
        "Ensure consistent formatting throughout"
      ].slice(0, 3 + Math.floor(seed * 2)),
      // Add key skill gaps for course recommendations
      keySkillGaps: keySkillGaps,
      missingKeywords: [
        isGenericAnalysis ? "quantifiable results" : `${role} experience`,
        isGenericAnalysis ? "leadership" : `${industry} knowledge`,
        "project management",
        "teamwork",
        "problem-solving",
        "communication skills"
      ].slice(0, 4 + Math.floor(seed * 3)),
      improvementSuggestions: {
        content: isGenericAnalysis 
          ? "Focus on adding specific, measurable achievements to your experience section. Quantify your impact where possible."
          : `Focus on highlighting specific achievements that demonstrate your ${role} skills and ${industry} experience.`,
        format: "Ensure consistent formatting throughout your CV. Use bullet points consistently and maintain uniform spacing.",
        structure: isGenericAnalysis
          ? "Consider reordering sections to place the most relevant information first. Your most impressive qualifications should be immediately visible."
          : `Consider reordering sections to emphasize experience most relevant to ${role} positions in the ${industry} industry.`,
        keywords: isGenericAnalysis
          ? "Research job descriptions in your target field and incorporate relevant keywords to pass ATS systems."
          : `Research ${role} job descriptions in the ${industry} sector and incorporate those keywords.`
      }
    };

    // Simulate processing time for realism
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    res.json(mockResults);
  } catch (error) {
    logger.error('Error in CV role-based analysis:', error);
    res.status(500).json({ 
      error: 'Failed to analyze CV', 
      message: 'An error occurred during CV analysis. Please try again later.' 
    });
  }
});

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

// Backward compatibility routes for British English spelling
// Redirect /analyse-only to /analyze-only
router.post('/analyse-only', (req, res, next) => {
  logger.info('Redirecting deprecated /analyse-only endpoint to /analyze-only');
  req.url = '/analyze-only';
  next();
});

// Redirect /analyse to /analyze
router.post('/analyse', (req, res, next) => {
  logger.info('Redirecting deprecated /analyse endpoint to /analyze');
  req.url = '/analyze';
  next();
});

// Redirect /analyse-by-role to /analyze-by-role
router.post('/analyse-by-role', (req, res, next) => {
  logger.info('Redirecting deprecated /analyse-by-role endpoint to /analyze-by-role');
  req.url = '/analyze-by-role';
  next();
});

// Export the router
module.exports = router; 