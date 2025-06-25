const express = require('express');
const multer = require('multer');
const { PrismaClient } = require('@prisma/client');
const { auth: authMiddleware } = require('../middleware/auth');
const { logger } = require('../config/logger');
const aiAnalysisService = require('../services/aiAnalysisService');
const { parseCV, extractTextFromFile } = require('../utils/cvParser');

const router = express.Router();
const prisma = new PrismaClient();
const upload = multer({ storage: multer.memoryStorage() });

// Enhanced CV analysis endpoint using database-driven approach
router.post('/analyze-enhanced', authMiddleware, upload.fields([
  { name: 'cv', maxCount: 1 },
  { name: 'jobDescription', maxCount: 1 }
]), async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { jobDescriptionText } = req.body;
    const cvFile = req.files?.cv?.[0];
    const jobDescFile = req.files?.jobDescription?.[0];

    if (!cvFile) {
      return res.status(400).json({ error: 'CV file is required' });
    }

    // Mock analysis for now - would integrate with actual parsing
    const mockAnalysis = {
      analysisId: 'mock-' + Date.now(),
      industry: {
        name: 'building_safety',
        displayName: 'Building Safety & Fire Safety'
      },
      role: {
        name: 'building-safety-manager',
        displayName: 'Building Safety Manager'
      },
      scores: {
        overall: 72,
        ats: 68,
        content: 75,
        format: 70,
        jobMatch: 65
      },
      feedback: {
        strengths: [
          'Relevant educational background',
          'Extensive fire safety and risk assessment experience',
          'Senior leadership in emergency services/safety management',
          'IOSH managing safely qualification',
          'Proven track record in building safety compliance'
        ],
        weaknesses: [
          'Could highlight relevant experience more prominently',
          'Missing some industry-specific keywords',
          'Could add more quantifiable achievements',
          'Consider additional certifications or training'
        ],
        improvements: [
          'Add NEBOSH Fire Safety Certificate',
          'Include Institute of Fire Engineers membership',
          'Highlight building regulations knowledge',
          'Add specific building safety achievements'
        ],
        missingKeywords: [
          'building safety',
          'fire safety',
          'building regulations',
          'building control',
          'safety compliance',
          'building codes',
          'fire risk assessment',
          'building standards'
        ]
      },
      courseRecommendations: await getCourseRecommendations(),
      improvementPlan: {
        timeframe: '3-6 months',
        priority: [
          'Obtain industry-specific certifications',
          'Emphasize relevant experience',
          'Complete building safety manager qualification program'
        ],
        nextSteps: [
          'Apply for NEBOSH Fire Safety Certificate',
          'Join Institute of Fire Engineers',
          'Update CV with building safety keywords',
          'Get professional review of CV'
        ]
      },
      processingTime: Date.now() - startTime
    };

    res.json(mockAnalysis);

  } catch (error) {
    logger.error('Enhanced CV analysis failed', {
      userId: req.user?.id,
      error: error.message
    });

    res.status(500).json({
      error: 'Analysis failed. Please try again.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get course recommendations by skill gaps
router.get('/courses/recommendations', authMiddleware, async (req, res) => {
  try {
    const { skills, industry, role, level = 'all' } = req.query;
    
    const skillsArray = skills ? skills.split(',').map(s => s.trim()) : [];
    
    const courses = await prisma.courseRecommendation.findMany({
      where: {
        AND: [
          { isActive: true },
          industry ? { industryId: industry } : {},
          role ? { roleId: role } : {},
          level !== 'all' ? { level } : {},
          skillsArray.length > 0 ? {
            skillTags: {
              hasSome: skillsArray
            }
          } : {}
        ]
      },
      orderBy: [
        { priority: 'desc' },
        { rating: 'desc' },
        { title: 'asc' }
      ],
      take: 10
    });

    res.json(courses);
  } catch (error) {
    logger.error('Failed to get course recommendations', {
      error: error.message,
      query: req.query
    });
    res.status(500).json({ error: 'Failed to get course recommendations' });
  }
});

// Get analysis history for user
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const analyses = await prisma.cVAnalysis.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      skip: parseInt(skip),
      take: parseInt(limit),
      include: {
        courseRecommendations: {
          include: {
            course: true
          }
        }
      }
    });

    const total = await prisma.cVAnalysis.count({
      where: { userId: req.user.id }
    });

    res.json({
      analyses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Failed to get analysis history', {
      userId: req.user?.id,
      error: error.message
    });
    res.status(500).json({ error: 'Failed to get analysis history' });
  }
});

// Helper functions

async function detectIndustryFromDB(jobDescription) {
  const industries = await prisma.industry.findMany({
    select: {
      id: true,
      name: true,
      displayName: true,
      keywords: true
    }
  });

  let bestMatch = null;
  let bestScore = 0;

  for (const industry of industries) {
    const score = calculateKeywordMatch(jobDescription.toLowerCase(), industry.keywords);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = industry;
    }
  }

  return bestScore > 0.1 ? bestMatch : null;
}

