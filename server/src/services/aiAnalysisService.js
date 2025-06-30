const OpenAI = require('openai');
const Anthropic = require('@anthropic-ai/sdk');
const logger = require('../utils/logger');
const crypto = require('crypto');

class AIAnalysisService {
  constructor() {
    this.openai = null;
    this.anthropic = null;
    this.isOpenAIEnabled = false;
    this.isAnthropicEnabled = false;
    
    // Analysis result caching for identical CV content
    this.analysisCache = new Map();
    this.cacheTimeout = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    
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
        keywords: ['creative design', 'visual design', 'UI/UX', 'graphic design', 'interior design', 'fashion design', 'apparel design', 'Adobe Creative Suite', 'Photoshop', 'Illustrator', 'Figma', 'fashion illustration', 'pattern making', 'garment construction', 'textile design', 'fashion merchandising', 'trend forecasting', 'color theory', 'typography', 'composition', 'branding', 'layout', 'prototyping', 'user experience', 'aesthetic', 'portfolio', 'draping', 'sewing', 'fashion sketching', 'fashion CAD', 'sustainable fashion', 'fashion styling', 'fabric selection'],
        skills: ['Creative thinking', 'Visual communication', 'Attention to aesthetic detail', 'Client consultation', 'Project management', 'Software proficiency', 'Problem-solving through design', 'Fashion illustration', 'Pattern making', 'Textile knowledge', 'Trend analysis', 'Color theory application'],
        qualifications: ['Design degree/diploma', 'Fashion design degree', 'Portfolio of work', 'Design software certifications', 'Fashion industry experience', 'Client testimonials', 'Fashion design certifications'],
        incompatibleFields: ['emergency services', 'healthcare', 'finance', 'manufacturing', 'technology'],
        transferableFrom: ['architecture', 'art', 'marketing', 'photography', 'textiles', 'visual arts', 'retail fashion']
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
      },
      construction: {
        keywords: ['building safety', 'construction safety', 'OSHA', 'NEBOSH', 'IOSH', 'safety management', 'risk assessment', 'building regulations', 'compliance', 'safety protocols', 'incident investigation', 'safety training', 'hazard identification', 'safety audits', 'construction', 'building', 'site safety', 'scaffolding', 'fall protection', 'PPE', 'safety legislation'],
        skills: ['Safety management', 'Risk assessment', 'Regulatory compliance', 'Incident investigation', 'Safety training delivery', 'Hazard identification', 'Safety auditing', 'Communication', 'Leadership', 'Problem-solving'],
        qualifications: ['NEBOSH certification', 'IOSH Managing Safely', 'OSHA certifications', 'Construction safety qualifications', 'Building safety certifications', 'Risk management certifications', 'Professional safety memberships'],
        incompatibleFields: ['arts', 'design', 'marketing', 'retail'],
        transferableFrom: ['emergency services', 'engineering', 'healthcare', 'military', 'manufacturing', 'fire service', 'rescue services', 'health and safety']
      },
      building_safety: {
        keywords: ['building safety', 'fire safety', 'building regulations', 'building control', 'safety compliance', 'building codes', 'fire risk assessment', 'building standards', 'safety management', 'regulatory compliance', 'building inspection', 'safety audits', 'building surveying', 'construction safety', 'NEBOSH', 'IOSH', 'CDM', 'building safety manager', 'institute of fire engineers', 'IFE', 'member grade', 'graduate membership', 'fire engineering', 'fire risk assessor', 'competent person', 'building act', 'building safety act', 'golden thread', 'BSA'],
        skills: ['Building safety expertise', 'Fire safety knowledge', 'Regulatory compliance', 'Risk assessment', 'Building inspection', 'Safety management', 'Technical analysis', 'Report writing', 'Stakeholder communication', 'Fire engineering principles', 'Building safety act compliance', 'Fire risk assessment', 'Emergency evacuation planning'],
        qualifications: ['Building safety qualifications', 'Fire safety certifications', 'NEBOSH General Certificate', 'IOSH Managing Safely', 'Building control qualifications', 'Construction safety training', 'Professional memberships (IOSH, NEBOSH)', 'Institute of Fire Engineers membership', 'Member Grade IFE', 'Graduate Membership IFE', 'IFE Diploma', 'Fire Engineering qualifications', 'Fire Risk Assessment certification', 'Building Safety Act training'],
        incompatibleFields: ['arts', 'design', 'retail', 'hospitality', 'marketing'],
        transferableFrom: ['construction', 'engineering', 'emergency services', 'architecture', 'surveying', 'health and safety', 'fire service', 'rescue services', 'kent fire and rescue', 'watch manager'],
        criticalQualifications: ['institute of fire engineers', 'member grade ife', 'graduate membership ife', 'ife diploma', 'fire engineering qualification', 'fire risk assessment certification'],
        professionalBodies: ['Institute of Fire Engineers', 'Institution of Fire Engineers', 'IFE', 'IOSH', 'NEBOSH', 'CIOB', 'RICS']
      },
      safety: {
        keywords: ['safety management', 'health and safety', 'risk assessment', 'safety compliance', 'safety protocols', 'incident investigation', 'safety training', 'hazard identification', 'safety audits', 'NEBOSH', 'IOSH', 'OSHA', 'safety legislation', 'safety culture', 'occupational health', 'workplace safety'],
        skills: ['Safety management', 'Risk assessment', 'Regulatory compliance', 'Incident investigation', 'Safety training delivery', 'Hazard identification', 'Safety auditing', 'Communication', 'Leadership'],
        qualifications: ['NEBOSH certifications', 'IOSH qualifications', 'OSHA training', 'Safety management qualifications', 'Risk management certifications', 'Professional safety memberships'],
        incompatibleFields: ['arts', 'design', 'retail', 'marketing'],
        transferableFrom: ['emergency services', 'construction', 'engineering', 'healthcare', 'manufacturing', 'fire service', 'rescue services', 'military', 'police']
      },
      manufacturing: {
        keywords: ['manufacturing', 'production', 'quality control', 'lean manufacturing', 'six sigma', 'process improvement', 'supply chain', 'inventory management', 'production planning', 'equipment maintenance', 'safety protocols', 'ISO standards'],
        skills: ['Process optimization', 'Quality control', 'Production planning', 'Safety management', 'Team leadership', 'Problem-solving', 'Technical analysis', 'Equipment operation'],
        qualifications: ['Manufacturing engineering degree', 'Six Sigma certifications', 'Lean manufacturing training', 'Quality management certifications', 'Safety certifications', 'Technical skills training'],
        incompatibleFields: ['arts', 'design', 'marketing'],
        transferableFrom: ['engineering', 'construction', 'technology', 'logistics']
      },
      legal: {
        keywords: ['legal', 'law', 'litigation', 'contract law', 'corporate law', 'legal research', 'case law', 'legal writing', 'court proceedings', 'legal compliance', 'regulatory law', 'legal analysis', 'dispute resolution'],
        skills: ['Legal analysis', 'Research skills', 'Written communication', 'Critical thinking', 'Attention to detail', 'Client communication', 'Case management', 'Regulatory knowledge'],
        qualifications: ['Law degree', 'Bar admission', 'Legal certifications', 'Continuing legal education', 'Specialized law training', 'Professional legal memberships'],
        incompatibleFields: ['construction', 'manufacturing', 'arts'],
        transferableFrom: ['finance', 'business', 'government', 'compliance']
      },
      hospitality: {
        keywords: ['hospitality', 'customer service', 'hotel management', 'food service', 'guest relations', 'tourism', 'event management', 'restaurant management', 'hospitality operations', 'service excellence'],
        skills: ['Customer service', 'Communication', 'Problem-solving', 'Team management', 'Cultural sensitivity', 'Multitasking', 'Service delivery', 'Conflict resolution'],
        qualifications: ['Hospitality management degree', 'Customer service training', 'Food safety certifications', 'Hotel management qualifications', 'Tourism certifications'],
        incompatibleFields: ['engineering', 'technology', 'healthcare'],
        transferableFrom: ['retail', 'sales', 'customer service', 'event planning']
      },
      retail: {
        keywords: ['retail', 'sales', 'customer service', 'merchandising', 'inventory management', 'retail operations', 'point of sale', 'visual merchandising', 'store management', 'retail sales'],
        skills: ['Customer service', 'Sales techniques', 'Inventory management', 'Visual merchandising', 'Cash handling', 'Team coordination', 'Product knowledge', 'Communication'],
        qualifications: ['Retail management training', 'Customer service certifications', 'Sales training', 'Merchandising qualifications', 'Retail operations training'],
        incompatibleFields: ['engineering', 'healthcare', 'technology'],
        transferableFrom: ['hospitality', 'customer service', 'sales', 'marketing']
      },
      'sales-manager': {
        specificSkills: ['Sales strategy', 'Team management', 'Customer relationship management', 'Sales forecasting', 'Performance management', 'Market analysis'],
        seniority: ['Sales Executive: 0-3 years', 'Sales Manager: 3-7 years', 'Sales Director: 7+ years'],
        criticalKeywords: ['sales', 'customer', 'revenue', 'team management', 'business development']
      },
      'fashion-designer': {
        specificSkills: ['Fashion illustration', 'Garment construction', 'Pattern making', 'Textile knowledge', 'Trend analysis', 'Adobe Creative Suite', 'Fashion sketching', 'Draping', 'Sewing techniques', 'Fashion merchandising', 'Color theory', 'Fabric selection', 'Fashion history', 'Sustainable fashion'],
        seniority: ['Assistant Designer: 0-2 years', 'Designer: 2-5 years', 'Senior Designer: 5-8 years', 'Creative Director: 8+ years'],
        criticalKeywords: ['fashion design', 'apparel design', 'garment construction', 'pattern making', 'fashion illustration', 'textile design', 'trend forecasting', 'fashion merchandising', 'clothing design', 'fashion sketching', 'draping', 'fashion portfolio', 'fashion CAD', 'sustainable fashion', 'fashion styling']
      },

      // Technology roles
      'network-engineer': {
        specificSkills: ['Network configuration', 'Cisco certification', 'TCP/IP protocols', 'Network security', 'Routing and switching', 'Network monitoring', 'Troubleshooting', 'VPN configuration', 'Firewall management'],
        seniority: ['Junior Engineer: 0-2 years', 'Network Engineer: 2-5 years', 'Senior Engineer: 5+ years'],
        criticalKeywords: ['network administration', 'cisco', 'routing', 'switching', 'TCP/IP', 'network security', 'infrastructure']
      },
      'product-manager': {
        specificSkills: ['Product strategy', 'Market research', 'User experience design', 'Agile methodology', 'Stakeholder management', 'Data analysis', 'Product roadmapping', 'Cross-functional leadership'],
        seniority: ['Associate PM: 0-2 years', 'Product Manager: 2-5 years', 'Senior PM: 5+ years'],
        criticalKeywords: ['product management', 'product strategy', 'user experience', 'agile', 'product roadmap', 'market research']
      },
      'cybersecurity-analyst': {
        specificSkills: ['Security monitoring', 'Incident response', 'Vulnerability assessment', 'Security frameworks', 'Threat analysis', 'SIEM tools', 'Penetration testing', 'Security compliance'],
        seniority: ['Junior Analyst: 0-2 years', 'Security Analyst: 2-5 years', 'Senior Analyst: 5+ years'],
        criticalKeywords: ['cybersecurity', 'security analysis', 'incident response', 'vulnerability assessment', 'SIEM', 'penetration testing']
      },
      'devops-engineer': {
        specificSkills: ['CI/CD pipelines', 'Docker containerization', 'Kubernetes orchestration', 'Cloud platforms', 'Infrastructure as code', 'Monitoring tools', 'Version control', 'Automation scripting'],
        seniority: ['Junior DevOps: 0-2 years', 'DevOps Engineer: 2-5 years', 'Senior DevOps: 5+ years'],
        criticalKeywords: ['devops', 'CI/CD', 'docker', 'kubernetes', 'cloud infrastructure', 'automation', 'deployment']
      },
      'ui-ux-designer': {
        specificSkills: ['User interface design', 'User experience research', 'Prototyping', 'Wireframing', 'Design systems', 'Usability testing', 'Adobe Creative Suite', 'Figma/Sketch'],
        seniority: ['Junior Designer: 0-2 years', 'UX Designer: 2-5 years', 'Senior Designer: 5+ years'],
        criticalKeywords: ['UI/UX design', 'user experience', 'prototyping', 'wireframing', 'usability testing', 'design systems']
      },
      'cloud-architect': {
        specificSkills: ['Cloud architecture design', 'AWS/Azure/GCP', 'Microservices architecture', 'Serverless computing', 'Cloud security', 'Cost optimization', 'Migration strategies'],
        seniority: ['Cloud Engineer: 0-3 years', 'Cloud Architect: 3-7 years', 'Principal Architect: 7+ years'],
        criticalKeywords: ['cloud architecture', 'AWS', 'Azure', 'GCP', 'microservices', 'serverless', 'cloud migration']
      },

      // Healthcare roles
      'physician': {
        specificSkills: ['Medical diagnosis', 'Patient care', 'Clinical procedures', 'Medical documentation', 'Treatment planning', 'Emergency medicine', 'Evidence-based medicine'],
        seniority: ['Resident: 0-4 years', 'Attending Physician: 4-10 years', 'Senior Physician: 10+ years'],
        criticalKeywords: ['medical practice', 'patient care', 'clinical diagnosis', 'medical procedures', 'healthcare delivery']
      },
      'medical-technician': {
        specificSkills: ['Laboratory testing', 'Medical equipment operation', 'Sample analysis', 'Quality control', 'Medical terminology', 'Safety protocols'],
        seniority: ['Entry Level: 0-2 years', 'Technician: 2-5 years', 'Senior Technician: 5+ years'],
        criticalKeywords: ['medical technology', 'laboratory testing', 'medical equipment', 'clinical analysis', 'healthcare support']
      },
      'healthcare-admin': {
        specificSkills: ['Healthcare management', 'Medical billing', 'Healthcare compliance', 'Staff coordination', 'Budget management', 'Patient services'],
        seniority: ['Coordinator: 0-3 years', 'Administrator: 3-7 years', 'Director: 7+ years'],
        criticalKeywords: ['healthcare administration', 'medical management', 'healthcare operations', 'patient services', 'medical billing']
      },
      'pharmacist': {
        specificSkills: ['Pharmaceutical care', 'Drug dispensing', 'Medication therapy management', 'Clinical pharmacy', 'Drug interactions', 'Patient counseling'],
        seniority: ['Staff Pharmacist: 0-3 years', 'Clinical Pharmacist: 3-7 years', 'Pharmacy Manager: 7+ years'],
        criticalKeywords: ['pharmacy practice', 'pharmaceutical care', 'medication management', 'drug therapy', 'clinical pharmacy']
      },
      'physical-therapist': {
        specificSkills: ['Physical assessment', 'Treatment planning', 'Therapeutic exercises', 'Manual therapy', 'Patient education', 'Rehabilitation techniques'],
        seniority: ['Staff PT: 0-3 years', 'Senior PT: 3-7 years', 'Lead Therapist: 7+ years'],
        criticalKeywords: ['physical therapy', 'rehabilitation', 'therapeutic exercise', 'manual therapy', 'patient treatment']
      },
      'nutritionist': {
        specificSkills: ['Nutritional assessment', 'Diet planning', 'Nutrition education', 'Medical nutrition therapy', 'Food science', 'Health promotion'],
        seniority: ['Entry Level: 0-2 years', 'Nutritionist: 2-5 years', 'Senior Nutritionist: 5+ years'],
        criticalKeywords: ['nutrition science', 'dietetics', 'nutritional counseling', 'diet planning', 'health nutrition']
      },
      'mental-health': {
        specificSkills: ['Psychological assessment', 'Therapy techniques', 'Mental health counseling', 'Crisis intervention', 'Treatment planning', 'Case management'],
        seniority: ['Associate: 0-3 years', 'Therapist: 3-7 years', 'Senior Clinician: 7+ years'],
        criticalKeywords: ['mental health', 'psychological therapy', 'counseling', 'behavioral health', 'clinical psychology']
      },

