import React from 'react';
import { QUALIFICATION_LEVELS } from '../data/educationData';
import { formatDateRange } from '../utils/dateUtils';

// Helper function to get qualification label from value
const getQualificationLabel = (value) => {
  if (!value) return '';
  const qualification = QUALIFICATION_LEVELS.find(qual => qual.value === value);
  return qualification ? qualification.label : value;
};

const ProfessionalTemplate = ({ cv }) => {
  if (!cv) return null;

  return (
    <div className="bg-white print:bg-white text-gray-800 max-w-4xl mx-auto shadow-none print:shadow-none">
      {/* Professional template with clean, minimal design */}
      
      {/* Header - Minimalist with clear contact info */}
      <header className="py-6 border-b-2 border-gray-700 print:break-inside-avoid">
        <h1 className="text-3xl font-bold text-center text-gray-900">{cv.personalInfo?.fullName}</h1>
        <div className="flex flex-wrap justify-center mt-2 text-sm text-gray-600 gap-4">
          {cv.personalInfo?.email && (
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {cv.personalInfo.email}
            </span>
          )}
          {cv.personalInfo?.phone && (
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {cv.personalInfo.phone}
            </span>
          )}
          {cv.personalInfo?.location && (
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {cv.personalInfo.location}
            </span>
          )}
          {cv.personalInfo?.socialNetwork && (
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              {cv.personalInfo.socialNetwork}
            </span>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 py-6">
        {/* Personal Statement */}
        {cv.personalStatement && (
          <section className="print:break-inside-avoid">
            <h2 className="text-xl font-bold text-gray-800 mb-3 uppercase tracking-wider border-b border-gray-300 pb-1">Profile</h2>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{cv.personalStatement}</p>
          </section>
        )}

        {/* Skills - clean two-column layout */}
        {cv.skills?.length > 0 && (
          <section className="print:break-inside-avoid">
            <h2 className="text-xl font-bold text-gray-800 mb-3 uppercase tracking-wider border-b border-gray-300 pb-1">Key Skills</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
              {cv.skills.map((skill, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-2 h-2 bg-gray-700 rounded-full mr-2 flex-shrink-0"></div>
                  <span className="font-medium">{skill.skill}</span>
                  <span className="text-gray-500 ml-1">({skill.level})</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience - Structured with emphasis on work experience */}
        {cv.experiences?.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3 uppercase tracking-wider border-b border-gray-300 pb-1 print:break-inside-avoid">Professional Experience</h2>
            {cv.experiences.map((exp, index) => (
              <div key={index} className="mb-6 print:break-inside-avoid">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                  <h3 className="text-lg font-semibold text-gray-800">{exp.position}</h3>
                  <span className="text-sm text-gray-600 mt-1 md:mt-0">
                    {formatDateRange(exp.startDate, exp.endDate)}
                  </span>
                </div>
                <p className="text-base font-medium text-gray-700">{exp.company}</p>
                <div className="mt-2 text-gray-600 whitespace-pre-wrap leading-relaxed">{exp.description}</div>
              </div>
            ))}
          </section>
        )}

        {/* Education - Clean organization */}
        {cv.education?.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3 uppercase tracking-wider border-b border-gray-300 pb-1 print:break-inside-avoid">Education</h2>
            {cv.education.map((edu, index) => (
              <div key={index} className="mb-6 print:break-inside-avoid">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                  <h3 className="text-lg font-semibold text-gray-800">{edu.institution}</h3>
                  <span className="text-sm text-gray-600 mt-1 md:mt-0">
                    {formatDateRange(edu.startDate, edu.endDate)}
                  </span>
                </div>
                <p className="text-base font-medium text-gray-700">
                  {getQualificationLabel(edu.degree)}{edu.field ? ` - ${edu.field}` : ''}
                </p>
                <div className="mt-2 text-gray-600 whitespace-pre-wrap leading-relaxed">{edu.description}</div>
              </div>
            ))}
          </section>
        )}

        {/* References */}
        <section className="print:break-inside-avoid">
          <h2 className="text-xl font-bold text-gray-800 mb-3 uppercase tracking-wider border-b border-gray-300 pb-1">References</h2>
          {cv.referencesOnRequest ? (
            <p className="text-gray-700 italic">References available upon request</p>
          ) : cv.references?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cv.references.map((ref, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded">
                  <h3 className="font-semibold text-gray-800">{ref.name}</h3>
                  <p className="text-gray-700">{ref.position}</p>
                  <p className="text-gray-600">{ref.company}</p>
                  <p className="text-gray-600">{ref.email}</p>
                  <p className="text-gray-600">{ref.phone}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-700 italic">No references provided</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default ProfessionalTemplate; 