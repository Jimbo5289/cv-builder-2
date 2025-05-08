const express = require('express');
const router = express.Router();
const database = require('../config/database');
const OpenAI = require('openai');
const PDFDocument = require('pdfkit');
const authMiddleware = require('../middleware/auth');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

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
    const { templateId, personalInfo } = req.body;

    if (!personalInfo) {
      return res.status(400).json({ error: 'Personal information is required' });
    }

    // Create CV with initial personal information
    const cv = await database.client.CV.create({
      data: {
        userId: req.user.id,
        templateId,
        title: `${personalInfo.fullName}'s CV`,
        content: JSON.stringify({
          personalInfo,
          skills: [],
          experiences: [],
          education: [],
          references: []
        })
      }
    });

    res.status(201).json({
      id: cv.id,
      message: 'CV created successfully',
      cv: {
        id: cv.id,
        templateId: cv.templateId,
        content: JSON.parse(cv.content)
      }
    });
  } catch (error) {
    console.error('Error creating CV:', error);
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

    const cv = await database.client.cV.findUnique({
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

    const updatedCV = await database.client.cV.update({
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

    const cv = await database.client.cV.findUnique({
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

    const updatedCV = await database.client.cV.update({
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

    const cv = await database.client.cV.findUnique({
      where: {
        id: req.params.id,
        userId: req.user.id
      },
      include: {
        sections: {
          where: {
            title: 'Personal Statement'
          }
        }
      }
    });

    if (!cv) {
      return res.status(404).json({ error: 'CV not found' });
    }

    // Update or create personal statement section
    let updatedCv;
    if (cv.sections.length > 0) {
      // Update existing section
      updatedCv = await database.client.cV.update({
        where: { id: req.params.id },
        data: {
          sections: {
            update: {
              where: {
                id: cv.sections[0].id
              },
              data: {
                content: personalStatement
              }
            }
          }
        },
        include: {
          sections: true
        }
      });
    } else {
      // Create new section
      updatedCv = await database.client.cV.update({
        where: { id: req.params.id },
        data: {
          sections: {
            create: {
              title: 'Personal Statement',
              content: personalStatement,
              order: 1
            }
          }
        },
        include: {
          sections: true
        }
      });
    }

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

    const cv = await database.client.cV.findUnique({
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

    const updatedCV = await database.client.cV.update({
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

    const cv = await database.client.cV.findUnique({
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

    const updatedCV = await database.client.cV.update({
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

module.exports = router; 