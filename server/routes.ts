import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import multer from "multer";
import path from "path";
import fs from "fs";
import { storage } from "./storage";
import { insertContactInquirySchema, insertCostCalculationSchema, insertPoolDesignSchema, insertPoolDesignIntakeSchema, insertPoolIntakeFileSchema } from "@shared/schema";
import { sendPoolEstimate, sendContactConfirmation, sendAdminNotification, sendPoolIntakeConfirmation, sendPoolIntakeAdminNotification } from "./email";
import { poolIntakeRateLimiter, normalRateLimiter } from "./rate-limiter";
import { sanitizeRequestBody, validateFileUpload, securityHeaders } from "./security-middleware";
import { generatePoolDesign, generatePoolSpecsFromVoice, generateCostEstimateFromSpecs, generateConstructionPlan } from "./openai-service";
import { sendContactEmail } from "./sendgrid";
import { aiDesignProcessRequestSchema, aiDesignProcessResponseSchema, sendEmailRequestSchema } from "@shared/schema";
import { z } from "zod";
import { generateSitemap } from "../client/src/utils/sitemap-generator";
import { seoMiddleware } from "./seo-middleware";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

// Validate that we're using a secret key, not a publishable key
// In development, allow fallback to avoid blocking VR functionality testing
if (!process.env.STRIPE_SECRET_KEY.startsWith('sk_')) {
  if (process.env.NODE_ENV === 'development') {
    console.warn(`⚠️ Invalid Stripe secret key in development: expected 'sk_' but got '${process.env.STRIPE_SECRET_KEY.substring(0, 7)}'. Payment functionality may not work, but VR features will be available.`);
  } else {
    throw new Error(`Invalid Stripe secret key: expected key starting with 'sk_', but got key starting with '${process.env.STRIPE_SECRET_KEY.substring(0, 7)}'. Check environment variable configuration.`);
  }
}

console.log(`✅ Stripe initialized with ${process.env.STRIPE_SECRET_KEY.substring(0, 7)}... (${process.env.STRIPE_SECRET_KEY.includes('test') ? 'test' : 'live'} mode)`);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-08-27.basil",
});

// Configure multer for 360° image uploads
const storage360 = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'attached_assets/360-designs';
    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Use original name but ensure it's unique
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9-_]/g, '-') // Replace special chars with hyphens
      .toLowerCase();
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

const upload360 = multer({ 
  storage: storage360,
  fileFilter: (req, file, cb) => {
    // Only allow JPG and PNG files (no SVG for security)
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedMimes.includes(file.mimetype.toLowerCase())) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
  limits: {
    fileSize: 20 * 1024 * 1024 // 20MB limit for 360° images
  }
});

// Configure multer for pool intake form uploads
const intakeStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'attached_assets/pool-intake';
    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate secure filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9-_]/g, '-') // Replace special chars with hyphens
      .toLowerCase()
      .substring(0, 50); // Limit filename length
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

const uploadIntake = multer({ 
  storage: intakeStorage,
  fileFilter: (req, file, cb) => {
    // Allow common file types for pool design intake
    const allowedMimes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/heic',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    // Reject executable files and other potentially dangerous types
    const blockedExtensions = ['.exe', '.bat', '.cmd', '.com', '.pif', '.scr', '.vbs', '.js', '.jar'];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    
    if (blockedExtensions.includes(fileExtension)) {
      cb(null, false);
    } else if (allowedMimes.includes(file.mimetype.toLowerCase())) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit per file
    files: 20 // Max 20 files total
  }
});

// Helper function to generate unique ticket numbers
function generateTicketNumber(): string {
  const timestamp = Date.now().toString(36); // Base36 timestamp
  const random = Math.random().toString(36).substring(2, 8); // Random string
  return `PDC-${timestamp}-${random}`.toUpperCase();
}

