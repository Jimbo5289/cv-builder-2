/* eslint-disable */

/**
 * @page Contact
 * @description Contact page component that allows users to send messages to the CV Builder team.
 * This component implements a complete contact form workflow including:
 * - Form state management
 * - Client-side validation (especially for message length)
 * - Server communication via API
 * - Error handling and validation error display
 * - Success confirmation display
 * - Visual feedback during form submission
 * 
 * The component includes elegant placeholder styling that shows guidance text which
 * disappears when the user starts typing.
 * 
 * @route /contact - The route that renders this contact page
 * 
 * @context ServerContext - Used to access the API URL for form submission
 * 
 * @state {Object} formData - Contains all form field values
 * @state {Object} formStatus - Tracks form submission state (submitting, submitted, errors)
 * @state {Object} validationErrors - Stores validation error messages by field name
 * 
 * @returns {JSX.Element} A complete contact form page with validation and submission handling
 */
import React, { useState } from 'react';
import { useServer } from '../context/ServerContext';
import toast from 'react-hot-toast';

export default function Contact() {
  /**
   * Form data state containing all input field values
   * @type {Object}
   * @property {string} name - User's full name
   * @property {string} email - User's email address
   * @property {string} subject - Message subject line
   * @property {string} message - Main message content (requires 10+ characters)
   */
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  /**
   * Form status state to track the submission process
   * @type {Object}
   * @property {boolean} isSubmitting - Whether the form is currently being submitted
   * @property {boolean} isSubmitted - Whether the form was successfully submitted
   * @property {boolean} isError - Whether an error occurred during submission
   * @property {string} errorMessage - Error message to display if submission failed
   */
  const [formStatus, setFormStatus] = useState({
    isSubmitting: false,
    isSubmitted: false,
    isError: false,
    errorMessage: ''
  });

  /**
   * Validation errors state to store field-specific validation error messages
   * @type {Object}
   * @property {string} message - Error message for the message field
   */
  const [validationErrors, setValidationErrors] = useState({
    message: ''
  });

  // Get API URL from server context
  const { apiUrl } = useServer();

  /**
   * Handles changes to form input fields
   * Updates the formData state and clears validation errors for the field being edited
   * 
   * @param {Object} e - Event object from the input change
   * @param {string} e.target.name - Name of the form field that changed
   * @param {string} e.target.value - New value of the form field
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when typing in message field
    if (name === 'message' && validationErrors.message) {
      setValidationErrors(prev => ({
        ...prev,
        message: ''
      }));
    }
  };

  /**
   * Validates the form before submission
   * Currently checks that the message is at least 10 characters long
   * 
   * @returns {boolean} Whether the form passed validation
   */
  const validateForm = () => {
    let isValid = true;
    const errors = { message: '' };
    
    // Check message length (server requires at least 10 characters)
    if (formData.message.length < 10) {
      errors.message = 'Message must be at least 10 characters long';
      isValid = false;
    }
    
    setValidationErrors(errors);
    return isValid;
  };

  /**
   * Handles form submission
   * Validates the form, sends data to the server API, and manages submission states
   * 
   * @param {Object} e - Form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    // Update form status to submitting
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
        
        // Handle validation errors from the server
        if (response.status === 400 && data.validationErrors) {
          const serverErrors = {};
          data.validationErrors.forEach(err => {
            serverErrors[err.field] = err.message;
          });
          setValidationErrors(prev => ({ ...prev, ...serverErrors }));
          throw new Error('Please correct the validation errors');
        }
        
        throw new Error(data.error || 'Failed to send message');
      }
      
      // Success - update form status and reset form
      setFormStatus({ 
        isSubmitting: false, 
        isSubmitted: true, 
        isError: false,
        errorMessage: '' 
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Show appropriate success message based on mock status
      if (data.mock) {
        toast.success('Your message was processed with the mock email service. To receive real emails, configure the SMTP settings.');
      } else {
        toast.success('Your message has been sent successfully! We will respond to your inquiry soon.');
      }
    } catch (error) {
      console.error('Contact form submission error:', error);
      // Update form status with error
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
        {/* Page header section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Have questions or feedback? We'd love to hear from you. Fill out the form below and our team will get back to you as soon as possible.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Contact information sidebar */}
          <div className="md:col-span-1 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md flex flex-col items-center">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-8 text-center">Get in Touch</h2>
            
            {/* Email contact information */}
            <div className="flex items-center mb-4">
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              <p className="text-gray-600 dark:text-gray-300">support@mycvbuilder.co.uk</p>
            </div>
          </div>
          
          {/* Form container */}
          <div className="md:col-span-2 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
            {/* Success message (shown after successful submission) */}
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
              /* Contact form */
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error alert - shown when form submission fails */}
                {formStatus.isError && (
                  <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{formStatus.errorMessage || 'Failed to send message. Please try again.'}</span>
                  </div>
                )}
                
                {/* Name field */}
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
                
                {/* Email field */}
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
                
                {/* Subject field */}
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
                
                {/* Message field with enhanced placeholder and validation */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Message
                  </label>
                  <div className="relative">
                    <textarea
                      id="message"
                      name="message"
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-2 border ${validationErrors.message ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400`}
                      placeholder=""
                    ></textarea>
                    {/* Elegant placeholder text that disappears when typing begins */}
                    {formData.message.length === 0 && (
                      <div className="absolute inset-0 pointer-events-none flex items-start pt-2 px-4">
                        <span className="text-gray-400/60 dark:text-gray-500/70 text-sm italic">
                          Please enter at least 10 characters
                        </span>
                      </div>
                    )}
                  </div>
                  {/* Validation error message */}
                  {validationErrors.message && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {validationErrors.message}
                    </p>
                  )}
                </div>
                
                {/* Submit button with loading state */}
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