import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function FAQ() {
  const [openFaqId, setOpenFaqId] = useState(null);

  const toggleFaq = (id) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  const faqs = [
    {
      id: 1,
      question: "How does CV Builder work?",
      answer: "CV Builder provides professional templates and an intuitive editor to help you create a standout CV. Simply choose a template, fill in your information, and our platform formats everything perfectly. You can then download your CV as a PDF or share it directly with employers."
    },
    {
      id: 2,
      question: "Is CV Builder free to use?",
      answer: "We offer both free and premium plans. The free plan allows you to create and download basic CVs. Our premium plans offer additional templates, advanced formatting options, AI content suggestions, and the ability to create multiple CVs. Visit our pricing page for more details."
    },
    {
      id: 3,
      question: "Can I update my CV after creating it?",
      answer: "Yes! You can update your CV anytime. We save your information securely, allowing you to make changes whenever needed. This is particularly useful when you gain new skills or experience, or when applying for different jobs."
    },
    {
      id: 4,
      question: "How do I download my CV?",
      answer: "Once you've completed your CV, simply click the 'Download' button in the preview page. Your CV will be downloaded as a professionally formatted PDF document that you can share with employers."
    },
    {
      id: 5,
      question: "What makes a good CV?",
      answer: "A good CV is clear, concise, and tailored to the job you're applying for. It should highlight your relevant skills and achievements, use action verbs, and be free of errors. Check our CV Tips page for more detailed guidance."
    },
    {
      id: 6,
      question: "Can I create multiple versions of my CV?",
      answer: "Yes, with our premium plans you can create multiple versions of your CV. This is useful for tailoring your CV to different jobs or industries."
    },
    {
      id: 7,
      question: "How do I cancel my subscription?",
      answer: "You can cancel your subscription at any time from your account settings. After cancellation, you'll still have access to the premium features until the end of your billing cycle."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">Frequently Asked Questions</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {faqs.map(faq => (
            <div key={faq.id} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
              <button
                onClick={() => toggleFaq(faq.id)}
                className="flex justify-between items-center w-full p-5 text-left font-medium text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none"
              >
                <span>{faq.question}</span>
                <svg 
                  className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform ${openFaqId === faq.id ? 'transform rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div 
                className={`transition-all duration-300 ease-in-out overflow-hidden ${openFaqId === faq.id ? 'max-h-96 p-5' : 'max-h-0 p-0'}`}
              >
                <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Didn't find what you're looking for?
          </p>
          <Link 
            to="/contact"
            className="inline-block bg-blue-600 dark:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
} 