      // Finance roles
      'accountant': {
        specificSkills: ['Financial reporting', 'Tax preparation', 'Bookkeeping', 'Audit procedures', 'Financial analysis', 'Compliance', 'Accounting software'],
        seniority: ['Staff Accountant: 0-3 years', 'Senior Accountant: 3-6 years', 'Accounting Manager: 6+ years'],
        criticalKeywords: ['accounting', 'financial reporting', 'tax preparation', 'bookkeeping', 'audit', 'financial statements']
      },
      'investment-banker': {
        specificSkills: ['Financial modeling', 'Valuation analysis', 'Mergers & acquisitions', 'Capital markets', 'Client relationships', 'Deal structuring'],
        seniority: ['Analyst: 0-2 years', 'Associate: 2-4 years', 'VP: 4-7 years', 'Director: 7+ years'],
        criticalKeywords: ['investment banking', 'financial modeling', 'mergers acquisitions', 'capital markets', 'deal structuring']
      },
      'financial-advisor': {
        specificSkills: ['Investment planning', 'Portfolio management', 'Financial planning', 'Client relationship management', 'Risk assessment', 'Retirement planning'],
        seniority: ['Junior Advisor: 0-3 years', 'Financial Advisor: 3-7 years', 'Senior Advisor: 7+ years'],
        criticalKeywords: ['financial planning', 'investment advisory', 'portfolio management', 'wealth management', 'financial consulting']
      },
      'insurance-underwriter': {
        specificSkills: ['Risk assessment', 'Policy evaluation', 'Underwriting guidelines', 'Financial analysis', 'Insurance regulations', 'Data analysis'],
        seniority: ['Junior Underwriter: 0-3 years', 'Underwriter: 3-6 years', 'Senior Underwriter: 6+ years'],
        criticalKeywords: ['insurance underwriting', 'risk assessment', 'policy evaluation', 'insurance analysis', 'underwriting']
      },
      'compliance-officer': {
        specificSkills: ['Regulatory compliance', 'Policy development', 'Risk management', 'Audit coordination', 'Training delivery', 'Compliance monitoring'],
        seniority: ['Compliance Analyst: 0-3 years', 'Compliance Officer: 3-7 years', 'Compliance Manager: 7+ years'],
        criticalKeywords: ['regulatory compliance', 'policy development', 'risk management', 'compliance monitoring', 'regulatory affairs']
      },
      'credit-analyst': {
        specificSkills: ['Credit analysis', 'Financial statement analysis', 'Risk assessment', 'Loan evaluation', 'Credit scoring', 'Industry analysis'],
        seniority: ['Junior Analyst: 0-3 years', 'Credit Analyst: 3-6 years', 'Senior Analyst: 6+ years'],
        criticalKeywords: ['credit analysis', 'financial analysis', 'risk assessment', 'loan evaluation', 'credit risk']
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

  // Role-specific requirements - now using database-driven approach
  async getRoleRequirements(role, industry) {
    const RoleRequirementsService = require('./roleRequirementsService');
    
    try {
      // Pass the existing database connection to avoid creating a new one
      const { client } = require('../config/database');
      const roleService = new RoleRequirementsService(client);
      
      const requirements = await roleService.getRoleRequirements(role);
      return requirements;
    } catch (error) {
      logger.error('Error fetching role requirements, using fallback:', error);
      return this.getFallbackRoleRequirements();
    }
  }

  // Fallback role requirements for when database fails
  getFallbackRoleRequirements() {
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
      },
      'building-safety-manager': {
        specificSkills: ['Building safety compliance', 'Fire risk assessment', 'Building regulations knowledge', 'Safety auditing', 'Incident investigation', 'Safety training delivery', 'Regulatory compliance'],
        seniority: ['Assistant: 0-2 years', 'Manager: 2-7 years', 'Senior Manager: 7+ years'],
        criticalKeywords: ['building safety', 'fire safety', 'building regulations', 'safety compliance', 'risk assessment', 'NEBOSH', 'IOSH']
      },
      'safety-manager': {
        specificSkills: ['Safety management systems', 'Risk assessment', 'Incident investigation', 'Safety training', 'Regulatory compliance', 'Safety auditing', 'Hazard identification'],
        seniority: ['Safety Officer: 0-3 years', 'Safety Manager: 3-7 years', 'Head of Safety: 7+ years'],
        criticalKeywords: ['safety management', 'risk assessment', 'NEBOSH', 'IOSH', 'safety compliance', 'health and safety']
      },
      'construction-manager': {
        specificSkills: ['Project management', 'Construction planning', 'Safety management', 'Quality control', 'Budget management', 'Team leadership', 'Regulatory compliance'],
        seniority: ['Assistant Manager: 0-3 years', 'Manager: 3-7 years', 'Senior Manager: 7+ years'],
        criticalKeywords: ['construction', 'project management', 'building', 'safety management', 'construction planning']
      },
      'fire-safety-engineer': {
        specificSkills: ['Fire safety engineering', 'Fire risk assessment', 'Fire safety systems design', 'Building regulations', 'Fire modeling', 'Safety compliance'],
        seniority: ['Graduate Engineer: 0-2 years', 'Engineer: 2-5 years', 'Senior Engineer: 5+ years'],
        criticalKeywords: ['fire safety', 'fire engineering', 'fire risk assessment', 'building safety', 'fire systems']
      },
      'health-safety-advisor': {
        specificSkills: ['Health and safety advice', 'Risk assessment', 'Policy development', 'Training delivery', 'Compliance monitoring', 'Incident investigation'],
        seniority: ['Junior Advisor: 0-2 years', 'Advisor: 2-5 years', 'Senior Advisor: 5+ years'],
        criticalKeywords: ['health and safety', 'safety advice', 'risk assessment', 'NEBOSH', 'IOSH', 'safety compliance']
      },
      'quality-manager': {
        specificSkills: ['Quality management systems', 'Process improvement', 'Quality auditing', 'ISO standards', 'Quality control', 'Team management'],
        seniority: ['Quality Officer: 0-3 years', 'Quality Manager: 3-7 years', 'Head of Quality: 7+ years'],
        criticalKeywords: ['quality management', 'quality control', 'ISO', 'quality systems', 'process improvement']
      },
      'project-manager': {
        specificSkills: ['Project planning', 'Resource management', 'Risk management', 'Stakeholder management', 'Budget control', 'Team leadership'],
        seniority: ['Junior PM: 0-2 years', 'Project Manager: 2-5 years', 'Senior PM: 5+ years'],
        criticalKeywords: ['project management', 'project planning', 'team leadership', 'budget management', 'stakeholder management']
      },
      'compliance-manager': {
        specificSkills: ['Regulatory compliance', 'Policy development', 'Compliance monitoring', 'Risk assessment', 'Audit management', 'Training delivery'],
        seniority: ['Compliance Officer: 0-3 years', 'Compliance Manager: 3-7 years', 'Head of Compliance: 7+ years'],
        criticalKeywords: ['compliance', 'regulatory', 'policy', 'audit', 'risk management']
      },
      'risk-manager': {
        specificSkills: ['Risk assessment', 'Risk management frameworks', 'Risk monitoring', 'Business continuity', 'Insurance management', 'Risk reporting'],
        seniority: ['Risk Analyst: 0-3 years', 'Risk Manager: 3-7 years', 'Chief Risk Officer: 7+ years'],
        criticalKeywords: ['risk management', 'risk assessment', 'business continuity', 'risk analysis']
      },
      'operations-manager': {
        specificSkills: ['Operations management', 'Process optimization', 'Team management', 'Performance monitoring', 'Resource planning', 'Quality assurance'],
        seniority: ['Supervisor: 0-3 years', 'Operations Manager: 3-7 years', 'Director of Operations: 7+ years'],
        criticalKeywords: ['operations', 'process management', 'team management', 'performance optimization']
      },
      'engineer': {
        specificSkills: ['Engineering design', 'Technical analysis', 'Problem-solving', 'CAD software', 'Project management', 'Quality assurance'],
        seniority: ['Graduate Engineer: 0-2 years', 'Engineer: 2-5 years', 'Senior Engineer: 5+ years'],
        criticalKeywords: ['engineering', 'design', 'technical', 'CAD', 'analysis']
      },
      'teacher': {
        specificSkills: ['Curriculum development', 'Lesson planning', 'Student assessment', 'Classroom management', 'Educational technology', 'Student engagement'],
        seniority: ['Newly Qualified Teacher: 0-2 years', 'Teacher: 2-5 years', 'Senior Teacher: 5+ years'],
        criticalKeywords: ['teaching', 'education', 'curriculum', 'student', 'classroom']
      },
      'sales-manager': {
        specificSkills: ['Sales strategy', 'Team management', 'Customer relationship management', 'Sales forecasting', 'Performance management', 'Market analysis'],
        seniority: ['Sales Executive: 0-3 years', 'Sales Manager: 3-7 years', 'Sales Director: 7+ years'],
        criticalKeywords: ['sales', 'customer', 'revenue', 'team management', 'business development']
      },
      'fashion-designer': {
        specificSkills: ['Fashion illustration', 'Garment construction', 'Pattern making', 'Textile knowledge', 'Trend analysis', 'Adobe Creative Suite', 'Fashion sketching', 'Draping', 'Sewing techniques', 'Fashion merchandising', 'Color theory', 'Fabric selection', 'Fashion history', 'Sustainable fashion'],
        seniority: ['Assistant Designer: 0-2 years', 'Designer: 2-5 years', 'Senior Designer: 5-8 years', 'Creative Director: 8+ years'],
        criticalKeywords: ['fashion design', 'apparel design', 'garment construction', 'pattern making', 'fashion illustration', 'textile design', 'trend forecasting', 'fashion merchandising', 'clothing design', 'fashion sketching', 'draping', 'fashion portfolio', 'fashion CAD', 'sustainable fashion', 'fashion styling']
      },

      // Technology roles
      'network-engineer': {
        specificSkills: ['Network configuration', 'Cisco certification', 'TCP/IP protocols', 'Network security', 'Routing and switching', 'Network monitoring', 'Troubleshooting', 'VPN configuration', 'Firewall management'],
        seniority: ['Junior Engineer: 0-2 years', 'Network Engineer: 2-5 years', 'Senior Engineer: 5+ years'],
        criticalKeywords: ['network administration', 'cisco', 'routing', 'switching', 'TCP/IP', 'network security', 'infrastructure']
      },
      'product-manager': {
        specificSkills: ['Product strategy', 'Market research', 'User experience design', 'Agile methodology', 'Stakeholder management', 'Data analysis', 'Product roadmapping', 'Cross-functional leadership'],
        seniority: ['Associate PM: 0-2 years', 'Product Manager: 2-5 years', 'Senior PM: 5+ years'],
        criticalKeywords: ['product management', 'product strategy', 'user experience', 'agile', 'product roadmap', 'market research']
      },
      'cybersecurity-analyst': {
        specificSkills: ['Security monitoring', 'Incident response', 'Vulnerability assessment', 'Security frameworks', 'Threat analysis', 'SIEM tools', 'Penetration testing', 'Security compliance'],
        seniority: ['Junior Analyst: 0-2 years', 'Security Analyst: 2-5 years', 'Senior Analyst: 5+ years'],
        criticalKeywords: ['cybersecurity', 'security analysis', 'incident response', 'vulnerability assessment', 'SIEM', 'penetration testing']
      },
      'devops-engineer': {
        specificSkills: ['CI/CD pipelines', 'Docker containerization', 'Kubernetes orchestration', 'Cloud platforms', 'Infrastructure as code', 'Monitoring tools', 'Version control', 'Automation scripting'],
        seniority: ['Junior DevOps: 0-2 years', 'DevOps Engineer: 2-5 years', 'Senior DevOps: 5+ years'],
        criticalKeywords: ['devops', 'CI/CD', 'docker', 'kubernetes', 'cloud infrastructure', 'automation', 'deployment']
      },
      'ui-ux-designer': {
        specificSkills: ['User interface design', 'User experience research', 'Prototyping', 'Wireframing', 'Design systems', 'Usability testing', 'Adobe Creative Suite', 'Figma/Sketch'],
        seniority: ['Junior Designer: 0-2 years', 'UX Designer: 2-5 years', 'Senior Designer: 5+ years'],
        criticalKeywords: ['UI/UX design', 'user experience', 'prototyping', 'wireframing', 'usability testing', 'design systems']
      },
      'cloud-architect': {
        specificSkills: ['Cloud architecture design', 'AWS/Azure/GCP', 'Microservices architecture', 'Serverless computing', 'Cloud security', 'Cost optimization', 'Migration strategies'],
        seniority: ['Cloud Engineer: 0-3 years', 'Cloud Architect: 3-7 years', 'Principal Architect: 7+ years'],
        criticalKeywords: ['cloud architecture', 'AWS', 'Azure', 'GCP', 'microservices', 'serverless', 'cloud migration']
      },

      // Healthcare roles
      'physician': {
        specificSkills: ['Medical diagnosis', 'Patient care', 'Clinical procedures', 'Medical documentation', 'Treatment planning', 'Emergency medicine', 'Evidence-based medicine'],
        seniority: ['Resident: 0-4 years', 'Attending Physician: 4-10 years', 'Senior Physician: 10+ years'],
        criticalKeywords: ['medical practice', 'patient care', 'clinical diagnosis', 'medical procedures', 'healthcare delivery']
      },
      'medical-technician': {
        specificSkills: ['Laboratory testing', 'Medical equipment operation', 'Sample analysis', 'Quality control', 'Medical terminology', 'Safety protocols'],
        seniority: ['Entry Level: 0-2 years', 'Technician: 2-5 years', 'Senior Technician: 5+ years'],
        criticalKeywords: ['medical technology', 'laboratory testing', 'medical equipment', 'clinical analysis', 'healthcare support']
      },
      'healthcare-admin': {
        specificSkills: ['Healthcare management', 'Medical billing', 'Healthcare compliance', 'Staff coordination', 'Budget management', 'Patient services'],
        seniority: ['Coordinator: 0-3 years', 'Administrator: 3-7 years', 'Director: 7+ years'],
        criticalKeywords: ['healthcare administration', 'medical management', 'healthcare operations', 'patient services', 'medical billing']
      },
      'pharmacist': {
        specificSkills: ['Pharmaceutical care', 'Drug dispensing', 'Medication therapy management', 'Clinical pharmacy', 'Drug interactions', 'Patient counseling'],
        seniority: ['Staff Pharmacist: 0-3 years', 'Clinical Pharmacist: 3-7 years', 'Pharmacy Manager: 7+ years'],
        criticalKeywords: ['pharmacy practice', 'pharmaceutical care', 'medication management', 'drug therapy', 'clinical pharmacy']
      },
      'physical-therapist': {
        specificSkills: ['Physical assessment', 'Treatment planning', 'Therapeutic exercises', 'Manual therapy', 'Patient education', 'Rehabilitation techniques'],
        seniority: ['Staff PT: 0-3 years', 'Senior PT: 3-7 years', 'Lead Therapist: 7+ years'],
        criticalKeywords: ['physical therapy', 'rehabilitation', 'therapeutic exercise', 'manual therapy', 'patient treatment']
      },
      'nutritionist': {
        specificSkills: ['Nutritional assessment', 'Diet planning', 'Nutrition education', 'Medical nutrition therapy', 'Food science', 'Health promotion'],
        seniority: ['Entry Level: 0-2 years', 'Nutritionist: 2-5 years', 'Senior Nutritionist: 5+ years'],
        criticalKeywords: ['nutrition science', 'dietetics', 'nutritional counseling', 'diet planning', 'health nutrition']
      },
      'mental-health': {
        specificSkills: ['Psychological assessment', 'Therapy techniques', 'Mental health counseling', 'Crisis intervention', 'Treatment planning', 'Case management'],
        seniority: ['Associate: 0-3 years', 'Therapist: 3-7 years', 'Senior Clinician: 7+ years'],
        criticalKeywords: ['mental health', 'psychological therapy', 'counseling', 'behavioral health', 'clinical psychology']
      },

      // Finance roles
      'accountant': {
        specificSkills: ['Financial reporting', 'Tax preparation', 'Bookkeeping', 'Audit procedures', 'Financial analysis', 'Compliance', 'Accounting software'],
        seniority: ['Staff Accountant: 0-3 years', 'Senior Accountant: 3-6 years', 'Accounting Manager: 6+ years'],
        criticalKeywords: ['accounting', 'financial reporting', 'tax preparation', 'bookkeeping', 'audit', 'financial statements']
      },
      'investment-banker': {
        specificSkills: ['Financial modeling', 'Valuation analysis', 'Mergers & acquisitions', 'Capital markets', 'Client relationships', 'Deal structuring'],
        seniority: ['Analyst: 0-2 years', 'Associate: 2-4 years', 'VP: 4-7 years', 'Director: 7+ years'],
        criticalKeywords: ['investment banking', 'financial modeling', 'mergers acquisitions', 'capital markets', 'deal structuring']
      },
      'financial-advisor': {
        specificSkills: ['Investment planning', 'Portfolio management', 'Financial planning', 'Client relationship management', 'Risk assessment', 'Retirement planning'],
        seniority: ['Junior Advisor: 0-3 years', 'Financial Advisor: 3-7 years', 'Senior Advisor: 7+ years'],
        criticalKeywords: ['financial planning', 'investment advisory', 'portfolio management', 'wealth management', 'financial consulting']
      },
      'insurance-underwriter': {
        specificSkills: ['Risk assessment', 'Policy evaluation', 'Underwriting guidelines', 'Financial analysis', 'Insurance regulations', 'Data analysis'],
        seniority: ['Junior Underwriter: 0-3 years', 'Underwriter: 3-6 years', 'Senior Underwriter: 6+ years'],
        criticalKeywords: ['insurance underwriting', 'risk assessment', 'policy evaluation', 'insurance analysis', 'underwriting']
      },
      'compliance-officer': {
        specificSkills: ['Regulatory compliance', 'Policy development', 'Risk management', 'Audit coordination', 'Training delivery', 'Compliance monitoring'],
        seniority: ['Compliance Analyst: 0-3 years', 'Compliance Officer: 3-7 years', 'Compliance Manager: 7+ years'],
        criticalKeywords: ['regulatory compliance', 'policy development', 'risk management', 'compliance monitoring', 'regulatory affairs']
      },
      'credit-analyst': {
        specificSkills: ['Credit analysis', 'Financial statement analysis', 'Risk assessment', 'Loan evaluation', 'Credit scoring', 'Industry analysis'],
        seniority: ['Junior Analyst: 0-3 years', 'Credit Analyst: 3-6 years', 'Senior Analyst: 6+ years'],
        criticalKeywords: ['credit analysis', 'financial analysis', 'risk assessment', 'loan evaluation', 'credit risk']
      }
    };

