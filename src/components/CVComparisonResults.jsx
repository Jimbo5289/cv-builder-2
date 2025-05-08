import React from 'react';

const CVComparisonResults = ({ comparisonResults }) => {
  const { score, grade, feedback } = comparisonResults;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">CV Analysis Results</h2>
        <div className="flex items-center justify-center space-x-4">
          <div className="text-4xl font-bold text-[#2c3e50]">{score}%</div>
          <div className="text-4xl font-bold" style={{ color: getGradeColor(grade) }}>
            {grade}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <section>
          <h3 className="text-xl font-semibold mb-3 text-[#2c3e50]">Feedback</h3>
          <div className="space-y-2">
            {feedback.map((item, index) => (
              <p key={index} className="text-gray-700">
                {item}
              </p>
            ))}
          </div>
        </section>

        {comparisonResults.missingSections.length > 0 && (
          <section>
            <h3 className="text-xl font-semibold mb-3 text-[#2c3e50]">Missing Sections</h3>
            <ul className="list-disc pl-5 space-y-1">
              {comparisonResults.missingSections.map((section, index) => (
                <li key={index} className="text-red-600">
                  {formatSectionName(section)}
                </li>
              ))}
            </ul>
          </section>
        )}

        {comparisonResults.incompleteSections.length > 0 && (
          <section>
            <h3 className="text-xl font-semibold mb-3 text-[#2c3e50]">Incomplete Sections</h3>
            <div className="space-y-4">
              {comparisonResults.incompleteSections.map((section, index) => (
                <div key={index} className="border-l-4 border-yellow-500 pl-4">
                  <h4 className="font-semibold">{formatSectionName(section.section)}</h4>
                  {section.missingFields && (
                    <p className="text-gray-600">
                      Missing fields: {section.missingFields.join(', ')}
                    </p>
                  )}
                  {section.message && (
                    <p className="text-gray-600">{section.message}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

const getGradeColor = (grade) => {
  switch (grade) {
    case 'A':
      return '#10B981'; // green
    case 'B':
      return '#3B82F6'; // blue
    case 'C':
      return '#F59E0B'; // yellow
    case 'D':
      return '#F97316'; // orange
    case 'F':
      return '#EF4444'; // red
    default:
      return '#6B7280'; // gray
  }
};

const formatSectionName = (section) => {
  return section
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .replace(/\[.*\]/, '');
};

export default CVComparisonResults; 