export const compareCVWithStandard = (uploadedCV) => {
  const standardSections = [
    'contactInformation',
    'personalStatement',
    'workExperience',
    'education',
    'skills',
    'additionalSections',
    'references'
  ];

  const comparisonResults = {
    missingSections: [],
    incompleteSections: [],
    recommendations: [],
    score: 0
  };

  // Check for missing sections
  standardSections.forEach(section => {
    if (!uploadedCV[section]) {
      comparisonResults.missingSections.push(section);
    }
  });

  // Check section completeness
  if (uploadedCV.contactInformation) {
    const requiredContactFields = ['name', 'email', 'phone', 'location'];
    const missingFields = requiredContactFields.filter(field => !uploadedCV.contactInformation[field]);
    if (missingFields.length > 0) {
      comparisonResults.incompleteSections.push({
        section: 'contactInformation',
        missingFields
      });
    }
  }

  if (uploadedCV.personalStatement) {
    if (uploadedCV.personalStatement.length < 50) {
      comparisonResults.incompleteSections.push({
        section: 'personalStatement',
        message: 'Personal statement is too short'
      });
    }
  }

  if (uploadedCV.workExperience) {
    if (!Array.isArray(uploadedCV.workExperience) || uploadedCV.workExperience.length === 0) {
      comparisonResults.incompleteSections.push({
        section: 'workExperience',
        message: 'No work experience entries found'
      });
    } else {
      uploadedCV.workExperience.forEach((exp, index) => {
        const requiredFields = ['title', 'company', 'startDate', 'responsibilities'];
        const missingFields = requiredFields.filter(field => !exp[field]);
        if (missingFields.length > 0) {
          comparisonResults.incompleteSections.push({
            section: `workExperience[${index}]`,
            missingFields
          });
        }
      });
    }
  }

  if (uploadedCV.education) {
    if (!Array.isArray(uploadedCV.education) || uploadedCV.education.length === 0) {
      comparisonResults.incompleteSections.push({
        section: 'education',
        message: 'No education entries found'
      });
    } else {
      uploadedCV.education.forEach((edu, index) => {
        const requiredFields = ['degree', 'institution', 'graduationYear'];
        const missingFields = requiredFields.filter(field => !edu[field]);
        if (missingFields.length > 0) {
          comparisonResults.incompleteSections.push({
            section: `education[${index}]`,
            missingFields
          });
        }
      });
    }
  }

  if (uploadedCV.skills) {
    const requiredSkillCategories = ['technical', 'soft'];
    const missingCategories = requiredSkillCategories.filter(category => !uploadedCV.skills[category]);
    if (missingCategories.length > 0) {
      comparisonResults.incompleteSections.push({
        section: 'skills',
        missingCategories
      });
    }
  }

  // Generate recommendations
  if (comparisonResults.missingSections.length > 0) {
    comparisonResults.recommendations.push(
      `Add the following missing sections: ${comparisonResults.missingSections.join(', ')}`
    );
  }

  comparisonResults.incompleteSections.forEach(incomplete => {
    if (incomplete.missingFields) {
      comparisonResults.recommendations.push(
        `Complete the following fields in ${incomplete.section}: ${incomplete.missingFields.join(', ')}`
      );
    }
    if (incomplete.message) {
      comparisonResults.recommendations.push(
        `${incomplete.section}: ${incomplete.message}`
      );
    }
  });

  // Calculate score (0-100)
  const totalSections = standardSections.length;
  const missingSectionsPenalty = comparisonResults.missingSections.length * (100 / totalSections);
  const incompleteSectionsPenalty = comparisonResults.incompleteSections.length * (10 / totalSections);
  comparisonResults.score = Math.max(0, 100 - missingSectionsPenalty - incompleteSectionsPenalty);

  return comparisonResults;
};

export const getCVQualityScore = (comparisonResults) => {
  return {
    score: comparisonResults.score,
    grade: getGradeFromScore(comparisonResults.score),
    feedback: generateFeedback(comparisonResults)
  };
};

const getGradeFromScore = (score) => {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
};

const generateFeedback = (comparisonResults) => {
  const feedback = [];
  
  if (comparisonResults.score >= 90) {
    feedback.push('Your CV is well-structured and comprehensive.');
  } else if (comparisonResults.score >= 70) {
    feedback.push('Your CV is good but could use some improvements.');
  } else {
    feedback.push('Your CV needs significant improvements to meet professional standards.');
  }

  if (comparisonResults.recommendations.length > 0) {
    feedback.push('Recommendations for improvement:');
    feedback.push(...comparisonResults.recommendations);
  }

  return feedback;
}; 