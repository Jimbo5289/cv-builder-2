import React from 'react';

const CVComparisonResults = ({ comparisonResults }) => {
  const { score, grade, feedback } = comparisonResults;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">CV Analysis Results</h2>
        <div className="flex items-center justify-center space-x-4">
          <div className="text-4xl font-bold text-[#2c3e50] dark:text-white">{score}%</div>
          <div className="text-4xl font-bold" style={{ color: getGradeColor(grade) }}>
            {grade}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <section>
          <h3 className="text-xl font-semibold mb-3 text-[#2c3e50] dark:text-blue-400">Feedback</h3>
          <div className="space-y-2">
            {feedback.map((item, index) => (
              <p key={index} className="text-gray-700 dark:text-gray-300">
                {item}
              </p>
            ))}
          </div>
        </section>

        {comparisonResults.missingSections.length > 0 && (
          <section>
            <h3 className="text-xl font-semibold mb-3 text-[#2c3e50] dark:text-blue-400">Missing Sections</h3>
            <ul className="list-disc pl-5 space-y-1">
              {comparisonResults.missingSections.map((section, index) => (
                <li key={index} className="text-red-600 dark:text-red-400">
                  {formatSectionName(section)}
                </li>
              ))}
            </ul>
          </section>
        )}

        {comparisonResults.incompleteSections.length > 0 && (
          <section>
            <h3 className="text-xl font-semibold mb-3 text-[#2c3e50] dark:text-blue-400">Incomplete Sections</h3>
            <div className="space-y-4">
              {comparisonResults.incompleteSections.map((section, index) => (
                <div key={index} className="border-l-4 border-yellow-500 dark:border-yellow-600 pl-4">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200">{formatSectionName(section.section)}</h4>
                  {section.missingFields && (
                    <p className="text-gray-600 dark:text-gray-400">
                      Missing fields: {section.missingFields.join(', ')}
                    </p>
                  )}
                  {section.message && (
                    <p className="text-gray-600 dark:text-gray-400">{section.message}</p>
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
  const isDarkMode = document.documentElement.classList.contains('dark');
  
  switch (grade) {
    case 'A':
      return isDarkMode ? '#34D399' : '#10B981'; // light/dark green
    case 'B':
      return isDarkMode ? '#60A5FA' : '#3B82F6'; // light/dark blue
    case 'C':
      return isDarkMode ? '#FBBF24' : '#F59E0B'; // light/dark yellow
    case 'D':
      return isDarkMode ? '#FB923C' : '#F97316'; // light/dark orange
    case 'F':
      return isDarkMode ? '#F87171' : '#EF4444'; // light/dark red
    default:
      return isDarkMode ? '#9CA3AF' : '#6B7280'; // light/dark gray
  }
};

const formatSectionName = (section) => {
  return section
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .replace(/\[.*\]/, '');
};

export default CVComparisonResults; 