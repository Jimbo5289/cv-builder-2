const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const PDFDocument = require('pdfkit');

// Create a checkout session for CV download
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { cvId, type } = req.body;
    const userId = req.user.id;

    // Create a price for the download
    const price = await stripe.prices.create({
      product_data: {
        name: 'Enhanced CV Download',
        description: 'Download your AI-enhanced CV'
      },
      unit_amount: 999, // £9.99
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
      client_reference_id: req.user.id,
      metadata: {
        cvId,
        userId,
        type
      }
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Verify payment and allow download
router.get('/verify-download/:sessionId', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
    
    if (session.payment_status !== 'paid') {
      return res.status(400).json({ error: 'Payment not completed' });
    }

    // Get the CV data from the session metadata
    const cvId = session.metadata.cvId;
    const cv = await prisma.cv.findUnique({
      where: { id: cvId },
      include: { user: true }
    });

    if (!cv) {
      return res.status(404).json({ error: 'CV not found' });
    }

    // Generate a signed URL for the CV download
    const downloadUrl = `${process.env.FRONTEND_URL}/api/download-cv/${cvId}`;
    
    res.json({ downloadUrl });
  } catch (error) {
    console.error('Error verifying download:', error);
    res.status(500).json({ error: 'Error verifying download' });
  }
});

// Helper function to generate download URL
async function generateDownloadUrl(cv) {
  // Convert CV to PDF
  const pdfBuffer = await generatePDF(cv);
  
  // Upload to temporary storage and get URL
  const url = await uploadToStorage(pdfBuffer);
  
  return url;
}

// Helper function to generate PDF
async function generatePDF(cv) {
  // Implement PDF generation logic here
  // This could use a library like pdfkit or puppeteer
  // For now, return a mock buffer
  return Buffer.from(JSON.stringify(cv));
}

// Helper function to upload to storage
async function uploadToStorage(buffer) {
  // Implement storage upload logic here
  // This could use AWS S3, Google Cloud Storage, etc.
  // For now, return a mock URL
  return 'https://example.com/temp-download-url';
}

// Download CV route
router.get('/download-cv/:cvId', async (req, res) => {
  try {
    const cv = await prisma.cv.findUnique({
      where: { id: req.params.cvId },
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
      return res.status(404).json({ error: 'CV not found' });
    }

    // Generate PDF content
    const pdfBuffer = generateCVContent(cv);

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${cv.user.name}-CV.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);

    // Send the PDF buffer
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error downloading CV:', error);
    res.status(500).json({ error: 'Failed to download CV' });
  }
});

// Helper function to generate CV content
const generateCVContent = (cv) => {
  const doc = new PDFDocument({
    size: 'A4',
    margin: 50
  });

  const buffers = [];
  doc.on('data', buffers.push.bind(buffers));
  doc.on('end', () => {});

  // Add title
  doc.fontSize(24).text(cv.user.name, { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(cv.user.email, { align: 'center' });
  doc.moveDown(2);

  // Add sections
  cv.sections.forEach(section => {
    doc.fontSize(16).text(section.title, { underline: true });
    doc.moveDown();
    
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
    
    doc.moveDown(2);
  });

  doc.end();

  return Buffer.concat(buffers);
};

module.exports = router; 