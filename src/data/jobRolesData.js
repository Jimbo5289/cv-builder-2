// Job Industries and Roles for CV Analysis

// Main industry categories
export const INDUSTRIES = [
  { value: 'technology', label: 'Technology & IT' },
  { value: 'healthcare', label: 'Healthcare & Medicine' },
  { value: 'finance', label: 'Finance & Banking' },
  { value: 'education', label: 'Education & Training' },
  { value: 'engineering', label: 'Engineering & Manufacturing' },
  { value: 'retail', label: 'Retail & Sales' },
  { value: 'hospitality', label: 'Hospitality & Tourism' },
  { value: 'creative', label: 'Creative Arts & Design' },
  { value: 'legal', label: 'Legal & Compliance' },
  { value: 'marketing', label: 'Marketing & PR' },
  { value: 'construction', label: 'Construction & Trades' },
  { value: 'transport', label: 'Transport & Logistics' },
  { value: 'science', label: 'Science & Research' }
];

// Roles by industry
export const ROLES_BY_INDUSTRY = {
  technology: [
    { value: 'software-developer', label: 'Software Developer' },
    { value: 'data-scientist', label: 'Data Scientist' },
    { value: 'network-engineer', label: 'Network Engineer' },
    { value: 'product-manager', label: 'Product Manager' },
    { value: 'cybersecurity-analyst', label: 'Cybersecurity Analyst' },
    { value: 'devops-engineer', label: 'DevOps Engineer' },
    { value: 'ui-ux-designer', label: 'UI/UX Designer' },
    { value: 'cloud-architect', label: 'Cloud Architect' }
  ],
  
  healthcare: [
    { value: 'physician', label: 'Physician' },
    { value: 'nurse', label: 'Nurse' },
    { value: 'medical-technician', label: 'Medical Technician' },
    { value: 'healthcare-admin', label: 'Healthcare Administrator' },
    { value: 'pharmacist', label: 'Pharmacist' },
    { value: 'physical-therapist', label: 'Physical Therapist' },
    { value: 'nutritionist', label: 'Nutritionist/Dietitian' },
    { value: 'mental-health', label: 'Mental Health Professional' }
  ],
  
  finance: [
    { value: 'financial-analyst', label: 'Financial Analyst' },
    { value: 'accountant', label: 'Accountant' },
    { value: 'investment-banker', label: 'Investment Banker' },
    { value: 'financial-advisor', label: 'Financial Advisor' },
    { value: 'risk-manager', label: 'Risk Manager' },
    { value: 'insurance-underwriter', label: 'Insurance Underwriter' },
    { value: 'compliance-officer', label: 'Compliance Officer' },
    { value: 'credit-analyst', label: 'Credit Analyst' }
  ],
  
  education: [
    { value: 'teacher', label: 'Teacher' },
    { value: 'professor', label: 'Professor' },
    { value: 'education-admin', label: 'Education Administrator' },
    { value: 'curriculum-developer', label: 'Curriculum Developer' },
    { value: 'special-education', label: 'Special Education Teacher' },
    { value: 'education-counselor', label: 'Education Counselor' },
    { value: 'librarian', label: 'Librarian' },
    { value: 'corporate-trainer', label: 'Corporate Trainer' }
  ],
  
  engineering: [
    { value: 'mechanical-engineer', label: 'Mechanical Engineer' },
    { value: 'electrical-engineer', label: 'Electrical Engineer' },
    { value: 'civil-engineer', label: 'Civil Engineer' },
    { value: 'chemical-engineer', label: 'Chemical Engineer' },
    { value: 'aerospace-engineer', label: 'Aerospace Engineer' },
    { value: 'industrial-engineer', label: 'Industrial Engineer' },
    { value: 'manufacturing-manager', label: 'Manufacturing Manager' },
    { value: 'quality-assurance', label: 'Quality Assurance Engineer' }
  ],
  
  retail: [
    { value: 'store-manager', label: 'Store Manager' },
    { value: 'sales-associate', label: 'Sales Associate' },
    { value: 'retail-buyer', label: 'Retail Buyer' },
    { value: 'merchandiser', label: 'Merchandiser' },
    { value: 'visual-merchandiser', label: 'Visual Merchandiser' },
    { value: 'inventory-manager', label: 'Inventory Manager' },
    { value: 'customer-service', label: 'Customer Service Representative' },
    { value: 'e-commerce-manager', label: 'E-commerce Manager' }
  ],
  
  hospitality: [
    { value: 'hotel-manager', label: 'Hotel Manager' },
    { value: 'chef', label: 'Chef/Cook' },
    { value: 'event-planner', label: 'Event Planner' },
    { value: 'restaurant-manager', label: 'Restaurant Manager' },
    { value: 'concierge', label: 'Concierge' },
    { value: 'tour-guide', label: 'Tour Guide' },
    { value: 'travel-agent', label: 'Travel Agent' },
    { value: 'hospitality-supervisor', label: 'Hospitality Supervisor' }
  ],
  
  creative: [
    { value: 'graphic-designer', label: 'Graphic Designer' },
    { value: 'photographer', label: 'Photographer' },
    { value: 'writer', label: 'Writer/Editor' },
    { value: 'interior-designer', label: 'Interior Designer' },
    { value: 'fashion-designer', label: 'Fashion Designer' },
    { value: 'video-producer', label: 'Video Producer' },
    { value: 'art-director', label: 'Art Director' },
    { value: 'animator', label: 'Animator/Illustrator' }
  ],
  
  legal: [
    { value: 'lawyer', label: 'Lawyer/Attorney' },
    { value: 'paralegal', label: 'Paralegal' },
    { value: 'legal-consultant', label: 'Legal Consultant' },
    { value: 'legal-secretary', label: 'Legal Secretary' },
    { value: 'compliance-manager', label: 'Compliance Manager' },
    { value: 'contract-manager', label: 'Contract Manager' },
    { value: 'intellectual-property', label: 'Intellectual Property Specialist' },
    { value: 'mediator', label: 'Mediator/Arbitrator' }
  ],
  
  marketing: [
    { value: 'marketing-manager', label: 'Marketing Manager' },
    { value: 'digital-marketer', label: 'Digital Marketer' },
    { value: 'content-strategist', label: 'Content Strategist' },
    { value: 'seo-specialist', label: 'SEO Specialist' },
    { value: 'social-media-manager', label: 'Social Media Manager' },
    { value: 'public-relations', label: 'Public Relations Specialist' },
    { value: 'brand-manager', label: 'Brand Manager' },
    { value: 'market-researcher', label: 'Market Researcher' }
  ],
  
  construction: [
    { value: 'construction-manager', label: 'Construction Manager' },
    { value: 'architect', label: 'Architect' },
    { value: 'site-supervisor', label: 'Site Supervisor' },
    { value: 'quantity-surveyor', label: 'Quantity Surveyor' },
    { value: 'building-inspector', label: 'Building Inspector' },
    
    // Skilled Trades
    { value: 'carpenter', label: 'Carpenter' },
    { value: 'electrician', label: 'Electrician' },
    { value: 'plumber', label: 'Plumber' },
    { value: 'hvac-technician', label: 'HVAC Technician' },
    { value: 'welder', label: 'Welder' },
    { value: 'mason', label: 'Mason/Bricklayer' },
    { value: 'heavy-equipment-operator', label: 'Heavy Equipment Operator' },
    { value: 'construction-worker', label: 'Construction Worker/Laborer' }
  ],
  
  transport: [
    { value: 'logistics-manager', label: 'Logistics Manager' },
    { value: 'fleet-manager', label: 'Fleet Manager' },
    { value: 'supply-chain', label: 'Supply Chain Analyst' },
    { value: 'warehouse-manager', label: 'Warehouse Manager' },
    { value: 'transportation-planner', label: 'Transportation Planner' },
    { value: 'freight-coordinator', label: 'Freight Coordinator' },
    { value: 'shipping-manager', label: 'Shipping/Receiving Manager' },
    { value: 'customs-broker', label: 'Customs Broker' }
  ],
  
  science: [
    { value: 'researcher', label: 'Researcher' },
    { value: 'lab-technician', label: 'Laboratory Technician' },
    { value: 'biologist', label: 'Biologist' },
    { value: 'chemist', label: 'Chemist' },
    { value: 'environmental-scientist', label: 'Environmental Scientist' },
    { value: 'physicist', label: 'Physicist' },
    { value: 'geologist', label: 'Geologist' },
    { value: 'research-director', label: 'Research Director' }
  ]
};

