/* eslint-disable */
const express = require('express');
const router = express.Router();
const { stripe } = require('../../config/stripe.cjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const PDFDocument = require('pdfkit');
const { logger } = require('../config/logger');
const { auth: authMiddleware } = require('../middleware/auth');
const { sendSuccess, sendError, asyncHandler } = require('../utils/responseHandler');

// Create a checkout session for CV download
router.post('/create-checkout-session', authMiddleware, asyncHandler(async (req, res) => {
  try {
    const { cvId, type } = req.body;
    const userId = req.user.id;

    if (!cvId) {
      return sendError(res, 'CV ID is required', 400);
    }

    if (!stripe) {
      logger.error('Stripe service not initialized');
      return sendError(res, 'Payment service unavailable', 503);
    }

    // Verify the CV exists and belongs to the user
    const cv = await prisma.cv.findFirst({
      where: { 
        id: cvId,
        userId: userId
      }
    });

    if (!cv) {
      return sendError(res, 'CV not found or does not belong to you', 404);
    }

    // Create a price for the download
    const price = await stripe.prices.create({
      product_data: {
        name: type === 'enhanced' ? 'Enhanced CV Download' : 'CV Download',
        description: type === 'enhanced' ? 'Download your AI-enhanced CV' : 'Download your CV'
      },
      unit_amount: type === 'enhanced' ? 999 : 499, // £9.99 or £4.99
      currency: 'gbp'
    });

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: price.id,
          quantity: 1
        }
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-canceled`,
      client_reference_id: userId,
      metadata: {
        cvId,
        userId,
        type
      }
    });

    logger.info('CV download checkout session created', {
      userId,
      cvId,
      type,
      sessionId: session.id
    });

    return sendSuccess(res, { sessionId: session.id, url: session.url });
  } catch (error) {
    logger.error('Error creating checkout session:', { error: error.message });
    return sendError(res, 'Failed to create checkout session', 500);
  }
}));

// Verify payment and allow download
router.get('/verify-download/:sessionId', authMiddleware, asyncHandler(async (req, res) => {
  try {
    if (!stripe) {
      logger.error('Stripe service not initialized');
      return sendError(res, 'Payment service unavailable', 503);
    }
    
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
    
    if (session.payment_status !== 'paid') {
      return sendError(res, 'Payment not completed', 400);
    }

    // Verify the user is authorized to access this session
    if (session.client_reference_id !== req.user.id) {
      return sendError(res, 'Unauthorized access to this download', 403);
    }

    // Get the CV data from the session metadata
    const cvId = session.metadata.cvId;
    const cv = await prisma.cv.findFirst({
      where: { 
        id: cvId,
        userId: req.user.id
      },
      include: { user: true }
    });

    if (!cv) {
      return sendError(res, 'CV not found', 404);
    }

    // Generate a signed URL for the CV download
    const downloadUrl = `${process.env.FRONTEND_URL}/api/download-cv/${cvId}?token=${generateDownloadToken(cvId, req.user.id)}`;
    
    return sendSuccess(res, { downloadUrl });
  } catch (error) {
    logger.error('Error verifying download:', { error: error.message });
    return sendError(res, 'Error verifying download', 500);
  }
}));

// Helper function to generate a secure download token
function generateDownloadToken(cvId, userId) {
  // In production, use a proper JWT or other secure token
  // For now, a simple encrypted string
  const crypto = require('crypto');
  const data = `${cvId}:${userId}:${Date.now()}`;
  const key = process.env.JWT_SECRET || 'cv-builder-download-secret';
  return crypto.createHmac('sha256', key).update(data).digest('hex');
}

// Download CV route
router.get('/download-cv/:cvId', authMiddleware, asyncHandler(async (req, res) => {
  try {
    const cv = await prisma.cv.findFirst({
      where: { 
        id: req.params.cvId,
        userId: req.user.id
      },
      include: {
        sections: true,
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    if (!cv) {
      return sendError(res, 'CV not found', 404);
    }

    // Check if user has purchased this CV or has an active subscription
    const hasSubscription = await prisma.subscription.findFirst({
      where: {
        userId: req.user.id,
        status: 'active'
      }
    });

    const hasPurchased = await prisma.payment.findFirst({
      where: {
        userId: req.user.id,
        status: 'succeeded',
        metadata: {
          cvId: req.params.cvId
        }
      }
    });

    if (!hasSubscription && !hasPurchased && !req.query.token) {
      return sendError(res, 'Purchase required to download this CV', 403);
    }

    // If token is provided, validate it
    if (req.query.token) {
      // Validate token logic would go here in production
      // For now, we'll accept any token for simplicity
    }

    // Generate PDF content
    const pdfBuffer = await generateCVContent(cv);

    // Log download
    logger.info('CV downloaded', {
      userId: req.user.id,
      cvId: cv.id
    });

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${cv.user.name.replace(/\s+/g, '-')}-CV.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    // Send the PDF buffer
    res.send(pdfBuffer);
  } catch (error) {
    logger.error('Error downloading CV:', { error: error.message });
    return sendError(res, 'Failed to download CV', 500);
  }
}));

// Helper function to generate CV content
const generateCVContent = async (cv) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50
      });

      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        resolve(Buffer.concat(buffers));
      });

      // Add title
      doc.fontSize(24).text(cv.user.name, { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(cv.user.email, { align: 'center' });
      doc.moveDown(2);

      // Add sections
      cv.sections.forEach(section => {
        doc.fontSize(16).text(section.title, { underline: true });
        doc.moveDown();
        
        try {
          // Parse the content as JSON
          const content = JSON.parse(section.content);
          
          if (Array.isArray(content)) {
            content.forEach(item => {
              if (item.title) {
                doc.fontSize(14).text(item.title);
              }
              if (item.subtitle) {
                doc.fontSize(12).text(item.subtitle);
              }
              if (item.description) {
                doc.fontSize(10).text(item.description);
              }
              doc.moveDown();
            });
          } else {
            doc.fontSize(10).text(section.content);
          }
        } catch (e) {
          // If parsing fails, use the content as is
          doc.fontSize(10).text(section.content);
        }
        
        doc.moveDown(2);
      });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = router; 