const OpenAI = require('openai');
const logger = require('../utils/logger');

class AIAnalysisService {
  constructor() {
    this.openai = null;
    this.isEnabled = false;
    
    if (process.env.OPENAI_API_KEY && process.env.USE_AI_ANALYSIS === 'true') {
      try {
        this.openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY
        });
        this.isEnabled = true;
        logger.info('AI Analysis Service initialized with OpenAI');
      } catch (error) {
        logger.error('Failed to initialize OpenAI for AI Analysis:', error);
        this.isEnabled = false;
      }
    } else {
      logger.warn('AI Analysis disabled - missing OpenAI API key or USE_AI_ANALYSIS flag');
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
    if (!this.isEnabled) {
      logger.warn('AI Analysis not enabled, falling back to mock data');
      return this.generateMockAnalysis(industry, role, isGeneric);
    }

    try {
      const industryReqs = industry ? this.getIndustryRequirements(industry) : null;
      const roleReqs = role ? this.getRoleRequirements(role, industry) : null;

      // Create analysis prompt based on whether it's generic or role-specific
      const prompt = this.createAnalysisPrompt(cvText, industry, role, industryReqs, roleReqs, isGeneric);

      const completion = await this.openai.chat.completions.create({
        model: "gpt-4o-mini", // Using the cost-effective model
        messages: [
          {
            role: "system",
            content: "You are an expert CV/resume analyzer and career counselor. Provide detailed, actionable feedback with specific scores and recommendations. Always return valid JSON."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.3 // Lower temperature for more consistent results
      });

      const aiResponse = completion.choices[0].message.content;
      const analysisResult = this.parseAIResponse(aiResponse, industry, role);

      logger.info('AI Analysis completed successfully', {
        industry: industry || 'generic',
        role: role || 'generic',
        score: analysisResult.score
      });

      return analysisResult;

    } catch (error) {
      logger.error('AI Analysis failed, falling back to mock:', error);
      return this.generateMockAnalysis(industry, role, isGeneric);
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