import React from 'react';

export default function CvTips() {
  const tips = [
    {
      title: "Keep it concise",
      description: "Recruiters spend an average of 7 seconds scanning a CV. Keep it to 1-2 pages and highlight only the most relevant information."
    },
    {
      title: "Tailor your CV",
      description: "Customize your CV for each job application. Highlight the skills and experiences that match the job description."
    },
    {
      title: "Use action verbs",
      description: "Start bullet points with strong action verbs like 'achieved', 'implemented', 'managed', or 'developed'."
    },
    {
      title: "Quantify achievements",
      description: "Include numbers and percentages to demonstrate your impact, such as 'Increased sales by 20%' or 'Managed a team of 15 people'."
    },
    {
      title: "Include relevant keywords",
      description: "Many companies use Applicant Tracking Systems (ATS) to filter CVs. Include industry-specific keywords from the job description."
    },
    {
      title: "Check for errors",
      description: "Proofread carefully for spelling and grammar mistakes. A single error can disqualify your application in competitive fields."
    },
    {
      title: "Use a clean design",
      description: "Choose a professional, clean layout with consistent formatting. Use white space effectively to make it easy to scan."
    },
    {
      title: "Focus on recent experience",
      description: "Emphasize your most recent and relevant roles. You can summarize older positions or omit them if they're not relevant."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">CV Writing Tips</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 text-center">
          Follow these professional tips to create a standout CV that gets you noticed by employers.
        </p>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="grid gap-8 md:grid-cols-2">
            {tips.map((tip, index) => (
              <div key={index} className="border-l-4 border-blue-500 dark:border-blue-600 pl-4 py-1">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{tip.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{tip.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-12 bg-blue-50 dark:bg-blue-900/30 rounded-lg p-6 border border-blue-100 dark:border-blue-800">
          <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-300 mb-4">Need more help with your CV?</h2>
          <p className="text-blue-700 dark:text-blue-400 mb-4">
            Our CV builder offers professional templates and expert guidance to help you create
            a CV that stands out to employers.
          </p>
          <a 
            href="/templates"
            className="inline-block bg-blue-600 dark:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
          >
            Explore CV Templates
          </a>
        </div>
      </div>
    </div>
  );
} 