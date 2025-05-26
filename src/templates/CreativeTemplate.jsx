import React from 'react';
import { QUALIFICATION_LEVELS } from '../data/educationData';
import { formatDateRange } from '../utils/dateUtils';

// Helper function to get qualification label from value
const getQualificationLabel = (value) => {
  if (!value) return '';
  const qualification = QUALIFICATION_LEVELS.find(qual => qual.value === value);
  return qualification ? qualification.label : value;
};

const CreativeTemplate = ({ cv }) => {
  if (!cv) return null;

  // Generate a color based on the name for visual elements
  const getAccentColor = () => {
    const colors = ['#E24A8B', '#4AE2C4', '#E2A64A', '#4A90E2', '#9C4AE2'];
    const nameHash = cv.personalInfo?.fullName?.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) || 0;
    return colors[nameHash % colors.length];
  };
  
  const accentColor = getAccentColor();

  return (
    <div className="bg-white print:bg-white text-gray-800 max-w-4xl mx-auto shadow-none print:shadow-none">
      {/* Creative template with modern layout and visual elements */}
      
      {/* Header - Modern and eye-catching with accent color */}
      <header className="py-8 px-6 print:break-inside-avoid" style={{ backgroundColor: `${accentColor}15` }}>
        <div className="relative">
          <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full" style={{ backgroundColor: accentColor }}></div>
          <h1 className="text-4xl font-bold text-gray-900 ml-6 relative z-10">{cv.personalInfo?.fullName}</h1>
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            {cv.personalStatement && (
              <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
                {cv.personalStatement.length > 300 
                  ? cv.personalStatement.substring(0, 300) + '...' 
                  : cv.personalStatement}
              </p>
            )}
          </div>
          
          <div className="flex flex-col space-y-2 items-start md:items-end">
            {cv.personalInfo?.email && (
              <span className="flex items-center text-gray-700">
                <span className="mr-2">{cv.personalInfo.email}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: accentColor }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
            )}
            {cv.personalInfo?.phone && (
              <span className="flex items-center text-gray-700">
                <span className="mr-2">{cv.personalInfo.phone}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: accentColor }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </span>
            )}
            {cv.personalInfo?.location && (
              <span className="flex items-center text-gray-700">
                <span className="mr-2">{cv.personalInfo.location}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: accentColor }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </span>
            )}
            {cv.personalInfo?.socialNetwork && (
              <span className="flex items-center text-gray-700">
                <span className="mr-2">{cv.personalInfo.socialNetwork}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: accentColor }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </span>
            )}
          </div>
        </div>
      </header>

      <div className="px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left column - Skills and Education */}
          <div className="col-span-1 md:col-span-4">
            {/* Skills with visual skill level indicators */}
            {cv.skills?.length > 0 && (
              <section className="mb-8 print:break-inside-avoid">
                <h2 className="text-lg font-bold mb-4 relative pl-4" style={{ borderLeft: `4px solid ${accentColor}` }}>
                  Skills
                </h2>
                <div className="space-y-3">
                  {cv.skills.map((skill, index) => {
                    // Calculate a visual skill level (1-5)
                    let level = 3; // Default medium level
                    if (skill.level === 'Beginner') level = 1;
                    if (skill.level === 'Elementary') level = 2;
                    if (skill.level === 'Intermediate') level = 3;
                    if (skill.level === 'Advanced') level = 4;
                    if (skill.level === 'Expert') level = 5;
                    
                    return (
                      <div key={index} className="mb-2">
                        <div className="flex justify-between mb-1">
                          <span className="font-medium text-gray-700">{skill.skill}</span>
                          <span className="text-sm text-gray-500">{skill.level}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="h-1.5 rounded-full" style={{ 
                            width: `${level * 20}%`, 
                            backgroundColor: accentColor 
                          }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
            
            {/* Education with modern styling */}
            {cv.education?.length > 0 && (
              <section className="print:break-inside-avoid">
                <h2 className="text-lg font-bold mb-4 relative pl-4" style={{ borderLeft: `4px solid ${accentColor}` }}>
                  Education
                </h2>
                {cv.education.map((edu, index) => (
                  <div key={index} className="mb-4 relative pl-6 pb-4">
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-300"></div>
                    <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }}></div>
                    <h3 className="font-semibold text-gray-800">{edu.institution}</h3>
                    <p className="text-gray-700 font-medium">
                      {getQualificationLabel(edu.degree)}{edu.field ? ` - ${edu.field}` : ''}
                    </p>
                    <p className="text-sm text-gray-500 mb-2">
                      {formatDateRange(edu.startDate, edu.endDate)}
                    </p>
                    <div className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">{edu.description}</div>
                  </div>
                ))}
              </section>
            )}
          </div>
          
          {/* Right column - Experience and References */}
          <div className="col-span-1 md:col-span-8">
            {/* Experience with timeline design */}
            {cv.experiences?.length > 0 && (
              <section className="mb-8">
                <h2 className="text-lg font-bold mb-4 relative pl-4 print:break-inside-avoid" style={{ borderLeft: `4px solid ${accentColor}` }}>
                  Experience
                </h2>
                {cv.experiences.map((exp, index) => (
                  <div key={index} className="mb-6 relative pl-8 pb-6 border-l border-gray-300 print:break-inside-avoid">
                    <div className="absolute left-0 top-0 w-4 h-4 -ml-2 rounded-full border-2 border-white" style={{ backgroundColor: accentColor }}></div>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-1">
                      <h3 className="text-lg font-semibold text-gray-800">{exp.position}</h3>
                      <span className="text-sm text-gray-500 whitespace-nowrap">
                        {formatDateRange(exp.startDate, exp.endDate)}
                      </span>
                    </div>
                    <p className="text-base font-medium text-gray-700 mb-2">{exp.company}</p>
                    <div className="text-gray-600 whitespace-pre-wrap leading-relaxed">{exp.description}</div>
                  </div>
                ))}
              </section>
            )}
            
            {/* References */}
            <section className="print:break-inside-avoid">
              <h2 className="text-lg font-bold mb-4 relative pl-4" style={{ borderLeft: `4px solid ${accentColor}` }}>
                References
              </h2>
              {cv.referencesOnRequest ? (
                <p className="italic text-gray-700 pl-8">References available upon request</p>
              ) : cv.references?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-8">
                  {cv.references.map((ref, index) => (
                    <div key={index} className="p-4 rounded-lg" style={{ backgroundColor: `${accentColor}10` }}>
                      <h3 className="font-semibold text-gray-800">{ref.name}</h3>
                      <p className="text-gray-700">{ref.position}</p>
                      <p className="text-gray-600">{ref.company}</p>
                      <div className="mt-2 text-sm">
                        <p className="text-gray-600">{ref.email}</p>
                        <p className="text-gray-600">{ref.phone}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="italic text-gray-700 pl-8">No references provided</p>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreativeTemplate; 