const OpenAI = require('openai');
const Anthropic = require('@anthropic-ai/sdk');
const logger = require('../utils/logger');

class AIAnalysisService {
  constructor() {
    this.openai = null;
    this.anthropic = null;
    this.isOpenAIEnabled = false;
    this.isAnthropicEnabled = false;
    
    // Initialize OpenAI
    if (process.env.OPENAI_API_KEY && process.env.USE_AI_ANALYSIS === 'true') {
      try {
        this.openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY
        });
        this.isOpenAIEnabled = true;
        logger.info('OpenAI initialized for CV analysis');
      } catch (error) {
        logger.error('Failed to initialize OpenAI:', error);
      }
    }

    // Initialize Anthropic (Claude)
    if (process.env.ANTHROPIC_API_KEY && process.env.USE_AI_ANALYSIS === 'true') {
      try {
        this.anthropic = new Anthropic({
          apiKey: process.env.ANTHROPIC_API_KEY
        });
        this.isAnthropicEnabled = true;
        logger.info('Anthropic Claude initialized for CV analysis');
      } catch (error) {
        logger.error('Failed to initialize Anthropic:', error);
      }
    }

    if (!this.isOpenAIEnabled && !this.isAnthropicEnabled) {
      logger.warn('No AI services available - using enhanced mock analysis');
    }
  }

  // Industry-specific requirements and keywords
  getIndustryRequirements(industry) {
    const requirements = {
      technology: {
        keywords: ['programming', 'software development', 'cloud', 'agile', 'devops', 'API', 'database', 'cybersecurity', 'machine learning', 'AI', 'data science', 'Python', 'JavaScript', 'Git', 'testing', 'algorithms', 'frameworks', 'full-stack', 'frontend', 'backend'],
        skills: ['Technical problem-solving', 'Code quality and best practices', 'Continuous learning', 'Collaboration in technical teams', 'Version control proficiency', 'System design', 'Debugging and troubleshooting'],
        qualifications: ['Computer Science degree', 'Software engineering experience', 'Technical certifications', 'Programming language proficiency', 'Project portfolio', 'Open source contributions'],
        incompatibleFields: ['retail', 'food service', 'manual labor', 'arts', 'emergency services'],
        transferableFrom: ['engineering', 'mathematics', 'data analysis', 'research']
      },
      healthcare: {
        keywords: ['patient care', 'medical', 'clinical', 'diagnosis', 'treatment', 'healthcare', 'EMR', 'EHR', 'HIPAA', 'patient safety', 'medical records', 'vital signs', 'patient assessment', 'care planning', 'medical terminology', 'emergency response', 'triage', 'CPR', 'first aid'],
        skills: ['Patient communication', 'Clinical decision-making', 'Empathy and compassion', 'Attention to detail', 'Emergency response', 'Team collaboration', 'Medical documentation', 'Infection control'],
        qualifications: ['Medical degree/nursing qualification', 'Clinical experience', 'Medical certifications', 'Continuing education', 'Professional licensing', 'Board certifications'],
        incompatibleFields: ['technology', 'finance', 'marketing', 'design'],
        transferableFrom: ['emergency services', 'social work', 'psychology', 'biology', 'research']
      },
      finance: {
        keywords: ['financial analysis', 'accounting', 'bookkeeping', 'budgeting', 'forecasting', 'financial reporting', 'audit', 'tax preparation', 'risk assessment', 'investment analysis', 'portfolio management', 'cash flow', 'financial statements', 'Excel', 'financial modeling', 'regulatory compliance', 'trading', 'banking'],
        skills: ['Analytical thinking', 'Attention to detail', 'Risk assessment', 'Client communication', 'Regulatory compliance', 'Financial modeling', 'Data analysis', 'Mathematical proficiency'],
        qualifications: ['Finance/Accounting degree', 'Professional certifications (CPA, CFA, etc.)', 'Financial analysis experience', 'Regulatory knowledge', 'Software proficiency', 'Series licenses'],
        incompatibleFields: ['healthcare', 'emergency services', 'arts', 'design'],
        transferableFrom: ['mathematics', 'economics', 'data analysis', 'consulting', 'insurance']
      },
      design: {
        keywords: ['creative design', 'visual design', 'UI/UX', 'graphic design', 'interior design', 'Adobe Creative Suite', 'Photoshop', 'Illustrator', 'Figma', 'color theory', 'typography', 'composition', 'branding', 'layout', 'prototyping', 'user experience', 'aesthetic', 'portfolio'],
        skills: ['Creative thinking', 'Visual communication', 'Attention to aesthetic detail', 'Client consultation', 'Project management', 'Software proficiency', 'Problem-solving through design'],
        qualifications: ['Design degree/diploma', 'Portfolio of work', 'Design software certifications', 'Industry experience', 'Client testimonials'],
        incompatibleFields: ['emergency services', 'healthcare', 'finance', 'manufacturing'],
        transferableFrom: ['architecture', 'art', 'marketing', 'photography']
      },
      engineering: {
        keywords: ['design', 'CAD', 'technical drawings', 'specifications', 'quality control', 'prototyping', 'testing', 'manufacturing', 'engineering analysis', 'compliance', 'problem-solving', 'product development', 'process improvement', 'technical documentation', 'AutoCAD', 'SolidWorks', 'MATLAB'],
        skills: ['Technical design', 'Problem-solving', 'Project management', 'Quality assurance', 'Safety compliance', 'Innovation', 'Mathematical analysis', 'Technical communication'],
        qualifications: ['Engineering degree', 'Professional engineering license', 'Technical certifications', 'Industry experience', 'CAD software proficiency', 'Professional development'],
        incompatibleFields: ['arts', 'retail', 'food service'],
        transferableFrom: ['technology', 'mathematics', 'physics', 'architecture', 'construction']
      },
      marketing: {
        keywords: ['marketing strategy', 'digital marketing', 'social media', 'content creation', 'SEO', 'analytics', 'campaign management', 'brand management', 'market research', 'customer acquisition', 'lead generation', 'conversion optimization', 'advertising', 'email marketing', 'influencer marketing'],
        skills: ['Creative thinking', 'Data analysis', 'Communication', 'Brand strategy', 'Digital literacy', 'Customer understanding', 'Project management', 'Content creation'],
        qualifications: ['Marketing degree', 'Digital marketing certifications', 'Campaign experience', 'Analytics proficiency', 'Creative portfolio', 'Social media expertise'],
        incompatibleFields: ['emergency services', 'healthcare', 'manufacturing'],
        transferableFrom: ['communications', 'sales', 'journalism', 'psychology', 'business']
      },
      education: {
        keywords: ['teaching', 'curriculum development', 'lesson planning', 'student assessment', 'classroom management', 'educational technology', 'learning objectives', 'differentiated instruction', 'student engagement', 'professional development', 'pedagogy', 'learning outcomes'],
        skills: ['Communication', 'Patience', 'Adaptability', 'Leadership', 'Creative problem-solving', 'Cultural sensitivity', 'Classroom management', 'Assessment design'],
        qualifications: ['Education degree', 'Teaching certification', 'Subject expertise', 'Classroom experience', 'Continuing education', 'Professional development'],
        incompatibleFields: ['manufacturing', 'emergency services'],
        transferableFrom: ['psychology', 'social work', 'training', 'communications']
      },
      sales: {
        keywords: ['sales', 'customer relationship management', 'CRM', 'lead generation', 'prospecting', 'negotiation', 'closing deals', 'customer service', 'account management', 'sales targets', 'revenue growth', 'client acquisition', 'sales pipeline'],
        skills: ['Communication', 'Persuasion', 'Relationship building', 'Negotiation', 'Resilience', 'Goal orientation', 'Customer focus', 'Time management'],
        qualifications: ['Sales experience', 'Customer service background', 'Industry knowledge', 'CRM proficiency', 'Sales training', 'Performance track record'],
        incompatibleFields: ['engineering', 'healthcare'],
        transferableFrom: ['customer service', 'marketing', 'retail', 'hospitality', 'business development']
      },
      emergency_services: {
        keywords: ['emergency response', 'first aid', 'CPR', 'rescue operations', 'fire suppression', 'emergency medical services', 'ambulance', 'paramedic', 'EMT', 'incident command', 'safety protocols', 'hazmat', 'emergency preparedness', 'crisis management', 'public safety'],
        skills: ['Emergency response', 'Decision-making under pressure', 'Physical fitness', 'Team coordination', 'Crisis management', 'Medical skills', 'Safety awareness', 'Leadership in emergencies'],
        qualifications: ['Emergency services training', 'Medical certifications', 'Physical fitness standards', 'Background checks', 'Ongoing training', 'Professional certifications'],
        incompatibleFields: ['design', 'marketing', 'finance'],
        transferableFrom: ['healthcare', 'military', 'security', 'law enforcement']
      }
    };

    return requirements[industry] || {
      keywords: ['leadership', 'communication', 'problem-solving', 'teamwork', 'project management'],
      skills: ['Communication', 'Leadership', 'Problem-solving', 'Adaptability', 'Time management'],
      qualifications: ['Relevant degree', 'Professional experience', 'Industry knowledge', 'Skill certifications'],
      incompatibleFields: [],
      transferableFrom: []
    };
  }

  // Role-specific requirements
  getRoleRequirements(role, industry) {
    const roleRequirements = {
      'software-developer': {
        specificSkills: ['Programming languages', 'Software architecture', 'Code review', 'Testing methodologies', 'Debugging'],
        seniority: ['Junior: 0-2 years', 'Mid: 2-5 years', 'Senior: 5+ years'],
        criticalKeywords: ['programming', 'coding', 'software', 'development', 'algorithms']
      },
      'data-scientist': {
        specificSkills: ['Statistical analysis', 'Machine learning', 'Data visualization', 'Python/R', 'SQL'],
        seniority: ['Junior: 0-2 years', 'Mid: 2-5 years', 'Senior: 5+ years'],
        criticalKeywords: ['data science', 'machine learning', 'statistics', 'analytics', 'modeling']
      },
      'financial-analyst': {
        specificSkills: ['Financial modeling', 'Excel proficiency', 'Financial reporting', 'Market analysis', 'Risk assessment'],
        seniority: ['Analyst: 0-3 years', 'Senior Analyst: 3-6 years', 'Manager: 6+ years'],
        criticalKeywords: ['financial analysis', 'modeling', 'forecasting', 'budgeting', 'reporting']
      },
      'nurse': {
        specificSkills: ['Patient care', 'Medical procedures', 'Documentation', 'Emergency response', 'Team collaboration'],
        seniority: ['Staff Nurse: 0-3 years', 'Charge Nurse: 3-7 years', 'Nurse Manager: 7+ years'],
        criticalKeywords: ['nursing', 'patient care', 'clinical', 'medical', 'healthcare']
      },
      'marketing-manager': {
        specificSkills: ['Campaign management', 'Digital marketing', 'Analytics', 'Brand strategy', 'Team leadership'],
        seniority: ['Coordinator: 0-2 years', 'Manager: 2-5 years', 'Director: 5+ years'],
        criticalKeywords: ['marketing', 'campaigns', 'digital', 'brand', 'strategy']
      }
    };

    return roleRequirements[role] || {
      specificSkills: ['Role-specific expertise', 'Industry knowledge', 'Professional competencies'],
      seniority: ['Entry: 0-2 years', 'Mid: 2-5 years', 'Senior: 5+ years'],
      criticalKeywords: ['professional', 'experience', 'skills', 'qualifications']
    };
  }

  // Main analysis method
  async analyzeCV(cvText, industry = null, role = null, isGeneric = false) {
    if (!this.isOpenAIEnabled && !this.isAnthropicEnabled) {
      logger.warn('No AI services available - using enhanced mock analysis');
      return this.generateMockAnalysis(industry, role, isGeneric);
    }

    try {
      const industryReqs = industry ? this.getIndustryRequirements(industry) : null;
      const roleReqs = role ? this.getRoleRequirements(role, industry) : null;

      // Pre-analysis: Quick field detection and compatibility check
      const compatibilityCheck = this.performCompatibilityCheck(cvText, industry, industryReqs);
      
      // Run multiple AI analyses in parallel for cross-validation
      const analyses = await this.runMultiModelAnalysis(cvText, industry, role, industryReqs, roleReqs, isGeneric);
      
      // Combine results using consensus engine
      const finalResult = this.createConsensusAnalysis(analyses, compatibilityCheck, industry, role);

      logger.info('Multi-model AI Analysis completed successfully', {
        industry: industry || 'generic',
        role: role || 'generic',
        score: finalResult.score,
        confidence: finalResult.confidence,
        modelsUsed: analyses.length
      });

      return finalResult;

    } catch (error) {
      logger.error('Multi-model AI Analysis failed, falling back to enhanced mock:', error);
      return this.generateMockAnalysis(industry, role, isGeneric);
    }
  }

  // Compatibility pre-check using keyword analysis
  performCompatibilityCheck(cvText, industry, industryReqs) {
    if (!industry || !industryReqs) {
      return { compatibility: 'medium', keywordScore: 50, detectedField: 'unknown' };
    }

    const cvLower = cvText.toLowerCase();
    
    // Check for industry keywords
    const industryKeywords = industryReqs.keywords || [];
    const foundKeywords = industryKeywords.filter(keyword => 
      cvLower.includes(keyword.toLowerCase())
    );
    
    // Detect likely current field
    const detectedField = this.detectCurrentField(cvText);
    
    // Calculate keyword match percentage
    const keywordScore = Math.round((foundKeywords.length / industryKeywords.length) * 100);
    
    // Determine compatibility
    let compatibility = 'medium';
    if (industryReqs.incompatibleFields && industryReqs.incompatibleFields.includes(detectedField)) {
      compatibility = 'low';
    } else if (industryReqs.transferableFrom && industryReqs.transferableFrom.includes(detectedField)) {
      compatibility = 'high';
    } else if (keywordScore > 60) {
      compatibility = 'high';
    } else if (keywordScore < 20) {
      compatibility = 'low';
    }

    return {
      compatibility,
      keywordScore,
      detectedField,
      foundKeywords: foundKeywords.slice(0, 5)
    };
  }

  // Detect current professional field from CV
  detectCurrentField(cvText) {
    const fieldKeywords = {
      'emergency_services': ['fire', 'rescue', 'ambulance', 'paramedic', 'emt', 'emergency response', 'firefighter'],
      'healthcare': ['nurse', 'doctor', 'medical', 'patient care', 'clinical', 'hospital'],
      'technology': ['software', 'programming', 'developer', 'code', 'technical', 'IT'],
      'education': ['teacher', 'teaching', 'education', 'classroom', 'student', 'curriculum'],
      'finance': ['accounting', 'financial', 'banking', 'audit', 'investment'],
      'marketing': ['marketing', 'advertising', 'brand', 'campaign', 'social media'],
      'design': ['design', 'creative', 'visual', 'graphic', 'UI/UX', 'artistic'],
      'sales': ['sales', 'customer', 'client', 'revenue', 'negotiation']
    };

    const cvLower = cvText.toLowerCase();
    let maxScore = 0;
    let detectedField = 'unknown';

    for (const [field, keywords] of Object.entries(fieldKeywords)) {
      const matches = keywords.filter(keyword => cvLower.includes(keyword)).length;
      const score = (matches / keywords.length) * 100;
      
      if (score > maxScore) {
        maxScore = score;
        detectedField = field;
      }
    }

    return maxScore > 30 ? detectedField : 'unknown';
  }

  // Run multiple AI models in parallel
  async runMultiModelAnalysis(cvText, industry, role, industryReqs, roleReqs, isGeneric) {
    const analyses = [];
    const promises = [];

    // Create analysis prompt
    const prompt = this.createAnalysisPrompt(cvText, industry, role, industryReqs, roleReqs, isGeneric);

    // Run Claude 3.5 Sonnet (primary analyst)
    if (this.isAnthropicEnabled) {
      promises.push(
        this.runClaudeAnalysis(prompt, industry, role, 'claude-3-5-sonnet-20241022')
          .then(result => ({ source: 'claude-3.5-sonnet', priority: 1, ...result }))
          .catch(error => {
            logger.error('Claude 3.5 Sonnet analysis failed:', error);
            return null;
          })
      );
    }

    // Run GPT-4o (secondary analyst)
    if (this.isOpenAIEnabled) {
      promises.push(
        this.runOpenAIAnalysis(prompt, industry, role, 'gpt-4o-mini')
          .then(result => ({ source: 'gpt-4o-mini', priority: 2, ...result }))
          .catch(error => {
            logger.error('GPT-4o analysis failed:', error);
            return null;
          })
      );
    }

    // Wait for all analyses to complete
    const results = await Promise.all(promises);
    
    // Filter out failed analyses
    results.forEach(result => {
      if (result) analyses.push(result);
    });

    // Ensure we have at least one analysis
    if (analyses.length === 0) {
      throw new Error('All AI analyses failed');
    }

    return analyses;
  }

  // Claude analysis implementation
  async runClaudeAnalysis(prompt, industry, role, model = 'claude-3-5-sonnet-20241022') {
    const message = await this.anthropic.messages.create({
      model: model,
      max_tokens: 2000,
      temperature: 0.3,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const response = message.content[0].text;
    return this.parseAIResponse(response, industry, role);
  }

  // OpenAI analysis implementation
  async runOpenAIAnalysis(prompt, industry, role, model = 'gpt-4o-mini') {
    const completion = await this.openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: 'system',
          content: 'You are an expert CV/resume analyzer and career counselor. Provide detailed, actionable feedback with specific scores and recommendations. Always return valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.3
    });

    const response = completion.choices[0].message.content;
    return this.parseAIResponse(response, industry, role);
  }

  // Consensus engine to combine multiple AI analyses
  createConsensusAnalysis(analyses, compatibilityCheck, industry, role) {
    if (analyses.length === 1) {
      // Single analysis - add compatibility validation
      const result = analyses[0];
      return this.validateWithCompatibility(result, compatibilityCheck, industry, role);
    }

    // Multiple analyses - create consensus
    const scores = {
      score: this.calculateConsensusScore(analyses.map(a => a.score)),
      formatScore: this.calculateConsensusScore(analyses.map(a => a.formatScore)),
      contentScore: this.calculateConsensusScore(analyses.map(a => a.contentScore)),
      jobFitScore: this.calculateConsensusScore(analyses.map(a => a.jobFitScore))
    };

    // Combine strengths and recommendations
    const allStrengths = analyses.flatMap(a => a.strengths || []);
    const allRecommendations = analyses.flatMap(a => a.recommendations || []);
    const allMissingKeywords = analyses.flatMap(a => a.missingKeywords || []);

    // Calculate confidence based on agreement between models
    const confidence = this.calculateConfidence(analyses);

    const consensusResult = {
      ...scores,
      strengths: this.deduplicateArray(allStrengths).slice(0, 5),
      recommendations: this.deduplicateArray(allRecommendations).slice(0, 5),
      missingKeywords: this.deduplicateArray(allMissingKeywords).slice(0, 8),
      improvements: this.combineImprovements(analyses),
      keySkillGaps: this.combineSkillGaps(analyses),
      experienceLevel: this.determineConsensusExperienceLevel(analyses),
      competitiveAdvantages: this.combineCompetitiveAdvantages(analyses),
      relevanceAnalysis: this.createConsensusRelevanceAnalysis(analyses, compatibilityCheck),
      careerTransitionAdvice: this.createConsensusTransitionAdvice(analyses, compatibilityCheck),
      timeToCompetitive: this.determineConsensusTimeframe(analyses, compatibilityCheck),
      fieldCompatibility: compatibilityCheck.compatibility,
      confidence: confidence,
      analysisQuality: confidence > 80 ? 'high' : confidence > 60 ? 'medium' : 'low',
      modelsUsed: analyses.map(a => a.source)
    };

    return this.validateWithCompatibility(consensusResult, compatibilityCheck, industry, role);
  }

  // Validate AI results against hard compatibility rules
  validateWithCompatibility(result, compatibilityCheck, industry, role) {
    const industryReqs = this.getIndustryRequirements(industry);
    
    // Apply hard limits based on compatibility
    if (compatibilityCheck.compatibility === 'low') {
      result.score = Math.min(result.score, 35);
      result.jobFitScore = Math.min(result.jobFitScore, 30);
      result.timeToCompetitive = '3-5 years';
    } else if (compatibilityCheck.compatibility === 'high' && compatibilityCheck.keywordScore > 60) {
      result.score = Math.max(result.score, 70);
    }

    // Ensure minimum keyword presence for high scores
    if (result.score > 70 && compatibilityCheck.keywordScore < 30) {
      result.score = Math.max(45, Math.min(result.score, 65));
      result.jobFitScore = Math.max(40, Math.min(result.jobFitScore, 60));
    }

    return result;
  }

  calculateConsensusScore(scores) {
    if (scores.length === 0) return 50;
    
    // Remove outliers if we have 3+ scores
    if (scores.length >= 3) {
      scores.sort((a, b) => a - b);
      scores = scores.slice(1, -1); // Remove lowest and highest
    }
    
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  }

  calculateConfidence(analyses) {
    if (analyses.length === 1) return 75; // Single model confidence
    
    // Calculate agreement between models
    const scores = analyses.map(a => a.score);
    const maxDiff = Math.max(...scores) - Math.min(...scores);
    
    // High confidence if models agree closely
    if (maxDiff <= 10) return 95;
    if (maxDiff <= 20) return 85;
    if (maxDiff <= 30) return 75;
    return 60;
  }

  deduplicateArray(arr) {
    return [...new Set(arr.map(item => item.toLowerCase()))];
  }

  combineImprovements(analyses) {
    const allImprovements = analyses.flatMap(a => a.improvements || []);
    return this.deduplicateArray(allImprovements).slice(0, 4);
  }

  combineSkillGaps(analyses) {
    const allGaps = analyses.flatMap(a => a.keySkillGaps || []);
    return this.deduplicateArray(allGaps).slice(0, 6);
  }

  determineConsensusExperienceLevel(analyses) {
    const levels = analyses.map(a => a.experienceLevel || 'entry');
    const levelCounts = levels.reduce((acc, level) => {
      acc[level] = (acc[level] || 0) + 1;
      return acc;
    }, {});
    
    return Object.keys(levelCounts).reduce((a, b) => 
      levelCounts[a] > levelCounts[b] ? a : b
    );
  }

  combineCompetitiveAdvantages(analyses) {
    const allAdvantages = analyses.flatMap(a => a.competitiveAdvantages || []);
    return this.deduplicateArray(allAdvantages).slice(0, 4);
  }

  createConsensusRelevanceAnalysis(analyses, compatibilityCheck) {
    const analysis = analyses[0]?.relevanceAnalysis || '';
    return `${analysis} (Compatibility: ${compatibilityCheck.compatibility}, Keyword Match: ${compatibilityCheck.keywordScore}%)`;
  }

  createConsensusTransitionAdvice(analyses, compatibilityCheck) {
    if (compatibilityCheck.compatibility === 'low') {
      return 'Significant career change required. Consider formal education, bootcamps, or extensive retraining programs. Start with entry-level positions to gain industry experience.';
    } else if (compatibilityCheck.compatibility === 'medium') {
      return 'Focus on transferable skills while gaining industry-specific experience through courses, projects, or internships.';
    } else {
      return 'Leverage existing relevant experience. Focus on highlighting transferable skills and staying current with industry trends.';
    }
  }

  determineConsensusTimeframe(analyses, compatibilityCheck) {
    switch (compatibilityCheck.compatibility) {
      case 'high': return '3-6 months';
      case 'medium': return '1-2 years';
      case 'low': return '3-5 years';
      default: return '1-2 years';
    }
  }

  createAnalysisPrompt(cvText, industry, role, industryReqs, roleReqs, isGeneric) {
    if (isGeneric) {
      return `Analyze this CV for general professional quality and provide specific feedback:

CV Content:
${cvText}

Please provide a JSON response with the following structure:
{
  "score": [number 1-100],
  "formatScore": [number 1-100],
  "contentScore": [number 1-100],
  "strengths": [array of 3-5 specific strengths],
  "recommendations": [array of 3-5 specific improvements],
  "missingKeywords": [array of important keywords/skills missing],
  "improvements": [array of 4 detailed improvement suggestions],
  "analysis": "Brief overall assessment"
}

Focus on:
- Professional presentation and formatting
- Content clarity and relevance
- Skills and experience presentation
- Achievement quantification
- Professional development areas`;
    }

    return `CRITICAL: You are evaluating how well this CV matches a specific ${role} role in the ${industry} industry. Score based on RELEVANCE and FIT, not general CV quality.

CV Content:
${cvText}

Target Role: ${role} in ${industry}

REQUIRED for this role:
- Essential Skills: ${roleReqs.specificSkills.join(', ')}
- Critical Keywords: ${roleReqs.criticalKeywords.join(', ')}
- Industry Keywords: ${industryReqs.keywords.join(', ')}
- Typical Qualifications: ${industryReqs.qualifications.join(', ')}

COMPATIBILITY ANALYSIS:
- Fields INCOMPATIBLE with ${industry}: ${industryReqs.incompatibleFields.join(', ')}
- Fields that TRANSFER WELL to ${industry}: ${industryReqs.transferableFrom.join(', ')}

SCORING INSTRUCTIONS (BE REALISTIC):
- Score 85-100: CV shows strong direct experience and skills for this specific role
- Score 70-84: CV shows relevant experience with some gaps to fill
- Score 55-69: CV shows transferable skills but needs significant development
- Score 35-54: CV shows limited relevance, major reskilling needed
- Score 15-34: CV from incompatible field, extensive career change required
- Score 1-14: CV completely unsuitable for this role

AUTOMATIC SCORE ADJUSTMENTS:
- If CV is from incompatible field (${industryReqs.incompatibleFields.join(', ')}): MAX score is 35
- If CV shows no relevant keywords: MAX score is 25
- If CV is from transferable field (${industryReqs.transferableFrom.join(', ')}): MIN score is 45

REALISTIC EXAMPLES:
- Fire/Rescue → Healthcare Nurse: 75-85 (emergency medical skills transfer)
- Fire/Rescue → Interior Designer: 15-25 (no relevant skills)
- Fire/Rescue → Safety Manager: 70-80 (safety expertise transfers)
- Teacher → Software Developer: 20-30 (completely different skillset)
- Teacher → Corporate Trainer: 80-90 (teaching skills transfer)
- Accountant → Graphic Designer: 10-20 (no creative background)

Analyze this CV and provide JSON response:
{
  "score": [HONEST RELEVANCE score 1-100 for ${role} in ${industry}],
  "formatScore": [CV presentation quality 1-100],
  "contentScore": [Content clarity and structure 1-100],
  "jobFitScore": [Specific fit for ${role} role 1-100],
  "strengths": [3-5 strengths SPECIFIC to ${role} requirements, be honest if few exist],
  "recommendations": [3-5 specific actions to become competitive for ${role}],
  "missingKeywords": [critical ${industry}/${role} keywords absent from CV],
  "improvements": [4 detailed steps to transition into ${role}],
  "experienceLevel": "entry|junior|mid|senior for ${role} (not their current field)",
  "keySkillGaps": [critical skills missing for ${role} success],
  "competitiveAdvantages": [unique strengths that could help in ${role}],
  "relevanceAnalysis": "Honest assessment of how well this background fits ${role} in ${industry}",
  "careerTransitionAdvice": "Specific advice for moving from their current field to ${role}",
  "timeToCompetitive": "Realistic timeframe to become competitive for ${role} (e.g., '6 months', '2-3 years', '5+ years')",
  "fieldCompatibility": "high|medium|low compatibility between current background and ${role}"
}

BE BRUTALLY HONEST about fit. A CV from an incompatible field should score 15-35 maximum. Users need realistic expectations to make informed career decisions.`;
  }

  parseAIResponse(aiResponse, industry, role) {
    try {
      // Try to extract JSON from the response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in AI response');
      }

      const parsed = JSON.parse(jsonMatch[0]);

      // Ensure all required fields exist with fallbacks
      return {
        score: this.validateScore(parsed.score),
        formatScore: this.validateScore(parsed.formatScore),
        contentScore: this.validateScore(parsed.contentScore),
        jobFitScore: this.validateScore(parsed.jobFitScore || parsed.score),
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths.slice(0, 5) : this.getDefaultStrengths(industry, role),
        recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations.slice(0, 5) : this.getDefaultRecommendations(industry, role),
        missingKeywords: Array.isArray(parsed.missingKeywords) ? parsed.missingKeywords.slice(0, 8) : this.getDefaultMissingKeywords(industry, role),
        improvements: Array.isArray(parsed.improvements) ? parsed.improvements.slice(0, 4) : this.getDefaultImprovements(industry, role),
        keySkillGaps: Array.isArray(parsed.keySkillGaps) ? parsed.keySkillGaps.slice(0, 6) : this.getDefaultSkillGaps(industry),
        experienceLevel: parsed.experienceLevel || 'entry',
        competitiveAdvantages: Array.isArray(parsed.competitiveAdvantages) ? parsed.competitiveAdvantages.slice(0, 4) : [],
        relevanceAnalysis: parsed.relevanceAnalysis || parsed.analysis || 'Analysis completed',
        careerTransitionAdvice: parsed.careerTransitionAdvice || 'Consider developing relevant skills for this field',
        timeToCompetitive: parsed.timeToCompetitive || 'Varies based on current skills',
        fieldCompatibility: parsed.fieldCompatibility || 'medium'
      };
    } catch (error) {
      logger.error('Failed to parse AI response:', error);
      return this.generateMockAnalysis(industry, role);
    }
  }

  validateScore(score) {
    const num = parseInt(score);
    if (isNaN(num) || num < 1 || num > 100) {
      return Math.floor(Math.random() * 20) + 70; // Fallback score 70-90
    }
    return num;
  }

  getDefaultStrengths(industry, role) {
    if (industry === 'technology') {
      return ['Technical experience demonstrated', 'Problem-solving approach evident', 'Continuous learning mindset'];
    }
    if (industry === 'healthcare') {
      return ['Patient-focused experience', 'Clinical competency shown', 'Team collaboration skills'];
    }
    if (industry === 'finance') {
      return ['Analytical skills demonstrated', 'Attention to detail evident', 'Financial acumen shown'];
    }
    return ['Professional experience demonstrated', 'Clear communication skills', 'Relevant background shown'];
  }

  getDefaultRecommendations(industry, role) {
    if (industry === 'technology') {
      return ['Add more technical project details', 'Include programming languages and frameworks', 'Highlight problem-solving achievements'];
    }
    if (industry === 'healthcare') {
      return ['Emphasize patient care experience', 'Include medical certifications prominently', 'Add clinical outcome achievements'];
    }
    if (industry === 'finance') {
      return ['Quantify financial achievements', 'Include financial software proficiency', 'Highlight analytical project results'];
    }
    return ['Add more quantifiable achievements', 'Include relevant certifications', 'Strengthen skills section'];
  }

  getDefaultMissingKeywords(industry, role) {
    const industryReqs = this.getIndustryRequirements(industry);
    return industryReqs.keywords.slice(0, 6);
  }

  getDefaultSkillGaps(industry) {
    if (industry === 'technology') return ['advanced programming', 'cloud technologies', 'AI/ML'];
    if (industry === 'healthcare') return ['patient care', 'medical procedures', 'healthcare tech'];
    if (industry === 'finance') return ['financial modeling', 'risk analysis', 'financial software'];
    return ['leadership', 'project management', 'communication'];
  }

  getDefaultImprovements(industry, role) {
    if (industry === 'technology') {
      return [
        'Add specific programming languages and technical frameworks used in projects',
        'Include measurable impact of technical solutions (performance improvements, user adoption)',
        'Highlight collaboration in agile/scrum development environments',
        'Showcase continuous learning through courses, certifications, or personal projects'
      ];
    }
    return [
      'Focus on quantifiable achievements and outcomes',
      'Strengthen industry-specific terminology and keywords',
      'Improve formatting for better readability and ATS compatibility',
      'Add relevant certifications and professional development'
    ];
  }

  generateMockAnalysis(industry, role, isGeneric = false) {
    const industryReqs = industry ? this.getIndustryRequirements(industry) : null;
    
    // Generate more realistic mock scores based on compatibility
    let baseScore;
    let fieldCompatibility;
    let timeToCompetitive;
    
    if (industry && industryReqs) {
      // Simulate different compatibility scenarios
      const randomScenario = Math.random();
      if (randomScenario < 0.3) {
        // Incompatible field scenario
        baseScore = Math.floor(Math.random() * 20) + 15; // 15-35
        fieldCompatibility = 'low';
        timeToCompetitive = '3-5 years';
      } else if (randomScenario < 0.6) {
        // Transferable field scenario
        baseScore = Math.floor(Math.random() * 25) + 45; // 45-70
        fieldCompatibility = 'medium';
        timeToCompetitive = '1-2 years';
      } else {
        // Compatible field scenario
        baseScore = Math.floor(Math.random() * 25) + 70; // 70-95
        fieldCompatibility = 'high';
        timeToCompetitive = '3-6 months';
      }
    } else {
      baseScore = Math.floor(Math.random() * 20) + 70; // Generic 70-90 range
      fieldCompatibility = 'medium';
      timeToCompetitive = '1-2 years';
    }

    return {
      score: baseScore,
      formatScore: Math.max(65, baseScore - 5),
      contentScore: Math.min(95, baseScore + 5),
      jobFitScore: baseScore,
      strengths: this.getDefaultStrengths(industry, role),
      recommendations: this.getDefaultRecommendations(industry, role),
      missingKeywords: this.getDefaultMissingKeywords(industry, role),
      improvements: this.getDefaultImprovements(industry, role),
      keySkillGaps: this.getDefaultSkillGaps(industry),
      experienceLevel: baseScore > 70 ? 'mid' : 'entry',
      competitiveAdvantages: this.getCompetitiveAdvantages(industry, fieldCompatibility),
      relevanceAnalysis: this.getRelevanceAnalysis(industry, role, fieldCompatibility, baseScore),
      careerTransitionAdvice: this.getTransitionAdvice(industry, role, fieldCompatibility),
      timeToCompetitive: timeToCompetitive,
      fieldCompatibility: fieldCompatibility
    };
  }

  getCompetitiveAdvantages(industry, compatibility) {
    if (compatibility === 'high') {
      return ['Direct relevant experience', 'Industry knowledge', 'Established network', 'Proven track record'];
    } else if (compatibility === 'medium') {
      return ['Transferable skills', 'Fresh perspective', 'Strong work ethic', 'Adaptability'];
    } else {
      return ['Leadership experience', 'Problem-solving skills', 'Work ethic', 'Willingness to learn'];
    }
  }

  getRelevanceAnalysis(industry, role, compatibility, score) {
    if (compatibility === 'high') {
      return `Strong match for ${role} role. Current background aligns well with ${industry} requirements.`;
    } else if (compatibility === 'medium') {
      return `Moderate fit for ${role}. Some skills transfer to ${industry}, but additional training needed.`;
    } else {
      return `Limited relevance for ${role} in ${industry}. Significant career change required with extensive retraining.`;
    }
  }

  getTransitionAdvice(industry, role, compatibility) {
    if (compatibility === 'high') {
      return `Focus on highlighting relevant experience and staying current with ${industry} trends.`;
    } else if (compatibility === 'medium') {
      return `Emphasize transferable skills while gaining ${industry}-specific experience through courses, projects, or entry-level roles.`;
    } else {
      return `Consider extensive retraining through formal education, bootcamps, or career change programs. Start with entry-level positions to gain ${industry} experience.`;
    }
  }
}

module.exports = new AIAnalysisService(); 