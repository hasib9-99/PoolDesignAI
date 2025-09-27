import { MailService } from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY environment variable must be set");
}

const mailService = new MailService();
mailService.setApiKey(process.env.SENDGRID_API_KEY);

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  try {
    console.log(`Sending email to ${params.to} from ${params.from} with subject: ${params.subject}`);
    
    await mailService.send({
      to: params.to,
      from: params.from,
      subject: params.subject,
      text: params.text || '',
      html: params.html || '',
      replyTo: params.replyTo,
    });
    
    console.log(`Email sent successfully to ${params.to}`);
    return true;
  } catch (error: any) {
    console.error('SendGrid email error details:', {
      message: error.message,
      code: error.code,
      statusCode: error.response?.status,
      body: error.response?.body,
      errors: error.response?.body?.errors
    });
    return false;
  }
}

interface EstimateData {
  customerEmail: string;
  size: string;
  type: string;
  material: string;
  features?: string;
  location?: string;
  timeline?: string;
  contractorCost: string;
  ownerBuilderCost: string;
  savings: string;
}

export function generateEstimateEmail(data: EstimateData): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pool Design Estimate</title>
    <style>
        body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; }
        .header { background: linear-gradient(135deg, #3b82f6, #f97316); color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .header p { margin: 5px 0 0; opacity: 0.9; }
        .content { padding: 30px; }
        .estimate-details { background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .cost-comparison { display: flex; gap: 15px; margin: 20px 0; }
        .cost-box { flex: 1; padding: 15px; border-radius: 8px; text-align: center; }
        .contractor-cost { background-color: #fef3c7; border: 2px solid #f59e0b; }
        .owner-cost { background-color: #d1fae5; border: 2px solid #10b981; }
        .savings { background-color: #ecfdf5; border: 2px solid #059669; font-weight: bold; }
        .cost-amount { font-size: 18px; font-weight: bold; margin: 5px 0; }
        .footer { background-color: #1f2937; color: white; padding: 20px; text-align: center; }
        .contact-info { margin: 15px 0; }
        .feature-list { list-style: none; padding: 0; }
        .feature-list li { padding: 5px 0; border-bottom: 1px solid #e5e7eb; }
        .highlight { color: #f97316; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Your Pool Design Estimate</h1>
            <p>47 Years of Combined Experience • Professional Design Services</p>
        </div>
        
        <div class="content">
            <h2>Thank you for your interest!</h2>
            <p>Based on your specifications, we've prepared a detailed cost estimate for your pool project. This estimate reflects current market pricing and includes both contractor and owner-builder options.</p>
            
            <div class="estimate-details">
                <h3>Project Details</h3>
                <ul class="feature-list">
                    <li><strong>Pool Size:</strong> ${data.size}</li>
                    <li><strong>Pool Type:</strong> ${data.type}</li>
                    <li><strong>Material:</strong> ${data.material}</li>
                    <li><strong>Features:</strong> ${data.features || 'Standard package'}</li>
                    <li><strong>Location:</strong> ${data.location || 'Not specified'}</li>
                    <li><strong>Timeline:</strong> ${data.timeline || 'Not specified'}</li>
                </ul>
            </div>
            
            <h3>Cost Comparison</h3>
            <div class="cost-comparison">
                <div class="cost-box contractor-cost">
                    <h4>Professional Contractor</h4>
                    <div class="cost-amount">${data.contractorCost}</div>
                    <p style="margin: 0; font-size: 12px;">Full-service installation</p>
                </div>
                <div class="cost-box owner-cost">
                    <h4>Owner-Builder Cost</h4>
                    <div class="cost-amount">${data.ownerBuilderCost}</div>
                    <p style="margin: 0; font-size: 12px;">With our guidance</p>
                </div>
                <div class="cost-box savings">
                    <h4>Your Savings</h4>
                    <div class="cost-amount highlight">${data.savings}</div>
                    <p style="margin: 0; font-size: 12px;">Build it yourself!</p>
                </div>
            </div>
            
            <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>What's Included in Our Owner-Builder Service:</h3>
                <ul>
                    <li>✅ Complete 3D design and engineering plans</li>
                    <li>✅ Step-by-step construction guidance</li>
                    <li>✅ Material specifications and supplier recommendations</li>
                    <li>✅ Phone/video support throughout construction</li>
                    <li>✅ Permit assistance and code compliance</li>
                    <li>✅ Quality checkpoints and inspections</li>
                </ul>
            </div>
            
            <h3>Next Steps</h3>
            <p>Ready to start your dream pool? We offer <span class="highlight">FREE consultations</span> where we'll:</p>
            <ul>
                <li>Refine your design based on your specific site</li>
                <li>Provide detailed material lists and costs</li>
                <li>Create a timeline for your project</li>
                <li>Answer all your questions</li>
            </ul>
            
            <p><strong>Contact us today to schedule your consultation!</strong></p>
        </div>
        
        <div class="footer">
            <h3>Kayne Marzetti Pool Design</h3>
            <div class="contact-info">
                <p><strong>📍 Location:</strong> 4300 W Lake Mary Blvd, Suite 1010, Lake Mary, FL 32746</p>
                <p><strong>📧 Email:</strong> info@pooldesignconsultant.com</p>
                <p><strong>📞 Phone:</strong> Available for consultation</p>
            </div>
            <p style="margin-top: 20px; font-size: 12px; opacity: 0.8;">
                34 years pool design experience • 13 years landscape design • 5000+ pools designed
            </p>
            <p style="font-size: 11px; opacity: 0.7; margin-top: 10px;">
                *Estimates are based on current market pricing and may vary. Final pricing subject to site evaluation and local requirements.
            </p>
        </div>
    </div>
</body>
</html>
  `;
}

export async function sendPoolEstimate(data: EstimateData): Promise<boolean> {
  const htmlContent = generateEstimateEmail(data);
  
  return sendEmail({
    to: data.customerEmail,
    from: process.env.GMAIL_USER || 'kayne@pooldesignconsultant.com',
    subject: 'Your Pool Design Estimate - Save Up to 50% with Owner-Builder Option',
    html: htmlContent,
    text: `Your Pool Design Estimate

Thank you for your interest in our pool design services!

Project Details:
- Pool Size: ${data.size}
- Pool Type: ${data.type}  
- Material: ${data.material}
- Features: ${data.features || 'Standard package'}
- Location: ${data.location}
- Timeline: ${data.timeline}

Cost Comparison:
- Professional Contractor: ${data.contractorCost}
- Owner-Builder Cost: ${data.ownerBuilderCost}
- Your Savings: ${data.savings}

Contact us for a FREE consultation!
Kayne Marzetti Pool Design
4300 W Lake Mary Blvd, Suite 1010, Lake Mary, FL 32746

47 years combined experience • 5000+ pools designed`
  });
}

interface ContactInquiryData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  location?: string;
  details?: string;
  budget?: string;
}

// Send admin notification when someone submits a contact form
export async function sendAdminNotification(data: ContactInquiryData): Promise<boolean> {
  const htmlContent = `
  <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
        .inquiry-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444; }
        .urgent { background: #fee2e2; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #fecaca; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚨 New Pool Design Inquiry</h1>
          <p>Action Required - Customer Contact Request</p>
        </div>
        <div class="content">
          <div class="urgent">
            <h3>New Customer Lead - Contact Within 24 Hours</h3>
            <p>A potential customer has requested a free consultation for their pool project.</p>
          </div>
          
          <div class="inquiry-details">
            <h3>Customer Information:</h3>
            <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ''}
            ${data.location ? `<p><strong>Location:</strong> ${data.location}</p>` : ''}
            ${data.budget ? `<p><strong>Budget Range:</strong> ${data.budget}</p>` : ''}
            ${data.details ? `<p><strong>Project Details:</strong><br>${data.details}</p>` : ''}
          </div>
          
          <div class="urgent">
            <h3>Next Steps:</h3>
            <ul>
              <li>Contact customer within 24 hours</li>
              <li>Schedule free consultation</li>
              <li>Send project proposal and pricing</li>
              <li>Follow up with design options</li>
            </ul>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 11px; color: #6b7280; text-align: center;">
            <p><strong>Pool Design Consultant</strong><br>
            4300 W Lake Mary Blvd, Suite 1010, Lake Mary, FL 32746</p>
          </div>
        </div>
      </div>
    </body>
  </html>`;

  return sendEmail({
    to: 'kayne@pooldesignconsultant.com', // Admin notification goes to Kayne
    from: 'kayne@pooldesignconsultant.com', // Use verified business email as sender
    subject: `🚨 New Pool Design Lead - ${data.firstName} ${data.lastName}`,
    html: htmlContent,
    text: `NEW POOL DESIGN INQUIRY - ACTION REQUIRED

Customer: ${data.firstName} ${data.lastName}
Email: ${data.email}
${data.phone ? `Phone: ${data.phone}` : ''}
${data.location ? `Location: ${data.location}` : ''}
${data.budget ? `Budget: ${data.budget}` : ''}
${data.details ? `Details: ${data.details}` : ''}

CONTACT CUSTOMER WITHIN 24 HOURS
    
Kayne Marzetti Pool Design
Pool Design Consultant System

---
Pool Design Consultant
4300 W Lake Mary Blvd, Suite 1010, Lake Mary, FL 32746`
  });
}

export async function sendContactConfirmation(data: ContactInquiryData): Promise<boolean> {
  const htmlContent = `
  <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
        .highlight { background: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .contact-info { background: white; padding: 20px; border-radius: 8px; margin-top: 20px; }
        .footer { text-align: center; color: #64748b; margin-top: 30px; }
        .cta { background: #f97316; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Thank You for Your Interest!</h1>
          <p>Your free consultation request has been received</p>
        </div>
        <div class="content">
          <p>Dear ${data.firstName},</p>
          
          <p>Thank you for reaching out to <strong>Kayne Marzetti Pool Design</strong>! We've received your request for a free consultation and are excited to help you create the perfect pool for your home.</p>
          
          <div class="highlight">
            <h3>What happens next?</h3>
            <p>Our experienced pool designers will contact you within <strong>24 hours</strong> to schedule your personalized consultation. During this call, we'll discuss:</p>
            <ul>
              <li>Your specific pool vision and requirements</li>
              <li>Site evaluation and design options</li>
              <li>Owner-builder vs. contractor cost comparisons</li>
              <li>Timeline and next steps for your project</li>
            </ul>
          </div>
          
          <div class="contact-info">
            <h3>Your Inquiry Details:</h3>
            <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ''}
            ${data.location ? `<p><strong>Location:</strong> ${data.location}</p>` : ''}
            ${data.budget ? `<p><strong>Budget:</strong> ${data.budget}</p>` : ''}
            ${data.details ? `<p><strong>Project Details:</strong> ${data.details}</p>` : ''}
          </div>
          
          <a href="https://pooldesignconsultant.com/ai-3d-design" class="cta">Try Our AI Pool Designer</a>
          
          <div class="footer">
            <p><strong>Kayne Marzetti Pool Design</strong><br>
            4300 W Lake Mary Blvd, Suite 1010<br>
            Lake Mary, FL 32746<br>
            Phone: (407) 555-0123</p>
            
            <p><em>47 years combined experience • 5000+ pools designed</em></p>
            
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 11px; color: #6b7280;">
              <p>This email was sent to ${data.email} because you requested a pool design consultation.</p>
              <p>Pool Design Consultant | 4300 W Lake Mary Blvd, Suite 1010, Lake Mary, FL 32746</p>
              <p>If you no longer wish to receive emails, <a href="mailto:kayne@pooldesignconsultant.com?subject=Unsubscribe" style="color: #3b82f6;">click here to unsubscribe</a>.</p>
            </div>
          </div>
        </div>
      </div>
    </body>
  </html>`;
  
  return sendEmail({
    to: data.email,
    from: 'kayne@pooldesignconsultant.com', // Use verified business email as sender
    subject: 'Your Free Pool Design Consultation - Next Steps',
    html: htmlContent,
    text: `Dear ${data.firstName},

Thank you for reaching out to Kayne Marzetti Pool Design! We've received your request for a free consultation and are excited to help you create the perfect pool for your home.

What happens next?
Our experienced pool designers will contact you within 24 hours to schedule your personalized consultation. During this call, we'll discuss:
• Your specific pool vision and requirements
• Site evaluation and design options  
• Owner-builder vs. contractor cost comparisons
• Timeline and next steps for your project

Your Inquiry Details:
Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
${data.phone ? `Phone: ${data.phone}` : ''}
${data.location ? `Location: ${data.location}` : ''}
${data.budget ? `Budget: ${data.budget}` : ''}
${data.details ? `Project Details: ${data.details}` : ''}

Try our AI Pool Designer: https://pooldesignconsultant.com/ai-3d-design

Kayne Marzetti Pool Design
4300 W Lake Mary Blvd, Suite 1010, Lake Mary, FL 32746
Phone: (407) 555-0123

47 years combined experience • 5000+ pools designed

---
This email was sent to ${data.email} because you requested a pool design consultation.
To unsubscribe, reply with "UNSUBSCRIBE" in the subject line.`
  });
}

// Pool Design Intake Email Functions

interface PoolIntakeData {
  fullName: string;
  email: string;
  phone: string;
  ticketNumber: string;
  projectAddress: string;
  poolSize: string;
  budgetRange: string;
  filesUploaded: number;
  hasHOA: boolean;
  hasSpa: boolean;
  waterFeatures?: string[];
  fireFeatures?: string[];
}

interface PoolIntakeAdminData extends PoolIntakeData {
  intakeId: string;
  city: string;
  state: string;
  county: string;
  deckMaterial: string;
  equipmentBrand?: string;
  targetStartDate?: string;
  specialRequests?: string;
  sketchNotes?: string;
  files: Array<{
    originalName: string;
    fileType: string;
    publicUrl: string;
    fileSize: number;
  }>;
}

export async function sendPoolIntakeConfirmation(data: PoolIntakeData): Promise<boolean> {
  const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Pool Design Intake Confirmation</title>
      <style>
          body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; }
          .header { background: linear-gradient(135deg, #3b82f6, #f97316); color: white; padding: 30px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; }
          .header p { margin: 5px 0 0; opacity: 0.9; }
          .content { padding: 30px; }
          .ticket-box { background: linear-gradient(135deg, #ecfdf5, #d1fae5); border: 2px solid #10b981; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: center; }
          .ticket-number { font-size: 24px; font-weight: bold; color: #059669; margin: 10px 0; }
          .project-details { background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .timeline-box { background: linear-gradient(135deg, #eff6ff, #dbeafe); border: 2px solid #3b82f6; padding: 20px; border-radius: 10px; margin: 20px 0; }
          .footer { background-color: #1f2937; color: white; padding: 20px; text-align: center; }
          .contact-info { margin: 15px 0; }
          .feature-list { list-style: none; padding: 0; }
          .feature-list li { padding: 5px 0; border-bottom: 1px solid #e5e7eb; }
          .highlight { color: #f97316; font-weight: bold; }
          .next-steps { background: #fef3c7; border: 2px solid #f59e0b; padding: 20px; border-radius: 8px; margin: 20px 0; }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>Pool Design Intake Received!</h1>
              <p>Professional Pool Design Services • 47 Years Combined Experience</p>
          </div>
          
          <div class="content">
              <p>Dear ${data.fullName},</p>
              
              <p>Thank you for submitting your pool design intake form! We've successfully received all your project details and uploaded files. Our design team is excited to create your dream pool.</p>
              
              <div class="ticket-box">
                  <h3>Your Ticket Number</h3>
                  <div class="ticket-number">${data.ticketNumber}</div>
                  <p style="margin: 0; font-size: 14px;">Save this number for all future correspondence</p>
              </div>
              
              <div class="project-details">
                  <h3>Project Summary</h3>
                  <ul class="feature-list">
                      <li><strong>Property:</strong> ${data.projectAddress}</li>
                      <li><strong>Pool Size:</strong> ${data.poolSize}</li>
                      <li><strong>Budget Range:</strong> ${data.budgetRange}</li>
                      <li><strong>Files Uploaded:</strong> ${data.filesUploaded} files</li>
                      ${data.hasSpa ? '<li><strong>Spa:</strong> Included in design</li>' : ''}
                      ${data.hasHOA ? '<li><strong>HOA:</strong> Property has HOA requirements</li>' : ''}
                      ${data.waterFeatures && data.waterFeatures.length > 0 ? `<li><strong>Water Features:</strong> ${data.waterFeatures.join(', ')}</li>` : ''}
                      ${data.fireFeatures && data.fireFeatures.length > 0 ? `<li><strong>Fire Features:</strong> ${data.fireFeatures.join(', ')}</li>` : ''}
                  </ul>
              </div>
              
              <div class="timeline-box">
                  <h3>What Happens Next?</h3>
                  <p><strong>Timeline: 2-4 Business Days</strong></p>
                  <ol>
                      <li><strong>File Review:</strong> Our team reviews your survey, photos, and specifications</li>
                      <li><strong>Initial Design:</strong> We create preliminary pool concepts based on your requirements</li>
                      <li><strong>Design Delivery:</strong> You'll receive professional design concepts via email</li>
                      <li><strong>Consultation:</strong> Schedule a call to discuss the designs and next steps</li>
                  </ol>
              </div>
              
              <div class="next-steps">
                  <h3>Important Reminders</h3>
                  <ul>
                      <li>Keep your ticket number <strong>${data.ticketNumber}</strong> for reference</li>
                      <li>Check your email (including spam) for design delivery</li>
                      <li>If you have additional files or questions, reply to this email</li>
                      <li>We'll contact you within 2-4 business days with your concepts</li>
                  </ul>
              </div>
              
              <h3>Questions?</h3>
              <p>If you have any questions or need to make changes to your submission, please reply to this email with your ticket number <strong>${data.ticketNumber}</strong>.</p>
              
              <p>Thank you for choosing <span class="highlight">Pool Design Consultant</span> for your pool project!</p>
          </div>
          
          <div class="footer">
              <h3>Pool Design Consultant</h3>
              <div class="contact-info">
                  <p><strong>📧 Email:</strong> kayne@pooldesignconsultant.com</p>
                  <p><strong>🌐 Website:</strong> pooldesignconsultant.com</p>
                  <p><strong>📍 Location:</strong> Professional Pool Design Services</p>
              </div>
              <p style="margin-top: 20px; font-size: 12px; opacity: 0.8;">
                  47 years combined experience • 5000+ pools designed
              </p>
              <p style="font-size: 11px; opacity: 0.7; margin-top: 10px;">
                  This is an automated confirmation. Please save your ticket number for reference.
              </p>
              <div style="margin-top: 20px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.2); font-size: 11px; opacity: 0.7;">
                  <p>This email was sent to ${data.email} because you submitted a pool design intake form.</p>
                  <p><strong>Pool Design Consultant</strong><br>
                  4300 W Lake Mary Blvd, Suite 1010, Lake Mary, FL 32746</p>
                  <p>If you no longer wish to receive project updates, <a href="mailto:kayne@pooldesignconsultant.com?subject=Unsubscribe%20${data.ticketNumber}" style="color: #f97316;">click here to unsubscribe</a>.</p>
              </div>
          </div>
      </div>
  </body>
  </html>
  `;

  return sendEmail({
    to: data.email,
    from: 'kayne@pooldesignconsultant.com',
    subject: `Pool Design Intake Received - Ticket #${data.ticketNumber}`,
    html: htmlContent,
    text: `Dear ${data.fullName},

Thank you for submitting your pool design intake form! We've successfully received all your project details and uploaded files.

Your Ticket Number: ${data.ticketNumber}
(Please save this number for all future correspondence)

Project Summary:
- Property: ${data.projectAddress}
- Pool Size: ${data.poolSize}
- Budget Range: ${data.budgetRange}
- Files Uploaded: ${data.filesUploaded} files
${data.hasSpa ? '- Spa: Included in design' : ''}
${data.hasHOA ? '- HOA: Property has HOA requirements' : ''}
${data.waterFeatures && data.waterFeatures.length > 0 ? `- Water Features: ${data.waterFeatures.join(', ')}` : ''}
${data.fireFeatures && data.fireFeatures.length > 0 ? `- Fire Features: ${data.fireFeatures.join(', ')}` : ''}

What Happens Next? (Timeline: 2-4 Business Days)
1. File Review: Our team reviews your survey, photos, and specifications
2. Initial Design: We create preliminary pool concepts based on your requirements
3. Design Delivery: You'll receive professional design concepts via email
4. Consultation: Schedule a call to discuss the designs and next steps

Important Reminders:
- Keep your ticket number ${data.ticketNumber} for reference
- Check your email (including spam) for design delivery
- If you have additional files or questions, reply to this email
- We'll contact you within 2-4 business days with your concepts

Questions?
If you have any questions or need to make changes to your submission, please reply to this email with your ticket number ${data.ticketNumber}.

Thank you for choosing Pool Design Consultant for your pool project!

Pool Design Consultant
Email: kayne@pooldesignconsultant.com
Website: pooldesignconsultant.com

47 years combined experience • 5000+ pools designed

---
This email was sent to ${data.email} because you submitted a pool design intake form.

Pool Design Consultant
4300 W Lake Mary Blvd, Suite 1010, Lake Mary, FL 32746

To unsubscribe from project updates, reply with "UNSUBSCRIBE ${data.ticketNumber}" in the subject line.`
  });
}

export async function sendPoolIntakeAdminNotification(data: PoolIntakeAdminData): Promise<boolean> {
  const filesList = data.files.map(file => 
    `- ${file.originalName} (${file.fileType}, ${(file.fileSize / 1024 / 1024).toFixed(2)}MB) - ${file.publicUrl}`
  ).join('\n');

  const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Pool Design Intake</title>
      <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 700px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
          .urgent { background: #fee2e2; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #fecaca; }
          .details-section { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626; }
          .files-section { background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #bae6fd; }
          .ticket-highlight { background: #dcfce7; border: 2px solid #16a34a; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0; }
          .file-link { color: #2563eb; text-decoration: none; }
          .action-items { background: #fff7ed; border: 2px solid #f97316; padding: 20px; border-radius: 8px; margin: 20px 0; }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>🚨 New Pool Design Intake</h1>
              <p>Complete Project Submission - Action Required</p>
          </div>
          <div class="content">
              <div class="ticket-highlight">
                  <h3>Ticket Number: ${data.ticketNumber}</h3>
                  <p>Intake ID: ${data.intakeId}</p>
              </div>
              
              <div class="urgent">
                  <h3>New Customer Intake - Full Design Package Required</h3>
                  <p><strong>${data.fullName}</strong> has submitted a complete pool design intake with ${data.filesUploaded} uploaded files. This is a comprehensive project submission requiring professional design concepts within 2-4 business days.</p>
              </div>
              
              <div class="details-section">
                  <h3>Customer Information:</h3>
                  <p><strong>Name:</strong> ${data.fullName}</p>
                  <p><strong>Email:</strong> ${data.email}</p>
                  <p><strong>Phone:</strong> ${data.phone}</p>
                  <p><strong>Project Address:</strong> ${data.projectAddress}</p>
                  <p><strong>City/State:</strong> ${data.city}, ${data.state}</p>
                  <p><strong>County:</strong> ${data.county}</p>
                  <p><strong>Budget Range:</strong> ${data.budgetRange}</p>
                  ${data.targetStartDate ? `<p><strong>Target Start Date:</strong> ${data.targetStartDate}</p>` : ''}
              </div>
              
              <div class="details-section">
                  <h3>Pool Specifications:</h3>
                  <p><strong>Pool Size:</strong> ${data.poolSize}</p>
                  <p><strong>Deck Material:</strong> ${data.deckMaterial}</p>
                  <p><strong>Include Spa:</strong> ${data.hasSpa ? 'Yes' : 'No'}</p>
                  <p><strong>HOA Property:</strong> ${data.hasHOA ? 'Yes - Check HOA requirements' : 'No'}</p>
                  ${data.equipmentBrand ? `<p><strong>Equipment Preference:</strong> ${data.equipmentBrand}</p>` : ''}
                  ${data.waterFeatures && data.waterFeatures.length > 0 ? `<p><strong>Water Features:</strong> ${data.waterFeatures.join(', ')}</p>` : ''}
                  ${data.fireFeatures && data.fireFeatures.length > 0 ? `<p><strong>Fire Features:</strong> ${data.fireFeatures.join(', ')}</p>` : ''}
                  ${data.specialRequests ? `<p><strong>Special Requests:</strong> ${data.specialRequests}</p>` : ''}
                  ${data.sketchNotes ? `<p><strong>Design Notes:</strong> ${data.sketchNotes}</p>` : ''}
              </div>
              
              <div class="files-section">
                  <h3>Uploaded Files (${data.filesUploaded} total):</h3>
                  ${data.files.map(file => `
                  <p>📄 <strong>${file.originalName}</strong><br>
                  Type: ${file.fileType} | Size: ${(file.fileSize / 1024 / 1024).toFixed(2)}MB<br>
                  <a href="${file.publicUrl}" class="file-link" target="_blank">View File</a></p>
                  `).join('')}
              </div>
              
              <div class="action-items">
                  <h3>Action Items - Complete Within 2-4 Business Days:</h3>
                  <ol>
                      <li><strong>Review all uploaded files</strong> (survey, photos, documents)</li>
                      <li><strong>Verify site requirements</strong> and any HOA restrictions</li>
                      <li><strong>Create preliminary pool design concepts</strong> based on specifications</li>
                      <li><strong>Prepare design presentation</strong> with multiple options</li>
                      <li><strong>Send design concepts to customer</strong> via email</li>
                      <li><strong>Schedule follow-up consultation</strong> to discuss designs</li>
                      <li><strong>Quote any additional services</strong> if needed</li>
                  </ol>
              </div>
              
              <div class="urgent">
                  <h3>Priority Level: HIGH</h3>
                  <p>Complete intake submission with files. Customer expects design concepts within 2-4 business days as promised.</p>
                  <p><strong>Ticket Number:</strong> ${data.ticketNumber}</p>
              </div>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 11px; color: #6b7280; text-align: center;">
                <p><strong>Pool Design Consultant</strong><br>
                4300 W Lake Mary Blvd, Suite 1010, Lake Mary, FL 32746</p>
              </div>
          </div>
      </div>
  </body>
  </html>`;

  return sendEmail({
    to: 'kayne@pooldesignconsultant.com',
    from: 'kayne@pooldesignconsultant.com',
    subject: `🚨 PRIORITY: Pool Design Intake - ${data.fullName} (${data.ticketNumber})`,
    html: htmlContent,
    text: `NEW POOL DESIGN INTAKE SUBMISSION - ACTION REQUIRED

Ticket Number: ${data.ticketNumber}
Intake ID: ${data.intakeId}

CUSTOMER INFORMATION:
Name: ${data.fullName}
Email: ${data.email}
Phone: ${data.phone}
Project Address: ${data.projectAddress}
City/State: ${data.city}, ${data.state}
County: ${data.county}
Budget Range: ${data.budgetRange}
${data.targetStartDate ? `Target Start Date: ${data.targetStartDate}` : ''}

POOL SPECIFICATIONS:
Pool Size: ${data.poolSize}
Deck Material: ${data.deckMaterial}
Include Spa: ${data.hasSpa ? 'Yes' : 'No'}
HOA Property: ${data.hasHOA ? 'Yes - Check HOA requirements' : 'No'}
${data.equipmentBrand ? `Equipment Preference: ${data.equipmentBrand}` : ''}
${data.waterFeatures && data.waterFeatures.length > 0 ? `Water Features: ${data.waterFeatures.join(', ')}` : ''}
${data.fireFeatures && data.fireFeatures.length > 0 ? `Fire Features: ${data.fireFeatures.join(', ')}` : ''}
${data.specialRequests ? `Special Requests: ${data.specialRequests}` : ''}
${data.sketchNotes ? `Design Notes: ${data.sketchNotes}` : ''}

UPLOADED FILES (${data.filesUploaded} total):
${filesList}

ACTION ITEMS - Complete Within 2-4 Business Days:
1. Review all uploaded files (survey, photos, documents)
2. Verify site requirements and any HOA restrictions
3. Create preliminary pool design concepts based on specifications
4. Prepare design presentation with multiple options
5. Send design concepts to customer via email
6. Schedule follow-up consultation to discuss designs
7. Quote any additional services if needed

PRIORITY LEVEL: HIGH
Complete intake submission with files. Customer expects design concepts within 2-4 business days as promised.

Pool Design Consultant System - Automated Intake Notification

---
Pool Design Consultant
4300 W Lake Mary Blvd, Suite 1010, Lake Mary, FL 32746`
  });
}

