/* eslint-disable */
const express = require('express');
const router = express.Router();
const { z } = require('zod');
const { sendContactFormEmail } = require('../services/emailService');
const { logger } = require('../config/logger');
const rateLimit = require('express-rate-limit');

// Contact request schema validation
const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters")
});

// Rate limiter for contact form submissions (10 submissions per hour)
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 submissions per window
  message: { error: 'Too many contact requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false
});

// Test endpoint for email (no rate limiting for testing)
router.get('/test', async (req, res) => {
  try {
    logger.info('Email test endpoint hit!');
    
    // Test data
    const senderInfo = {
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Email Test - Direct'
    };
    const message = 'This is a test email from the CV Builder server sent directly to james_ingleton@icloud.com.';
    
    // Create direct email message
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
    
    // Send direct email
    try {
      const info = await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: 'james_ingleton@icloud.com', // Send directly to your personal email
        subject: 'Direct Test Email',
        html: '<h1>Direct Test Email</h1><p>This is a direct test email to your personal address.</p>'
      });
      
      logger.info('Direct test email sent:', { messageId: info.messageId });
      
      // Also send using the normal service
      const result = await sendContactFormEmail(senderInfo, message);
      
      return res.status(200).json({
        success: true,
        message: 'Test emails sent successfully!',
        details: {
          direct: { messageId: info.messageId },
          service: result
        }
      });
    } catch (emailError) {
      logger.error('Direct email error:', emailError);
      return res.status(500).json({
        error: 'Failed to send direct test email',
        message: emailError.message
      });
    }
  } catch (error) {
    logger.error('Error in test email endpoint:', {
      error: error.message,
      stack: error.stack
    });
    
    return res.status(500).json({
      error: 'Failed to send test email',
      message: error.message
    });
  }
});

// POST endpoint for contact form submissions
router.post('/', contactLimiter, async (req, res) => {
  try {
    // Log request for debugging
    console.log('Contact test endpoint hit!');
    console.log('Request body:', req.body);
    
    // Validate input
    const validatedData = contactSchema.parse(req.body);
    
    // Prepare sender info
    const senderInfo = {
      name: validatedData.name,
      email: validatedData.email,
      subject: validatedData.subject
    };
    
    // Send email
    const result = await sendContactFormEmail(senderInfo, validatedData.message);
    
    if (!result.success) {
      logger.error('Failed to process contact form submission:', {
        error: result.error,
        isConfigIssue: result.isConfigIssue
      });
      
      if (result.isConfigIssue) {
        return res.status(500).json({ 
          error: 'Email service not configured properly. Please try again later or contact support directly.' 
        });
      }
      
      return res.status(500).json({ 
        error: 'Failed to send your message. Please try again later.' 
      });
    }
    
    // Log successful submission
    logger.info('Contact form submission processed successfully', {
      sender: senderInfo.email
    });
    
    return res.status(200).json({ 
      success: true, 
      message: 'Your message has been sent successfully. We will get back to you soon.' 
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Validation error
      const validationErrors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      
      return res.status(400).json({ 
        error: 'Validation failed', 
        validationErrors 
      });
    }
    
    // Unexpected error
    logger.error('Unexpected error in contact form submission:', {
      error: error.message,
      stack: error.stack
    });
    
    return res.status(500).json({ 
      error: 'An unexpected error occurred. Please try again later.' 
    });
  }
});

module.exports = router; 