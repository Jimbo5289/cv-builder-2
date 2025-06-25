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
        keywords: ['building safety', 'fire safety', 'building regulations', 'building control', 'safety compliance', 'building codes', 'fire risk assessment', 'building standards', 'safety management', 'regulatory compliance', 'building inspection', 'safety audits', 'building surveying', 'construction safety', 'NEBOSH', 'IOSH', 'CDM', 'building safety manager'],
        skills: ['Building safety expertise', 'Fire safety knowledge', 'Regulatory compliance', 'Risk assessment', 'Building inspection', 'Safety management', 'Technical analysis', 'Report writing', 'Stakeholder communication'],
        qualifications: ['Building safety qualifications', 'Fire safety certifications', 'NEBOSH General Certificate', 'IOSH Managing Safely', 'Building control qualifications', 'Construction safety training', 'Professional memberships (IOSH, NEBOSH)'],
        incompatibleFields: ['arts', 'design', 'retail', 'hospitality', 'marketing'],
        transferableFrom: ['construction', 'engineering', 'emergency services', 'architecture', 'surveying', 'health and safety', 'fire service', 'rescue services']
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

  // Main analysis method - Universal approach
  async analyzeCV(cvText, industry = null, role = null, isGeneric = false, jobDescription = null) {
    try {
      logger.info('Starting universal CV analysis', { industry, role, isGeneric });
      
      // Step 1: Parse CV content universally
      const cvData = this.parseCV(cvText);
      
      // Step 2: Parse job requirements
      let jobData;
      if (jobDescription) {
        // Parse actual job description
        jobData = this.parseJobDescription(jobDescription);
        industry = jobData.industry || industry || 'general';
        role = jobData.role || role || 'general';
      } else {
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

CRITICAL INSTRUCTIONS:
1. BE BRUTALLY HONEST about fit - users need realistic expectations
2. Score based on ACTUAL RELEVANCE, not generic CV quality
3. Identify SPECIFIC missing skills/experience for this exact role
4. Provide ACTIONABLE improvement recommendations
5. Consider transferable skills but don't overscore unrelated experience

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
        responsibilities: []
      };
    }

    const jd = jobDescription.toLowerCase();
    
    // Enhanced skill extraction patterns - handles multiple formats
    const skillPatterns = [
      // Requirements patterns
      /(?:required|must have|essential|mandatory|need|looking for)[^.]*?(?:skills?|experience|knowledge)[^.]*?([^.]+)/gi,
      /(?:proficiency|experience|skilled?|expertise)\s+(?:in|with|using)\s+([^.,\n]+)/gi,
      /(?:knowledge of|experience with|familiar with|competent in)\s+([^.,\n]+)/gi,
      /(?:bachelor|master|degree|certification|qualified?|license)\s+(?:in|with)?\s*([^.,\n]+)/gi,
      
      // Bullet point patterns
      /•\s*([^•\n]+)/gi,
      /-\s*([^-\n]+)/gi,
      /\*\s*([^*\n]+)/gi,
      
      // Responsibility patterns
      /(?:responsibilities|duties|you will|role involves|key tasks)[^.]*?([^.]+)/gi,
      
      // Technical skill patterns
      /(?:proficient|expert|advanced|intermediate|beginner)\s+(?:in|with|at)\s+([^.,\n]+)/gi
    ];

    const extractedSkills = new Set();
    const extractedQualifications = new Set();
    const responsibilities = new Set();
    
    skillPatterns.forEach((pattern, index) => {
      const matches = [...jd.matchAll(pattern)];
      matches.forEach(match => {
        if (match[1]) {
          const cleanText = this.cleanExtractedText(match[1]);
          const items = this.splitSkillText(cleanText);
          
          items.forEach(item => {
            if (item.length > 2) {
              // Categorize extracted items
              if (this.isQualification(item)) {
                extractedQualifications.add(item);
              } else if (this.isResponsibility(item)) {
                responsibilities.add(item);
              } else {
                extractedSkills.add(item);
              }
            }
          });
        }
      });
    });

    // Extract experience requirements with multiple patterns
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

    // Dynamic seniority detection
    const seniority = this.determineSeniorityFromText(jd, Math.max(...experienceYears, 0));

    // Enhanced industry and role detection
    const industry = this.detectIndustryFromText(jd);
    const role = this.detectRoleFromText(jd);

    // Extract comprehensive keywords
    const keywords = this.extractComprehensiveKeywords(jd);

    return {
      requiredSkills: [...extractedSkills].slice(0, 15),
      preferredSkills: this.extractPreferredSkills(jd),
      qualifications: [...extractedQualifications].slice(0, 10),
      experience: experienceYears,
      keywords: keywords,
      industry,
      role,
      seniority,
      responsibilities: [...responsibilities].slice(0, 8)
    };
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
    const industryKeywords = {
      'building_safety': ['building safety', 'fire safety', 'building regulations', 'safety compliance', 'construction safety', 'building control', 'safety management', 'fire risk assessment', 'building standards', 'CDM regulations', 'building surveying'],
      'emergency_services': ['emergency services', 'fire service', 'rescue', 'ambulance', 'paramedic', 'firefighter', 'emergency response', 'fire brigade', 'crisis management'],
      'safety': ['safety management', 'health and safety', 'IOSH', 'NEBOSH', 'risk assessment', 'safety compliance', 'occupational health', 'workplace safety'],
      'construction': ['construction', 'building', 'contractor', 'site', 'trades', 'civil engineering', 'project management'],
      'technology': ['software', 'programming', 'developer', 'engineer', 'tech', 'digital', 'coding', 'it'],
      'healthcare': ['medical', 'clinical', 'patient', 'healthcare', 'hospital', 'nursing', 'doctor'],
      'finance': ['financial', 'banking', 'investment', 'accounting', 'finance', 'audit'],
      'education': ['education', 'teaching', 'school', 'university', 'learning', 'academic'],
      'marketing': ['marketing', 'advertising', 'brand', 'campaign', 'digital marketing'],
      'engineering': ['engineering', 'mechanical', 'electrical', 'civil', 'aerospace']
    };

    let bestMatch = 'general';
    let maxMatches = 0;

    for (const [industry, keywords] of Object.entries(industryKeywords)) {
      const matches = keywords.filter(keyword => text.includes(keyword)).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        bestMatch = industry;
      }
    }
    
    return bestMatch;
  }

  detectRoleFromText(text) {
    const roleKeywords = {
      'building-safety-manager': ['building safety manager', 'head of building safety', 'building safety', 'fire safety manager', 'safety manager'],
      'software-developer': ['software developer', 'programmer', 'coding', 'software engineer'],
      'data-scientist': ['data scientist', 'data analyst', 'machine learning', 'analytics'],
      'financial-analyst': ['financial analyst', 'finance analyst', 'investment analyst'],
      'project-manager': ['project manager', 'program manager', 'project lead'],
      'marketing-manager': ['marketing manager', 'brand manager', 'marketing director'],
      'fashion-designer': ['fashion designer', 'apparel designer', 'clothing designer', 'textile designer', 'fashion stylist'],
      'safety-manager': ['safety manager', 'health and safety manager', 'risk manager', 'compliance manager'],
      'construction-manager': ['construction manager', 'site manager', 'project manager', 'building manager']
    };

    for (const [role, keywords] of Object.entries(roleKeywords)) {
      if (keywords.some(keyword => text.includes(keyword))) {
        return role;
      }
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
        qualifications: []
      };
    }

    const cv = cvText.toLowerCase();
    
    // Extract skills section
    const skillsSection = this.extractSection(cv, ['skills', 'technical skills', 'key skills', 'competencies']);
    const extractedSkills = this.extractSkillsFromText(skillsSection || cv);
    
    // Extract experience section and calculate years
    const experienceSection = this.extractSection(cv, ['experience', 'work history', 'employment', 'career']);
    const experienceYears = this.calculateExperienceYears(experienceSection || cv);
    const workExperience = this.extractWorkExperience(experienceSection || cv);
    
    // Extract education
    const educationSection = this.extractSection(cv, ['education', 'qualifications', 'academic']);
    const education = this.extractEducation(educationSection || cv);
    
    // Extract achievements
    const achievements = this.extractAchievements(cv);
    
    // Detect current field
    const currentField = this.detectCurrentField(cv);
    
    // Extract keywords
    const keywords = this.extractKeywordsFromText(cv);
    
    return {
      skills: extractedSkills.slice(0, 15),
      experience: workExperience.slice(0, 5),
      education: education.slice(0, 4),
      achievements: achievements.slice(0, 8),
      keywords: keywords.slice(0, 20),
      currentField,
      experienceYears,
      qualifications: this.extractQualifications(cv)
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

    // Check transferability
    const industryReqs = this.getIndustryRequirements(jobIndustry);
    if (industryReqs.transferableFrom.includes(cvIndustry)) {
      return 'transferable';
    }

    // Check if entry-level (limited/no experience)
    if (cvData.experienceYears <= 1 || cvData.experience.length === 0) {
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
    const jobSkills = [...jobData.requiredSkills, ...jobData.keywords].map(skill => skill.toLowerCase());
    
    if (jobSkills.length === 0) return 50;

    // Direct skill matches
    const directMatches = jobSkills.filter(jobSkill => 
      cvSkills.some(cvSkill => 
        cvSkill.includes(jobSkill) || 
        jobSkill.includes(cvSkill) ||
        this.areSkillsSimilar(cvSkill, jobSkill)
      )
    );

    // Semantic skill matching for transferable concepts
    const semanticMatches = this.findSemanticSkillMatches(cvSkills, jobSkills);
    
    // Industry context matching
    const contextMatches = this.findContextualSkillMatches(cvData, jobData);

    const totalMatches = new Set([...directMatches, ...semanticMatches, ...contextMatches]).size;
    const matchPercentage = (totalMatches / jobSkills.length) * 100;

    // Apply universal transferability bonuses
    const transferabilityBonus = this.calculateUniversalTransferabilityBonus(cvData, jobData);
    
    return Math.min(100, Math.round(matchPercentage + transferabilityBonus));
  }

  // Semantic skill matching for related concepts
  findSemanticSkillMatches(cvSkills, jobSkills) {
    const semanticMappings = {
      // Leadership and management
      'leadership': ['management', 'team lead', 'supervision', 'coordination', 'director'],
      'management': ['leadership', 'oversight', 'administration', 'coordination'],
      'project management': ['project coordination', 'program management', 'project delivery'],
      
      // Safety and compliance
      'safety': ['health and safety', 'risk management', 'compliance', 'security'],
      'fire safety': ['building safety', 'emergency response', 'risk assessment'],
      'risk assessment': ['hazard identification', 'safety analysis', 'compliance'],
      
      // Technical skills
      'analysis': ['analytical', 'data analysis', 'research', 'evaluation'],
      'problem solving': ['troubleshooting', 'resolution', 'critical thinking'],
      'communication': ['presentation', 'interpersonal', 'client relations'],
      
      // Industry specific
      'emergency response': ['crisis management', 'incident response', 'emergency planning'],
      'customer service': ['client relations', 'customer support', 'customer care'],
      'quality control': ['quality assurance', 'quality management', 'inspection']
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

  // Find contextual matches based on industry knowledge
  findContextualSkillMatches(cvData, jobData) {
    const matches = [];
    const cvField = cvData.currentField;
    const jobIndustry = jobData.industry;

    // Industry context mappings for transferable skills
    const industryContexts = {
      'emergency_services': {
        'leadership': ['team management', 'crisis leadership', 'incident command'],
        'training': ['emergency training', 'safety training', 'professional development'],
        'assessment': ['risk assessment', 'incident analysis', 'safety evaluation']
      },
      'healthcare': {
        'care': ['patient care', 'clinical care', 'health services'],
        'documentation': ['medical records', 'clinical documentation', 'patient records'],
        'emergency': ['emergency response', 'urgent care', 'crisis management']
      },
      'technology': {
        'development': ['software development', 'system development', 'application development'],
        'analysis': ['data analysis', 'system analysis', 'technical analysis'],
        'design': ['system design', 'software design', 'technical design']
      },
      'finance': {
        'analysis': ['financial analysis', 'data analysis', 'market analysis'],
        'management': ['portfolio management', 'risk management', 'asset management'],
        'reporting': ['financial reporting', 'compliance reporting', 'regulatory reporting']
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

  // Calculate universal transferability bonus for any field combination
  calculateUniversalTransferabilityBonus(cvData, jobData) {
    let bonus = 0;
    const cvField = cvData.currentField;
    const jobIndustry = jobData.industry;

    // High-value transferable experience patterns
    const universalTransferables = [
      'leadership', 'management', 'communication', 'problem solving',
      'project management', 'training', 'analysis', 'compliance',
      'safety', 'emergency response', 'customer service', 'teamwork'
    ];

    // Count high-value transferable skills
    const transferableCount = cvData.skills.filter(skill => 
      universalTransferables.some(transferable => 
        skill.toLowerCase().includes(transferable.toLowerCase())
      )
    ).length;

    // Base transferability bonus
    bonus += Math.min(15, transferableCount * 2);

    // Experience level bonus for senior candidates
    if (cvData.experienceYears >= 5) {
      bonus += 10;
    }

    // Industry-specific high transferability
    const industryTransferability = {
      'emergency_services_to_safety': 25,
      'healthcare_to_emergency': 20,
      'engineering_to_construction': 20,
      'finance_to_business': 15,
      'education_to_training': 15,
      'military_to_security': 20,
      'management_to_management': 15
    };

    // Apply specific transferability bonuses
    const transferKey = `${cvField}_to_${jobIndustry}`;
    if (industryTransferability[transferKey]) {
      bonus += industryTransferability[transferKey];
    }

    // Cross-industry management experience
    if (cvData.skills.some(skill => skill.toLowerCase().includes('management')) &&
        jobData.requiredSkills.some(skill => skill.toLowerCase().includes('management'))) {
      bonus += 10;
    }

    return Math.min(30, bonus); // Cap bonus at 30%
  }

  // Check if two skills are semantically similar
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
      ['building safety', 'construction safety']
    ];

    return similarityMappings.some(([term1, term2]) => 
      (skill1.includes(term1) && skill2.includes(term2)) ||
      (skill1.includes(term2) && skill2.includes(term1))
    );
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
    
    const weightedScore = (
      matchResult.experienceMatch * weights.experience +
      matchResult.skillsMatch * weights.skills +
      matchResult.educationMatch * weights.education +
      matchResult.transferabilityScore * weights.transferability
    ) / 100;

    return Math.round(weightedScore);
  }

  getWeightsByMatchType(matchType) {
    switch (matchType) {
      case 'direct':
        return { experience: 0.4, skills: 0.4, education: 0.15, transferability: 0.05 };
      case 'transferable':
        return { experience: 0.3, skills: 0.3, education: 0.2, transferability: 0.2 };
      case 'entry-level':
        return { experience: 0.1, skills: 0.3, education: 0.5, transferability: 0.1 };
      case 'career-change':
        return { experience: 0.2, skills: 0.3, education: 0.25, transferability: 0.25 };
      default:
        return { experience: 0.35, skills: 0.35, education: 0.2, transferability: 0.1 };
    }
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
    // Base result from universal algorithm
    const result = {
      // Core scores (algorithmic)
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
}

module.exports = new AIAnalysisService(); 