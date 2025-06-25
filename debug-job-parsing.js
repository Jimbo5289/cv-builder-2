const fs = require('fs');

// Test the exact job description parsing logic
const testJobDescription = `Head of Building Safety

We are seeking an experienced Head of Building Safety to join our team. 

Key Requirements:
- Member Grade Institute of Fire Engineers (IFE) qualification
- Extensive experience in building safety management
- Knowledge of Building Safety Act and Golden Thread requirements
- Fire risk assessment experience
- Building regulations compliance
- IOSH or NEBOSH certification preferred

Responsibilities:
- Lead building safety compliance across portfolio
- Manage fire safety risk assessments
- Ensure compliance with building safety regulations
- Coordinate with fire engineers and safety consultants
- Oversee building safety improvements and remediation works

This is a senior leadership role requiring proven expertise in building safety management.`;

// Simulate the detectIndustryFromText function
function detectIndustryFromText(text) {
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
    'finance': [
      'financial', 'banking', 'investment', 'accounting', 'finance', 'audit',
      'financial analyst', 'investment banking', 'financial services'
    ]
  };

  let bestMatch = 'general';
  let maxMatches = 0;
  let debugInfo = {};

  for (const [industry, keywords] of Object.entries(industryKeywords)) {
    const matches = keywords.filter(keyword => 
      textLower.includes(keyword.toLowerCase())
    );
    debugInfo[industry] = { matches: matches.length, foundKeywords: matches };
    if (matches.length > maxMatches) {
      maxMatches = matches.length;
      bestMatch = industry;
    }
  }
  
  // Special case for building safety positions
  if (textLower.includes('head of building safety') || 
      textLower.includes('building safety manager') ||
      textLower.includes('fire safety manager')) {
    console.log('🔥 SPECIAL CASE TRIGGERED: Building Safety Position Detected');
    return 'building_safety';
  }
  
  console.log('🔍 INDUSTRY DETECTION DEBUG:');
  console.log('Text (first 200 chars):', textLower.substring(0, 200));
  console.log('Detection Results:', debugInfo);
  console.log('Best Match:', bestMatch, 'with', maxMatches, 'matches');
  
  return bestMatch;
}

console.log('🧪 TESTING JOB DESCRIPTION PARSING');
console.log('=====================================');

const detectedIndustry = detectIndustryFromText(testJobDescription);
console.log('\n✅ FINAL RESULT:', detectedIndustry);

if (detectedIndustry === 'building_safety') {
  console.log('✅ SUCCESS: Correctly identified as building_safety');
} else {
  console.log('❌ FAILED: Incorrectly identified as', detectedIndustry);
  console.log('❌ This explains why the analysis is showing finance recommendations!');
} 