import React from 'react';
import { QUALIFICATION_LEVELS } from '../data/educationData';
import { formatDateRange } from '../utils/dateUtils';

// Helper function to get qualification label from value
const getQualificationLabel = (value) => {
  if (!value) return '';
  const qualification = QUALIFICATION_LEVELS.find(qual => qual.value === value);
  return qualification ? qualification.label : value;
};

const AcademicTemplate = ({ cv }) => {
  if (!cv) return null;

  // Function to detect publication entries in the description
  const parsePublications = (description) => {
    if (!description) return { general: description, publications: [] };
    
    // Very simple detection: look for lines that might be publications
    // In real app, we'd have a dedicated publications field or better parsing
    const lines = description.split('\n');
    const publications = lines.filter(line => 
      (line.includes('(20') || line.includes('(19')) && // Has a year in parentheses
      (line.includes('. ') || line.includes(', ')) // Has common citation punctuation
    );
    
    const general = lines.filter(line => !publications.includes(line)).join('\n');
    
    return { general, publications };
  };

  return (
    <div className="bg-white print:bg-white text-gray-900 max-w-4xl mx-auto shadow-none print:shadow-none font-serif">
      {/* Academic template with focus on research, publications, and education */}
      
      {/* Header - Classic academic styling */}
      <header className="py-6 text-center print:break-inside-avoid">
        <h1 className="text-3xl font-bold tracking-tight mb-1 text-gray-900">{cv.personalInfo?.fullName}</h1>
        
        <div className="flex flex-wrap justify-center text-sm text-gray-700 gap-3 mt-2">
          {cv.personalInfo?.email && (
            <span className="border-r border-gray-400 pr-3">{cv.personalInfo.email}</span>
          )}
          {cv.personalInfo?.phone && (
            <span className="border-r border-gray-400 pr-3">{cv.personalInfo.phone}</span>
          )}
          {cv.personalInfo?.location && (
            <span className="border-r border-gray-400 pr-3">{cv.personalInfo.location}</span>
          )}
          {cv.personalInfo?.socialNetwork && (
            <span>{cv.personalInfo.socialNetwork}</span>
          )}
        </div>
      </header>

      <hr className="border-t border-gray-300 my-4" />

      <div className="grid grid-cols-1 gap-6 py-4">
        {/* Personal Statement / Research Interests */}
        {cv.personalStatement && (
          <section className="print:break-inside-avoid">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Research Interests</h2>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{cv.personalStatement}</p>
          </section>
        )}

        {/* Education - Prominently featured for academic CV */}
        {cv.education?.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3 print:break-inside-avoid">Education</h2>
            {cv.education.map((edu, index) => (
              <div key={index} className="mb-5 print:break-inside-avoid">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{getQualificationLabel(edu.degree)}{edu.field ? ` in ${edu.field}` : ''}</h3>
                    <p className="text-base text-gray-800">{edu.institution}</p>
                  </div>
                  <span className="text-sm text-gray-600 whitespace-nowrap mt-1 md:mt-0">
                    {formatDateRange(edu.startDate, edu.endDate)}
                  </span>
                </div>
                <div className="mt-2 text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {/* Parse for thesis/dissertation if exists */}
                  {edu.description?.includes('Thesis:') || edu.description?.includes('Dissertation:') ? (
                    <div>
                      {edu.description.split('\n').map((line, i) => {
                        if (line.includes('Thesis:') || line.includes('Dissertation:')) {
                          return <p key={i} className="font-medium">{line}</p>;
                        }
                        return <p key={i}>{line}</p>;
                      })}
                    </div>
                  ) : (
                    edu.description
                  )}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Experience - Treated as Academic Positions & Teaching Experience */}
        {cv.experiences?.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3 print:break-inside-avoid">Academic Positions</h2>
            {cv.experiences.map((exp, index) => {
              // Parse description for potential publications
              const { general, publications } = parsePublications(exp.description);
              
              return (
                <div key={index} className="mb-5 print:break-inside-avoid">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{exp.position}</h3>
                      <p className="text-base text-gray-800">{exp.company}</p>
                    </div>
                    <span className="text-sm text-gray-600 whitespace-nowrap mt-1 md:mt-0">
                      {formatDateRange(exp.startDate, exp.endDate)}
                    </span>
                  </div>
                  
                  {/* General responsibilities and achievements */}
                  <div className="mt-2 text-gray-700 whitespace-pre-wrap leading-relaxed">{general}</div>
                  
                  {/* Publications if detected */}
                  {publications.length > 0 && (
                    <div className="mt-3 print:break-inside-avoid">
                      <h4 className="text-base font-semibold text-gray-800 mb-1">Related Publications:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {publications.map((pub, i) => (
                          <li key={i} className="text-gray-700">{pub}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </section>
        )}

        {/* Skills - Presented as Academic Skills and Research Methods */}
        {cv.skills?.length > 0 && (
          <section className="print:break-inside-avoid">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Research Skills & Methods</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
              {cv.skills.map((skill, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-1 h-1 bg-gray-900 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                  <div>
                    <span className="font-medium text-gray-800">{skill.skill}</span>
                    {skill.level && (
                      <span className="text-gray-600 text-sm ml-1">({skill.level})</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* References - Academic References */}
        <section className="print:break-inside-avoid">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Academic References</h2>
          {cv.referencesOnRequest ? (
            <p className="text-gray-700 italic">Academic references available upon request</p>
          ) : cv.references?.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {cv.references.map((ref, index) => (
                <div key={index} className="mb-3">
                  <h3 className="font-semibold text-gray-900">{ref.name}</h3>
                  <p className="text-gray-800">{ref.position}</p>
                  <p className="text-gray-700">{ref.company}</p>
                  <div className="mt-1 text-gray-600">
                    <p>{ref.email}</p>
                    <p>{ref.phone}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-700 italic">No references provided</p>
          )}
        </section>
      </div>
      
      <footer className="pt-4 border-t border-gray-300 text-center text-xs text-gray-500 mt-6 print:break-inside-avoid">
        <p>Curriculum Vitae - {cv.personalInfo?.fullName} - Last Updated: {new Date().toLocaleDateString()}</p>
      </footer>
    </div>
  );
};

export default AcademicTemplate; 