async function detectRoleFromDB(jobDescription, industryId) {
  const roles = await prisma.role.findMany({
    where: { industryId },
    select: {
      id: true,
      name: true,
      displayName: true,
      keywords: true
    }
  });

  let bestMatch = null;
  let bestScore = 0;

  for (const role of roles) {
    const score = calculateKeywordMatch(jobDescription.toLowerCase(), role.keywords);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = role;
    }
  }

  return bestScore > 0.1 ? bestMatch : null;
}

function calculateKeywordMatch(text, keywords) {
  if (!keywords || keywords.length === 0) return 0;
  
  let matches = 0;
  for (const keyword of keywords) {
    if (text.includes(keyword.toLowerCase())) {
      matches++;
    }
  }
  
  return matches / keywords.length;
}

async function getAnalysisTemplate(industryId, roleId) {
  // Try to find specific template for role first, then industry, then default
  const conditions = [
    { industryId, roleId },
    { industryId, roleId: null },
    { industryId: null, roleId: null }
  ].filter(condition => condition.industryId !== undefined);

  for (const condition of conditions) {
    const template = await prisma.analysisTemplate.findFirst({
      where: condition
    });
    if (template) return template;
  }

  return null;
}

async function performEnhancedAnalysis(cvData, jobDescription, industry, role, template) {
  // Use AI analysis service with enhanced template-based scoring
  const aiResults = await aiAnalysisService.analyzeCV(
    cvData.fullText,
    industry?.name,
    role?.name,
    false,
    jobDescription
  );

  // Apply template-based scoring if available
  if (template && template.scoringWeights) {
    const weights = template.scoringWeights;
    
    // Recalculate scores based on template weights
    const scores = {
      keywordScore: calculateTemplateKeywordScore(cvData.fullText, template.keywordPatterns || []),
      experienceScore: calculateExperienceScore(cvData),
      skillsScore: calculateSkillsScore(cvData, industry, role),
      formatScore: calculateFormatScore(cvData)
    };

    // Weighted overall score
    const overallScore = Math.round(
      (scores.keywordScore * (weights.keywords || 0.25)) +
      (scores.experienceScore * (weights.experience || 0.25)) +
      (scores.skillsScore * (weights.skills || 0.25)) +
      (scores.formatScore * (weights.format || 0.25))
    );

    return {
      ...aiResults,
      overallScore,
      keywordScore: scores.keywordScore,
      templateUsed: template.name,
      skillGaps: identifySkillGaps(cvData, industry, role),
      timeframe: estimateImprovementTimeframe(scores),
      priorityAreas: getPriorityImprovementAreas(scores, template),
      nextSteps: generateNextSteps(scores, template)
    };
  }

  return {
    ...aiResults,
    skillGaps: identifySkillGaps(cvData, industry, role),
    timeframe: '3-6 months',
    priorityAreas: aiResults.improvements?.slice(0, 3) || [],
    nextSteps: generateGenericNextSteps(aiResults)
  };
}

function calculateTemplateKeywordScore(cvText, keywords) {
  if (!keywords || keywords.length === 0) return 75;
  
  let matches = 0;
  const text = cvText.toLowerCase();
  
  for (const keyword of keywords) {
    if (text.includes(keyword.toLowerCase())) {
      matches++;
    }
  }
  
  return Math.min(100, Math.round((matches / keywords.length) * 100));
}

function calculateExperienceScore(cvData) {
  const experienceYears = cvData.experienceYears || 0;
  if (experienceYears >= 10) return 100;
  if (experienceYears >= 5) return 85;
  if (experienceYears >= 2) return 70;
  if (experienceYears >= 1) return 55;
  return 40;
}

function calculateSkillsScore(cvData, industry, role) {
  // Score based on relevant skills for industry/role
  const skills = cvData.skills || [];
  if (skills.length === 0) return 50;
  
  // Basic scoring - could be enhanced with industry-specific skill matching
  if (skills.length >= 15) return 90;
  if (skills.length >= 10) return 80;
  if (skills.length >= 5) return 70;
  return 60;
}

function calculateFormatScore(cvData) {
  let score = 70; // Base score
  
  // Check for key sections
  if (cvData.personalStatement) score += 10;
  if (cvData.experience && cvData.experience.length > 0) score += 10;
  if (cvData.education && cvData.education.length > 0) score += 5;
  if (cvData.skills && cvData.skills.length > 0) score += 5;
  
  return Math.min(100, score);
}

function identifySkillGaps(cvData, industry, role) {
  const userSkills = (cvData.skills || []).map(s => s.toLowerCase());
  const requiredSkills = [
    ...(industry?.requiredSkills || []),
    ...(role?.requiredSkills || [])
  ].map(s => s.toLowerCase());

  return requiredSkills.filter(skill => 
    !userSkills.some(userSkill => 
      userSkill.includes(skill) || skill.includes(userSkill)
    )
  );
}

function estimateImprovementTimeframe(scores) {
  const avgScore = Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length;
  
  if (avgScore >= 80) return '1-2 months';
  if (avgScore >= 60) return '3-4 months';
  if (avgScore >= 40) return '4-6 months';
  return '6+ months';
}

