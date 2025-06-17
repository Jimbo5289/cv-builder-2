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
        keywords: ['programming', 'software development', 'cloud', 'agile', 'devops', 'API', 'database', 'cybersecurity', 'machine learning', 'AI', 'data science', 'Python', 'JavaScript', 'Git', 'testing'],
        skills: ['Technical problem-solving', 'Code quality and best practices', 'Continuous learning', 'Collaboration in technical teams', 'Version control proficiency'],
        qualifications: ['Computer Science degree', 'Software engineering experience', 'Technical certifications', 'Programming language proficiency', 'Project portfolio']
      },
      healthcare: {
        keywords: ['patient care', 'medical', 'clinical', 'diagnosis', 'treatment', 'healthcare', 'EMR', 'EHR', 'HIPAA', 'patient safety', 'medical records', 'vital signs', 'patient assessment', 'care planning', 'medical terminology'],
        skills: ['Patient communication', 'Clinical decision-making', 'Empathy and compassion', 'Attention to detail', 'Emergency response', 'Team collaboration'],
        qualifications: ['Medical degree/nursing qualification', 'Clinical experience', 'Medical certifications', 'Continuing education', 'Professional licensing']
      },
      finance: {
        keywords: ['financial analysis', 'accounting', 'bookkeeping', 'budgeting', 'forecasting', 'financial reporting', 'audit', 'tax preparation', 'risk assessment', 'investment analysis', 'portfolio management', 'cash flow', 'financial statements', 'Excel', 'financial modeling'],
        skills: ['Analytical thinking', 'Attention to detail', 'Risk assessment', 'Client communication', 'Regulatory compliance', 'Financial modeling'],
        qualifications: ['Finance/Accounting degree', 'Professional certifications (CPA, CFA, etc.)', 'Financial analysis experience', 'Regulatory knowledge', 'Software proficiency']
      },
      engineering: {
        keywords: ['design', 'CAD', 'technical drawings', 'specifications', 'quality control', 'prototyping', 'testing', 'manufacturing', 'engineering analysis', 'compliance', 'problem-solving', 'product development', 'process improvement', 'technical documentation'],
        skills: ['Technical design', 'Problem-solving', 'Project management', 'Quality assurance', 'Safety compliance', 'Innovation'],
        qualifications: ['Engineering degree', 'Professional engineering license', 'Technical certifications', 'Industry experience', 'CAD software proficiency']
      },
      marketing: {
        keywords: ['marketing strategy', 'digital marketing', 'social media', 'content creation', 'SEO', 'analytics', 'campaign management', 'brand management', 'market research', 'customer acquisition', 'lead generation', 'conversion optimization'],
        skills: ['Creative thinking', 'Data analysis', 'Communication', 'Brand strategy', 'Digital literacy', 'Customer understanding'],
        qualifications: ['Marketing degree', 'Digital marketing certifications', 'Campaign experience', 'Analytics proficiency', 'Creative portfolio']
      },
      education: {
        keywords: ['teaching', 'curriculum development', 'lesson planning', 'student assessment', 'classroom management', 'educational technology', 'learning objectives', 'differentiated instruction', 'student engagement', 'professional development'],
        skills: ['Communication', 'Patience', 'Adaptability', 'Leadership', 'Creative problem-solving', 'Cultural sensitivity'],
        qualifications: ['Education degree', 'Teaching certification', 'Subject expertise', 'Classroom experience', 'Continuing education']
      }
    };

    return requirements[industry] || {
      keywords: ['leadership', 'communication', 'problem-solving', 'teamwork', 'project management'],
      skills: ['Communication', 'Leadership', 'Problem-solving', 'Adaptability', 'Time management'],
      qualifications: ['Relevant degree', 'Professional experience', 'Industry knowledge', 'Skill certifications']
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

    return `Analyze this CV specifically for a ${role} role in the ${industry} industry:

CV Content:
${cvText}

Industry Requirements:
- Key Skills: ${industryReqs.skills.join(', ')}
- Important Keywords: ${industryReqs.keywords.join(', ')}
- Typical Qualifications: ${industryReqs.qualifications.join(', ')}

Role-Specific Requirements:
- Critical Skills: ${roleReqs.specificSkills.join(', ')}
- Key Keywords: ${roleReqs.criticalKeywords.join(', ')}
- Experience Levels: ${roleReqs.seniority.join(', ')}

Please provide a detailed analysis as JSON:
{
  "score": [overall match score 1-100],
  "formatScore": [CV format/presentation score 1-100],
  "contentScore": [content relevance/quality score 1-100],
  "jobFitScore": [specific fit for this role score 1-100],
  "strengths": [array of 3-5 specific strengths for this role],
  "recommendations": [array of 3-5 role-specific improvements],
  "missingKeywords": [array of industry/role keywords missing from CV],
  "improvements": [array of 4 detailed, actionable improvement suggestions],
  "experienceLevel": "junior|mid|senior based on CV content",
  "keySkillGaps": [array of critical skills missing for this role],
  "competitiveAdvantages": [array of strengths that make candidate competitive],
  "analysis": "Brief assessment of fit for the specific role and industry"
}

Evaluate:
1. How well the CV matches the specific ${role} role requirements
2. Presence of ${industry} industry-specific keywords and experience
3. Professional formatting and presentation quality
4. Relevant skills and achievements for this career path
5. Areas for improvement to better match industry standards`;
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
        experienceLevel: parsed.experienceLevel || 'mid',
        competitiveAdvantages: Array.isArray(parsed.competitiveAdvantages) ? parsed.competitiveAdvantages.slice(0, 4) : [],
        analysis: parsed.analysis || 'Analysis completed'
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
    const baseScore = Math.floor(Math.random() * 20) + 70; // 70-90 range

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
      experienceLevel: 'mid',
      analysis: 'Mock analysis - AI service not available'
    };
  }
}

module.exports = new AIAnalysisService(); 