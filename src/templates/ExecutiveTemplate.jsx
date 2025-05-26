import React from 'react';
import { QUALIFICATION_LEVELS } from '../data/educationData';
import { formatDateRange } from '../utils/dateUtils';

// Helper function to get qualification label from value
const getQualificationLabel = (value) => {
  if (!value) return '';
  const qualification = QUALIFICATION_LEVELS.find(qual => qual.value === value);
  return qualification ? qualification.label : value;
};

const ExecutiveTemplate = ({ cv }) => {
  if (!cv) return null;

  return (
    <div className="bg-white print:bg-white text-gray-900 max-w-4xl mx-auto shadow-none print:shadow-none">
      {/* Executive template with sophisticated layout for senior roles */}
      
      {/* Header - Elegant with understated design elements */}
      <header className="pt-8 pb-6 border-b-2 border-gray-900 print:break-inside-avoid">
        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">{cv.personalInfo?.fullName}</h1>
        
        <div className="mt-3 flex flex-col md:flex-row md:justify-between md:items-end">
          <div className="max-w-2xl mb-3 md:mb-0">
            {cv.personalStatement && (
              <p className="text-gray-700 text-sm leading-relaxed italic">
                "{cv.personalStatement.split('.')[0]}."
              </p>
            )}
          </div>
          
          <div className="flex flex-col items-start md:items-end space-y-1 text-sm text-gray-700">
            {cv.personalInfo?.email && (
              <span>{cv.personalInfo.email}</span>
            )}
            {cv.personalInfo?.phone && (
              <span>{cv.personalInfo.phone}</span>
            )}
            {cv.personalInfo?.location && (
              <span>{cv.personalInfo.location}</span>
            )}
            {cv.personalInfo?.socialNetwork && (
              <span>{cv.personalInfo.socialNetwork}</span>
            )}
          </div>
        </div>
      </header>

      <div className="py-6">
        {/* Main content in a two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left column (1/3 width) */}
          <div className="col-span-1 md:border-r border-gray-200 pr-0 md:pr-6">
            {/* Profile section */}
            {cv.personalStatement && (
              <section className="mb-8 print:break-inside-avoid">
                <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">Executive Profile</h2>
                <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">{cv.personalStatement}</p>
              </section>
            )}
            
            {/* Skills section with executive focus */}
            {cv.skills?.length > 0 && (
              <section className="mb-8 print:break-inside-avoid">
                <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">Core Competencies</h2>
                <div className="space-y-1">
                  {cv.skills.map((skill, index) => (
                    <div key={index} className="mb-1 py-1">
                      <div className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-gray-900 mr-2 flex-shrink-0"></div>
                        <span className="font-medium text-gray-800">{skill.skill}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
            
            {/* Education with emphasis on achievements */}
            {cv.education?.length > 0 && (
              <section className="print:break-inside-avoid">
                <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide">Education</h2>
                {cv.education.map((edu, index) => (
                  <div key={index} className="mb-4">
                    <h3 className="font-semibold text-gray-900">{edu.institution}</h3>
                    <p className="text-gray-800 font-medium">
                      {getQualificationLabel(edu.degree)}{edu.field ? ` in ${edu.field}` : ''}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      {formatDateRange(edu.startDate, edu.endDate)}
                    </p>
                    <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{edu.description}</div>
                  </div>
                ))}
              </section>
            )}
          </div>
          
          {/* Right column (2/3 width) - Experience with emphasis on leadership and achievements */}
          <div className="col-span-1 md:col-span-2">
            {cv.experiences?.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wide border-b border-gray-300 pb-1 print:break-inside-avoid">
                  Professional Experience
                </h2>
                {cv.experiences.map((exp, index) => (
                  <div key={index} className="mb-6 print:break-inside-avoid">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-1">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{exp.position}</h3>
                        <p className="text-base text-gray-800">{exp.company}</p>
                      </div>
                      <span className="text-sm text-gray-600 whitespace-nowrap mt-1 md:mt-0">
                        {formatDateRange(exp.startDate, exp.endDate)}
                      </span>
                    </div>
                    <div className="mt-2 text-gray-700 whitespace-pre-wrap leading-relaxed">{exp.description}</div>
                    {index < cv.experiences.length - 1 && (
                      <div className="border-b border-gray-200 my-6"></div>
                    )}
                  </div>
                ))}
              </section>
            )}
            
            {/* References - Sophisticated presentation */}
            <section className="mt-8 print:break-inside-avoid">
              <h2 className="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wide border-b border-gray-300 pb-1">
                References
              </h2>
              {cv.referencesOnRequest ? (
                <p className="text-gray-700 font-medium">Professional references available upon request</p>
              ) : cv.references?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {cv.references.map((ref, index) => (
                    <div key={index} className="border-l-2 border-gray-300 pl-4">
                      <h3 className="font-semibold text-gray-900">{ref.name}</h3>
                      <p className="text-gray-800">{ref.position}</p>
                      <p className="text-gray-700">{ref.company}</p>
                      <div className="mt-1 text-sm text-gray-600">
                        <p>{ref.email}</p>
                        <p>{ref.phone}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-700 font-medium">No references provided</p>
              )}
            </section>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="pt-6 border-t border-gray-300 text-center text-xs text-gray-500 mt-8 print:break-inside-avoid">
        <p>Confidential - {cv.personalInfo?.fullName} - Page 1</p>
      </footer>
    </div>
  );
};

export default ExecutiveTemplate; 