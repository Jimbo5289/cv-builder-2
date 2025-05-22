import React, { useState } from 'react';
import { useServer } from '../context/ServerContext';
import toast from 'react-hot-toast';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [formStatus, setFormStatus] = useState({
    isSubmitting: false,
    isSubmitted: false,
    isError: false,
    errorMessage: ''
  });

  const { apiUrl } = useServer();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ 
      isSubmitting: true, 
      isSubmitted: false, 
      isError: false,
      errorMessage: '' 
    });
    
    try {
      // Use the regular API endpoint
      const apiUrlFull = `${apiUrl}/api/contact`;
      console.log('Submitting form to API:', apiUrlFull);
      
      // Send data to backend API
      const response = await fetch(apiUrlFull, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      console.log('API Response status:', response.status);
      
      // Get response data
      let data;
      try {
        data = await response.json();
        console.log('API Response data:', data);
      } catch (error) {
        console.error('Failed to parse API response:', error);
        data = { error: 'Failed to parse server response' };
      }
      
      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 404) {
          throw new Error('API endpoint not found. The contact service may not be running.');
        }
        throw new Error(data.error || 'Failed to send message');
      }
      
      // Success
      setFormStatus({ 
        isSubmitting: false, 
        isSubmitted: true, 
        isError: false,
        errorMessage: '' 
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Check if using mock or real email service
      if (data.mock) {
        toast.success('Your message was processed with the mock email service. To receive real emails, configure the SMTP settings.');
      } else {
        toast.success('Your message has been sent successfully! We will respond to your inquiry soon.');
      }
    } catch (error) {
      console.error('Contact form submission error:', error);
      setFormStatus({ 
        isSubmitting: false, 
        isSubmitted: false, 
        isError: true,
        errorMessage: error.message 
      });
      toast.error(`Failed to send message: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Have questions or feedback? We'd love to hear from you. Fill out the form below and our team will get back to you as soon as possible.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md flex flex-col items-center">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-8 text-center">Get in Touch</h2>
            
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="bg-blue-100 dark:bg-blue-900/50 w-12 h-12 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4 flex flex-col justify-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Email</h3>
                <p className="text-gray-600 dark:text-gray-300">support@cvbuilder.com</p>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
            {formStatus.isSubmitted ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-green-500 dark:text-green-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Thank You!</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">Your message has been sent successfully. We'll get back to you soon.</p>
                <button
                  onClick={() => setFormStatus({ isSubmitting: false, isSubmitted: false, isError: false, errorMessage: '' })}
                  className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {formStatus.isError && (
                  <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{formStatus.errorMessage || 'Failed to send message. Please try again.'}</span>
                  </div>
                )}
                
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={formStatus.isSubmitting}
                  className="w-full px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white font-medium rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-70"
                >
                  {formStatus.isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 