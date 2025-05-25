import React from 'react';
import { FiExternalLink } from 'react-icons/fi';

const CourseRecommendations = ({ courses = [], title = 'Recommended Courses' }) => {
  if (!courses || courses.length === 0) {
    return null;
  }
  
  return (
    <div className="mt-6 p-4 bg-blue-50 dark:bg-gray-800 rounded-lg">
      <h3 className="text-lg font-medium text-blue-800 dark:text-blue-300 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        Improve your skills with these recommended courses from trusted providers
      </p>
      <div className="space-y-3">
        {courses.map((course, index) => (
          <div 
            key={index} 
            className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-md shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex-grow mb-2 sm:mb-0">
              <h4 className="font-medium text-gray-800 dark:text-white">{course.title}</h4>
              <div className="flex items-center mt-1">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mr-2">
                  Provider: {course.provider}
                </span>
                <span className="text-xs px-2 py-1 rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                  {course.level}
                </span>
              </div>
            </div>
            <a 
              href={course.url} 
              target="_blank"
              rel="noopener noreferrer" 
              className="inline-flex items-center px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              View Course <FiExternalLink className="ml-1" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseRecommendations; 