// Keywords associated with industry-specific roles
export const KEYWORDS_BY_INDUSTRY = {
  technology: [
    'programming', 'software development', 'cloud', 'agile', 'scrum', 'devops',
    'frontend', 'backend', 'full-stack', 'API', 'database', 'cybersecurity',
    'machine learning', 'AI', 'data science', 'SQL', 'Python', 'JavaScript',
    'CI/CD', 'version control', 'Git', 'testing', 'debugging', 'UX/UI'
  ],
  healthcare: [
    'patient care', 'medical', 'clinical', 'diagnosis', 'treatment', 'healthcare',
    'EMR', 'EHR', 'HIPAA', 'patient safety', 'medical records', 'vital signs',
    'patient assessment', 'care planning', 'medical terminology', 'pharmacology',
    'patient advocacy', 'infection control', 'quality improvement', 'preventive care'
  ],
  finance: [
    'financial analysis', 'accounting', 'bookkeeping', 'budgeting', 'forecasting',
    'financial reporting', 'audit', 'tax preparation', 'financial compliance',
    'risk assessment', 'investment analysis', 'portfolio management', 'cash flow',
    'financial statements', 'Excel', 'financial modeling', 'banking', 'reconciliation'
  ],
  engineering: [
    'design', 'CAD', 'technical drawings', 'specifications', 'quality control',
    'prototyping', 'testing', 'manufacturing', 'engineering analysis', 'compliance',
    'problem-solving', 'product development', 'process improvement', 'technical documentation',
    'safety standards', 'project planning', 'systems engineering', 'sustainable design'
  ]
}; 