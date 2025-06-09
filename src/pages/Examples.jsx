/* eslint-disable */
import React from 'react';
import { Link } from 'react-router-dom';

const Examples = () => {
  const exampleCVs = [
    {
      id: 1,
      title: 'Software Engineer',
      description: 'A clean and professional CV template perfect for tech roles',
      image: '/images/examples/software-engineer.svg'
    },
    {
      id: 2,
      title: 'Marketing Manager',
      description: 'Creative CV template highlighting marketing achievements',
      image: '/images/examples/marketing-manager.svg'
    },
    {
      id: 3,
      title: 'Graphic Designer',
      description: 'Visual CV template showcasing design portfolio',
      image: '/images/examples/graphic-designer.svg'
    },
    {
      id: 4,
      title: 'Project Manager',
      description: 'Structured CV template emphasizing project delivery',
      image: '/images/examples/project-manager.svg'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">CV Examples</h1>
        <p className="text-xl text-gray-600">
          Get inspired by our collection of professionally crafted CV examples
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {exampleCVs.map((cv) => (
          <div
            key={cv.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={cv.image}
                alt={cv.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {cv.title}
              </h3>
              <p className="text-gray-600 mb-4">{cv.description}</p>
              <Link
                to="/create"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300"
              >
                Use this template
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <Link
          to="/create"
          className="inline-block bg-gray-900 text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors duration-300 text-lg font-semibold"
        >
          Create Your Own CV
        </Link>
      </div>
    </div>
  );
};

export default Examples; 