    return roleRequirements[role] || {
      specificSkills: ['Role-specific expertise', 'Industry knowledge', 'Professional competencies'],
      seniority: ['Entry: 0-2 years', 'Mid: 2-5 years', 'Senior: 5+ years'],
      criticalKeywords: ['professional', 'experience', 'skills', 'qualifications']
    };
  }

  // Generate hash for caching identical CV analyses
  generateCVHash(cvText, industry, role, jobDescription) {
    const content = cvText + (industry || '') + (role || '') + (jobDescription || '');
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  // Check and clean expired cache entries
  cleanExpiredCache() {
    const now = Date.now();
    for (const [hash, entry] of this.analysisCache.entries()) {
      if (now - entry.timestamp > this.cacheTimeout) {
        this.analysisCache.delete(hash);
      }
    }
  }

  // Main analysis method - Universal approach
  async analyzeCV(cvText, industry = null, role = null, isGeneric = false, jobDescription = null) {
    const startTime = Date.now(); // Track processing time
    
    try {
      // Generate hash for this analysis request
      const cvHash = this.generateCVHash(cvText, industry, role, jobDescription);
      
      // Check cache first
      this.cleanExpiredCache();
      if (this.analysisCache.has(cvHash)) {
        const cachedResult = this.analysisCache.get(cvHash);
        const ageMinutes = Math.round((Date.now() - cachedResult.timestamp) / 1000 / 60);
        logger.info('Returning cached analysis result', { 
          hash: cvHash.substring(0, 8),
          age: ageMinutes + ' minutes'
        });
        
        // Mark result as from cache
        const result = { ...cachedResult.result };
        if (result.analysisMetadata) {
          result.analysisMetadata.fromCache = true;
          result.analysisMetadata.cacheAge = ageMinutes;
        }
        
        return result;
      }
      
      logger.info('Starting universal CV analysis', { industry, role, isGeneric });
      
      // Step 1: Parse CV content universally
      const cvData = this.parseCV(cvText);
      
      // Step 2: Parse job requirements
      let jobData;
      let analysisType = 'generic';
      if (jobDescription) {
        jobData = this.parseJobDescription(jobDescription);
        industry = jobData.industry || industry || 'general';
        role = jobData.role || role || 'general';
        analysisType = 'job';
      } else if (!isGeneric && role && industry) {
        analysisType = 'role';
        // Create job data from industry/role parameters
        if (!industry) {
          industry = cvData.currentField || this.detectCurrentField(cvText) || 'general';
        }
        if (!role) {
          role = 'general';
        }
        
        const industryReqs = this.getIndustryRequirements(industry);
        const roleReqs = await this.getRoleRequirements(role, industry);
        
        jobData = {
          industry,
          role,
          requiredSkills: roleReqs.specificSkills || industryReqs.keywords.slice(0, 8),
          qualifications: industryReqs.qualifications.slice(0, 5),
          keywords: industryReqs.keywords.slice(0, 12),
          experience: [3], // Default 3 years requirement
          seniority: 'mid',
          responsibilities: []
        };
      } else {
        analysisType = 'generic';
        if (!industry) {
          industry = cvData.currentField || this.detectCurrentField(cvText) || 'general';
        }
        if (!role) {
          role = 'general';
        }
        
        const industryReqs = this.getIndustryRequirements(industry);
        const roleReqs = await this.getRoleRequirements(role, industry);
        
        jobData = {
          industry,
          role,
          requiredSkills: roleReqs.specificSkills || industryReqs.keywords.slice(0, 8),
          qualifications: industryReqs.qualifications.slice(0, 5),
          keywords: industryReqs.keywords.slice(0, 12),
          experience: [3],
          seniority: 'mid',
          responsibilities: []
        };
      }

      // Step 3: Perform universal algorithmic matching
      const universalMatch = this.performUniversalMatch(cvData, jobData);
      
      // Step 4: Enhance with AI analysis if available
      let aiResults = null;
      if (this.isOpenAIEnabled || this.isAnthropicEnabled) {
        try {
          logger.info('Running AI enhancement analysis');
          const industryReqs = this.getIndustryRequirements(industry);
          const roleReqs = await this.getRoleRequirements(role, industry);
          aiResults = await this.runMultiModelAnalysis(cvText, industry, role, industryReqs, roleReqs, isGeneric);
        } catch (error) {
          logger.warn('AI enhancement failed, using algorithmic results only:', error);
        }
      }
      
      // Step 5: Combine algorithmic and AI results
      const finalResult = this.combineUniversalAndAIResults(universalMatch, aiResults, cvData, jobData);
      
      logger.info('Universal CV analysis completed', {
        industry,
        role,
        matchType: universalMatch.matchType,
        careerStage: universalMatch.careerStage,
        score: finalResult.score,
        aiEnhanced: !!aiResults
      });
      
      // REVOLUTIONARY: Add comprehensive personalized insights
      finalResult.personalizedFeedback = this.generatePersonalizedFeedback(cvData, jobData, universalMatch);
      finalResult.dynamicCourseRecommendations = this.generateDynamicCourseRecommendations(cvData, jobData, universalMatch.gapAreas);
      
      // Always generate detailed improvements, tailored to analysis type
      try {
        finalResult.detailedImprovements = await this.generateDetailedImprovements(cvText, industry, role, analysisType, jobDescription);
        logger.info('Generated detailed improvements', { count: finalResult.detailedImprovements.length, analysisType });
      } catch (error) {
        logger.warn('Failed to generate detailed improvements:', error);
        finalResult.detailedImprovements = [];
      }
      
      // Enhanced metadata with deep insights
      finalResult.analysisMetadata = {
        analysisVersion: '4.0-Revolutionary',
        confidenceScore: this.calculateConfidenceScore(universalMatch, cvData, jobData),
        matchType: universalMatch.matchType,
        careerStage: universalMatch.careerStage,
        cvQualityScore: this.calculateContentScore(cvData),
        atsCompliance: this.calculateATSCompliance(cvData),
        processingTime: Date.now() - startTime,
        aiEnhanced: !!aiResults,
        fromCache: false,
        hasDetailedImprovements: finalResult.detailedImprovements?.length > 0 || false
      };

      // Cache the result for future identical requests
      this.analysisCache.set(cvHash, {
        result: finalResult,
        timestamp: Date.now()
      });

      logger.info('Analysis completed and cached', { 
        hash: cvHash.substring(0, 8),
        score: finalResult.score,
        processingTime: finalResult.analysisMetadata.processingTime + 'ms'
      });

      return finalResult;

    } catch (error) {
      logger.error('Universal CV analysis failed:', error);
      return this.generateFallbackAnalysis(cvText, industry, role);
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
      'emergency_services': [
        'fire', 'rescue', 'ambulance', 'paramedic', 'emt', 'emergency response', 'firefighter',
        'kent fire', 'fire service', 'fire brigade', 'watch manager', 'station manager',
        'emergency medical', 'first aid', 'crisis management', 'incident command', 'fire safety',
        'building safety', 'fire risk assessment', 'IOSH', 'NEBOSH', 'health and safety',
        'fire prevention', 'fire protection', 'emergency care', 'rescue operations'
      ],
      'building_safety': [
        'building safety', 'fire safety', 'building regulations', 'building control', 'construction safety',
        'IOSH', 'NEBOSH', 'fire risk assessment', 'building codes', 'safety management',
        'building inspection', 'regulatory compliance', 'CDM', 'building standards'
      ],
      'healthcare': ['nurse', 'doctor', 'medical', 'patient care', 'clinical', 'hospital', 'healthcare'],
      'technology': ['software', 'programming', 'developer', 'code', 'technical', 'IT', 'javascript', 'python'],
      'education': ['teacher', 'teaching', 'education', 'classroom', 'student', 'curriculum'],
      'finance': ['accounting', 'financial', 'banking', 'audit', 'investment', 'finance'],
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

    return maxScore > 20 ? detectedField : 'unknown';
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
      temperature: 0.0,  // Changed from 0.3 to 0.0 for deterministic results
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
      temperature: 0.0  // Changed from 0.3 to 0.0 for deterministic results
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
      fieldCompatibility: compatibilityCheck?.compatibility || 'medium',
      confidence: confidence,
      analysisQuality: confidence > 80 ? 'high' : confidence > 60 ? 'medium' : 'low',
      modelsUsed: analyses.map(a => a.source)
    };

    return this.validateWithCompatibility(consensusResult, compatibilityCheck, industry, role);
  }

  // Validate AI results against hard compatibility rules
  validateWithCompatibility(result, compatibilityCheck, industry, role) {
    if (!compatibilityCheck) {
      return result; // Skip validation if no compatibility check available
    }
    
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
    if (!compatibilityCheck) {
      return analysis || 'CV analysis completed';
    }
    return `${analysis} (Compatibility: ${compatibilityCheck.compatibility}, Keyword Match: ${compatibilityCheck.keywordScore}%)`;
  }

  createConsensusTransitionAdvice(analyses, compatibilityCheck) {
    if (!compatibilityCheck) {
      return analyses[0]?.careerTransitionAdvice || 'Focus on developing relevant skills and experience for your target role';
    }
    
    if (compatibilityCheck.compatibility === 'low') {
      return 'Significant career change required. Consider formal education, bootcamps, or extensive retraining programs. Start with entry-level positions to gain industry experience.';
    } else if (compatibilityCheck.compatibility === 'medium') {
      return 'Focus on transferable skills while gaining industry-specific experience through courses, projects, or internships.';
    } else {
      return 'Leverage existing relevant experience. Focus on highlighting transferable skills and staying current with industry trends.';
    }
  }

  determineConsensusTimeframe(analyses, compatibilityCheck) {
    if (!compatibilityCheck) {
      return analyses[0]?.timeToCompetitive || '6-12 months';
    }
    
    switch (compatibilityCheck.compatibility) {
      case 'high': return '3-6 months';
      case 'medium': return '1-2 years';
      case 'low': return '3-5 years';
      default: return '1-2 years';
    }
  }

  createAnalysisPrompt(cvText, industry, role, industryReqs, roleReqs, isGeneric) {
    if (isGeneric) {
      return `Analyze this CV using professional ATS scoring criteria:

CV Content:
${cvText}

Perform comprehensive ATS analysis with the following structure:
{
  "score": [number 1-100 based on ATS compliance],
  "formatScore": [formatting and readability 1-100],
  "contentScore": [content quality and relevance 1-100],
  "atsCompliance": [ATS system compatibility 1-100],
  "strengths": [array of 3-5 specific strengths],
  "recommendations": [array of 3-5 specific improvements],
  "missingKeywords": [array of important keywords/skills missing],
  "improvements": [array of 4 detailed improvement suggestions],
  "analysis": "Brief overall assessment"
}

Focus on:
- ATS keyword optimization
- Quantified achievements
- Skills-experience alignment
- Professional formatting
- Industry-standard terminology`;
    }

    return `ADVANCED CV-JOB MATCHING ANALYSIS

You are an expert ATS system and career matching specialist. Perform a comprehensive analysis comparing this CV against the specific role requirements.

CV CONTENT:
${cvText}

TARGET ROLE: ${role} in ${industry}

STEP 1 - JOB REQUIREMENT EXTRACTION:
Extract and analyze these critical elements:
- Essential technical skills: ${roleReqs.specificSkills.join(', ')}
- Required keywords: ${roleReqs.criticalKeywords.join(', ')}
- Industry-specific terms: ${industryReqs.keywords.slice(0, 10).join(', ')}
- Typical qualifications: ${industryReqs.qualifications.slice(0, 5).join(', ')}

STEP 2 - CV CONTENT ANALYSIS:
Analyze the CV for:
1. Relevant work experience and achievements
2. Technical skills and certifications
3. Educational background alignment
4. Quantified accomplishments
5. Industry-specific terminology usage
6. Leadership and management experience
7. Problem-solving examples
8. Career progression evidence

STEP 3 - COMPATIBILITY ASSESSMENT:
- Fields highly compatible: ${industryReqs.transferableFrom.join(', ')}
- Fields with challenges: ${industryReqs.incompatibleFields.join(', ')}
- Career transition feasibility
- Skill transferability analysis
- Experience relevance evaluation

STEP 4 - ATS SCORING CRITERIA:
Apply professional ATS scoring (1-100):
- 90-100: Perfect match, immediate hire candidate
- 80-89: Strong match, minor gaps only
- 70-79: Good match, some development needed
- 60-69: Moderate match, significant gaps to address
- 50-59: Weak match, major reskilling required
- 40-49: Poor match, extensive career change needed
- 1-39: No match, completely different field

CRITICAL: For Building Safety roles, specifically check for:
- Institute of Fire Engineers membership (Member Grade IFE, Graduate Membership IFE)
- IFE Diploma in Fire Engineering
- Fire Risk Assessment qualifications
- Building Safety Act knowledge
- Fire engineering expertise
- Professional body memberships (IFE, IOSH, NEBOSH)

MISSING IFE QUALIFICATION = MAJOR SCORING IMPACT for Building Safety roles

STEP 5 - REALISTIC SCORING GUIDELINES:
- Emergency services → Building safety: 85-95 (fire safety expertise transfers directly)
- Emergency services → Healthcare: 75-85 (emergency medical experience)
- Fire service → Construction safety: 80-90 (safety management expertise)
- Teaching → Software development: 25-35 (no technical background)
- Finance → Marketing: 45-55 (analytical skills transfer)
- Engineering → Construction: 80-90 (highly relevant technical skills)
- Retail → Healthcare: 35-45 (customer service transfers, no medical knowledge)
- Manufacturing → Engineering: 70-80 (technical knowledge transfers)

CRITICAL EMERGENCY SERVICES TRANSFERABILITY:
When analyzing Emergency Services CVs (fire, rescue, ambulance, paramedic):
- Fire safety experience = HIGHLY RELEVANT to building safety roles (85-95 score)
- IOSH/NEBOSH qualifications = PERFECT for safety management roles 
- Risk assessment skills = DIRECTLY applicable to building safety
- Emergency response = VALUABLE for crisis management roles
- Leadership in high-pressure situations = EXCELLENT for management roles

DO NOT UNDERESTIMATE EMERGENCY SERVICES EXPERIENCE:
- Fire officers understand building safety better than most
- Emergency services training includes safety protocols and risk assessment
- Watch Managers have proven leadership and crisis management skills
- Fire Risk Assessment experience is DIRECTLY relevant to building safety

CRITICAL INSTRUCTIONS FOR THOROUGH ANALYSIS:
1. DEEP CONTENT ANALYSIS: Analyze EVERY detail in the CV against EVERY requirement in the job description
2. NO GENERIC RESPONSES: Every recommendation must be specific to THIS CV and THIS job
3. COMPREHENSIVE SKILL MAPPING: Map each CV skill/experience to specific job requirements
4. DETAILED GAP ANALYSIS: Identify exactly what's missing and why it matters for this role
5. SPECIFIC IMPROVEMENT ACTIONS: Provide precise steps tailored to this person's background
6. PROFESSIONAL QUALIFICATION AUDIT: Check for ALL industry-specific certifications/memberships
7. TRANSFERABILITY ASSESSMENT: Explain HOW skills transfer and WHY they're relevant
8. QUANTIFIED SCORING: Base scores on actual alignment, not CV formatting
9. PERSONALIZED NEXT STEPS: Create development path specific to this career transition
10. INDUSTRY-SPECIFIC FEEDBACK: Use terminology and requirements specific to the target field

FOR ANY ROLE/INDUSTRY COMBINATION:
- Research the specific requirements of THIS exact role
- Identify the critical qualifications/certifications for THIS field
- Assess experience relevance in context of THIS industry
- Provide career pathway advice specific to THIS transition
- Flag missing credentials that are essential for THIS role
- Recommend courses/certifications that directly address THIS person's gaps

SCORING MUST REFLECT ACTUAL JOB FIT:
- 90-100: CV demonstrates almost all required qualifications/experience
- 80-89: Strong relevant background with minor gaps in specific areas
- 70-79: Good transferable experience but missing key qualifications
- 60-69: Some relevant skills but significant gaps in requirements
- 50-59: Limited relevance, major reskilling/qualification needed
- Below 50: Poor fit requiring fundamental career change

Provide comprehensive JSON analysis:
{
  "score": [HONEST ATS-style score 1-100 for this specific role],
  "formatScore": [CV formatting and ATS compatibility 1-100],
  "contentScore": [Content quality and structure 1-100],
  "jobFitScore": [Specific relevance to ${role} role 1-100],
  "atsCompliance": [Keyword optimization and ATS readability 1-100],
  "experienceRelevance": [How relevant is their experience 1-100],
  "skillsAlignment": [How well skills match requirements 1-100],
  "qualificationMatch": [Education/certification alignment 1-100],
  
  "strengths": [3-5 genuine strengths for THIS specific role],
  "recommendations": [3-5 specific actions to improve candidacy for THIS role],
  "missingKeywords": [critical keywords absent from CV that THIS role requires],
  "missingSkills": [essential skills not demonstrated for THIS role],
  "improvements": [4 detailed, actionable improvement steps for THIS role],
  
  "experienceLevel": "entry|junior|mid|senior for THIS specific role",
  "careerStage": "career-changer|early-career|experienced|senior-professional",
  "keySkillGaps": [most critical skills missing for success in THIS role],
  "competitiveAdvantages": [unique strengths that could help in THIS role],
  
  "relevanceAnalysis": "Detailed assessment of background fit for ${role}",
  "transferableSkills": [skills from their background that apply to THIS role],
  "careerTransitionAdvice": "Specific advice for transitioning to THIS role",
  "timeToCompetitive": "Realistic timeframe to become competitive (e.g., '3-6 months', '1-2 years', '3+ years')",
  "fieldCompatibility": "high|medium|low compatibility with THIS specific role",
  
  "atsOptimization": {
    "keywordDensity": "low|medium|high for THIS role",
    "missingAtsKeywords": [keywords needed for ATS systems in THIS field],
    "formatIssues": [specific formatting problems for ATS systems],
    "optimizationTips": [specific advice for ATS optimization in THIS field]
  },
  
  "developmentPriorities": [top 3 areas to focus development for THIS role],
  "certificationRecommendations": [specific certifications that would help for THIS role],
  "nextSteps": [immediate actionable steps to improve candidacy]
}

Remember: Score realistically based on actual job requirements. A career changer should typically score 30-60 until they develop relevant skills.`;
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
        atsCompliance: this.validateScore(parsed.atsCompliance || parsed.formatScore),
        experienceRelevance: this.validateScore(parsed.experienceRelevance || parsed.score),
        skillsAlignment: this.validateScore(parsed.skillsAlignment || parsed.score),
        qualificationMatch: this.validateScore(parsed.qualificationMatch || parsed.contentScore),
        
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths.slice(0, 5) : this.getDefaultStrengths(industry, role),
        recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations.slice(0, 5) : this.getDefaultRecommendations(industry, role),
        missingKeywords: Array.isArray(parsed.missingKeywords) ? parsed.missingKeywords.slice(0, 8) : this.getDefaultMissingKeywords(industry, role),
        missingSkills: Array.isArray(parsed.missingSkills) ? parsed.missingSkills.slice(0, 6) : this.getDefaultSkillGaps(industry),
        improvements: Array.isArray(parsed.improvements) ? parsed.improvements.slice(0, 4) : this.getDefaultImprovements(industry, role),
        
        experienceLevel: parsed.experienceLevel || 'entry',
        careerStage: parsed.careerStage || 'early-career',
        keySkillGaps: Array.isArray(parsed.keySkillGaps) ? parsed.keySkillGaps.slice(0, 6) : this.getDefaultSkillGaps(industry),
        competitiveAdvantages: Array.isArray(parsed.competitiveAdvantages) ? parsed.competitiveAdvantages.slice(0, 4) : [],
        
        relevanceAnalysis: parsed.relevanceAnalysis || parsed.analysis || 'Analysis completed',
        transferableSkills: Array.isArray(parsed.transferableSkills) ? parsed.transferableSkills.slice(0, 5) : [],
        careerTransitionAdvice: parsed.careerTransitionAdvice || 'Consider developing relevant skills for this field',
        timeToCompetitive: parsed.timeToCompetitive || 'Varies based on current skills',
        fieldCompatibility: parsed.fieldCompatibility || 'medium',
        
        atsOptimization: {
          keywordDensity: parsed.atsOptimization?.keywordDensity || 'medium',
          missingAtsKeywords: Array.isArray(parsed.atsOptimization?.missingAtsKeywords) ? parsed.atsOptimization.missingAtsKeywords.slice(0, 6) : [],
          formatIssues: Array.isArray(parsed.atsOptimization?.formatIssues) ? parsed.atsOptimization.formatIssues.slice(0, 4) : [],
          optimizationTips: Array.isArray(parsed.atsOptimization?.optimizationTips) ? parsed.atsOptimization.optimizationTips.slice(0, 4) : []
        },
        
        developmentPriorities: Array.isArray(parsed.developmentPriorities) ? parsed.developmentPriorities.slice(0, 3) : [],
        certificationRecommendations: Array.isArray(parsed.certificationRecommendations) ? parsed.certificationRecommendations.slice(0, 4) : [],
        nextSteps: Array.isArray(parsed.nextSteps) ? parsed.nextSteps.slice(0, 4) : []
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
    if (industry === 'building_safety' || industry === 'construction' || industry === 'safety') {
      return ['Highlight NEBOSH/IOSH certifications', 'Include specific safety management achievements', 'Add risk assessment experience', 'Quantify safety improvements and compliance results'];
    }
    if (industry === 'engineering') {
      return ['Include CAD software proficiency', 'Highlight technical project results', 'Add engineering certifications and licenses'];
    }
    if (industry === 'education') {
      return ['Include curriculum development experience', 'Highlight student achievement outcomes', 'Add educational technology skills'];
    }
    if (industry === 'marketing') {
      return ['Include digital marketing metrics and results', 'Highlight campaign performance data', 'Add marketing software proficiency'];
    }
    if (industry === 'sales') {
      return ['Quantify sales achievements and targets met', 'Include CRM software experience', 'Highlight customer relationship successes'];
    }
    if (industry === 'manufacturing') {
      return ['Include Lean/Six Sigma certifications', 'Highlight process improvement results', 'Add quality control achievements'];
    }
    if (industry === 'legal') {
      return ['Include bar admissions and legal certifications', 'Highlight case management experience', 'Add specialized legal area expertise'];
    }
    if (industry === 'design' && (role === 'fashion-designer' || role?.includes('fashion'))) {
      return ['Showcase fashion design portfolio with diverse projects', 'Include specific fashion software proficiency (Adobe Illustrator, CLO 3D, Gerber)', 'Highlight trend forecasting and market research experience', 'Add fashion industry internships and collaborations', 'Quantify design project outcomes and commercial success'];
    }
    if (industry === 'design') {
      return ['Include design software proficiency prominently', 'Showcase portfolio with diverse project examples', 'Highlight client collaboration and project outcomes'];
    }
    if (industry === 'hospitality') {
      return ['Include customer service metrics', 'Highlight guest satisfaction scores', 'Add hospitality management experience'];
    }
    if (industry === 'retail') {
      return ['Include sales performance metrics', 'Highlight inventory management experience', 'Add customer service achievements'];
    }
    return ['Add more quantifiable achievements', 'Include relevant certifications', 'Strengthen skills section'];
  }

  getDefaultMissingKeywords(industry, role) {
    if (industry === 'building_safety' || industry === 'construction' || industry === 'safety') {
      return ['NEBOSH', 'IOSH', 'risk assessment', 'building safety', 'safety management', 'compliance', 'incident investigation', 'safety audits'];
    }
    if (industry === 'technology') {
      return ['programming', 'software development', 'cloud computing', 'agile', 'devops'];
    }
    if (industry === 'healthcare') {
      return ['patient care', 'clinical experience', 'medical terminology', 'healthcare protocols'];
    }
    if (industry === 'finance') {
      return ['financial analysis', 'Excel', 'financial modeling', 'risk assessment'];
    }
    if (industry === 'engineering') {
      return ['CAD', 'technical design', 'engineering analysis', 'project management'];
    }
    if (industry === 'education') {
      return ['curriculum development', 'lesson planning', 'student assessment', 'classroom management'];
    }
    if (industry === 'marketing') {
      return ['digital marketing', 'SEO', 'analytics', 'campaign management'];
    }
    if (industry === 'sales') {
      return ['CRM', 'sales targets', 'customer relationships', 'lead generation'];
    }
    if (industry === 'manufacturing') {
      return ['quality control', 'lean manufacturing', 'process improvement', 'ISO standards'];
    }
    if (industry === 'legal') {
      return ['legal research', 'case law', 'litigation', 'regulatory compliance'];
    }
    if (industry === 'hospitality') {
      return ['customer service', 'guest relations', 'hospitality operations', 'service excellence'];
    }
    if (industry === 'retail') {
      return ['retail operations', 'merchandising', 'inventory management', 'sales techniques'];
    }
    return ['leadership', 'project management', 'communication', 'problem-solving'];
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

  generateMockAnalysis(industry, role, _isGeneric = false) {
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

  // Advanced job description parsing - handles ANY job description format
  parseJobDescription(jobDescription) {
    if (!jobDescription || typeof jobDescription !== 'string') {
      return {
        requiredSkills: [],
        preferredSkills: [],
        qualifications: [],
        experience: [],
        keywords: [],
        industry: null,
        role: null,
        seniority: 'mid',
        responsibilities: [],
        coreRequirements: [],
        technicalSkills: [],
        softSkills: [],
        importanceWeights: {}
      };
    }

    const jd = jobDescription.toLowerCase();
    
    // CRITICAL IMPROVEMENT: Enhanced multi-format skill extraction with importance weighting
    const skillPatterns = [
      // Essential requirements (highest weight)
      { pattern: /(?:essential|critical|must have|required|mandatory|need)[^.]*?(?:skills?|experience|knowledge)[^.]*?([^.]+)/gi, weight: 1.0 },
      { pattern: /(?:minimum|at least)[^.]*?(?:experience|years)[^.]*?([^.]+)/gi, weight: 1.0 },
      
      // Strong requirements (high weight)  
      { pattern: /(?:proficiency|experience|skilled?|expertise)\s+(?:in|with|using)\s+([^.,\n]+)/gi, weight: 0.9 },
      { pattern: /(?:knowledge of|experience with|familiar with|competent in)\s+([^.,\n]+)/gi, weight: 0.8 },
      
      // Qualifications and certifications (very high weight)
      { pattern: /(?:bachelor|master|degree|certification|qualified?|license|certified)\s+(?:in|with)?\s*([^.,\n]+)/gi, weight: 0.95 },
      { pattern: /(?:member grade|graduate membership|fellow|chartered|professional membership)\s+(?:of\s+)?([^.,\n]+)/gi, weight: 1.0 },
      { pattern: /(?:institute of fire engineers|institution of fire engineers|ife|member grade ife|graduate membership ife)\s*([^.,\n]*)/gi, weight: 1.0 },
      
      // Preferred/nice-to-have (lower weight)
      { pattern: /(?:preferred|desirable|nice to have|bonus|plus|advantage)[^.]*?([^.]+)/gi, weight: 0.6 },
      
      // Bullet point extraction with context analysis
      { pattern: /•\s*([^•\n]+)/gi, weight: 0.8 },
      { pattern: /-\s*([^-\n]+)/gi, weight: 0.8 },
      { pattern: /\*\s*([^*\n]+)/gi, weight: 0.8 },
      
      // Responsibility patterns (medium weight for skill inference)
      { pattern: /(?:responsibilities|duties|you will|role involves|key tasks)[^.]*?([^.]+)/gi, weight: 0.7 },
      
      // Technical proficiency levels (weighted by level)
      { pattern: /(?:expert|advanced)\s+(?:in|with|at)\s+([^.,\n]+)/gi, weight: 1.0 },
      { pattern: /(?:proficient|intermediate)\s+(?:in|with|at)\s+([^.,\n]+)/gi, weight: 0.8 },
      { pattern: /(?:beginner|basic)\s+(?:in|with|at)\s+([^.,\n]+)/gi, weight: 0.6 }
    ];

    const extractedSkills = new Map(); // skill -> importance weight
    const extractedQualifications = new Set();
    const responsibilities = new Set();
    const technicalSkills = new Set();
    const softSkills = new Set();
    
    // ENHANCED: Context-aware extraction with importance scoring
    skillPatterns.forEach(({ pattern, weight }) => {
      const matches = [...jd.matchAll(pattern)];
      matches.forEach(match => {
        if (match[1]) {
          const cleanText = this.cleanExtractedText(match[1]);
          const items = this.splitSkillText(cleanText);
          
          items.forEach(item => {
            if (item.length > 2 && !this.isCommonWord(item)) {
              // Categorize and weight extracted items
              if (this.isQualification(item)) {
                extractedQualifications.add(item);
                extractedSkills.set(item, Math.max(extractedSkills.get(item) || 0, weight));
              } else if (this.isResponsibility(item)) {
                responsibilities.add(item);
                // Extract implied skills from responsibilities
                const impliedSkills = this.extractSkillsFromResponsibility(item);
                impliedSkills.forEach(skill => {
                  extractedSkills.set(skill, Math.max(extractedSkills.get(skill) || 0, weight * 0.7));
                });
              } else if (this.isTechnicalSkill(item)) {
                technicalSkills.add(item);
                extractedSkills.set(item, Math.max(extractedSkills.get(item) || 0, weight));
              } else if (this.isSoftSkill(item)) {
                softSkills.add(item);
                extractedSkills.set(item, Math.max(extractedSkills.get(item) || 0, weight));
              } else {
                extractedSkills.set(item, Math.max(extractedSkills.get(item) || 0, weight));
              }
            }
          });
        }
      });
    });

    // CRITICAL: Enhanced experience extraction with context
    const experiencePatterns = [
      /(\d+)\+?\s*(?:to\s*(\d+))?\s*years?\s*(?:of\s*)?(?:experience|exp)/gi,
      /(?:minimum|at least|minimum of)\s*(\d+)\s*years?/gi,
      /(\d+)-(\d+)\s*years?\s*experience/gi,
      /(?:entry level|graduate|junior|senior|lead|principal|director)/gi
    ];

    const experienceYears = [];
    experiencePatterns.forEach(pattern => {
      const matches = [...jd.matchAll(pattern)];
      matches.forEach(match => {
        if (match[1]) experienceYears.push(parseInt(match[1]));
        if (match[2]) experienceYears.push(parseInt(match[2]));
      });
    });

    // ENHANCED: Multi-dimensional seniority detection
    const seniority = this.determineSeniorityFromText(jd, Math.max(...experienceYears, 0));

    // CRITICAL: Improved industry and role detection with confidence scoring
    const industry = this.detectIndustryFromText(jd);
    const role = this.detectRoleFromText(jd);

    // ENHANCED: Comprehensive keyword extraction with relevance scoring
    const keywords = this.extractComprehensiveKeywords(jd);

    // NEW: Core requirements identification
    const coreRequirements = this.identifyCoreRequirements(jd, [...extractedSkills.keys()]);

    // NEW: Importance weights for scoring accuracy
    const importanceWeights = this.calculateImportanceWeights(extractedSkills);

    return {
      requiredSkills: [...extractedSkills.keys()].slice(0, 20),
      preferredSkills: this.extractPreferredSkills(jd),
      qualifications: [...extractedQualifications].slice(0, 10),
      experience: experienceYears,
      keywords: keywords,
      industry,
      role,
      seniority,
      responsibilities: [...responsibilities].slice(0, 10),
      coreRequirements: coreRequirements.slice(0, 8),
      technicalSkills: [...technicalSkills].slice(0, 15),
      softSkills: [...softSkills].slice(0, 10),
      importanceWeights: importanceWeights
    };
  }

  // NEW: Extract skills from responsibility descriptions
  extractSkillsFromResponsibility(responsibility) {
    const skillMappings = {
      'manage': ['management', 'leadership', 'supervision'],
      'develop': ['development', 'programming', 'design'],
      'analyze': ['analysis', 'data analysis', 'research'],
      'communicate': ['communication', 'presentation', 'interpersonal'],
      'coordinate': ['coordination', 'project management', 'organization'],
      'implement': ['implementation', 'project delivery', 'execution'],
      'design': ['design', 'planning', 'architecture'],
      'troubleshoot': ['troubleshooting', 'problem solving', 'debugging'],
      'maintain': ['maintenance', 'support', 'documentation'],
      'train': ['training', 'teaching', 'mentoring']
    };

    const skills = [];
    for (const [verb, associatedSkills] of Object.entries(skillMappings)) {
      if (responsibility.toLowerCase().includes(verb)) {
        skills.push(...associatedSkills);
      }
    }
    return skills;
  }

  // ENHANCED: Identify technical vs soft skills including building safety
  isTechnicalSkill(skill) {
    const technicalKeywords = [
      // Technology skills
      'programming', 'software', 'database', 'cloud', 'api', 'framework',
      'javascript', 'python', 'java', 'sql', 'html', 'css', 'react', 'angular',
      'aws', 'azure', 'docker', 'kubernetes', 'git', 'linux', 'windows',
      'networking', 'security', 'encryption', 'automation', 'devops',
      'machine learning', 'ai', 'data science', 'analytics', 'excel',
      'powerbi', 'tableau', 'salesforce', 'sap', 'oracle',
      
      // Building safety and engineering technical skills
      'fire risk assessment', 'building regulations', 'building codes', 'cad',
      'autocad', 'solidworks', 'building control', 'fire engineering',
      'structural analysis', 'hvac systems', 'fire suppression systems',
      'smoke control', 'emergency lighting', 'fire alarm systems',
      'sprinkler systems', 'evacuation planning', 'means of escape',
      'compartmentation', 'fire doors', 'fire stopping', 'passive fire protection',
      'active fire protection', 'fire load calculations', 'egress analysis',
      'building safety act', 'golden thread', 'competent person scheme',
      
      // Safety and engineering technical skills
      'nebosh', 'iosh', 'osha', 'risk assessment', 'hazard identification',
      'incident investigation', 'safety management systems', 'permit to work',
      'method statements', 'safety case', 'quantified risk assessment',
      'failure mode analysis', 'root cause analysis', 'bow tie analysis'
    ];
    return technicalKeywords.some(keyword => skill.toLowerCase().includes(keyword));
  }

  // NEW: Identify soft skills
  isSoftSkill(skill) {
    const softKeywords = [
      'communication', 'leadership', 'teamwork', 'collaboration', 'management',
      'problem solving', 'critical thinking', 'creativity', 'adaptability',
      'time management', 'organization', 'interpersonal', 'presentation',
      'negotiation', 'customer service', 'mentoring', 'coaching', 'planning'
    ];
    return softKeywords.some(keyword => skill.toLowerCase().includes(keyword));
  }

  // NEW: Identify core requirements from job description
  identifyCoreRequirements(jobText, allSkills) {
    const coreIndicators = [
      'essential', 'critical', 'must have', 'required', 'mandatory',
      'minimum', 'at least', 'necessary', 'key requirement'
    ];

    const coreRequirements = [];
    coreIndicators.forEach(indicator => {
      const regex = new RegExp(`${indicator}[^.]*?([^.]+)`, 'gi');
      const matches = [...jobText.matchAll(regex)];
      matches.forEach(match => {
        if (match[1]) {
          const requirement = this.cleanExtractedText(match[1]);
          if (requirement.length > 5 && requirement.length < 100) {
            coreRequirements.push(requirement);
          }
        }
      });
    });

    return [...new Set(coreRequirements)];
  }

  // NEW: Calculate importance weights for accurate scoring
  calculateImportanceWeights(skillMap) {
    const weights = {};
    let totalWeight = 0;

    // Normalize weights
    for (const [skill, weight] of skillMap.entries()) {
      weights[skill] = weight;
      totalWeight += weight;
    }

    // Normalize to ensure total doesn't exceed reasonable bounds
    if (totalWeight > 0) {
      for (const skill in weights) {
        weights[skill] = weights[skill] / totalWeight;
      }
    }

    return weights;
  }

  // Clean and normalize extracted text
  cleanExtractedText(text) {
    return text
      .replace(/[^\w\s,&+/()-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Split skill text into individual items
  splitSkillText(text) {
    const separators = [',', '&', ' and ', ' or ', '+', '/', ';', '•', '-'];
    let items = [text];
    
    separators.forEach(separator => {
      items = items.flatMap(item => item.split(separator));
    });
    
    return items.map(item => item.trim()).filter(item => item.length > 0);
  }

  // Determine if extracted text is a qualification
  isQualification(text) {
    const qualificationKeywords = [
      'degree', 'bachelor', 'master', 'phd', 'certification', 'license',
      'diploma', 'certificate', 'qualification', 'accreditation'
    ];
    return qualificationKeywords.some(keyword => text.toLowerCase().includes(keyword));
  }

  // Determine if extracted text is a responsibility
  isResponsibility(text) {
    const responsibilityKeywords = [
      'manage', 'lead', 'develop', 'implement', 'coordinate', 'oversee',
      'responsible for', 'ensure', 'maintain', 'conduct', 'perform'
    ];
    return responsibilityKeywords.some(keyword => text.toLowerCase().includes(keyword)) && text.length > 20;
  }

  // Determine seniority from job description text
  determineSeniorityFromText(text, maxExperience) {
    const seniorityKeywords = {
      'entry': ['entry level', 'graduate', 'trainee', 'junior', 'assistant', '0-2 years'],
      'junior': ['junior', 'associate', '1-3 years', '2-4 years'],
      'mid': ['mid level', 'experienced', '3-7 years', '4-8 years'],
      'senior': ['senior', 'lead', 'principal', '7+ years', '8+ years', '10+ years'],
      'executive': ['director', 'manager', 'head of', 'chief', 'vp', 'vice president']
    };

    for (const [level, keywords] of Object.entries(seniorityKeywords)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        return level;
      }
    }

    // Fallback to experience-based determination
    if (maxExperience >= 10) return 'senior';
    if (maxExperience >= 5) return 'mid';
    if (maxExperience >= 2) return 'junior';
    return 'entry';
  }

  // Extract preferred skills separately
  extractPreferredSkills(text) {
    const preferredPatterns = [
      /(?:preferred|desirable|nice to have|bonus)[^.]*?([^.]+)/gi,
      /(?:plus|advantage|beneficial)\s+(?:if|to have)\s+([^.,\n]+)/gi
    ];

    const preferredSkills = new Set();
    preferredPatterns.forEach(pattern => {
      const matches = [...text.matchAll(pattern)];
      matches.forEach(match => {
        if (match[1]) {
          const items = this.splitSkillText(this.cleanExtractedText(match[1]));
          items.forEach(item => {
            if (item.length > 2) preferredSkills.add(item);
          });
        }
      });
    });

    return [...preferredSkills].slice(0, 8);
  }

  // Extract comprehensive keywords for ATS optimization
  extractComprehensiveKeywords(text) {
    // Remove common words and extract meaningful keywords
    const commonWords = new Set([
      'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      'a', 'an', 'is', 'are', 'will', 'be', 'have', 'has', 'had', 'do', 'does', 'did',
      'this', 'that', 'these', 'those', 'we', 'you', 'they', 'them', 'our', 'your'
    ]);
    
    const words = text.match(/\b\w{3,}\b/g) || [];
    const keywordFreq = {};
    
    words.forEach(word => {
      const lowerWord = word.toLowerCase();
      if (!commonWords.has(lowerWord) && lowerWord.length >= 3) {
        keywordFreq[lowerWord] = (keywordFreq[lowerWord] || 0) + 1;
      }
    });

    // Extract multi-word phrases that are important
    const phrases = this.extractImportantPhrases(text);
    phrases.forEach(phrase => {
      keywordFreq[phrase] = (keywordFreq[phrase] || 0) + 2; // Give phrases higher weight
    });

    return Object.keys(keywordFreq)
      .sort((a, b) => keywordFreq[b] - keywordFreq[a])
      .slice(0, 20);
  }

  // Extract important multi-word phrases
  extractImportantPhrases(text) {
    const phrasePatterns = [
      /\b(?:project management|data analysis|customer service|software development|machine learning|artificial intelligence|quality assurance|business development|risk management|emergency response|fire safety|building safety|health and safety)\b/gi,
      /\b(?:team leadership|problem solving|critical thinking|time management|attention to detail|excellent communication|strong analytical|proven track record)\b/gi
    ];

    const phrases = new Set();
    phrasePatterns.forEach(pattern => {
      const matches = [...text.matchAll(pattern)];
      matches.forEach(match => phrases.add(match[0].toLowerCase()));
    });

    return [...phrases];
  }

  detectIndustryFromText(text) {
    const textLower = text.toLowerCase();
    
    const industryKeywords = {
      'building_safety': [
        'building safety', 'head of building safety', 'fire safety', 'building regulations', 
        'safety compliance', 'construction safety', 'building control', 'safety management', 
        'fire risk assessment', 'building standards', 'CDM regulations', 'building surveying',
        'institute of fire engineers', 'institution of fire engineers', 'ife', 'member grade ife',
        'building safety act', 'golden thread', 'competent person scheme', 'fire safety manager',
        'building safety manager', 'fire engineering', 'structural fire protection'
      ],
      'emergency_services': [
        'emergency services', 'fire service', 'rescue', 'ambulance', 'paramedic', 'firefighter', 
        'emergency response', 'fire brigade', 'crisis management', 'kent fire', 'watch manager',
        'station manager', 'fire and rescue', 'emergency care', 'incident command'
      ],
      'safety': [
        'safety management', 'health and safety', 'IOSH', 'NEBOSH', 'risk assessment', 
        'safety compliance', 'occupational health', 'workplace safety', 'safety officer',
        'safety consultant', 'health and safety advisor'
      ],
      'construction': [
        'construction', 'building', 'contractor', 'site', 'trades', 'civil engineering', 
        'project management', 'construction management', 'site management'
      ],
      'technology': [
        'software', 'programming', 'developer', 'engineer', 'tech', 'digital', 'coding', 'it',
        'software development', 'web development', 'data science', 'artificial intelligence'
      ],
      'healthcare': [
        'medical', 'clinical', 'patient', 'healthcare', 'hospital', 'nursing', 'doctor',
        'physician', 'nurse', 'medical care', 'patient care'
      ],
      'finance': [
        'financial', 'banking', 'investment', 'accounting', 'finance', 'audit',
        'financial analyst', 'investment banking', 'financial services'
      ],
      'education': [
        'education', 'teaching', 'school', 'university', 'learning', 'academic',
        'teacher', 'professor', 'educational', 'curriculum'
      ],
      'marketing': [
        'marketing', 'advertising', 'brand', 'campaign', 'digital marketing',
        'marketing manager', 'brand management', 'social media marketing'
      ],
      'engineering': [
        'engineering', 'mechanical', 'electrical', 'civil', 'aerospace',
        'engineer', 'engineering manager', 'technical engineering'
      ]
    };

    let bestMatch = 'general';
    let maxMatches = 0;

    for (const [industry, keywords] of Object.entries(industryKeywords)) {
      const matches = keywords.filter(keyword => 
        textLower.includes(keyword.toLowerCase())
      ).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        bestMatch = industry;
      }
    }
    
    // Special case for building safety positions
    if (textLower.includes('head of building safety') || 
        textLower.includes('building safety manager') ||
        textLower.includes('fire safety manager')) {
      return 'building_safety';
    }
    
    return bestMatch;
  }

  detectRoleFromText(text) {
    const textLower = text.toLowerCase();
    
    const roleKeywords = {
      'building-safety-manager': [
        'building safety manager', 'head of building safety', 'building safety', 
        'fire safety manager', 'safety manager', 'building safety officer',
        'fire safety officer', 'fire safety consultant', 'building control officer'
      ],
      'emergency-services-manager': [
        'watch manager', 'station manager', 'crew manager', 'fire service manager',
        'emergency services manager', 'incident commander', 'rescue manager'
      ],
      'software-developer': [
        'software developer', 'programmer', 'coding', 'software engineer',
        'web developer', 'frontend developer', 'backend developer'
      ],
      'data-scientist': [
        'data scientist', 'data analyst', 'machine learning', 'analytics',
        'data engineer', 'business analyst'
      ],
      'financial-analyst': [
        'financial analyst', 'finance analyst', 'investment analyst',
        'financial advisor', 'finance manager'
      ],
      'project-manager': [
        'project manager', 'program manager', 'project lead',
        'project coordinator', 'programme manager'
      ],
      'marketing-manager': [
        'marketing manager', 'brand manager', 'marketing director',
        'digital marketing manager', 'marketing coordinator'
      ],
      'fashion-designer': [
        'fashion designer', 'apparel designer', 'clothing designer', 
        'textile designer', 'fashion stylist'
      ],
      'safety-manager': [
        'safety manager', 'health and safety manager', 'risk manager', 
        'compliance manager', 'safety advisor', 'safety consultant'
      ],
      'construction-manager': [
        'construction manager', 'site manager', 'project manager', 
        'building manager', 'construction supervisor'
      ]
    };

    for (const [role, keywords] of Object.entries(roleKeywords)) {
      if (keywords.some(keyword => textLower.includes(keyword.toLowerCase()))) {
        return role;
      }
    }
    
    // Special case for building safety positions
    if (textLower.includes('head of building safety')) {
      return 'building-safety-manager';
    }
    
    return 'general';
  }

  extractKeywordsFromText(text) {
    // Remove common words and extract meaningful keywords
    const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'a', 'an', 'is', 'are', 'will', 'be', 'have', 'has', 'had', 'do', 'does', 'did'];
    const words = text.match(/\b\w{3,}\b/g) || [];
    
    const keywordFreq = {};
    words.forEach(word => {
      const lowerWord = word.toLowerCase();
      if (!commonWords.includes(lowerWord)) {
        keywordFreq[lowerWord] = (keywordFreq[lowerWord] || 0) + 1;
      }
    });

    return Object.keys(keywordFreq)
      .sort((a, b) => keywordFreq[b] - keywordFreq[a])
      .slice(0, 15);
  }

  // Advanced CV parsing and extraction
  parseCV(cvText) {
    if (!cvText || typeof cvText !== 'string') {
      return {
        skills: [],
        experience: [],
        education: [],
        achievements: [],
        keywords: [],
        currentField: null,
        experienceYears: 0,
        qualifications: [],
        technicalSkills: [],
        softSkills: [],
        workHistory: [],
        certifications: [],
        projects: [],
        languages: [],
        sectionQuality: {}
      };
    }

    const cv = cvText.toLowerCase();
    
    // ENHANCED: Multi-pattern section extraction with fallbacks
    const skillsSection = this.extractSection(cv, [
      'skills', 'technical skills', 'key skills', 'competencies', 
      'core competencies', 'professional skills', 'expertise',
      'technologies', 'tools', 'proficiencies'
    ]);
    
    const experienceSection = this.extractSection(cv, [
      'experience', 'work history', 'employment', 'career',
      'professional experience', 'work experience', 'employment history'
    ]);
    
    const educationSection = this.extractSection(cv, [
      'education', 'qualifications', 'academic', 'academic background',
      'educational background', 'training', 'certifications'
    ]);

    // CRITICAL: Enhanced skill extraction with context analysis
    const extractedSkills = this.extractSkillsFromText(skillsSection || cv);
    const contextualSkills = this.extractContextualSkills(experienceSection || cv);
    const technicalSkills = extractedSkills.filter(skill => this.isTechnicalSkill(skill));
    const softSkills = extractedSkills.filter(skill => this.isSoftSkill(skill));
    
    // ENHANCED: Sophisticated experience calculation
    const experienceYears = this.calculateExperienceYears(experienceSection || cv);
    const workExperience = this.extractWorkExperience(experienceSection || cv);
    const workHistory = this.extractDetailedWorkHistory(experienceSection || cv);
    
    // IMPROVED: Comprehensive education and qualification extraction
    const education = this.extractEducation(educationSection || cv);
    const certifications = this.extractCertifications(cv);
    const languages = this.extractLanguages(cv);
    
    // ENHANCED: Multi-source achievement extraction
    const achievements = this.extractAchievements(cv);
    const projects = this.extractProjects(cv);
    
    // CRITICAL: Improved field detection with confidence scoring
    const currentField = this.detectCurrentField(cv);
    
    // ENHANCED: Comprehensive keyword extraction
    const keywords = this.extractKeywordsFromText(cv);
    
    // NEW: Section quality assessment for accuracy scoring
    const sectionQuality = this.assessSectionQuality(cv, {
      skills: skillsSection,
      experience: experienceSection,
      education: educationSection
    });

    // ENHANCED: Add comprehensive extraction for revolutionary analysis
    const industryExperience = this.extractIndustryExperience(cvText);
    const leadershipExperience = this.extractLeadershipExperience(cvText);
    const professionalMemberships = this.extractProfessionalMemberships(cvText);
    const quantifiedAchievements = this.extractQuantifiedAchievements(cvText);
    const teamManagementExperience = this.extractTeamManagementExperience(cvText);
    const budgetManagementExperience = this.extractBudgetManagementExperience(cvText);
    const clientInteractionExperience = this.extractClientInteractionExperience(cvText);
    const crossFunctionalExperience = this.extractCrossFunctionalExperience(cvText);

    return {
      skills: [...new Set([...extractedSkills, ...contextualSkills])].slice(0, 25),
      experience: workExperience.slice(0, 8),
      education: education.slice(0, 6),
      achievements: achievements.slice(0, 10),
      keywords: keywords.slice(0, 30),
      currentField,
      experienceYears,
      qualifications: this.extractQualifications(cv),
      technicalSkills: technicalSkills.slice(0, 15),
      softSkills: softSkills.slice(0, 10),
      workHistory: workHistory.slice(0, 8),
      certifications: certifications.slice(0, 10),
      projects: projects.slice(0, 6),
      languages: languages.slice(0, 5),
      sectionQuality,
      
      // REVOLUTIONARY: Enhanced comprehensive extraction
      industryExperience: industryExperience.slice(0, 5),
      leadershipExperience: leadershipExperience.slice(0, 5),
      professionalMemberships: professionalMemberships.slice(0, 5),
      quantifiedAchievements: quantifiedAchievements.slice(0, 8),
      teamManagementExperience: teamManagementExperience.slice(0, 3),
      budgetManagementExperience: budgetManagementExperience.slice(0, 3),
      clientInteractionExperience: clientInteractionExperience.slice(0, 3),
      crossFunctionalExperience: crossFunctionalExperience.slice(0, 3),
      careerProgression: this.analyzeCareerProgression(workExperience)
    };
  }

  extractSection(text, sectionTitles) {
    for (const title of sectionTitles) {
      const regex = new RegExp(`(${title})[^\\n]*\\n([\\s\\S]*?)(?=\\n\\s*[A-Z][^\\n]*:|$)`, 'i');
      const match = text.match(regex);
      if (match && match[2]) {
        return match[2].trim();
      }
    }
    return null;
  }

  // Enhanced CV parsing for universal skill and experience extraction
  extractSkillsFromText(text) {
    if (!text) return [];

    const skillPatterns = [
      // Technical skills sections
      /(?:technical skills?|core competencies|key skills?|skills?)[^:]*?:([^.]*?)(?:\n\n|\n[A-Z]|$)/gi,
      
      // Software and tools
      /(?:software|tools?|technologies|platforms?)[^:]*?:([^.]*?)(?:\n\n|\n[A-Z]|$)/gi,
      
      // Programming languages
      /(?:programming languages?|languages?|coding)[^:]*?:([^.]*?)(?:\n\n|\n[A-Z]|$)/gi,
      
      // Certifications and qualifications
      /(?:certified in|qualified in|proficient in|experienced with|skilled in)\s+([^.,\n]+)/gi,
      
      // Achievement-based skills
      /(?:achieved|accomplished|delivered|managed|led|developed|implemented|designed|created)\s+([^.,\n]+)/gi,
      
      // Responsibility-based skills
      /(?:responsible for|duties included|tasks involved|experience in)\s+([^.,\n]+)/gi,
      
      // Bullet point skills
      /[•\-\*]\s*([^•\-\*\n]+)/gi
    ];

    const extractedSkills = new Set();
    const text_lower = text.toLowerCase();

    skillPatterns.forEach(pattern => {
      const matches = [...text_lower.matchAll(pattern)];
      matches.forEach(match => {
        if (match[1]) {
          const skillText = this.cleanExtractedText(match[1]);
          const skills = this.extractIndividualSkills(skillText);
          skills.forEach(skill => {
            if (skill.length > 2 && !this.isCommonWord(skill)) {
              extractedSkills.add(skill);
            }
          });
        }
      });
    });

    // Extract skills from context (work experience descriptions)
    const contextualSkills = this.extractContextualSkills(text_lower);
    contextualSkills.forEach(skill => extractedSkills.add(skill));

    // Extract industry-specific skills
    const industrySkills = this.extractIndustrySpecificSkills(text_lower);
    industrySkills.forEach(skill => extractedSkills.add(skill));

    return [...extractedSkills].slice(0, 25);
  }

  // Extract individual skills from combined text
  extractIndividualSkills(text) {
    const separators = [',', '&', ';', '|', ' and ', ' or ', '+', '/', '•', '-', '*'];
    let skills = [text];
    
    separators.forEach(separator => {
      skills = skills.flatMap(skill => skill.split(separator));
    });
    
    return skills
      .map(skill => skill.trim())
      .filter(skill => skill.length > 1)
      .map(skill => this.normalizeSkill(skill));
  }

  // Normalize skill names for consistency
  normalizeSkill(skill) {
    const normalizations = {
      'js': 'javascript',
      'py': 'python',
      'mgmt': 'management',
      'admin': 'administration',
      'dev': 'development',
      'pm': 'project management',
      'h&s': 'health and safety',
      'qa': 'quality assurance',
      'qc': 'quality control'
    };

    const normalized = normalizations[skill.toLowerCase()];
    return normalized || skill;
  }

  // Extract contextual skills from work descriptions
  extractContextualSkills(text) {
    const contextualPatterns = [
      // Action verbs with skills
      /(?:managed|led|supervised|coordinated|implemented|developed|designed|created|built|delivered|achieved)\s+([^.,\n]{10,50})/gi,
      
      // Experience with specific tools/technologies
      /(?:using|with|via|through)\s+([A-Z][a-zA-Z\s]{2,20})/gi,
      
      // Skills in achievements
      /(?:expertise in|experience in|specialization in|background in)\s+([^.,\n]+)/gi
    ];

    const skills = new Set();
    contextualPatterns.forEach(pattern => {
      const matches = [...text.matchAll(pattern)];
      matches.forEach(match => {
        if (match[1]) {
          const skill = match[1].trim();
          if (skill.length > 3 && skill.length < 50) {
            skills.add(skill);
          }
        }
      });
    });

    return [...skills];
  }

  // Extract industry-specific skills based on context
  extractIndustrySpecificSkills(text) {
    const industrySkillMappings = {
      'emergency services': ['emergency response', 'crisis management', 'incident command', 'fire safety', 'rescue operations', 'first aid', 'cpr'],
      'healthcare': ['patient care', 'clinical assessment', 'medical procedures', 'healthcare delivery', 'patient safety'],
      'technology': ['software development', 'programming', 'system design', 'database management', 'cloud computing'],
      'finance': ['financial analysis', 'risk assessment', 'portfolio management', 'regulatory compliance'],
      'construction': ['project management', 'safety management', 'building regulations', 'construction planning'],
      'education': ['curriculum development', 'student assessment', 'educational technology', 'classroom management']
    };

    const skills = new Set();
    for (const [industry, skillList] of Object.entries(industrySkillMappings)) {
      if (text.includes(industry.replace(' ', '')) || 
          skillList.some(skill => text.includes(skill.replace(' ', '')))) {
        skillList.forEach(skill => {
          if (text.includes(skill.replace(' ', '')) || 
              this.hasRelatedTerms(text, skill)) {
            skills.add(skill);
          }
        });
      }
    }

    return [...skills];
  }

  // Check if text has terms related to a skill
  hasRelatedTerms(text, skill) {
    const relatedTerms = {
      'fire safety': ['fire', 'safety', 'building safety', 'risk assessment'],
      'emergency response': ['emergency', 'response', 'crisis', 'incident'],
      'project management': ['project', 'management', 'coordination', 'planning'],
      'patient care': ['patient', 'care', 'clinical', 'medical']
    };

    const terms = relatedTerms[skill];
    if (!terms) return false;

    return terms.filter(term => text.includes(term)).length >= 2;
  }

  // Check if a word is too common to be a skill
  isCommonWord(word) {
    const commonWords = new Set([
      'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had',
      'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might',
      'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they'
    ]);
    
    return commonWords.has(word.toLowerCase()) || word.length < 3;
  }

  calculateExperienceYears(text) {
    // Look for date patterns and calculate total experience
    const datePatterns = [
      /(\d{4})\s*[-–]\s*(\d{4}|present|current)/gi,
      /(\d{1,2}\/\d{4})\s*[-–]\s*(\d{1,2}\/\d{4}|present|current)/gi
    ];

    let totalYears = 0;
    const currentYear = new Date().getFullYear();

    datePatterns.forEach(pattern => {
      const matches = [...text.matchAll(pattern)];
      matches.forEach(match => {
        const startYear = parseInt(match[1].substring(match[1].length - 4));
        const endYear = match[2].toLowerCase().includes('present') || match[2].toLowerCase().includes('current') ? currentYear : parseInt(match[2].substring(match[2].length - 4));
        
        if (startYear && endYear && startYear <= endYear) {
          totalYears += (endYear - startYear);
        }
      });
    });

    return Math.max(totalYears, 0);
  }

  extractWorkExperience(text) {
    const experiencePattern = /([^.\n]+(?:manager|director|analyst|developer|engineer|specialist|coordinator|assistant|lead|senior|junior)[^.\n]*)\s*(?:at|@)\s*([^.\n]+)/gi;
    const matches = [...text.matchAll(experiencePattern)];
    
    return matches.map(match => ({
      title: match[1].trim(),
      company: match[2].trim()
    }));
  }

  extractEducation(text) {
    const educationPattern = /(bachelor|master|phd|diploma|certificate|degree)[^.\n]*(?:in|of)\s*([^.\n]+)/gi;
    const matches = [...text.matchAll(educationPattern)];
    
    return matches.map(match => ({
      level: match[1].trim(),
      field: match[2].trim()
    }));
  }

  extractAchievements(text) {
    const achievementPatterns = [
      /(?:achieved|accomplished|delivered|improved|increased|decreased|managed|led|created|developed|implemented)\s+([^.\n]+)/gi,
      /(?:\d+%|\$\d+|£\d+|€\d+)\s*(?:increase|improvement|reduction|savings?|revenue|profit)/gi
    ];

    const achievements = new Set();
    
    achievementPatterns.forEach(pattern => {
      const matches = [...text.matchAll(pattern)];
      matches.forEach(match => {
        if (match[1] && match[1].length > 10 && match[1].length < 100) {
          achievements.add(match[1].trim());
        } else if (match[0] && match[0].length > 5 && match[0].length < 50) {
          achievements.add(match[0].trim());
        }
      });
    });

    return [...achievements];
  }

  extractQualifications(text) {
    const qualificationPatterns = [
      /(nebosh|iosh|osha|cpa|cfa|pmp|cissp|aws certified|microsoft certified|google certified|cisco certified)[^.\n]*/gi,
      /(certified|certification|qualified|license|licensed)\s+([^.\n]+)/gi
    ];

    const qualifications = new Set();
    
    qualificationPatterns.forEach(pattern => {
      const matches = [...text.matchAll(pattern)];
      matches.forEach(match => {
        if (match[0] && match[0].length > 3 && match[0].length < 50) {
          qualifications.add(match[0].trim());
        }
      });
    });

    return [...qualifications];
  }

  // Universal CV-Job Matching Algorithm
  performUniversalMatch(cvData, jobData) {
    const matchResult = {
      overallCompatibility: 0,
      experienceMatch: 0,
      skillsMatch: 0,
      educationMatch: 0,
      transferabilityScore: 0,
      careerStage: 'entry',
      matchType: 'direct', // direct, transferable, career-change, entry-level
      strengthAreas: [],
      gapAreas: [],
      developmentPath: []
    };

    // Determine match type and career stage
    matchResult.matchType = this.determineMatchType(cvData, jobData);
    matchResult.careerStage = this.determineCareerStage(cvData, jobData);

    // Calculate individual match scores
    matchResult.experienceMatch = this.calculateExperienceMatch(cvData, jobData);
    matchResult.skillsMatch = this.calculateSkillsMatch(cvData, jobData);
    matchResult.educationMatch = this.calculateEducationMatch(cvData, jobData);
    matchResult.transferabilityScore = this.calculateTransferabilityScore(cvData, jobData);

    // Calculate overall compatibility based on match type
    matchResult.overallCompatibility = this.calculateOverallCompatibility(matchResult);

    // Identify strengths and gaps
    matchResult.strengthAreas = this.identifyStrengthAreas(cvData, jobData);
    matchResult.gapAreas = this.identifyGapAreas(cvData, jobData);
    matchResult.developmentPath = this.createDevelopmentPath(matchResult.gapAreas, matchResult.matchType);

    return matchResult;
  }

  determineMatchType(cvData, jobData) {
    const cvIndustry = cvData.currentField || this.detectCurrentField(cvData.keywords.join(' '));
    const jobIndustry = jobData.industry;

    // Direct match - same industry/field
    if (cvIndustry === jobIndustry) {
      return 'direct';
    }

    // CRITICAL: Special high-compatibility transfers (emergency services → building safety, etc.)
    const specialHighTransfers = {
      'emergency_services': ['building_safety', 'safety', 'construction', 'healthcare'],
      'building_safety': ['emergency_services', 'safety', 'construction'],
      'engineering': ['construction', 'manufacturing', 'technology'],
      'finance': ['business', 'consulting', 'data analysis'],
      'healthcare': ['emergency_services', 'social work', 'research']
    };

    // Check for special high-compatibility transfers first
    if (specialHighTransfers[cvIndustry]?.includes(jobIndustry)) {
      return 'transferable';
    }

    // Check standard transferability from industry requirements
    const industryReqs = this.getIndustryRequirements(jobIndustry);
    if (industryReqs.transferableFrom.includes(cvIndustry)) {
      return 'transferable';
    }

    // Check if entry-level (limited/no experience) - but not for experienced candidates
    if ((cvData.experienceYears <= 1 || cvData.experience.length === 0) && 
        cvData.experienceYears < 5) { // Ensure experienced emergency services aren't classified as entry-level
      return 'entry-level';
    }

    // Career change
    return 'career-change';
  }

  determineCareerStage(cvData, jobData) {
    const experienceYears = cvData.experienceYears;
    const hasRelevantEducation = cvData.education.length > 0;
    const hasLeadershipExp = cvData.keywords.some(keyword => 
      ['manager', 'lead', 'director', 'supervisor', 'head'].some(title => 
        keyword.toLowerCase().includes(title)
      )
    );

    if (experienceYears === 0 && hasRelevantEducation) return 'graduate';
    if (experienceYears <= 2) return 'entry';
    if (experienceYears <= 5) return 'junior';
    if (experienceYears <= 10 || hasLeadershipExp) return 'mid';
    return 'senior';
  }

  calculateExperienceMatch(cvData, jobData) {
    if (cvData.experienceYears === 0) {
      // For new graduates/entry-level
      return jobData.seniority === 'entry' ? 85 : 45;
    }

    const requiredYears = this.extractRequiredExperience(jobData);
    if (requiredYears === 0) return 80; // No specific requirement

    const ratio = cvData.experienceYears / requiredYears;
    if (ratio >= 1.2) return 95; // Over-qualified
    if (ratio >= 1.0) return 90; // Perfect match
    if (ratio >= 0.8) return 75; // Close match
    if (ratio >= 0.5) return 60; // Moderate gap
    return 35; // Significant gap
  }

  calculateSkillsMatch(cvData, jobData) {
    const cvSkills = cvData.skills.map(skill => skill.toLowerCase());
    const cvTechnicalSkills = cvData.technicalSkills || [];
    const cvSoftSkills = cvData.softSkills || [];
    const cvKeywords = cvData.keywords.map(k => k.toLowerCase());
    
    const jobSkills = [...jobData.requiredSkills, ...jobData.keywords].map(skill => skill.toLowerCase());
    const jobTechnicalSkills = jobData.technicalSkills || [];
    const jobSoftSkills = jobData.softSkills || [];
    const importanceWeights = jobData.importanceWeights || {};
    
    if (jobSkills.length === 0) return 50;

    // ENHANCED: Multi-tier skill matching with confidence scoring
    let totalScore = 0;
    let totalWeight = 0;
    let matchedSkills = new Set();
    let confidenceFactors = [];

    // Tier 1: Direct exact matches (highest confidence)
    jobSkills.forEach(jobSkill => {
      const weight = importanceWeights[jobSkill] || 0.5;
      let matched = false;
      let confidence = 0;

      // Exact match
      if (cvSkills.some(cvSkill => cvSkill === jobSkill)) {
        matched = true;
        confidence = 1.0;
      }
      // Partial match
      else if (cvSkills.some(cvSkill => 
        cvSkill.includes(jobSkill) || jobSkill.includes(cvSkill))) {
        matched = true;
        confidence = 0.8;
      }
      // Keyword match
      else if (cvKeywords.some(keyword => 
        keyword.includes(jobSkill) || jobSkill.includes(keyword))) {
        matched = true;
        confidence = 0.6;
      }

      if (matched) {
        const score = confidence * 100 * weight;
        totalScore += score;
        totalWeight += weight;
        matchedSkills.add(jobSkill);
        confidenceFactors.push(confidence);
      } else {
        totalWeight += weight; // Count missing skills in total weight
      }
    });

    // Tier 2: Semantic skill matching (medium confidence)
    const semanticMatches = this.findSemanticSkillMatches(cvSkills, jobSkills);
    semanticMatches.forEach(jobSkill => {
      if (!matchedSkills.has(jobSkill)) {
        const weight = importanceWeights[jobSkill] || 0.5;
        const score = 0.7 * 100 * weight; // Semantic matches get 70% confidence
        totalScore += score;
        matchedSkills.add(jobSkill);
        confidenceFactors.push(0.7);
      }
    });
    
    // Tier 3: Contextual skill matching (lower confidence)
    const contextMatches = this.findContextualSkillMatches(cvData, jobData);
    contextMatches.forEach(jobSkill => {
      if (!matchedSkills.has(jobSkill)) {
        const weight = importanceWeights[jobSkill] || 0.5;
        const score = 0.5 * 100 * weight; // Context matches get 50% confidence
        totalScore += score;
        matchedSkills.add(jobSkill);
        confidenceFactors.push(0.5);
      }
    });

    // Tier 4: Technical vs Soft skill category bonuses
    const techSkillBonus = this.calculateTechnicalSkillBonus(cvTechnicalSkills, jobTechnicalSkills);
    const softSkillBonus = this.calculateSoftSkillBonus(cvSoftSkills, jobSoftSkills);
    
    // CRITICAL: Calculate weighted match percentage
    const baseScore = totalWeight > 0 ? (totalScore / totalWeight) : 0;
    
    // Apply transferability bonuses
    const transferabilityBonus = this.calculateUniversalTransferabilityBonus(cvData, jobData);
    
    // Apply quality-based confidence adjustment
    const qualityMultiplier = this.calculateSkillQualityMultiplier(cvData, confidenceFactors);
    
    // Final score calculation with all factors
    let finalScore = (baseScore + techSkillBonus + softSkillBonus + transferabilityBonus) * qualityMultiplier;
    
    return Math.min(100, Math.round(finalScore));
  }

  // NEW: Calculate technical skill matching bonus
  calculateTechnicalSkillBonus(cvTechSkills, jobTechSkills) {
    if (jobTechSkills.length === 0) return 0;
    
    const matches = cvTechSkills.filter(cvSkill => 
      jobTechSkills.some(jobSkill => 
        cvSkill.toLowerCase().includes(jobSkill.toLowerCase()) ||
        jobSkill.toLowerCase().includes(cvSkill.toLowerCase())
      )
    );
    
    const matchRatio = matches.length / jobTechSkills.length;
    return Math.min(10, matchRatio * 15); // Up to 15 point bonus
  }

  // NEW: Calculate soft skill matching bonus
  calculateSoftSkillBonus(cvSoftSkills, jobSoftSkills) {
    if (jobSoftSkills.length === 0) return 0;
    
    const matches = cvSoftSkills.filter(cvSkill => 
      jobSoftSkills.some(jobSkill => 
        cvSkill.toLowerCase().includes(jobSkill.toLowerCase()) ||
        jobSkill.toLowerCase().includes(cvSkill.toLowerCase())
      )
    );
    
    const matchRatio = matches.length / jobSoftSkills.length;
    return Math.min(10, matchRatio * 10); // Up to 10 point bonus
  }

  // NEW: Calculate skill quality multiplier based on CV analysis confidence
  calculateSkillQualityMultiplier(cvData, confidenceFactors) {
    const sectionQuality = cvData.sectionQuality || {};
    
    // Base multiplier
    let multiplier = 1.0;
    
    // Adjust based on skills section quality
    const skillsQuality = sectionQuality.skills || 70;
    if (skillsQuality > 80) multiplier += 0.1;
    else if (skillsQuality < 50) multiplier -= 0.1;
    
    // Adjust based on overall confidence of matches
    if (confidenceFactors.length > 0) {
      const avgConfidence = confidenceFactors.reduce((a, b) => a + b, 0) / confidenceFactors.length;
      multiplier += (avgConfidence - 0.7) * 0.2; // Adjust around 70% baseline
    }
    
    // Ensure reasonable bounds
    return Math.max(0.7, Math.min(1.3, multiplier));
  }

  // ENHANCED: Sophisticated experience matching with quality assessment
  calculateExperienceMatch(cvData, jobData) {
    // Basic experience years matching
    if (cvData.experienceYears === 0) {
      return jobData.seniority === 'entry' ? 85 : 45;
    }

    const requiredYears = this.extractRequiredExperience(jobData);
    if (requiredYears === 0) return 80; // No specific requirement

    const ratio = cvData.experienceYears / requiredYears;
    let baseScore = 0;
    
    if (ratio >= 1.5) baseScore = 95; // Significantly over-qualified
    else if (ratio >= 1.2) baseScore = 90; // Over-qualified
    else if (ratio >= 1.0) baseScore = 85; // Perfect match
    else if (ratio >= 0.8) baseScore = 75; // Close match
    else if (ratio >= 0.6) baseScore = 60; // Moderate gap
    else if (ratio >= 0.4) baseScore = 45; // Significant gap
    else baseScore = 30; // Major gap

    // CRITICAL: Quality-based adjustments
    const workHistory = cvData.workHistory || [];
    const sectionQuality = cvData.sectionQuality || {};
    
    // Bonus for detailed work history
    if (workHistory.length > 2) baseScore += 5;
    if (workHistory.length > 4) baseScore += 5;
    
    // Bonus for high-quality experience section
    const expQuality = sectionQuality.experience || 70;
    if (expQuality > 80) baseScore += 10;
    else if (expQuality < 50) baseScore -= 10;
    
    // Bonus for relevant experience titles
    const relevantTitles = workHistory.filter(job => 
      jobData.role && job.title && 
      job.title.toLowerCase().includes(jobData.role.toLowerCase())
    ).length;
    
    if (relevantTitles > 0) baseScore += 10;
    if (relevantTitles > 1) baseScore += 5;

    return Math.min(100, Math.max(0, baseScore));
  }

  // ENHANCED: Advanced education matching with context awareness
  calculateEducationMatch(cvData, jobData) {
    const cvEducation = cvData.education || [];
    const cvCertifications = cvData.certifications || [];
    const sectionQuality = cvData.sectionQuality || {};
    
    if (cvEducation.length === 0 && cvCertifications.length === 0) {
      return jobData.qualifications.length === 0 ? 70 : 30;
    }

    const cvEducationLevels = cvEducation.map(edu => edu.level?.toLowerCase() || '');
    const cvEducationFields = cvEducation.map(edu => edu.field?.toLowerCase() || '');
    
    let educationScore = 50; // Base score for having education

    // CRITICAL: Enhanced qualification matching
    const requiresBachelor = jobData.qualifications.some(qual => 
      qual.toLowerCase().includes('bachelor') || qual.toLowerCase().includes('degree')
    );
    const requiresMaster = jobData.qualifications.some(qual => 
      qual.toLowerCase().includes('master') || qual.toLowerCase().includes('msc') || qual.toLowerCase().includes('mba')
    );
    const requiresCertification = jobData.qualifications.some(qual =>
      qual.toLowerCase().includes('certification') || qual.toLowerCase().includes('certified')
    );

    const hasBachelor = cvEducationLevels.some(level => 
      level.includes('bachelor') || level.includes('degree')
    );
    const hasMaster = cvEducationLevels.some(level => 
      level.includes('master') || level.includes('msc') || level.includes('mba')
    );
    const hasCertifications = cvCertifications.length > 0;

    // Degree level matching
    if (requiresMaster && hasMaster) educationScore = 95;
    else if (requiresMaster && hasBachelor) educationScore = 70;
    else if (requiresBachelor && hasMaster) educationScore = 100; // Over-qualified
    else if (requiresBachelor && hasBachelor) educationScore = 90;
    else if (requiresBachelor && !hasBachelor && !hasMaster) educationScore = 40;

    // Certification bonuses
    if (requiresCertification && hasCertifications) educationScore += 15;
    else if (requiresCertification && !hasCertifications) educationScore -= 15;
    else if (!requiresCertification && hasCertifications) educationScore += 10; // Bonus for extra certs

    // ENHANCED: Field relevance analysis
    const industryKeywords = this.getIndustryRequirements(jobData.industry).keywords;
    const fieldRelevant = cvEducationFields.some(field => 
      industryKeywords.some(keyword => 
        field.includes(keyword.toLowerCase()) || keyword.toLowerCase().includes(field)
      )
    );

    if (fieldRelevant) educationScore += 20;

    // CRITICAL: Certification relevance bonus
    const relevantCertifications = cvCertifications.filter(cert => 
      industryKeywords.some(keyword => 
        cert.toLowerCase().includes(keyword.toLowerCase())
      ) || jobData.requiredSkills.some(skill =>
        cert.toLowerCase().includes(skill.toLowerCase())
      )
    );

    educationScore += Math.min(20, relevantCertifications.length * 5);

    // Quality adjustment
    const eduQuality = sectionQuality.education || 70;
    if (eduQuality > 80) educationScore += 5;
    else if (eduQuality < 50) educationScore -= 5;

    return Math.min(100, Math.max(0, educationScore));
  }

  // ENHANCED: Dynamic overall compatibility calculation with weighted components


  // ENHANCED: Weighted scoring by match type with industry considerations  
  getWeightsByMatchType(matchType) {
    switch (matchType) {
      case 'direct':
        return { experience: 0.4, skills: 0.4, education: 0.15, transferability: 0.05 };
      case 'transferable':
        return { experience: 0.25, skills: 0.35, education: 0.2, transferability: 0.2 };
      case 'entry-level':
        return { experience: 0.1, skills: 0.35, education: 0.45, transferability: 0.1 };
      case 'career-change':
        return { experience: 0.15, skills: 0.35, education: 0.25, transferability: 0.25 };
      default:
        return { experience: 0.3, skills: 0.4, education: 0.2, transferability: 0.1 };
    }
  }

  calculateEducationMatch(cvData, jobData) {
    if (cvData.education.length === 0) {
      // No education listed
      return jobData.qualifications.length === 0 ? 70 : 40;
    }

    const cvEducationLevels = cvData.education.map(edu => edu.level?.toLowerCase() || '');
    const cvEducationFields = cvData.education.map(edu => edu.field?.toLowerCase() || '');
    
    let educationScore = 50; // Base score for having education

    // Check degree level requirements
    const requiresBachelor = jobData.qualifications.some(qual => 
      qual.toLowerCase().includes('bachelor') || qual.toLowerCase().includes('degree')
    );
    const requiresMaster = jobData.qualifications.some(qual => 
      qual.toLowerCase().includes('master') || qual.toLowerCase().includes('msc') || qual.toLowerCase().includes('mba')
    );

    const hasBachelor = cvEducationLevels.some(level => 
      level.includes('bachelor') || level.includes('degree')
    );
    const hasMaster = cvEducationLevels.some(level => 
      level.includes('master') || level.includes('msc') || level.includes('mba')
    );

    if (requiresMaster && hasMaster) educationScore = 95;
    else if (requiresMaster && hasBachelor) educationScore = 75;
    else if (requiresBachelor && hasBachelor) educationScore = 90;
    else if (requiresBachelor && !hasBachelor) educationScore = 45;

    // Check field relevance
    const jobIndustryKeywords = this.getIndustryRequirements(jobData.industry).keywords;
    const fieldRelevant = cvEducationFields.some(field => 
      jobIndustryKeywords.some(keyword => 
        field.includes(keyword.toLowerCase()) || keyword.toLowerCase().includes(field)
      )
    );

    if (fieldRelevant) educationScore += 15;

    return Math.min(educationScore, 100);
  }

  calculateTransferabilityScore(cvData, jobData) {
    const cvIndustry = cvData.currentField;
    const jobIndustry = jobData.industry;

    if (cvIndustry === jobIndustry) return 100; // Same field

    const industryReqs = this.getIndustryRequirements(jobIndustry);
    
    // Special high-compatibility cases (emergency services → building safety, etc.)
    const specialHighTransfers = {
      'emergency_services': ['building_safety', 'safety', 'construction', 'healthcare'],
      'building_safety': ['emergency_services', 'safety', 'construction'],
      'engineering': ['construction', 'manufacturing', 'technology'],
      'finance': ['business', 'consulting', 'data analysis'],
      'healthcare': ['emergency_services', 'social work', 'research']
    };

    // Check for special high-compatibility transfers (90+ score)
    if (specialHighTransfers[cvIndustry]?.includes(jobIndustry)) {
      return 95;
    }

    // High transferability from mappings (85+ score)
    if (industryReqs.transferableFrom.includes(cvIndustry)) {
      return 85;
    }
    
    // Check for transferable skills (medium transferability)
    const transferableSkills = ['leadership', 'management', 'communication', 'problem-solving', 'teamwork', 'project management', 'safety', 'compliance', 'risk assessment'];
    const hasTransferableSkills = cvData.skills.some(skill => 
      transferableSkills.some(transferable => 
        skill.toLowerCase().includes(transferable)
      )
    );

    if (hasTransferableSkills) return 65;

    // Low transferability for incompatible fields
    if (industryReqs.incompatibleFields.includes(cvIndustry)) return 25;

    return 45; // Moderate transferability
  }

  calculateOverallCompatibility(matchResult) {
    const weights = this.getWeightsByMatchType(matchResult.matchType);
    
    // CRITICAL FIX: Proper weighted score calculation
    const weightedScore = (
      matchResult.experienceMatch * weights.experience +
      matchResult.skillsMatch * weights.skills +
      matchResult.educationMatch * weights.education +
      matchResult.transferabilityScore * weights.transferability
    );

    // Dynamic adjustments based on match quality
    let finalScore = weightedScore;
    
    // Career stage adjustments
    if (matchResult.careerStage === 'senior' && matchResult.experienceMatch > 90) {
      finalScore += 5; // Bonus for senior candidates with excellent experience
    }
    
    if (matchResult.careerStage === 'entry' && matchResult.educationMatch > 85) {
      finalScore += 5; // Bonus for entry-level with strong education
    }
    
    // Match type specific adjustments
    if (matchResult.matchType === 'transferable' && matchResult.skillsMatch > 80) {
      finalScore += 5; // Bonus for transferable candidates with strong skills
    }

    return Math.round(Math.min(100, Math.max(0, finalScore)));
  }

  extractRequiredExperience(jobData) {
    if (!jobData.experience || jobData.experience.length === 0) return 0;
    return Math.max(...jobData.experience);
  }

  identifyStrengthAreas(cvData, jobData) {
    const strengths = [];
    
    // Experience strengths
    if (cvData.experienceYears > this.extractRequiredExperience(jobData)) {
      strengths.push('Extensive relevant experience');
    }
    
    // Skills strengths
    const matchedSkills = this.findMatchedSkills(cvData.skills, jobData.requiredSkills);
    if (matchedSkills.length > 0) {
      strengths.push(`Strong skills match: ${matchedSkills.slice(0, 3).join(', ')}`);
    }
    
    // Education strengths
    if (cvData.education.length > 0) {
      strengths.push('Relevant educational background');
    }
    
    // Achievement strengths
    if (cvData.achievements.length > 0) {
      strengths.push('Demonstrated achievements and results');
    }

    return strengths.slice(0, 5);
  }

  identifyGapAreas(cvData, jobData) {
    const gaps = [];
    
    // Experience gaps
    const requiredExp = this.extractRequiredExperience(jobData);
    if (cvData.experienceYears < requiredExp) {
      gaps.push(`${requiredExp - cvData.experienceYears} years additional experience needed`);
    }
    
    // Skills gaps
    const missingSkills = this.findMissingSkills(cvData.skills, jobData.requiredSkills);
    if (missingSkills.length > 0) {
      gaps.push(`Missing key skills: ${missingSkills.slice(0, 3).join(', ')}`);
    }
    
    // Qualification gaps
    const missingQuals = this.findMissingQualifications(cvData.qualifications, jobData.qualifications);
    if (missingQuals.length > 0) {
      gaps.push(`Missing qualifications: ${missingQuals.slice(0, 2).join(', ')}`);
    }

    return gaps.slice(0, 5);
  }

  createDevelopmentPath(gapAreas, matchType) {
    const path = [];
    
    switch (matchType) {
      case 'entry-level':
        path.push('Focus on relevant coursework and certifications');
        path.push('Seek internships or entry-level positions');
        path.push('Build portfolio of relevant projects');
        break;
      case 'career-change':
        path.push('Complete industry-specific training');
        path.push('Highlight transferable skills');
        path.push('Network within target industry');
        break;
      case 'transferable':
        path.push('Obtain industry-specific certifications');
        path.push('Emphasize relevant experience');
        break;
      default:
        path.push('Address specific skill gaps');
        path.push('Gain additional relevant experience');
    }

    return path.slice(0, 4);
  }

  findMatchedSkills(cvSkills, jobSkills) {
    const matched = [];
    cvSkills.forEach(cvSkill => {
      jobSkills.forEach(jobSkill => {
        if (cvSkill.toLowerCase().includes(jobSkill.toLowerCase()) || 
            jobSkill.toLowerCase().includes(cvSkill.toLowerCase())) {
          matched.push(cvSkill);
        }
      });
    });
    return [...new Set(matched)];
  }

  findMissingSkills(cvSkills, jobSkills) {
    const cvSkillsLower = cvSkills.map(skill => skill.toLowerCase());
    return jobSkills.filter(jobSkill => 
      !cvSkillsLower.some(cvSkill => 
        cvSkill.includes(jobSkill.toLowerCase()) || 
        jobSkill.toLowerCase().includes(cvSkill)
      )
    );
  }

  findMissingQualifications(cvQuals, jobQuals) {
    const cvQualsLower = cvQuals.map(qual => qual.toLowerCase());
    return jobQuals.filter(jobQual => 
      !cvQualsLower.some(cvQual => 
        cvQual.includes(jobQual.toLowerCase()) || 
        jobQual.toLowerCase().includes(cvQual)
      )
    );
  }

  // Combine universal algorithmic results with AI enhancement
  combineUniversalAndAIResults(universalMatch, aiResults, cvData, jobData) {
    // Calculate confidence based on CV quality and match certainty
    const baseConfidence = this.calculateConfidenceScore(universalMatch, cvData, jobData);
    
    // Base result from enhanced universal algorithm
    const result = {
      // Core scores (algorithmic with quality adjustments)
      score: universalMatch.overallCompatibility,
      experienceRelevance: universalMatch.experienceMatch,
      skillsAlignment: universalMatch.skillsMatch,
      qualificationMatch: universalMatch.educationMatch,
      fieldCompatibility: universalMatch.matchType,
      
      // Additional scores
      formatScore: 75, // Default formatting score
      contentScore: this.calculateContentScore(cvData),
      jobFitScore: universalMatch.overallCompatibility,
      atsCompliance: this.calculateATSCompliance(cvData),
      
      // Analysis details
      experienceLevel: this.mapCareerStageToExperienceLevel(universalMatch.careerStage),
      careerStage: universalMatch.careerStage,
      
      // Algorithmic insights
      strengths: universalMatch.strengthAreas,
      keySkillGaps: universalMatch.gapAreas,
      improvements: universalMatch.developmentPath,
      transferableSkills: this.identifyTransferableSkills(cvData, jobData),
      
      // Dynamic recommendations
      missingKeywords: this.findMissingSkills(cvData.skills, jobData.keywords),
      missingSkills: this.findMissingSkills(cvData.skills, jobData.requiredSkills),
      recommendations: this.generateDynamicRecommendations(universalMatch, cvData, jobData),
      
      // Career guidance
      careerTransitionAdvice: this.generateTransitionAdvice(universalMatch.matchType, cvData, jobData),
      timeToCompetitive: this.estimateTimeToCompetitive(universalMatch, cvData, jobData),
      
      // Additional insights
      competitiveAdvantages: this.identifyCompetitiveAdvantages(cvData, jobData),
      developmentPriorities: universalMatch.developmentPath.slice(0, 3),
      certificationRecommendations: this.recommendCertifications(jobData.industry, jobData.role),
      nextSteps: this.generateNextSteps(universalMatch.matchType, universalMatch.gapAreas),
      
      // ATS optimization
      atsOptimization: {
        keywordDensity: this.calculateKeywordDensity(cvData, jobData),
        missingAtsKeywords: this.findMissingSkills(cvData.keywords, jobData.keywords).slice(0, 6),
        formatIssues: this.identifyFormatIssues(cvData),
        optimizationTips: this.generateATSOptimizationTips(cvData, jobData)
      },
      
      // Analysis metadata
      relevanceAnalysis: this.generateRelevanceAnalysis(universalMatch, cvData, jobData),
      analysisType: 'universal',
      confidence: this.calculateConfidenceScore(universalMatch, cvData, jobData)
    };

    // Enhance with AI insights if available
    if (aiResults && aiResults.length > 0) {
      const aiResult = this.createConsensusAnalysis(aiResults, null, jobData.industry, jobData.role);
      
      // Blend AI insights with algorithmic results
      result.strengths = this.blendArrayResults(result.strengths, aiResult.strengths, 5);
      result.recommendations = this.blendArrayResults(result.recommendations, aiResult.recommendations, 5);
      result.improvements = this.blendArrayResults(result.improvements, aiResult.improvements, 4);
      result.relevanceAnalysis = aiResult.relevanceAnalysis || result.relevanceAnalysis;
      result.analysisType = 'hybrid';
      
      // Adjust scores slightly based on AI input
      result.score = Math.round((result.score * 0.7) + (aiResult.score * 0.3));
    }

    return result;
  }

  // Generate fallback analysis for critical errors
  generateFallbackAnalysis(cvText, industry, role) {
    const basicData = {
      skills: this.extractBasicSkills(cvText),
      experienceYears: this.estimateExperienceYears(cvText),
      hasEducation: cvText.toLowerCase().includes('bachelor') || cvText.toLowerCase().includes('degree'),
      currentField: this.detectCurrentField(cvText)
    };

    return {
      score: 60, // Neutral score
      formatScore: 70,
      contentScore: 65,
      jobFitScore: 60,
      atsCompliance: 65,
      experienceRelevance: 60,
      skillsAlignment: 60,
      qualificationMatch: 60,
      
      strengths: ['Professional experience demonstrated', 'Clear communication evident'],
      recommendations: ['Optimize for ATS systems', 'Highlight relevant achievements', 'Add quantifiable results'],
      missingKeywords: ['industry-specific keywords', 'technical skills', 'certifications'],
      missingSkills: ['role-specific skills', 'technical competencies'],
      improvements: ['Add relevant certifications', 'Quantify achievements', 'Improve keyword optimization', 'Strengthen skills section'],
      
      experienceLevel: basicData.experienceYears > 5 ? 'mid' : 'entry',
      careerStage: 'transitional',
      fieldCompatibility: 'medium',
      
      transferableSkills: ['Communication', 'Problem-solving', 'Teamwork'],
      careerTransitionAdvice: 'Focus on developing relevant skills for target role',
      timeToCompetitive: '6-12 months with focused development',
      
      competitiveAdvantages: ['Diverse experience', 'Adaptability'],
      developmentPriorities: ['Skill development', 'Industry knowledge', 'Certification'],
      certificationRecommendations: ['Industry-specific certifications'],
      nextSteps: ['Skill assessment', 'Training plan', 'Network building'],
      
      atsOptimization: {
        keywordDensity: 'low',
        missingAtsKeywords: ['role keywords', 'industry terms'],
        formatIssues: ['Keyword optimization needed'],
        optimizationTips: ['Add industry keywords', 'Use standard formatting', 'Include relevant skills']
      },
      
      relevanceAnalysis: 'Basic analysis completed with limited data',
      analysisType: 'fallback',
      confidence: 60
    };
  }

  // Helper functions for the universal system
  calculateContentScore(cvData) {
    let score = 50; // Base score
    
    if (cvData.skills.length > 5) score += 15;
    if (cvData.experience.length > 0) score += 15;
    if (cvData.education.length > 0) score += 10;
    if (cvData.achievements.length > 0) score += 10;
    
    return Math.min(score, 100);
  }

  calculateATSCompliance(cvData) {
    let score = 60; // Base score
    
    if (cvData.skills.length > 8) score += 10;
    if (cvData.keywords.length > 15) score += 10;
    if (cvData.qualifications.length > 0) score += 10;
    if (cvData.achievements.length > 3) score += 10;
    
    return Math.min(score, 100);
  }

  mapCareerStageToExperienceLevel(careerStage) {
    const mapping = {
      'graduate': 'entry',
      'entry': 'entry',
      'junior': 'junior',
      'mid': 'mid',
      'senior': 'senior'
    };
    return mapping[careerStage] || 'mid';
  }

  identifyTransferableSkills(cvData, jobData) {
    const universalSkills = ['leadership', 'communication', 'problem-solving', 'teamwork', 'project management', 'analytical thinking'];
    return cvData.skills.filter(skill => 
      universalSkills.some(universal => 
        skill.toLowerCase().includes(universal) || universal.includes(skill.toLowerCase())
      )
    ).slice(0, 5);
  }

  generateDynamicRecommendations(universalMatch, cvData, jobData) {
    const recommendations = [];
    
    if (universalMatch.experienceMatch < 70) {
      recommendations.push('Highlight relevant experience more prominently');
    }
    if (universalMatch.skillsMatch < 70) {
      recommendations.push('Add industry-specific skills and keywords');
    }
    if (universalMatch.educationMatch < 70) {
      recommendations.push('Consider additional certifications or training');
    }
    if (cvData.achievements.length < 3) {
      recommendations.push('Add quantifiable achievements and results');
    }
    
    return recommendations.slice(0, 5);
  }

  generateTransitionAdvice(matchType, cvData, jobData) {
    switch (matchType) {
      case 'direct':
        return 'Optimize your CV to highlight direct experience and relevant achievements';
      case 'transferable':
        return 'Emphasize transferable skills and relevant experience while addressing industry-specific gaps';
      case 'entry-level':
        return 'Focus on education, projects, and transferable skills to demonstrate potential';
      case 'career-change':
        return 'Highlight transferable skills and consider additional training to bridge the gap';
      default:
        return 'Develop relevant skills and experience for your target role';
    }
  }

  estimateTimeToCompetitive(universalMatch, cvData, jobData) {
    const score = universalMatch.overallCompatibility;
    
    if (score >= 80) return '1-3 months';
    if (score >= 60) return '3-6 months';
    if (score >= 40) return '6-12 months';
    return '12+ months';
  }

  blendArrayResults(array1, array2, maxItems) {
    const combined = [...array1, ...array2];
    const unique = [...new Set(combined)];
    return unique.slice(0, maxItems);
  }

  extractBasicSkills(cvText) {
    const commonSkills = ['communication', 'leadership', 'teamwork', 'problem-solving', 'management'];
    const cvLower = cvText.toLowerCase();
    return commonSkills.filter(skill => cvLower.includes(skill));
  }

  estimateExperienceYears(cvText) {
    const yearMatches = cvText.match(/\d{4}/g) || [];
    const currentYear = new Date().getFullYear();
    const years = yearMatches.map(y => parseInt(y)).filter(y => y > 1990 && y <= currentYear);
    
    if (years.length >= 2) {
      return currentYear - Math.min(...years);
    }
    return 0;
  }

  // Additional helper functions for universal system
  identifyCompetitiveAdvantages(cvData, jobData) {
    const advantages = [];
    
    if (cvData.experienceYears > 5) {
      advantages.push('Extensive professional experience');
    }
    if (cvData.achievements.length > 3) {
      advantages.push('Demonstrated track record of achievements');
    }
    if (cvData.education.length > 1) {
      advantages.push('Strong educational background');
    }
    if (cvData.qualifications.length > 0) {
      advantages.push('Professional certifications and qualifications');
    }
    
    return advantages.slice(0, 4);
  }

  recommendCertifications(industry, role) {
    const certificationMap = {
      'technology': ['AWS Certified', 'Microsoft Certified', 'Google Cloud Certified', 'Scrum Master'],
      'healthcare': ['CPR Certification', 'Medical Assistant Certification', 'Healthcare Management'],
      'finance': ['CPA', 'CFA', 'FRM', 'Series 7'],
      'building_safety': ['NEBOSH General Certificate', 'IOSH Managing Safely', 'Fire Safety Certification'],
      'construction': ['OSHA 30', 'Construction Safety Certification', 'Project Management'],
      'education': ['Teaching License', 'Educational Leadership Certification', 'Subject Matter Certification'],
      'marketing': ['Google Analytics', 'Digital Marketing Certification', 'HubSpot Certification'],
      'sales': ['Sales Certification', 'CRM Certification', 'Negotiation Training']
    };
    
    return certificationMap[industry] || ['Industry-specific certification', 'Professional development courses'];
  }

  generateNextSteps(matchType, gapAreas) {
    const steps = [];
    
    switch (matchType) {
      case 'entry-level':
        steps.push('Complete relevant online courses');
        steps.push('Build a portfolio of projects');
        steps.push('Apply for internships or entry-level positions');
        break;
      case 'career-change':
        steps.push('Enroll in industry-specific training');
        steps.push('Network with professionals in target field');
        steps.push('Consider transitional roles');
        break;
      case 'transferable':
        steps.push('Highlight transferable skills in CV');
        steps.push('Obtain industry-specific certifications');
        steps.push('Gain relevant experience through projects');
        break;
      default:
        steps.push('Address identified skill gaps');
        steps.push('Optimize CV for target role');
        steps.push('Expand professional network');
    }
    
    return steps.slice(0, 4);
  }

  calculateKeywordDensity(cvData, jobData) {
    if (jobData.keywords.length === 0) return 'medium';
    
    const cvKeywords = cvData.keywords.map(k => k.toLowerCase());
    const jobKeywords = jobData.keywords.map(k => k.toLowerCase());
    
    const matches = jobKeywords.filter(jobKeyword => 
      cvKeywords.some(cvKeyword => 
        cvKeyword.includes(jobKeyword) || jobKeyword.includes(cvKeyword)
      )
    );
    
    const density = (matches.length / jobKeywords.length) * 100;
    
    if (density > 70) return 'high';
    if (density > 40) return 'medium';
    return 'low';
  }

  identifyFormatIssues(cvData) {
    const issues = [];
    
    if (cvData.skills.length < 5) {
      issues.push('Limited skills section');
    }
    if (cvData.achievements.length < 2) {
      issues.push('Lack of quantifiable achievements');
    }
    if (cvData.keywords.length < 10) {
      issues.push('Insufficient keyword optimization');
    }
    
    return issues.slice(0, 4);
  }

  generateATSOptimizationTips(cvData, jobData) {
    const tips = [];
    
    if (this.calculateKeywordDensity(cvData, jobData) === 'low') {
      tips.push('Increase relevant keyword density throughout CV');
    }
    if (cvData.skills.length < 8) {
      tips.push('Expand skills section with industry-specific terms');
    }
    if (cvData.achievements.length < 3) {
      tips.push('Add quantified achievements with numbers and percentages');
    }
    tips.push('Use standard section headings (Experience, Education, Skills)');
    
    return tips.slice(0, 4);
  }

  generateRelevanceAnalysis(universalMatch, cvData, jobData) {
    const { matchType, careerStage, overallCompatibility } = universalMatch;
    
    let analysis = `Career stage: ${careerStage}. Match type: ${matchType}. `;
    
    if (overallCompatibility >= 80) {
      analysis += 'Strong alignment with role requirements. ';
    } else if (overallCompatibility >= 60) {
      analysis += 'Good potential with some development needed. ';
    } else if (overallCompatibility >= 40) {
      analysis += 'Moderate fit requiring significant skill development. ';
    } else {
      analysis += 'Limited alignment, major career transition required. ';
    }
    
    if (matchType === 'transferable') {
      analysis += 'Transferable skills provide a foundation for role transition.';
    } else if (matchType === 'entry-level') {
      analysis += 'Educational background and potential are key strengths.';
    } else if (matchType === 'career-change') {
      analysis += 'Professional experience exists but requires significant retraining.';
    }
    
    return analysis;
  }

  calculateConfidenceScore(universalMatch, cvData, jobData) {
    let confidence = 70; // Base confidence
    
    // Higher confidence for more data
    if (cvData.skills.length > 8) confidence += 5;
    if (cvData.experience.length > 2) confidence += 5;
    if (cvData.education.length > 0) confidence += 5;
    if (cvData.achievements.length > 3) confidence += 5;
    
    // Higher confidence for clear matches
    if (universalMatch.overallCompatibility > 80) confidence += 10;
    if (universalMatch.matchType === 'direct') confidence += 10;
    
    return Math.min(confidence, 100);
  }

  // NEW: Extract detailed work history with context
  extractDetailedWorkHistory(text) {
    const workHistory = [];
    const jobPatterns = [
      /(\w+[\w\s]*?)\s*(?:at|@)\s*([\w\s&.,]+?)\s*(?:from|since|\()\s*([\d\w\s,-]+)/gi,
      /([\w\s]+?)\s*-\s*([\w\s&.,]+?)\s*\(?([\d\w\s,-]+)\)?/gi
    ];

    jobPatterns.forEach(pattern => {
      const matches = [...text.matchAll(pattern)];
      matches.forEach(match => {
        if (match[1] && match[2] && match[3]) {
          workHistory.push({
            title: match[1].trim(),
            company: match[2].trim(),
            period: match[3].trim(),
            description: this.extractJobDescription(text, match[1], match[2])
          });
        }
      });
    });

    return workHistory;
  }

  // NEW: Extract job descriptions for context
  extractJobDescription(text, title, company) {
    const searchText = `${title}.*?${company}`;
    const regex = new RegExp(`${searchText}[^\\n]*([\\s\\S]*?)(?=\\n\\s*[A-Z]|$)`, 'i');
    const match = text.match(regex);
    return match && match[1] ? match[1].trim().substring(0, 200) : '';
  }

  // NEW: Extract certifications
  extractCertifications(text) {
    const certificationPatterns = [
      /(?:certified|certification|cert\.?)\s+([^.,\n]+)/gi,
      /([A-Z]+\s*\+?)\s*(?:certified|certification)/gi,
      /(?:aws|azure|google cloud|cisco|microsoft|oracle|salesforce)\s+([^.,\n]+)/gi
    ];

    const certifications = new Set();
    certificationPatterns.forEach(pattern => {
      const matches = [...text.matchAll(pattern)];
      matches.forEach(match => {
        if (match[1] && match[1].length > 2 && match[1].length < 50) {
          certifications.add(match[1].trim());
        }
      });
    });

    return [...certifications];
  }

  // NEW: Extract languages
  extractLanguages(text) {
    const languagePatterns = [
      /(?:languages?|linguistic|fluent in|speak|native|bilingual)[^.]*?([^.,\n]+)/gi,
      /(?:english|spanish|french|german|mandarin|chinese|japanese|korean|arabic|portuguese|italian|russian)\s*(?:\([^)]*\))?/gi
    ];

    const languages = new Set();
    languagePatterns.forEach(pattern => {
      const matches = [...text.matchAll(pattern)];
      matches.forEach(match => {
        if (match[1]) {
          const langs = match[1].split(/[,&]/).map(lang => lang.trim());
          langs.forEach(lang => {
            if (lang.length > 2 && lang.length < 20) {
              languages.add(lang);
            }
          });
        } else if (match[0] && match[0].length < 20) {
          languages.add(match[0].trim());
        }
      });
    });

    return [...languages];
  }

  // NEW: Extract projects
  extractProjects(text) {
    const projectPatterns = [
      /(?:projects?|portfolio)[^.]*?([^.]+)/gi,
      /(?:developed|built|created|designed)\s+([^.,\n]{10,60})/gi
    ];

    const projects = new Set();
    projectPatterns.forEach(pattern => {
      const matches = [...text.matchAll(pattern)];
      matches.forEach(match => {
        if (match[1] && match[1].length > 10 && match[1].length < 100) {
          projects.add(match[1].trim());
        }
      });
    });

    return [...projects];
  }

  // NEW: Assess section quality for confidence scoring
  assessSectionQuality(fullText, sections) {
    const quality = {};
    
    // Skills section quality
    quality.skills = this.assessSkillsSectionQuality(sections.skills, fullText);
    
    // Experience section quality  
    quality.experience = this.assessExperienceSectionQuality(sections.experience, fullText);
    
    // Education section quality
    quality.education = this.assessEducationSectionQuality(sections.education, fullText);
    
    return quality;
  }

  // NEW: Assess skills section quality
  assessSkillsSectionQuality(skillsSection, fullText) {
    let score = 50; // Base score
    
    if (skillsSection) {
      score += 20; // Has dedicated skills section
      
      const skillCount = (skillsSection.match(/[,\n•-]/g) || []).length;
      if (skillCount > 5) score += 15;
      if (skillCount > 10) score += 10;
      
      // Check for technical vs soft skill balance
      const techSkills = (skillsSection.match(/(?:javascript|python|java|sql|aws|react|angular|docker)/gi) || []).length;
      const softSkills = (skillsSection.match(/(?:leadership|communication|teamwork|management)/gi) || []).length;
      if (techSkills > 0 && softSkills > 0) score += 15;
    } else {
      // Deduct for missing skills section, but check if skills are embedded
      const embeddedSkills = (fullText.match(/(?:skilled in|proficient in|experience with)/gi) || []).length;
      if (embeddedSkills > 3) score += 10;
    }
    
    return Math.min(score, 100);
  }

  // NEW: Assess experience section quality
  assessExperienceSectionQuality(experienceSection, fullText) {
    let score = 50;
    
    if (experienceSection) {
      score += 20;
      
      // Check for quantified achievements
      const numbers = (experienceSection.match(/\d+%|\$\d+|\d+\s*(?:years?|months?|days?)|increased|improved|reduced/gi) || []).length;
      if (numbers > 2) score += 15;
      if (numbers > 5) score += 10;
      
      // Check for action verbs
      const actionVerbs = (experienceSection.match(/(?:managed|led|developed|implemented|achieved|delivered|created|improved)/gi) || []).length;
      if (actionVerbs > 3) score += 15;
    } else {
      score -= 20;
    }
    
    return Math.min(score, 100);
  }

  // NEW: Assess education section quality
  assessEducationSectionQuality(educationSection, fullText) {
    let score = 50;
    
    if (educationSection) {
      score += 15;
      
      // Check for degree types
      const degrees = (educationSection.match(/(?:bachelor|master|phd|diploma|certificate)/gi) || []).length;
      if (degrees > 0) score += 20;
      
      // Check for institutions
      const institutions = (educationSection.match(/university|college|institute|school/gi) || []).length;
      if (institutions > 0) score += 15;
    }
    
    return Math.min(score, 100);
  }

  // ENHANCED: Semantic skill matching for related concepts with confidence scoring
  findSemanticSkillMatches(cvSkills, jobSkills) {
    const semanticMappings = {
      // Leadership and management
      'leadership': ['management', 'team lead', 'supervision', 'coordination', 'director'],
      'management': ['leadership', 'oversight', 'administration', 'coordination'],
      'project management': ['project coordination', 'program management', 'project delivery'],
      
      // Safety and compliance (CRITICAL for emergency services)
      'safety': ['health and safety', 'risk management', 'compliance', 'security'],
      'fire safety': ['building safety', 'emergency response', 'risk assessment', 'fire protection'],
      'building safety': ['fire safety', 'construction safety', 'safety management'],
      'risk assessment': ['hazard identification', 'safety analysis', 'compliance', 'risk evaluation'],
      'emergency response': ['crisis management', 'incident response', 'emergency planning'],
      
      // Technical skills
      'analysis': ['analytical', 'data analysis', 'research', 'evaluation'],
      'problem solving': ['troubleshooting', 'resolution', 'critical thinking'],
      'communication': ['presentation', 'interpersonal', 'client relations'],
      
      // Industry specific transferable skills
      'customer service': ['client relations', 'customer support', 'customer care'],
      'quality control': ['quality assurance', 'quality management', 'inspection'],
      'training': ['teaching', 'education', 'development', 'coaching'],
      'documentation': ['record keeping', 'reporting', 'administration'],
      
      // Technology skills
      'development': ['programming', 'coding', 'software engineering'],
      'database': ['sql', 'data management', 'data storage'],
      'cloud': ['aws', 'azure', 'cloud computing']
    };

    const matches = [];
    cvSkills.forEach(cvSkill => {
      jobSkills.forEach(jobSkill => {
        // Check semantic mappings
        for (const [concept, synonyms] of Object.entries(semanticMappings)) {
          if ((cvSkill.includes(concept) || synonyms.some(syn => cvSkill.includes(syn))) &&
              (jobSkill.includes(concept) || synonyms.some(syn => jobSkill.includes(syn)))) {
            matches.push(jobSkill);
          }
        }
      });
    });

    return [...new Set(matches)];
  }

  // ENHANCED: Find contextual matches based on industry knowledge and transferability
  findContextualSkillMatches(cvData, jobData) {
    const matches = [];
    const cvField = cvData.currentField;
    const jobIndustry = jobData.industry;

    // CRITICAL: Industry context mappings for transferable skills
    const industryContexts = {
      'emergency_services': {
        'leadership': ['team management', 'crisis leadership', 'incident command', 'emergency coordination'],
        'training': ['emergency training', 'safety training', 'professional development', 'skills training'],
        'assessment': ['risk assessment', 'incident analysis', 'safety evaluation', 'hazard assessment'],
        'safety': ['fire safety', 'building safety', 'health and safety', 'safety management'],
        'management': ['operations management', 'crisis management', 'resource management'],
        'response': ['emergency response', 'incident response', 'crisis response']
      },
      'healthcare': {
        'care': ['patient care', 'clinical care', 'health services', 'medical care'],
        'documentation': ['medical records', 'clinical documentation', 'patient records'],
        'emergency': ['emergency response', 'urgent care', 'crisis management'],
        'assessment': ['patient assessment', 'clinical assessment', 'health evaluation'],
        'communication': ['patient communication', 'medical communication', 'healthcare communication']
      },
      'technology': {
        'development': ['software development', 'system development', 'application development'],
        'analysis': ['data analysis', 'system analysis', 'technical analysis'],
        'design': ['system design', 'software design', 'technical design'],
        'management': ['project management', 'technical management', 'system management']
      },
      'finance': {
        'analysis': ['financial analysis', 'data analysis', 'market analysis'],
        'management': ['portfolio management', 'risk management', 'asset management'],
        'reporting': ['financial reporting', 'compliance reporting', 'regulatory reporting'],
        'assessment': ['risk assessment', 'financial assessment', 'credit assessment']
      },
      'construction': {
        'safety': ['building safety', 'construction safety', 'site safety'],
        'management': ['project management', 'construction management', 'site management'],
        'assessment': ['safety assessment', 'building assessment', 'structural assessment'],
        'planning': ['project planning', 'construction planning', 'site planning']
      }
    };

    if (industryContexts[cvField]) {
      const contextMappings = industryContexts[cvField];
      cvData.skills.forEach(cvSkill => {
        for (const [baseSkill, contextualSkills] of Object.entries(contextMappings)) {
          if (cvSkill.toLowerCase().includes(baseSkill)) {
            jobData.requiredSkills.forEach(jobSkill => {
              if (contextualSkills.some(contextSkill => 
                jobSkill.toLowerCase().includes(contextSkill.toLowerCase()))) {
                matches.push(jobSkill);
              }
            });
          }
        }
      });
    }

    return [...new Set(matches)];
  }

  // ENHANCED: Calculate universal transferability bonus with quality assessment
  calculateUniversalTransferabilityBonus(cvData, jobData) {
    let bonus = 0;
    const cvField = cvData.currentField;
    const jobIndustry = jobData.industry;
    const sectionQuality = cvData.sectionQuality || {};

    // High-value transferable experience patterns
    const universalTransferables = [
      'leadership', 'management', 'communication', 'problem solving',
      'project management', 'training', 'analysis', 'compliance',
      'safety', 'emergency response', 'customer service', 'teamwork'
    ];

    // Count high-value transferable skills with quality weighting
    const transferableCount = cvData.skills.filter(skill => 
      universalTransferables.some(transferable => 
        skill.toLowerCase().includes(transferable.toLowerCase())
      )
    ).length;

    // Base transferability bonus with quality adjustment
    let baseBonus = Math.min(15, transferableCount * 2);
    
    // Quality adjustment for skills section
    const skillsQuality = sectionQuality.skills || 70;
    if (skillsQuality > 80) baseBonus *= 1.1;
    else if (skillsQuality < 50) baseBonus *= 0.8;
    
    bonus += baseBonus;

    // Experience level bonus for senior candidates
    if (cvData.experienceYears >= 5) {
      bonus += 10;
    }
    if (cvData.experienceYears >= 10) {
      bonus += 5; // Additional bonus for very experienced candidates
    }

    // CRITICAL: Industry-specific high transferability with confidence scoring
    const industryTransferability = {
      'emergency_services_to_building_safety': 30, // VERY HIGH - fire safety expertise
      'emergency_services_to_safety': 28,
      'emergency_services_to_healthcare': 25,
      'emergency_services_to_construction': 22,
      'healthcare_to_emergency': 20,
      'engineering_to_construction': 25,
      'engineering_to_technology': 20,
      'finance_to_business': 18,
      'education_to_training': 20,
      'military_to_security': 25,
      'military_to_emergency_services': 20,
      'management_to_management': 15,
      'construction_to_building_safety': 25,
      'technology_to_engineering': 18
    };

    // Apply specific transferability bonuses
    const transferKey = `${cvField}_to_${jobIndustry}`;
    if (industryTransferability[transferKey]) {
      bonus += industryTransferability[transferKey];
    }

    // Cross-industry management experience with seniority bonus
    if (cvData.skills.some(skill => skill.toLowerCase().includes('management')) &&
        jobData.requiredSkills.some(skill => skill.toLowerCase().includes('management'))) {
      const mgmtBonus = cvData.experienceYears >= 5 ? 15 : 10;
      bonus += mgmtBonus;
    }

    // CRITICAL: Emergency services specific bonuses (addressing original issue)
    if (cvField === 'emergency_services') {
      // Fire safety expertise bonus
      if (cvData.skills.some(skill => 
        ['fire safety', 'fire risk', 'fire protection', 'building safety'].some(keyword =>
          skill.toLowerCase().includes(keyword)))) {
        bonus += 20;
      }
      
      // IOSH/NEBOSH certification bonus
      if (cvData.qualifications.some(qual => 
        ['iosh', 'nebosh', 'health and safety'].some(keyword =>
          qual.toLowerCase().includes(keyword)))) {
        bonus += 15;
      }
      
      // Leadership in emergency context bonus
      if (cvData.skills.some(skill => 
        ['watch manager', 'station manager', 'incident command', 'team leader'].some(keyword =>
          skill.toLowerCase().includes(keyword)))) {
        bonus += 10;
      }
    }

    return Math.min(35, bonus); // Increased cap for high-transferability scenarios
  }

  // ENHANCED: Check if two skills are semantically similar with confidence scoring
  areSkillsSimilar(skill1, skill2) {
    const similarityMappings = [
      ['javascript', 'js'],
      ['python', 'py'],
      ['management', 'mgmt'],
      ['administration', 'admin'],
      ['development', 'dev'],
      ['analysis', 'analytics'],
      ['customer service', 'customer support'],
      ['project management', 'project coordination'],
      ['fire safety', 'fire protection'],
      ['building safety', 'construction safety'],
      ['emergency response', 'crisis management'],
      ['risk assessment', 'safety assessment'],
      ['quality assurance', 'quality control']
    ];

    return similarityMappings.some(([term1, term2]) => 
      (skill1.includes(term1) && skill2.includes(term2)) ||
      (skill1.includes(term2) && skill2.includes(term1))
    );
  }

  // REVOLUTIONARY: Enhanced Feedback Generation for ANY CV/Job Combination
  generatePersonalizedFeedback(cvData, jobData, universalMatch) {
    const feedback = {
      specificStrengths: [],
      preciseDevelopmentAreas: [],
      personalizedNextSteps: [],
      industrySpecificAdvice: [],
      qualificationGaps: [],
      certificationRecommendations: [],
      skillDevelopmentPlan: []
    };

    // SPECIFIC STRENGTHS based on actual CV content
    if (cvData.experienceYears >= jobData.requiredExperience) {
      feedback.specificStrengths.push(`Strong ${cvData.experienceYears}-year track record in ${cvData.currentField}, exceeding the ${jobData.requiredExperience}-year requirement`);
    }

    if (cvData.leadershipExperience && cvData.leadershipExperience.length > 0) {
      feedback.specificStrengths.push(`Proven leadership experience: ${cvData.leadershipExperience[0]}`);
    }

    if (cvData.quantifiedAchievements && cvData.quantifiedAchievements.length > 0) {
      feedback.specificStrengths.push(`Demonstrated impact with quantified results: ${cvData.quantifiedAchievements[0]}`);
    }

    // PRECISE DEVELOPMENT AREAS based on specific gaps
    const missingSkills = this.findMissingSkills(cvData.skills, jobData.requiredSkills);
    missingSkills.forEach(skill => {
      feedback.preciseDevelopmentAreas.push(`Develop expertise in ${skill} - critical for this role`);
    });

    const missingQualifications = this.findMissingQualifications(cvData.qualifications, jobData.qualifications);
    missingQualifications.forEach(qual => {
      feedback.qualificationGaps.push(`Essential qualification: ${qual}`);
    });

    // PERSONALIZED NEXT STEPS based on career stage and background
    if (universalMatch.matchType === 'transferable') {
      feedback.personalizedNextSteps.push(`Leverage your ${cvData.currentField} background by highlighting transferable skills in ${jobData.industry}`);
      feedback.personalizedNextSteps.push(`Consider certification in ${jobData.industry}-specific qualifications to strengthen your application`);
    }

    if (universalMatch.matchType === 'career-change') {
      feedback.personalizedNextSteps.push(`Plan a 6-12 month transition period to develop core ${jobData.industry} skills`);
      feedback.personalizedNextSteps.push(`Network with professionals in ${jobData.industry} to understand industry expectations`);
    }

    // INDUSTRY-SPECIFIC ADVICE
    feedback.industrySpecificAdvice = this.generateIndustrySpecificAdvice(cvData.currentField, jobData.industry, cvData);

    return feedback;
  }

  generateIndustrySpecificAdvice(currentField, targetIndustry, cvData) {
    const advice = [];
    
    const industryTransitions = {
      'emergency_services': {
        'building_safety': [
          'Emphasize fire risk assessment experience - directly applicable to building safety roles',
          'Highlight IOSH/NEBOSH qualifications as they\'re highly valued in building safety',
          'Consider pursuing Institute of Fire Engineers membership for professional credibility',
          'Focus on regulatory compliance experience from emergency services'
        ],
        'healthcare': [
          'Leverage emergency medical response experience',
          'Highlight patient care and crisis management skills',
          'Consider additional medical training or certifications',
          'Emphasize ability to work under pressure in healthcare settings'
        ]
      },
      'technology': {
        'finance': [
          'Develop financial domain knowledge through relevant courses',
          'Learn financial regulations and compliance requirements',
          'Consider fintech-specific technologies and frameworks',
          'Network within financial services industry'
        ]
      },
      'healthcare': {
        'emergency_services': [
          'Highlight emergency response and crisis management experience',
          'Emphasize ability to make critical decisions under pressure',
          'Consider emergency medical technician certifications',
          'Focus on teamwork and communication skills from healthcare'
        ]
      }
    };

    if (industryTransitions[currentField] && industryTransitions[currentField][targetIndustry]) {
      return industryTransitions[currentField][targetIndustry];
    }

    // Generic advice for any transition
    return [
      `Research ${targetIndustry} industry standards and best practices`,
      `Network with ${targetIndustry} professionals for insider insights`,
      `Consider entry-level positions or internships to gain ${targetIndustry} experience`,
      `Develop ${targetIndustry}-specific technical skills through training`
    ];
  }

  // ENHANCED: Dynamic course recommendation based on specific gaps
  generateDynamicCourseRecommendations(cvData, jobData, gapAreas) {
    const recommendations = [];
    
    // Match missing skills to specific courses
    gapAreas.forEach(gap => {
      const courseCategory = this.mapSkillToCourseCategory(gap, jobData.industry);
      if (courseCategory) {
        recommendations.push({
          skill: gap,
          category: courseCategory,
          urgency: this.assessSkillUrgency(gap, jobData),
          timeframe: this.estimateTrainingTime(gap)
        });
      }
    });

    return recommendations.sort((a, b) => b.urgency - a.urgency);
  }

  mapSkillToCourseCategory(skill, industry) {
    const skillToCourse = {
      'project management': 'project management',
      'data analysis': 'data analysis',
      'fire safety': 'fire safety',
      'building safety': 'building safety',
      'python': 'programming',
      'javascript': 'programming',
      'leadership': 'leadership',
      'communication': 'communication',
      'risk assessment': 'risk assessment'
    };

    return skillToCourse[skill.toLowerCase()] || null;
  }

  assessSkillUrgency(skill, jobData) {
    // Check if skill is in core requirements (high urgency)
    if (jobData.coreRequirements && jobData.coreRequirements.includes(skill)) {
      return 10;
    }
    
    // Check if skill is in required skills (medium urgency)
    if (jobData.requiredSkills.includes(skill)) {
      return 7;
    }
    
    // Default urgency for preferred skills
    return 5;
  }

  estimateTrainingTime(skill) {
    const trainingTimes = {
      'programming': '3-6 months',
      'project management': '2-3 months',
      'data analysis': '2-4 months',
      'fire safety': '1-2 months',
      'building safety': '1-3 months',
      'leadership': '2-4 months',
      'communication': '1-2 months'
    };

    const category = this.mapSkillToCourseCategory(skill, 'general');
    return trainingTimes[category] || '1-3 months';
  }

  // MISSING METHOD IMPLEMENTATIONS - Adding the extraction methods I referenced
  extractPersonalInfo(text) {
    const personalInfo = {};
    
    // Extract name patterns
    const namePatterns = [
      /^([A-Z][a-z]+ [A-Z][a-z]+(?:\s[A-Z][a-z]+)?)/m,
      /name[:\s]+([A-Z][a-z]+ [A-Z][a-z]+)/i,
      /([A-Z][A-Z\s]+)(?:\n|$)/m
    ];
    
    namePatterns.forEach(pattern => {
      const match = text.match(pattern);
      if (match && !personalInfo.name) {
        personalInfo.name = match[1].trim();
      }
    });
    
    // Extract contact information
    const emailMatch = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
    if (emailMatch) personalInfo.email = emailMatch[1];
    
    const phoneMatch = text.match(/(\+?[\d\s\-\(\)]{10,20})/);
    if (phoneMatch) personalInfo.phone = phoneMatch[1];
    
    const locationMatch = text.match(/([\w\s]+,\s*[\w\s]+(?:,\s*[\w\s]+)?)/);
    if (locationMatch) personalInfo.location = locationMatch[1];
    
    return personalInfo;
  }

  extractCareerObjective(text) {
    const objectivePatterns = [
      /(?:objective|summary|profile|career\s+objective|professional\s+summary)[:\s]*([^.\n]*(?:\.[^.\n]*){0,3})/gi,
      /(?:seeking|looking\s+for|interested\s+in)[:\s]*([^.\n]*(?:\.[^.\n]*){0,2})/gi
    ];
    
    for (const pattern of objectivePatterns) {
      const match = text.match(pattern);
      if (match && match[1] && match[1].length > 20) {
        return match[1].trim();
      }
    }
    return '';
  }

  extractIndustryExperience(text) {
    const industryKeywords = {
      'technology': ['software', 'programming', 'development', 'coding', 'IT', 'tech', 'cloud', 'digital'],
      'healthcare': ['medical', 'clinical', 'patient', 'healthcare', 'hospital', 'nursing', 'EMT', 'paramedic'],
      'finance': ['financial', 'accounting', 'banking', 'investment', 'insurance', 'audit'],
      'emergency_services': ['fire', 'rescue', 'emergency', 'paramedic', 'ambulance', 'fire service', 'watch manager'],
      'building_safety': ['building safety', 'fire safety', 'building regulations', 'fire risk assessment'],
      'education': ['teaching', 'education', 'academic', 'training', 'curriculum', 'student'],
      'engineering': ['engineering', 'design', 'technical', 'CAD', 'manufacturing'],
      'marketing': ['marketing', 'advertising', 'branding', 'digital marketing', 'social media'],
      'retail': ['retail', 'sales', 'customer service', 'store', 'merchandising'],
      'construction': ['construction', 'building', 'contractor', 'site', 'safety']
    };
    
    const industryExperience = [];
    const lowerText = text.toLowerCase();
    
    Object.entries(industryKeywords).forEach(([industry, keywords]) => {
      const matchCount = keywords.filter(keyword => lowerText.includes(keyword)).length;
      if (matchCount > 0) {
        industryExperience.push({
          industry,
          relevance: matchCount / keywords.length,
          keywords: keywords.filter(keyword => lowerText.includes(keyword))
        });
      }
    });
    
    return industryExperience.sort((a, b) => b.relevance - a.relevance);
  }

  extractLeadershipExperience(text) {
    const leadershipPatterns = [
      /(manager|supervisor|director|lead|head|chief|coordinator|team lead)[^.\n]*([^.\n]*)/gi,
      /(managed|supervised|led|coordinated|directed|headed)\s+([^.\n]*team[^.\n]*)/gi,
              /(responsible\s+for\s+managing|oversaw|guided|mentored)\s+([^.\n]*)/gi
    ];
    
    const leadership = [];
    leadershipPatterns.forEach(pattern => {
      const matches = [...text.matchAll(pattern)];
      matches.forEach(match => {
        if (match[0] && match[0].length > 10) {
          leadership.push(match[0].trim());
        }
      });
    });
    
    return [...new Set(leadership)];
  }

  extractProfessionalMemberships(text) {
    const membershipPatterns = [
      /(member|fellow|associate|chartered)\s+(?:of\s+)?([^.\n]*(?:institute|institution|association|society|organization)[^.\n]*)/gi,
      /(institute\s+of\s+fire\s+engineers|ife|iosh|nebosh|ciob|rics|ieee|acm)[^.\n]*/gi,
      /(professional\s+membership|member\s+grade|graduate\s+membership)[^.\n]*/gi
    ];
    
    const memberships = [];
    membershipPatterns.forEach(pattern => {
      const matches = [...text.matchAll(pattern)];
      matches.forEach(match => {
        if (match[0] && match[0].length > 5) {
          memberships.push(match[0].trim());
        }
      });
    });
    
    return [...new Set(memberships)];
  }

  extractQuantifiedAchievements(text) {
    const quantifiedPatterns = [
      /(\d+%|\d+\.\d+%|\d+x|\d+\s*times|\$\d+|\d+\+|\d+k|\d+m|\d+\s*people|\d+\s*team|\d+\s*staff|\d+\s*years|\d+\s*months)/gi
    ];
    
    const achievements = [];
    quantifiedPatterns.forEach(pattern => {
      const matches = [...text.matchAll(pattern)];
      matches.forEach(match => {
        const context = text.substring(Math.max(0, match.index - 50), match.index + match[0].length + 50);
        if (context.includes('achieved') || context.includes('increased') || context.includes('improved') || 
            context.includes('reduced') || context.includes('delivered') || context.includes('managed')) {
          achievements.push(context.trim());
        }
      });
    });
    
    return [...new Set(achievements)];
  }

  extractAdvancedSkillsFromText(text) {
    const result = {
      skills: [],
      levels: {},
      tools: [],
      methodologies: []
    };
    
    // Enhanced skill extraction with proficiency levels
    const skillLevelPatterns = [
      /(expert|advanced|proficient|intermediate|beginner|basic)\s+(?:in\s+|with\s+|at\s+)?([^.\n,]+)/gi,
      /([^.\n,]+)\s+\(?(expert|advanced|proficient|intermediate|beginner|basic|novice)\)?/gi,
      /(skilled|experienced|competent)\s+(?:in\s+|with\s+|at\s+)?([^.\n,]+)/gi
    ];
    
    skillLevelPatterns.forEach(pattern => {
      const matches = [...text.matchAll(pattern)];
      matches.forEach(match => {
        let skill, level;
        if (match[1] && (match[1].includes('expert') || match[1].includes('advanced') || match[1].includes('proficient'))) {
          level = match[1];
          skill = match[2];
        } else {
          skill = match[1];
          level = match[2] || 'experienced';
        }
        
        if (skill && skill.length > 2 && skill.length < 50) {
          const cleanSkill = skill.trim().toLowerCase();
          result.skills.push(cleanSkill);
          result.levels[cleanSkill] = level.toLowerCase();
        }
      });
    });
    
    return result;
  }

  // Add other missing extraction methods with simple implementations
  extractLicenses(text) {
    const licensePatterns = [
      /(license|licensed|certification|certified)\s+([^.\n,]+)/gi
    ];
    
    const licenses = [];
    licensePatterns.forEach(pattern => {
      const matches = [...text.matchAll(pattern)];
      matches.forEach(match => {
        if (match[0] && match[0].length > 5) {
          licenses.push(match[0].trim());
        }
      });
    });
    
    return [...new Set(licenses)];
  }

  extractContinuousLearning(text) {
    const learningPatterns = [
      /(training|course|workshop|seminar|conference)\s+([^.\n,]+)/gi,
      /(completed|attended|participated)\s+([^.\n]*(?:training|course|workshop)[^.\n]*)/gi
    ];
    
    const learning = [];
    learningPatterns.forEach(pattern => {
      const matches = [...text.matchAll(pattern)];
      matches.forEach(match => {
        if (match[0] && match[0].length > 10) {
          learning.push(match[0].trim());
        }
      });
    });
    
    return [...new Set(learning)];
  }

  extractAwards(text) {
    const awardPatterns = [
      /(award|recognition|honor|achievement|commendation)\s+([^.\n,]+)/gi,
      /(received|won|earned)\s+([^.\n]*(?:award|recognition|honor)[^.\n]*)/gi
    ];
    
    const awards = [];
    awardPatterns.forEach(pattern => {
      const matches = [...text.matchAll(pattern)];
      matches.forEach(match => {
        if (match[0] && match[0].length > 10) {
          awards.push(match[0].trim());
        }
      });
    });
    
    return [...new Set(awards)];
  }

  extractPublications(text) {
    const publicationPatterns = [
      /(published|publication|paper|article|journal)\s+([^.\n,]+)/gi
    ];
    
    const publications = [];
    publicationPatterns.forEach(pattern => {
      const matches = [...text.matchAll(pattern)];
      matches.forEach(match => {
        if (match[0] && match[0].length > 10) {
          publications.push(match[0].trim());
        }
      });
    });
    
    return [...new Set(publications)];
  }

  extractVolunteerWork(text) {
    const volunteerPatterns = [
      /(volunteer|volunteering|community|charity)\s+([^.\n,]+)/gi
    ];
    
    const volunteer = [];
    volunteerPatterns.forEach(pattern => {
      const matches = [...text.matchAll(pattern)];
      matches.forEach(match => {
        if (match[0] && match[0].length > 10) {
          volunteer.push(match[0].trim());
        }
      });
    });
    
    return [...new Set(volunteer)];
  }

  extractSpecializations(text) {
    const specializationPatterns = [
      /(specialist|specialization|expertise|focus)\s+([^.\n,]+)/gi
    ];
    
    const specializations = [];
    specializationPatterns.forEach(pattern => {
      const matches = [...text.matchAll(pattern)];
      matches.forEach(match => {
        if (match[0] && match[0].length > 10) {
          specializations.push(match[0].trim());
        }
      });
    });
    
    return [...new Set(specializations)];
  }

  extractComplianceKnowledge(text) {
    const compliancePatterns = [
      /(compliance|regulatory|regulation|standard)\s+([^.\n,]+)/gi,
      /(gdpr|sox|iso|nebosh|iosh|osha)\s*([^.\n,]*)/gi
    ];
    
    const compliance = [];
    compliancePatterns.forEach(pattern => {
      const matches = [...text.matchAll(pattern)];
      matches.forEach(match => {
        if (match[0] && match[0].length > 5) {
          compliance.push(match[0].trim());
        }
      });
    });
    
    return [...new Set(compliance)];
  }

  extractTeamManagementExperience(text) {
    const teamPatterns = [
      /(managed|supervised|led|coordinated)\s+(?:a\s+)?team\s+of\s+(\d+)/gi,
      /(team\s+of\s+\d+|managed\s+\d+\s+people|supervised\s+\d+\s+staff)/gi
    ];
    
    const teamExp = [];
    teamPatterns.forEach(pattern => {
      const matches = [...text.matchAll(pattern)];
      matches.forEach(match => {
        if (match[0]) teamExp.push(match[0].trim());
      });
    });
    
    return [...new Set(teamExp)];
  }

  extractBudgetManagementExperience(text) {
    const budgetPatterns = [
      /(managed|oversaw|responsible\s+for)\s+(?:a\s+)?budget\s+of\s+[\$£€]?[\d,]+/gi,
      /(budget\s+management|financial\s+responsibility|cost\s+control)/gi
    ];
    
    const budgetExp = [];
    budgetPatterns.forEach(pattern => {
      const matches = [...text.matchAll(pattern)];
      matches.forEach(match => {
        if (match[0]) budgetExp.push(match[0].trim());
      });
    });
    
    return [...new Set(budgetExp)];
  }

  extractClientInteractionExperience(text) {
    const clientPatterns = [
      /(client|customer|stakeholder)\s+(interaction|management|service|support|relations)/gi,
      /(interfaced\s+with|worked\s+with|collaborated\s+with)\s+(clients|customers|stakeholders)/gi
    ];
    
    const clientExp = [];
    clientPatterns.forEach(pattern => {
      const matches = [...text.matchAll(pattern)];
      matches.forEach(match => {
        if (match[0]) clientExp.push(match[0].trim());
      });
    });
    
    return [...new Set(clientExp)];
  }

  extractCrossFunctionalExperience(text) {
    const crossFunctionalPatterns = [
      /(cross.functional|cross.departmental|collaborated\s+with\s+multiple)/gi,
      /(worked\s+across|liaison\s+with|coordinated\s+between)/gi
    ];
    
    const crossExp = [];
    crossFunctionalPatterns.forEach(pattern => {
      const matches = [...text.matchAll(pattern)];
      matches.forEach(match => {
        if (match[0]) crossExp.push(match[0].trim());
      });
    });
    
    return [...new Set(crossExp)];
  }

  analyzeCareerProgression(experiences) {
    if (!experiences || experiences.length === 0) return [];
    
    const progression = experiences.map(exp => ({
      role: exp.title || exp.position,
      company: exp.company,
      seniority: this.detectSeniorityLevel(exp.title || exp.position),
      responsibilities: exp.description || exp.responsibilities || ''
    }));
    
    return progression.sort((a, b) => b.seniority - a.seniority);
  }

  detectSeniorityLevel(title) {
    if (!title) return 1;
    const lowerTitle = title.toLowerCase();
    
    if (lowerTitle.includes('director') || lowerTitle.includes('vp') || lowerTitle.includes('head of')) return 5;
    if (lowerTitle.includes('senior') || lowerTitle.includes('lead') || lowerTitle.includes('principal')) return 4;
    if (lowerTitle.includes('manager') || lowerTitle.includes('supervisor')) return 3;
    if (lowerTitle.includes('junior') || lowerTitle.includes('assistant') || lowerTitle.includes('intern')) return 1;
    return 2; // Mid-level
  }

  // Enhanced analysis prompt for detailed paragraph improvements
  createDetailedImprovementPrompt(cvText, industry, role, analysisType = 'generic', jobDescription = null) {
    let focus = '';
    let target = '';
    let extra = '';
    if (analysisType === 'generic') {
      focus = 'content, format, and structure';
      target = 'any professional role';
      extra = 'Focus on general best practices, clarity, and ATS optimization.';
    } else if (analysisType === 'role') {
      focus = `content, format, structure, and role-specific keywords for ${role} in ${industry}`;
      target = `${role} in ${industry}`;
      extra = `Focus on adding field/role-specific keywords, skills, and advice for ${role} roles in ${industry}.`;
    } else if (analysisType === 'job') {
      focus = 'matching the CV to the provided job description, including keywords and requirements';
      target = `the provided job description for ${role} in ${industry}`;
      extra = 'Focus on tailoring the CV to match the job description, using its keywords and requirements.';
    }
    return `ADVANCED CV CONTENT IMPROVEMENT ANALYSIS\n\nYou are an expert CV writer and ATS optimization specialist. Analyze this CV and provide specific paragraph-level improvements.\n\nCV CONTENT:\n${cvText}\n\n${jobDescription ? `JOB DESCRIPTION:\n${jobDescription}\n` : ''}\nTARGET: ${target}\n\nINSTRUCTIONS:\n1. Extract and analyze specific sections/paragraphs from the CV\n2. Identify exactly what's wrong with each section\n3. Provide specific rewritten versions that are better optimized for ATS systems and ${target}\n4. Focus on ${focus}\n${extra}\n\nFor each improvement, provide:\n- The exact original text from the CV\n- Detailed analysis of why it needs improvement\n- A completely rewritten version that's better optimized\n\nReturn a JSON response with this structure:\n{\n  "detailedImprovements": [\n    {\n      "id": "improvement_1",\n      "section": "Personal Statement|Experience|Skills|Education",\n      "title": "Brief description of the improvement",\n      "priority": "high|medium|low",\n      "reason": "Why this needs improvement",\n      "originalText": "Exact text from the CV that needs improvement",\n      "analysis": "Detailed analysis of the problems with the original text",\n      "suggestedText": "Complete rewrite with ATS optimization and relevant keywords",\n      "keywords": ["list", "of", "keywords", "added"],\n      "improvements": ["specific", "changes", "made"]\n    }\n  ]\n}\n\nFocus on:\n- Personal statements that are too generic\n- Work experience without quantified achievements\n- Skills sections that lack specific technologies or keywords\n- Missing industry/job-specific keywords\n- Weak action verbs\n- Lack of measurable results\n\nProvide 3-5 specific improvements that would have the biggest impact on ATS scores and recruiter appeal.`;
  }

  // Generate detailed paragraph improvements
  async generateDetailedImprovements(cvText, industry, role, analysisType = 'generic', jobDescription = null) {
    if (!this.isAnthropicEnabled && !this.isOpenAIEnabled) {
      return [];
    }

    try {
      const prompt = this.createDetailedImprovementPrompt(cvText, industry, role, analysisType, jobDescription);
      let response;
      if (this.isAnthropicEnabled) {
        const message = await this.anthropic.messages.create({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 3000,
          temperature: 0.1, // Slightly higher for creative rewriting
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ]
        });
        response = message.content[0].text;
      } else if (this.isOpenAIEnabled) {
        const completion = await this.openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are an expert CV writer and ATS optimization specialist. Provide detailed, actionable improvements with specific text rewrites.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 3000,
          temperature: 0.1
        });
        response = completion.choices[0].message.content;
      }

      // Parse the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        logger.warn('No JSON found in detailed improvements response');
        return [];
      }

      const parsed = JSON.parse(jsonMatch[0]);
      if (!parsed.detailedImprovements || !Array.isArray(parsed.detailedImprovements)) {
        logger.warn('Invalid detailed improvements structure');
        return [];
      }
      // Validate and clean up the improvements
      const validImprovements = parsed.detailedImprovements
        .filter(imp => imp.originalText && imp.suggestedText && imp.analysis)
        .map((imp, index) => ({
          id: imp.id || `improvement_${index + 1}`,
          section: imp.section || 'General',
          title: imp.title || 'Content Improvement',
          priority: imp.priority || 'medium',
          reason: imp.reason || 'Needs optimization for better ATS compatibility',
          originalText: imp.originalText,
          analysis: imp.analysis,
          suggestedText: imp.suggestedText,
          keywords: Array.isArray(imp.keywords) ? imp.keywords : [],
          improvements: Array.isArray(imp.improvements) ? imp.improvements : []
        }));
      logger.info('Generated detailed improvements:', { 
        count: validImprovements.length,
        role,
        industry,
        analysisType
      });
      return validImprovements;
    } catch (error) {
      logger.error('Failed to generate detailed improvements:', error);
      return [];
    }
  }
}

module.exports = new AIAnalysisService(); 