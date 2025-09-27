import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import path from 'path';

// HTML encoding function to prevent XSS
function htmlEncode(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Input sanitization function with selective HTML encoding
function sanitizeInput(input: any, skipHtmlEncoding = false): any {
  if (typeof input === 'string') {
    // Remove SQL injection patterns
    const sqlPatterns = [
      /(\b(ALTER|CREATE|DELETE|DROP|EXEC(UTE)?|INSERT|SCRIPT|SELECT|UNION|UPDATE)\b)/gi,
      /(javascript:|data:|vbscript:)/gi,
      /(<script[^>]*>.*?<\/script>)/gi,
      /(<iframe[^>]*>.*?<\/iframe>)/gi,
      /(<object[^>]*>.*?<\/object>)/gi,
      /(<embed[^>]*>.*?<\/embed>)/gi,
      /(on\w+\s*=)/gi
    ];
    
    let sanitized = input.trim();
    
    // Remove dangerous patterns
    sqlPatterns.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '');
    });
    
    // Only HTML encode if not skipped (for JSON fields)
    if (!skipHtmlEncoding) {
      sanitized = htmlEncode(sanitized);
    }
    
    return sanitized;
  } else if (typeof input === 'object' && input !== null) {
    const sanitized: any = {};
    for (const key in input) {
      // Skip HTML encoding for JSON array fields that will be parsed later
      const isJsonField = ['waterFeatures', 'fireFeatures', 'structures', 'desiredEquipment', 'safetyFeatures', 'hoaGuidelines', 'submissionData'].includes(key);
      sanitized[key] = sanitizeInput(input[key], isJsonField);
    }
    return sanitized;
  }
  
  return input;
}

// Input sanitization middleware
export function sanitizeRequestBody() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.body && typeof req.body === 'object') {
      req.body = sanitizeInput(req.body);
    }
    next();
  };
}

// File upload security validation
export interface FileSecurityOptions {
  allowedTypes: string[];
  maxFileSize: number; // in bytes
  maxFiles: number;
  scanForMalware?: boolean;
}

export function validateFileUpload(options: FileSecurityOptions) {
  return (req: Request, res: Response, next: NextFunction) => {
    const files = req.files as Express.Multer.File[] || [];
    
    // Check file count
    if (files.length > options.maxFiles) {
      return res.status(400).json({
        success: false,
        error: 'Too many files',
        message: `Maximum ${options.maxFiles} files allowed`
      });
    }
    
    // Validate each file
    for (const file of files) {
      // Check file size
      if (file.size > options.maxFileSize) {
        return res.status(400).json({
          success: false,
          error: 'File too large',
          message: `File "${file.originalname}" exceeds maximum size of ${Math.round(options.maxFileSize / 1024 / 1024)}MB`
        });
      }
      
      // Check file type
      const fileExtension = path.extname(file.originalname).toLowerCase();
      const mimeType = file.mimetype.toLowerCase();
      
      const allowedExtensions = options.allowedTypes.map(type => type.toLowerCase());
      const allowedMimeTypes = [
        'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/webp',
        'application/pdf',
        'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain', 'text/csv',
        'application/zip', 'application/x-zip-compressed'
      ];
      
      if (!allowedExtensions.includes(fileExtension) || !allowedMimeTypes.includes(mimeType)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid file type',
          message: `File "${file.originalname}" has an unsupported format. Allowed types: ${options.allowedTypes.join(', ')}`
        });
      }
      
      // Check for suspicious file names
      const suspiciousPatterns = [
        /\.php$/i, /\.jsp$/i, /\.asp$/i, /\.exe$/i, /\.bat$/i, /\.cmd$/i,
        /\.scr$/i, /\.com$/i, /\.pif$/i, /\.vbs$/i, /\.js$/i
      ];
      
      if (suspiciousPatterns.some(pattern => pattern.test(file.originalname))) {
        return res.status(400).json({
          success: false,
          error: 'Suspicious file type',
          message: `File "${file.originalname}" contains a potentially dangerous extension`
        });
      }
      
      // Basic content validation - check file headers for common formats
      if (file.buffer) {
        const header = file.buffer.slice(0, 8);
        const headerHex = header.toString('hex').toUpperCase();
        
        // Check for common file signatures
        const validSignatures = [
          'FFD8FF', // JPEG
          '89504E47', // PNG
          '47494638', // GIF
          '25504446', // PDF
          '504B0304', // ZIP/Office documents
          'D0CF11E0' // Legacy Office documents
        ];
        
        const isValidSignature = validSignatures.some(sig => headerHex.startsWith(sig));
        
        if (!isValidSignature && mimeType !== 'text/plain' && mimeType !== 'text/csv') {
          console.warn(`Suspicious file signature for ${file.originalname}: ${headerHex}`);
          // Don't reject, just log as many legitimate files might have non-standard headers
        }
      }
    }
    
    next();
  };
}

// CSRF protection middleware (basic implementation)
export function csrfProtection() {
  return (req: Request, res: Response, next: NextFunction) => {
    // Skip CSRF protection for GET, HEAD, OPTIONS
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
      return next();
    }
    
    // For now, just check for presence of custom header
    const csrfToken = req.headers['x-csrf-token'] || req.body._csrf;
    
    if (!csrfToken) {
      // For API endpoints, we'll rely on CORS and other security measures
      // In a production app, you'd implement proper CSRF tokens
      console.log('Warning: No CSRF token present for', req.path);
    }
    
    next();
  };
}

// Request validation middleware
export function validateRequest(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }
      
      return res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  };
}

// Security headers middleware
export function securityHeaders() {
  return (req: Request, res: Response, next: NextFunction) => {
    // Set security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    
    // Remove server information
    res.removeHeader('X-Powered-By');
    
    next();
  };
}

export default {
  sanitizeRequestBody,
  validateFileUpload,
  csrfProtection,
  validateRequest,
  securityHeaders
};