function getPriorityImprovementAreas(scores, template) {
  const areas = [];
  
  if (scores.keywordScore < 60) {
    areas.push('Include more industry-relevant keywords');
  }
  if (scores.experienceScore < 60) {
    areas.push('Highlight relevant experience more prominently');
  }
  if (scores.skillsScore < 60) {
    areas.push('Add more relevant skills and qualifications');
  }
  if (scores.formatScore < 70) {
    areas.push('Improve CV structure and formatting');
  }
  
  return areas.slice(0, 4);
}

function generateNextSteps(scores, template) {
  const steps = [];
  
  if (scores.keywordScore < 70) {
    steps.push('Review job requirements and incorporate missing keywords');
  }
  if (scores.skillsScore < 70) {
    steps.push('Consider additional training or certifications');
  }
  steps.push('Get feedback from industry professionals');
  steps.push('Practice interview skills for target roles');
  
  return steps.slice(0, 4);
}

function generateGenericNextSteps(results) {
  return [
    'Incorporate missing keywords from job description',
    'Add quantifiable achievements to experience section',
    'Consider relevant training or certifications',
    'Improve CV formatting and structure'
  ];
}

async function getRelevantCourses(skillGaps, industryId, roleId, experienceLevel) {
  const courses = await prisma.courseRecommendation.findMany({
    where: {
      AND: [
        { isActive: true },
        {
          OR: [
            { industryId },
            { roleId },
            skillGaps.length > 0 ? {
              skillTags: {
                hasSome: skillGaps
              }
            } : {}
          ]
        }
      ]
    },
    orderBy: [
      { priority: 'desc' },
      { rating: 'desc' }
    ],
    take: 8
  });

  // Add relevance scoring and reasons
  return courses.map(course => {
    const relevanceScore = calculateCourseRelevance(course, skillGaps, experienceLevel);
    const reason = generateCourseReason(course, skillGaps);
    
    return {
      ...course,
      relevanceScore,
      reason,
      priority: Math.round(course.priority * relevanceScore)
    };
  }).sort((a, b) => b.priority - a.priority);
}

function calculateCourseRelevance(course, skillGaps, experienceLevel) {
  let score = 0.5; // Base relevance
  
  // Check skill overlap
  const matchingSkills = course.skillTags.filter(tag => 
    skillGaps.some(gap => gap.toLowerCase().includes(tag.toLowerCase()))
  );
  score += (matchingSkills.length / Math.max(course.skillTags.length, 1)) * 0.4;
  
  // Experience level matching
  const levelMap = { 'entry': 1, 'mid': 2, 'senior': 3, 'executive': 4 };
  const userLevel = levelMap[experienceLevel] || 2;
  const courseLevel = levelMap[course.level.toLowerCase()] || 2;
  
  if (Math.abs(userLevel - courseLevel) <= 1) {
    score += 0.1;
  }
  
  return Math.min(1, score);
}

function generateCourseReason(course, skillGaps) {
  const matchingSkills = course.skillTags.filter(tag => 
    skillGaps.some(gap => gap.toLowerCase().includes(tag.toLowerCase()))
  );
  
  if (matchingSkills.length > 0) {
    return `Addresses skill gaps: ${matchingSkills.slice(0, 2).join(', ')}`;
  }
  
  return 'Relevant for career development in this field';
}

async function getCourseRecommendations() {
  try {
    const courses = await prisma.courseRecommendation.findMany({
      where: {
        isActive: true,
        OR: [
          { skillTags: { hasSome: ['building safety', 'fire safety'] } },
          { industryId: { not: null } }
        ]
      },
      orderBy: [
        { priority: 'desc' },
        { rating: 'desc' }
      ],
      take: 6
    });

    if (courses.length === 0) {
      // Fallback mock data if database not populated yet
      return [
        {
          id: 'nebosh-fire-safety',
          title: 'NEBOSH Fire Safety Certificate',
          provider: 'NEBOSH',
          description: 'Comprehensive fire safety certificate for building safety professionals',
          url: 'https://www.nebosh.org.uk/qualifications/health-and-safety/nebosh-certificate-fire-safety/',
          duration: '5 days',
          level: 'Professional',
          cost: 'Paid',
          rating: 4.8,
          priority: 10,
          relevanceScore: 0.95,
          reason: 'Essential certification for building safety professionals'
        },
        {
          id: 'building-safety-act',
          title: 'Building Safety Act 2022 Overview',
          provider: 'CIOB',
          description: 'Essential overview of the Building Safety Act 2022 requirements',
          url: 'https://www.ciob.org/learning',
          duration: '2 days',
          level: 'Professional',
          cost: 'Paid',
          rating: 4.5,
          priority: 9,
          relevanceScore: 0.90,
          reason: 'Critical understanding of current building safety legislation'
        }
      ];
    }

    return courses.map(course => ({
      ...course,
      relevanceScore: 0.8,
      reason: 'Relevant for your career development'
    }));
  } catch (error) {
    logger.error('Error fetching course recommendations:', error);
    return [];
  }
}

module.exports = router; 