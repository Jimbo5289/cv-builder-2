/* eslint-disable */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Blog() {
  // Define a fallback image for cases where the main image fails to load
  const fallbackImage = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80";

  const blogPosts = [
    {
      id: 1,
      title: "10 CV Mistakes That Could Cost You The Job",
      excerpt: "Discover the common CV mistakes that recruiters immediately notice and how to avoid them.",
      date: "May 5, 2025",
      image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80",
      category: "CV Writing",
      photographer: "Avel Chuklanov",
      photoUrl: "https://unsplash.com/@chuklanov"
    },
    {
      id: 2,
      title: "How to Explain Employment Gaps on Your CV",
      excerpt: "Employment gaps don't have to be a red flag. Learn how to address them effectively on your CV.",
      date: "April 28, 2025",
      image: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&q=80",
      category: "Career Advice",
      photographer: "Eric Rothermel",
      photoUrl: "https://unsplash.com/@erothermel"
    },
    {
      id: 3,
      title: "Using AI Tools to Enhance Your Job Search",
      excerpt: "Modern AI tools can transform your job search. Learn how to use them effectively to find better opportunities.",
      date: "April 15, 2025",
      image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80",
      category: "Technology",
      photographer: "Aideal Hwa",
      photoUrl: "https://unsplash.com/@aideal"
    },
    {
      id: 4,
      title: "Transferable Skills: The Secret to Career Transitions",
      excerpt: "Changing careers? Learn how to identify and highlight transferable skills on your CV.",
      date: "April 2, 2025",
      image: "https://images.unsplash.com/photo-1553034545-32d4cd2168f1?auto=format&fit=crop&q=80",
      category: "Career Change",
      photographer: "Dan Freeman",
      photoUrl: "https://unsplash.com/@danfreemanphoto"
    },
    {
      id: 5,
      title: "Remote Work Skills That Should Be On Your CV",
      excerpt: "With remote work becoming more common, make sure your CV showcases these essential skills.",
      date: "March 20, 2025",
      image: "https://images.unsplash.com/photo-1593642634315-48f5414c3ad9?auto=format&fit=crop&q=80",
      category: "Remote Work",
      photographer: "XPS",
      photoUrl: "https://unsplash.com/@xps"
    },
    {
      id: 6,
      title: "Mastering the Video Interview: Preparation Tips",
      excerpt: "Video interviews require specific preparation. Here's how to make a great impression on camera.",
      date: "March 12, 2025",
      image: "https://images.unsplash.com/photo-1616587226960-4a03badbe8bf?auto=format&fit=crop&q=80",
      category: "Interviews",
      photographer: "Volodymyr Hryshchenko",
      photoUrl: "https://unsplash.com/@lunarts"
    }
  ];

  // State to track which images have failed to load
  const [failedImages, setFailedImages] = useState({});

  // Handle image load errors
  const handleImageError = (postId) => {
    setFailedImages(prev => ({
      ...prev,
      [postId]: true
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">CV Builder Blog</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Expert advice on CV writing, job hunting, and career development to help you succeed in your professional journey.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map(post => (
            <div key={post.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 overflow-hidden bg-gray-200 dark:bg-gray-700 relative">
                {!failedImages[post.id] ? (
                  <>
                    <img 
                      src={post.image} 
                      alt={`${post.title} - Photo by ${post.photographer} on Unsplash`} 
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                      onError={() => handleImageError(post.id)}
                    />
                    <div className="absolute bottom-0 right-0 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-tl-md">
                      <a href={post.photoUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        Photo: {post.photographer} / Unsplash
                      </a>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center p-4">
                      <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{post.title}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-center mb-2">
                  <span className="text-xs font-semibold bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 rounded-full px-3 py-1">
                    {post.category}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-3">{post.date}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{post.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{post.excerpt}</p>
                <Link
                  to={`/blog/${post.id}`}
                  className="text-blue-600 dark:text-blue-400 font-medium hover:text-blue-800 dark:hover:text-blue-300"
                >
                  Read More →
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-2">Want more career advice?</p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/cv-tips"
              className="text-blue-600 dark:text-blue-400 font-medium hover:text-blue-800 dark:hover:text-blue-300"
            >
              CV Writing Tips
            </Link>
            <Link
              to="/templates"
              className="text-blue-600 dark:text-blue-400 font-medium hover:text-blue-800 dark:hover:text-blue-300"
            >
              CV Templates
            </Link>
          </div>
        </div>
        
        <div className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400">
          <p>All photos sourced from <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="underline">Unsplash</a> under their free-to-use license.</p>
        </div>
      </div>
    </div>
  );
} 