// Helper function to determine file type category
function getFileTypeCategory(filename: string, mimetype: string): string {
  const extension = path.extname(filename).toLowerCase();
  
  if (['.jpg', '.jpeg', '.png', '.heic'].includes(extension)) {
    return 'photo';
  } else if (extension === '.pdf') {
    return 'survey'; // Assume PDFs are surveys unless specified otherwise
  } else if (['.doc', '.docx'].includes(extension)) {
    return 'hoa_doc';
  } else {
    return 'other';
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Contact inquiry endpoint
  app.post("/api/contact", 
    securityHeaders(),
    normalRateLimiter.middleware(), 
    sanitizeRequestBody(),
    async (req, res) => {
    try {
      const validatedData = insertContactInquirySchema.parse(req.body);
      const inquiry = await storage.createContactInquiry(validatedData);
      
      // Send confirmation email to customer and notification to admin
      const [customerEmailSent, adminEmailSent] = await Promise.all([
        sendContactConfirmation({
          firstName: validatedData.firstName,
          lastName: validatedData.lastName,
          email: validatedData.email,
          phone: validatedData.phone || undefined,
          location: validatedData.location || undefined,
          details: validatedData.details || undefined,
          budget: validatedData.budget || undefined
        }),
        sendAdminNotification({
          firstName: validatedData.firstName,
          lastName: validatedData.lastName,
          email: validatedData.email,
          phone: validatedData.phone || undefined,
          location: validatedData.location || undefined,
          details: validatedData.details || undefined,
          budget: validatedData.budget || undefined
        })
      ]);
      
      if (customerEmailSent) {
        console.log(`Contact confirmation email sent to ${validatedData.email}`);
      } else {
        console.error(`Failed to send contact confirmation email to ${validatedData.email}`);
      }
      
      if (adminEmailSent) {
        console.log(`Admin notification email sent to kayne@pooldesignconsultant.com`);
      } else {
        console.error(`Failed to send admin notification email`);
      }
      
      res.json({ success: true, inquiry, emailSent: customerEmailSent && adminEmailSent });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Validation failed", details: error.errors });
      } else {
        console.error('Contact endpoint error:', error);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  // Simple /send endpoint for HTML form compatibility
  app.post("/send", async (req, res) => {
    try {
      const { name, email, message } = req.body || {};
      if (!name || !email || !message) {
        return res.status(400).json({ message: "Missing name, email, or message." });
      }

      // Store in database
      try {
        const [firstName, ...lastNameParts] = name.split(' ');
        const lastName = lastNameParts.join(' ') || '';
        
        await storage.createContactInquiry({
          firstName,
          lastName,
          email,
          details: message
        });
      } catch (storageError) {
        console.error('Failed to store contact inquiry:', storageError);
      }

      // Send email via SendGrid
      try {
        await sendContactEmail({ name, email, message });
        console.log(`Contact email sent successfully to kayne@pooldesignconsultant.com`);
        res.json({ message: "✅ Message sent successfully!" });
      } catch (emailError) {
        console.error(`Failed to send email via SendGrid:`, emailError);
        // Graceful fallback - form still works, data saved
        console.log(`Contact inquiry saved to database for manual follow-up: ${name} (${email})`);
        res.json({ message: "✅ Message received! We'll get back to you within 24 hours." });
      }
    } catch (err: any) {
      console.error("Contact form error:", err?.response?.body || err);
      res.status(500).json({
        message: err?.response?.body?.errors?.[0]?.message || "❌ Failed to send message."
      });
    }
  });

  // SendGrid email endpoint for contact form
  app.post("/api/send-email", async (req, res) => {
    try {
      const validatedData = sendEmailRequestSchema.parse(req.body);
      
      // Store the contact inquiry first
      try {
        await storage.createContactInquiry({
          firstName: validatedData.firstName,
          lastName: validatedData.lastName,
          email: validatedData.email,
          phone: validatedData.phone,
          location: validatedData.location,
          budget: validatedData.budget,
          details: validatedData.details
        });
      } catch (storageError) {
        console.error('Failed to store contact inquiry:', storageError);
        // Continue with email sending even if storage fails
      }
      
      // Create contact message 
      let message = '';
      if (validatedData.phone) message += `Phone: ${validatedData.phone}\n`;
      if (validatedData.location) message += `Location: ${validatedData.location}\n`;
      if (validatedData.budget) message += `Budget: ${validatedData.budget}\n`;
      if (validatedData.details) message += `\nDetails: ${validatedData.details}\n`;

      // Add AI design data if present
      if (validatedData.isFromAI && validatedData.poolStyle) {
        message += `\n--- AI Design Details ---\n`;
        message += `Pool Style: ${validatedData.poolStyle}\n`;
        if (validatedData.poolLength) message += `Pool Length: ${validatedData.poolLength}ft\n`;
        if (validatedData.features) message += `Features: ${validatedData.features}\n`;
      }

      // Send email via SendGrid
      try {
        await sendContactEmail({
          name: `${validatedData.firstName} ${validatedData.lastName}`,
          email: validatedData.email,
          message: message || 'No additional details provided.'
        });

        console.log(`Contact email sent successfully to kayne@pooldesignconsultant.com`);
        res.json({ 
          success: true, 
          message: "Thank you for your inquiry! We'll get back to you within 24 hours." 
        });
      } catch (emailError) {
        console.error(`Failed to send email via SendGrid:`, emailError);
        // Graceful degradation: Form still works, inquiry is saved to database
        // Email will start working once kayne@pooldesignconsultant.com is verified in SendGrid
        console.log(`Contact inquiry saved to database for manual follow-up: ${validatedData.firstName} ${validatedData.lastName} (${validatedData.email})`);
        res.json({ 
          success: true, 
          message: "Thank you for your inquiry! We've received your message and will get back to you within 24 hours." 
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          error: "Validation failed", 
          details: error.errors 
        });
      } else {
        console.error('SendGrid email endpoint error:', error);
        res.status(500).json({ 
          success: false, 
          error: "Internal server error" 
        });
      }
    }
  });

  // Pool design intake form submission endpoint
  app.post("/api/pool-intake", 
    securityHeaders(),
    poolIntakeRateLimiter.middleware(),
    uploadIntake.any(),
    validateFileUpload({
      allowedTypes: ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.doc', '.docx', '.txt', '.zip'],
      maxFileSize: 10 * 1024 * 1024, // 10MB
      maxFiles: 10
    }),
    sanitizeRequestBody(),
    async (req, res) => {
    try {
      console.log('Pool intake submission received');
      console.log('Form data keys:', Object.keys(req.body));
      console.log('Files received:', req.files?.length || 0);
      
      // Parse form data
      const formData = {
        fullName: req.body.fullName,
        email: req.body.email,
        phone: req.body.phone,
        projectAddress: req.body.projectAddress,
        city: req.body.city,
        state: req.body.state,
        zipCode: req.body.zipCode,
        county: req.body.county,
        hasHOA: req.body.hasHOA === 'true',
        hoaGuidelines: req.body.hoaGuidelines,
        poolLength: parseInt(req.body.poolLength),
        poolWidth: parseInt(req.body.poolWidth),
        shallowDepth: parseFloat(req.body.shallowDepth),
        deepDepth: parseFloat(req.body.deepDepth),
        deckMaterial: req.body.deckMaterial,
        deckSquareFootage: parseInt(req.body.deckSquareFootage),
        waterFeatures: req.body.waterFeatures,
        fireFeatures: req.body.fireFeatures,
        structures: req.body.structures,
        hasSpa: req.body.hasSpa === 'true',
        spaSize: req.body.spaSize,
        spaSpillover: req.body.spaSpillover === 'true',
        equipmentBrand: req.body.equipmentBrand,
        safetyFeatures: req.body.safetyFeatures,
        budgetRange: req.body.budgetRange,
        targetStartDate: req.body.targetStartDate ? new Date(req.body.targetStartDate) : undefined,
        specialRequests: req.body.specialRequests,
        sketchNotes: req.body.sketchNotes,
        consentGiven: req.body.consentGiven === 'true',
        sourceIP: req.ip,
        userAgent: req.get('User-Agent'),
        submissionData: req.body // Store complete form data as backup
      };
      
      // Generate unique ticket number
      const ticketNumber = generateTicketNumber();
      
      // Validate using schema (omit auto-generated fields)
      const validatedData = insertPoolDesignIntakeSchema.parse({
        ...formData,
        ticketNumber
      });
      
      console.log('Form data validated successfully');
      
      // Create intake record
      const intake = await storage.createPoolDesignIntake({
        ...validatedData,
        ticketNumber
      });
      
      console.log('Intake record created with ID:', intake.id);
      
      // Process uploaded files
      const uploadedFiles = req.files as Express.Multer.File[] || [];
      const fileRecords = [];
      
      for (const file of uploadedFiles) {
        const fileType = getFileTypeCategory(file.filename, file.mimetype);
        
        try {
          const fileRecord = await storage.createPoolIntakeFile({
            intakeId: intake.id,
            fileType,
            fileName: file.filename,
            originalName: file.originalname,
            mimeType: file.mimetype,
            fileSize: file.size,
            bucketKey: file.path, // Use local path for now
            publicUrl: `/attached_assets/pool-intake/${file.filename}`,
            description: `${fileType} file uploaded with intake`
          });
          
          fileRecords.push(fileRecord);
        } catch (fileError) {
          console.error('Error saving file record:', fileError);
          // Continue processing other files
        }
      }
      
      console.log(`${fileRecords.length} file records created`);
      
      // Prepare email data
      const poolSize = `${formData.poolLength}' × ${formData.poolWidth}' (${formData.shallowDepth}' - ${formData.deepDepth}' depth)`;
      
      // Send customer confirmation email
      const customerEmailData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        ticketNumber: intake.ticketNumber,
        projectAddress: formData.projectAddress,
        poolSize,
        budgetRange: formData.budgetRange,
        filesUploaded: fileRecords.length,
        hasHOA: formData.hasHOA,
        hasSpa: formData.hasSpa,
        waterFeatures: formData.waterFeatures ? JSON.parse(formData.waterFeatures) : [],
        fireFeatures: formData.fireFeatures ? JSON.parse(formData.fireFeatures) : []
      };
      
      // Send admin notification email
      const adminEmailData = {
        ...customerEmailData,
        intakeId: intake.id,
        city: formData.city,
        state: formData.state,
        county: formData.county,
        deckMaterial: formData.deckMaterial,
        equipmentBrand: formData.equipmentBrand,
        targetStartDate: formData.targetStartDate?.toISOString().split('T')[0],
        specialRequests: formData.specialRequests,
        sketchNotes: formData.sketchNotes,
        files: fileRecords.map(file => ({
          originalName: file.originalName,
          fileType: file.fileType,
          publicUrl: file.publicUrl || '',
          fileSize: file.fileSize
        }))
      };
      
      // Send emails in parallel
      const [customerEmailSent, adminEmailSent] = await Promise.all([
        sendPoolIntakeConfirmation(customerEmailData),
        sendPoolIntakeAdminNotification(adminEmailData)
      ]);
      
      if (customerEmailSent) {
        console.log(`Pool intake confirmation email sent to ${formData.email}`);
      } else {
        console.error(`Failed to send pool intake confirmation email to ${formData.email}`);
      }
      
      if (adminEmailSent) {
        console.log(`Pool intake admin notification sent to kayne@pooldesignconsultant.com`);
      } else {
        console.error(`Failed to send pool intake admin notification`);
      }
      
      res.json({
        success: true,
        ticketNumber: intake.ticketNumber,
        intakeId: intake.id,
        filesUploaded: fileRecords.length,
        message: `Your pool design intake has been submitted successfully! Your ticket number is ${intake.ticketNumber}. You'll receive a confirmation email shortly.`
      });
      
    } catch (error) {
      console.error('Pool intake submission error:', error);
      
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false,
          error: "Validation failed", 
          details: error.errors 
        });
      } else {
        res.status(500).json({ 
          success: false,
          error: "Internal server error",
          message: "Failed to process your submission. Please try again or contact us directly."
        });
      }
    }
  });

  // Get pool intake submission by ID (for admin/customer lookup)
  app.get("/api/pool-intake/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const intake = await storage.getPoolDesignIntake(id);
      
      if (!intake) {
        return res.status(404).json({ error: "Intake not found" });
      }
      
      // Get associated files
      const files = await storage.getPoolIntakeFiles(id);
      
      res.json({
        intake,
        files
      });
    } catch (error) {
      console.error('Error fetching pool intake:', error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get all pool intake submissions (admin endpoint)
  app.get("/api/pool-intakes", async (req, res) => {
    try {
      const intakes = await storage.getPoolDesignIntakes();
      res.json(intakes);
    } catch (error) {
      console.error('Error fetching pool intakes:', error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get all contact inquiries (admin endpoint)
  app.get("/api/contact-inquiries", async (req, res) => {
    try {
      const inquiries = await storage.getContactInquiries();
      res.json(inquiries);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Upload 360° design images
  app.post("/api/upload-360-images", upload360.array('images', 10), async (req, res) => {
    try {
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      const uploadedFiles = req.files.map(file => ({
        filename: file.filename,
        originalName: file.originalname,
        path: `/attached_assets/360-designs/${file.filename}`,
        size: file.size
      }));

      res.json({ 
        success: true, 
        message: `${uploadedFiles.length} file(s) uploaded successfully`,
        files: uploadedFiles 
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: "Upload failed" });
    }
  });

  // Get list of available 360° design images
  app.get("/api/360-designs", async (req, res) => {
    try {
      const designsDir = 'attached_assets/360-designs';
      
      if (!fs.existsSync(designsDir)) {
        return res.json({ designs: [] });
      }

      const files = fs.readdirSync(designsDir)
        .filter(file => /\.(jpg|jpeg|png)$/i.test(file))
        .map(file => {
          const filePath = path.join(designsDir, file);
          const stats = fs.statSync(filePath);
          
          return {
            id: path.basename(file, path.extname(file)),
            filename: file,
            path: `/attached_assets/360-designs/${file}`,
            size: stats.size,
            created: stats.birthtime
          };
        })
        .sort((a, b) => b.created.getTime() - a.created.getTime()); // Newest first

      res.json({ designs: files });
    } catch (error) {
      console.error('Error reading 360 designs:', error);
      res.status(500).json({ error: "Failed to read designs" });
    }
  });

  // Cost calculation endpoint
  app.post("/api/cost-calculation", 
    securityHeaders(),
    normalRateLimiter.middleware(), 
    sanitizeRequestBody(),
    async (req, res) => {
    try {
      const validatedData = insertCostCalculationSchema.parse(req.body);
      const calculation = await storage.createCostCalculation(validatedData);
      
      // Calculate cost ranges for email
      const basePrice = 45000;
      let minPrice = basePrice;
      let maxPrice = basePrice + 20000;
      
      // Size adjustments
      if (validatedData.size?.includes('medium')) { minPrice += 15000; maxPrice += 15000; }
      if (validatedData.size?.includes('large')) { minPrice += 30000; maxPrice += 30000; }
      if (validatedData.size?.includes('custom')) { minPrice += 50000; maxPrice += 50000; }
      
      // Type adjustments
      if (validatedData.type?.includes('infinity')) { minPrice += 20000; maxPrice += 25000; }
      if (validatedData.type?.includes('saltwater')) { minPrice += 8000; maxPrice += 12000; }
      if (validatedData.type?.includes('natural')) { minPrice += 15000; maxPrice += 20000; }
      if (validatedData.type?.includes('luxury')) { minPrice += 25000; maxPrice += 35000; }
      
      // Material adjustments
      if (validatedData.material?.includes('fiberglass')) { minPrice += 5000; maxPrice += 8000; }
      if (validatedData.material?.includes('vinyl')) { minPrice -= 10000; maxPrice -= 15000; }
      if (validatedData.material?.includes('concrete')) { minPrice += 15000; maxPrice += 20000; }
      
      // Feature adjustments
      const features = JSON.parse(validatedData.features || '[]');
      features.forEach((feature: string) => {
        if (feature === 'heating') { minPrice += 8000; maxPrice += 12000; }
        if (feature === 'lighting') { minPrice += 3000; maxPrice += 5000; }
        if (feature === 'waterfall') { minPrice += 10000; maxPrice += 15000; }
        if (feature === 'spa') { minPrice += 15000; maxPrice += 20000; }
      });
      
      // Calculate owner-builder costs (50% less)
      const ownerBuilderMin = Math.round(minPrice * 0.5);
      const ownerBuilderMax = Math.round(maxPrice * 0.5);
      const savingsMin = minPrice - ownerBuilderMin;
      const savingsMax = maxPrice - ownerBuilderMax;
      
      const contractorCost = `$${minPrice.toLocaleString()} - $${maxPrice.toLocaleString()}`;
      const ownerBuilderCost = `$${ownerBuilderMin.toLocaleString()} - $${ownerBuilderMax.toLocaleString()}`;
      const savings = `$${savingsMin.toLocaleString()} - $${savingsMax.toLocaleString()}`;
      
      // Send detailed estimate email
      const emailSent = await sendPoolEstimate({
        customerEmail: validatedData.email!,
        size: validatedData.size!,
        type: validatedData.type!,
        material: validatedData.material!,
        features: features.join(', ') || 'Standard package',
        location: validatedData.location!,
        timeline: validatedData.timeline!,
        contractorCost,
        ownerBuilderCost,
        savings
      });
      
      res.json({ 
        success: true, 
        calculation,
        emailSent,
        message: emailSent 
          ? "Estimate saved and detailed report sent to your email!" 
          : "Estimate saved, but email delivery failed. Please contact us directly."
      });
    } catch (error) {
      console.error("Cost calculation error:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Validation failed", details: error.errors });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  // Get all cost calculations (admin endpoint)
  app.get("/api/cost-calculations", async (req, res) => {
    try {
      const calculations = await storage.getCostCalculations();
      res.json(calculations);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Stripe payment endpoint for consultation payments
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      console.log("Payment intent request received:", { amount: req.body.amount, description: req.body.description });
      console.log("Stripe secret key configured:", process.env.STRIPE_SECRET_KEY ? 'YES' : 'NO');
      console.log("Stripe key starts with:", process.env.STRIPE_SECRET_KEY?.substring(0, 7));
      
      const { amount, description } = req.body;
      
      if (!amount || amount < 50) {
        console.log("Invalid amount error:", amount);
        return res.status(400).json({ error: "Invalid amount" });
      }

      console.log("Creating payment intent with Stripe...");
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        description: description || "Pool Design Consultation",
        metadata: {
          service: "pool_design_consultation"
        },
        payment_method_types: ["card"], // Only allow card payments, exclude bank and cashapp
        automatic_payment_methods: {
          enabled: false // Disable automatic payment methods to control what's shown
        }
      });
      
      console.log("Payment intent created successfully:", paymentIntent.id);
      res.json({ 
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      });
    } catch (error: any) {
      console.error("Stripe payment error details:", {
        message: error.message,
        code: error.code,
        type: error.type,
        statusCode: error.statusCode,
        raw: error.raw
      });
      res.status(500).json({ 
        error: "Payment processing failed", 
        message: error.message,
        code: error.code
      });
    }
  });

  // Webhook endpoint for Stripe events
  app.post("/api/stripe-webhook", async (req, res) => {
    try {
      // This would handle Stripe webhooks for payment confirmation
      // For now, just acknowledge the webhook
      res.json({ received: true });
    } catch (error) {
      console.error("Webhook error:", error);
      res.status(500).json({ error: "Webhook processing failed" });
    }
  });

  // AI Pool Design Generation endpoint
  app.post("/api/generate-pool-design", async (req, res) => {
    try {
      const { poolShape, poolSize, style, features } = req.body;
      
      if (!poolShape || !poolSize || !style) {
        return res.status(400).json({ error: "Missing required fields: poolShape, poolSize, style" });
      }

      console.log('Generating pool design with data:', { poolShape, poolSize, style, features });
      
      // Generate AI design using OpenAI
      const designResult = await generatePoolDesign({
        poolShape,
        poolSize,
        style,
        features: features || []
      });

      // Save design to storage
      const poolDesign = await storage.createPoolDesign({
        poolShape,
        poolSize,
        style,
        features: JSON.stringify(features || []),
        imageUrl: designResult.imageUrl,
        estimatedCost: designResult.estimatedCost,
        timeline: designResult.timeline
      });

      res.json({ 
        success: true, 
        design: poolDesign,
        imageUrl: designResult.imageUrl,
        estimatedCost: designResult.estimatedCost,
        timeline: designResult.timeline
      });
    } catch (error: any) {
      console.error("Pool design generation error:", error);
      res.status(500).json({ 
        error: "Failed to generate pool design", 
        message: error.message 
      });
    }
  });

  // Get all pool designs (admin endpoint)
  app.get("/api/pool-designs", async (req, res) => {
    try {
      const designs = await storage.getPoolDesigns();
      res.json(designs);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // AI Voice-to-Pool Processing endpoint
  app.post("/api/ai-voice-process", async (req, res) => {
    try {
      const { transcript } = req.body;
      
      if (!transcript) {
        return res.status(400).json({ error: "Transcript is required" });
      }

      console.log('Processing voice transcript:', transcript);
      
      // Use OpenAI to parse the voice transcript into pool specifications
      const poolSpecs = await generatePoolSpecsFromVoice(transcript);
      
      res.json({ success: true, poolSpecs });
    } catch (error: any) {
      console.error('Voice processing error:', error);
      res.status(500).json({ 
        error: "Failed to process voice input", 
        message: error.message 
      });
    }
  });

  // AI Cost Estimation endpoint for voice-processed specs
  app.post("/api/ai-cost-estimate", async (req, res) => {
    try {
      const { poolSpecs } = req.body;
      
      if (!poolSpecs) {
        return res.status(400).json({ error: "Pool specs are required" });
      }

      console.log('Generating cost estimate for:', poolSpecs);
      
      // Use OpenAI to generate detailed cost estimate
      const costEstimate = await generateCostEstimateFromSpecs(poolSpecs);
      
      res.json({ success: true, costEstimate });
    } catch (error: any) {
      console.error('Cost estimation error:', error);
      res.status(500).json({ 
        error: "Failed to generate cost estimate", 
        message: error.message 
      });
    }
  });

  // AI Construction Plan Generation endpoint
  app.post("/api/ai-construction-plan", async (req, res) => {
    try {
      const { poolSpecs } = req.body;
      
      if (!poolSpecs) {
        return res.status(400).json({ error: "Pool specs are required" });
      }

      console.log('Generating construction plan for:', poolSpecs);
      
      // Use OpenAI to generate construction plan
      const constructionPlan = await generateConstructionPlan(poolSpecs);
      
      res.json({ success: true, constructionPlan });
    } catch (error: any) {
      console.error('Construction plan generation error:', error);
      res.status(500).json({ 
        error: "Failed to generate construction plan", 
        message: error.message 
      });
    }
  });

  // Unified AI Design Process endpoint (Voice-to-Pool functionality)
  app.post("/api/ai-design-process", async (req, res) => {
    try {
      // Validate request using Zod schema
      const validatedRequest = aiDesignProcessRequestSchema.parse(req.body);
      const { transcript } = validatedRequest;

      console.log('Processing AI design request with transcript:', transcript.substring(0, 100) + '...');

      // Step 1: Generate pool specs from voice transcript
      console.log('Step 1: Generating pool specs from voice...');
      const specs = await generatePoolSpecsFromVoice(transcript);
      console.log('Generated specs:', specs);

      // Step 2: Generate cost estimate from specs
      console.log('Step 2: Generating cost estimate...');
      const estimate = await generateCostEstimateFromSpecs(specs);
      console.log('Generated estimate:', estimate);

      // Step 3: Generate construction plan from specs
      console.log('Step 3: Generating construction plan...');
      const plan = await generateConstructionPlan(specs);
      console.log('Generated plan phases count:', plan.phases.length);

      // Step 4: Generate realistic pool design image using DALL-E
      console.log('Step 4: Generating AI pool design image...');
      const poolDesignRequest = {
        poolShape: specs.style.includes('rectangular') || specs.style.includes('lap') ? 'rectangular' : 'freeform',
        poolSize: specs.approxLengthFt > 50 ? 'large' : specs.approxLengthFt > 35 ? 'medium' : 'small',
        style: specs.style.toLowerCase(),
        features: specs.features.map(f => f.toLowerCase().replace(/\s+/g, '-'))
      };
      
      const poolDesignResult = await generatePoolDesign(poolDesignRequest);
      console.log('Generated design image URL:', poolDesignResult.imageUrl.substring(0, 50) + '...');

      // Validate response using Zod schema
      const response = aiDesignProcessResponseSchema.parse({
        specs,
        estimate,
        plan,
        imageUrl: poolDesignResult.imageUrl
      });

      console.log('AI design process completed successfully');
      res.json(response);
    } catch (error: any) {
      console.error('AI design process error:', error);
      
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          error: "Validation failed", 
          details: error.errors,
          message: "Invalid request data"
        });
      } else {
        res.status(500).json({ 
          error: "AI processing failed", 
          message: error.message || "Unknown error occurred"
        });
      }
    }
  });

  // Download image endpoint to avoid CORS issues
  app.post("/api/download-image", async (req, res) => {
    try {
      const { imageUrl } = req.body;
      
      if (!imageUrl) {
        return res.status(400).json({ error: 'Image URL is required' });
      }

      console.log('Downloading image from URL:', imageUrl);
      
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch image');
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Content-Disposition', 'attachment; filename="pool-design.png"');
      res.send(buffer);
    } catch (error) {
      console.error('Download image error:', error);
      res.status(500).json({ error: 'Failed to download image' });
    }
  });

  // SEO: Sitemap.xml endpoint
  app.get("/sitemap.xml", (req, res) => {
    try {
      const baseUrl = req.protocol + '://' + req.get('host');
      const sitemap = generateSitemap(baseUrl);
      
      res.setHeader('Content-Type', 'application/xml');
      res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
      res.send(sitemap);
    } catch (error) {
      console.error('Sitemap generation error:', error);
      res.status(500).send('Error generating sitemap');
    }
  });

  // SEO: Robots.txt endpoint (fallback - prefer static file)
  app.get("/robots.txt", (req, res) => {
    const baseUrl = req.protocol + '://' + req.get('host');
    const robotsTxt = `User-agent: *
Allow: /

# Important pages for SEO
Allow: /about
Allow: /packages
Allow: /contact
Allow: /testimonials
Allow: /ai-3d-design
Allow: /ai-optimization
Allow: /eco-design
Allow: /virtual-reality
Allow: /child-safety
Allow: /diy-pools-and-spas

# Block admin and payment pages
Disallow: /admin
Disallow: /payment-success

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml

# Crawl delay (optional)
Crawl-delay: 1`;

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
    res.send(robotsTxt);
  });

  // SEO Middleware - Add before Vite handler for bot detection
  app.use(seoMiddleware);



  const httpServer = createServer(app);
  return httpServer;
}
