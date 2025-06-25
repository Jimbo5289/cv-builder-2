/* eslint-disable */
import React from 'react';
import { FiExternalLink, FiStar, FiClock, FiUser, FiTarget, FiSearch } from 'react-icons/fi';

const CourseRecommendations = ({ courses = [], title = 'Recommended Courses to Match Job Requirements' }) => {
  if (!courses || courses.length === 0) {
    return null;
  }

  const getCostBadgeColor = (cost) => {
    switch (cost?.toLowerCase()) {
      case 'free': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'paid': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'subscription': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getLevelBadgeColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'advanced': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300';
      case 'professional': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const handleCourseClick = (course) => {
    // Primary: Use direct URL if available
    if (course.url && course.url !== '#' && course.url.startsWith('http')) {
      window.open(course.url, '_blank', 'noopener,noreferrer');
      return;
    }

    // Fallback 1: Search on provider's website
    if (course.provider) {
      const providerSearchUrls = {
        'NEBOSH': 'https://www.nebosh.org.uk/search/?q=',
        'CIOB': 'https://www.ciob.org/search?q=',
        'IFE': 'https://www.ife.org.uk/search?q=',
        'IOSH': 'https://www.iosh.com/search/?q=',
        'Coursera': 'https://www.coursera.org/search?query=',
        'edX': 'https://www.edx.org/search?q=',
        'Udemy': 'https://www.udemy.com/courses/search/?q=',
        'LinkedIn Learning': 'https://www.linkedin.com/learning/search?keywords=',
        'Pluralsight': 'https://www.pluralsight.com/search?q=',
        'FutureLearn': 'https://www.futurelearn.com/search?q='
      };

      const searchUrl = providerSearchUrls[course.provider];
      if (searchUrl) {
        const searchQuery = encodeURIComponent(course.title);
        window.open(searchUrl + searchQuery, '_blank', 'noopener,noreferrer');
        return;
      }
    }

    // Fallback 2: Google search for the course
    const searchQuery = encodeURIComponent(`${course.title} ${course.provider} course`);
    window.open(`https://www.google.com/search?q=${searchQuery}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
      <div className="flex items-center mb-4">
        <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg mr-3">
          <FiTarget className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100">{title}</h3>
      </div>
      
      <p className="text-sm text-blue-700 dark:text-blue-200 mb-6 leading-relaxed">
        Improve your skills with these recommended courses from trusted providers. 
        Each course has been selected based on the specific requirements identified in the job description.
      </p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {courses.map((course, index) => (
          <div 
            key={course.id || index} 
            className="group bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div className="p-5">
              {/* Header with title and rating */}
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-semibold text-gray-900 dark:text-white text-base leading-tight pr-2">
                  {course.title}
                </h4>
                {course.rating && (
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <FiStar className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {course.rating}
                    </span>
                  </div>
                )}
              </div>

              {/* Provider and badges */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {course.provider}
                </span>
                
                {course.level && (
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getLevelBadgeColor(course.level)}`}>
                    {course.level}
                  </span>
                )}
                
                {course.cost && (
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getCostBadgeColor(course.cost)}`}>
                    {course.cost}
                  </span>
                )}
              </div>

              {/* Course details */}
              <div className="flex items-center gap-4 mb-3 text-sm text-gray-500 dark:text-gray-400">
                {course.duration && (
                  <div className="flex items-center gap-1">
                    <FiClock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                )}
                
                {course.relevanceScore && (
                  <div className="flex items-center gap-1">
                    <FiTarget className="w-4 h-4" />
                    <span>{Math.round(course.relevanceScore * 100)}% match</span>
                  </div>
                )}
              </div>

              {/* Description */}
              {course.description && (
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                  {course.description}
                </p>
              )}

              {/* Reason for recommendation */}
              {course.reason && (
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border-l-3 border-blue-400">
                  <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                    💡 {course.reason}
                  </p>
                </div>
              )}

              {/* Action button */}
              <button
                onClick={() => handleCourseClick(course)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium text-sm group-hover:bg-blue-700"
              >
                {course.url && course.url !== '#' && course.url.startsWith('http') ? (
                  <>
                    <span>View Course</span>
                    <FiExternalLink className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>Find Course</span>
                    <FiSearch className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer tip */}
      <div className="mt-6 p-4 bg-blue-100 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center mt-0.5">
            <span className="text-white text-xs font-bold">💡</span>
          </div>
          <div className="text-sm text-blue-800 dark:text-blue-200">
            <p className="font-medium mb-1">Pro Tip:</p>
            <p>
              These courses are specifically recommended based on the skills gaps identified in your CV analysis. 
              Completing them will significantly improve your job match score and competitiveness.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseRecommendations; 