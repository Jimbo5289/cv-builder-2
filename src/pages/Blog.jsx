import React from 'react';
import { Link } from 'react-router-dom';

export default function Blog() {
  const blogPosts = [
    {
      id: 1,
      title: "10 CV Mistakes That Could Cost You The Job",
      excerpt: "Discover the common CV mistakes that recruiters immediately notice and how to avoid them.",
      date: "May 5, 2025",
      image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
      category: "CV Writing"
    },
    {
      id: 2,
      title: "How to Explain Employment Gaps on Your CV",
      excerpt: "Employment gaps don't have to be a red flag. Learn how to address them effectively on your CV.",
      date: "April 28, 2025",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
      category: "Career Advice"
    },
    {
      id: 3,
      title: "Using AI Tools to Enhance Your Job Search",
      excerpt: "Modern AI tools can transform your job search. Learn how to use them effectively to find better opportunities.",
      date: "April 15, 2025",
      image: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
      category: "Technology"
    },
    {
      id: 4,
      title: "Transferable Skills: The Secret to Career Transitions",
      excerpt: "Changing careers? Learn how to identify and highlight transferable skills on your CV.",
      date: "April 2, 2025",
      image: "https://images.unsplash.com/photo-1507209261841-e517c3ef7fc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
      category: "Career Change"
    },
    {
      id: 5,
      title: "Remote Work Skills That Should Be On Your CV",
      excerpt: "With remote work becoming more common, make sure your CV showcases these essential skills.",
      date: "March 20, 2025",
      image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
      category: "Remote Work"
    },
    {
      id: 6,
      title: "Mastering the Video Interview: Preparation Tips",
      excerpt: "Video interviews require specific preparation. Here's how to make a great impression on camera.",
      date: "March 12, 2025",
      image: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
      category: "Interviews"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">CV Builder Blog</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Expert advice on CV writing, job hunting, and career development to help you succeed in your professional journey.
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map(post => (
            <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center mb-2">
                  <span className="text-xs font-semibold bg-blue-100 text-blue-800 rounded-full px-3 py-1">
                    {post.category}
                  </span>
                  <span className="text-sm text-gray-500 ml-3">{post.date}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h3>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <Link
                  to={`/blog/${post.id}`}
                  className="text-blue-600 font-medium hover:text-blue-800"
                >
                  Read More →
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-2">Want more career advice?</p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/cv-tips"
              className="text-blue-600 font-medium hover:text-blue-800"
            >
              CV Writing Tips
            </Link>
            <Link
              to="/templates"
              className="text-blue-600 font-medium hover:text-blue-800"
            >
              CV Templates
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 