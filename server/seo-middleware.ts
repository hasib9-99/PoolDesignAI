import type { Request, Response, NextFunction } from 'express';
import { readFileSync } from 'fs';
import { join } from 'path';
import { seoRoutes, getAbsoluteUrl, SITE_URL } from '../shared/seo-data';

// Bot detection - social crawlers and SEO bots
const BOT_USER_AGENTS = [
  'facebookexternalhit',
  'Twitterbot',
  'LinkedInBot',
  'Slackbot',
  'Discordbot',
  'Pinterest',
  'TelegramBot',
  'WhatsApp',
  'Google-InspectionTool',
  'GoogleBot',
  'Bingbot',
  'YandexBot',
  'DuckDuckBot'
];

function isSEOBot(userAgent: string): boolean {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return BOT_USER_AGENTS.some(bot => ua.includes(bot.toLowerCase()));
}

// Cache the base HTML template
let htmlTemplate: string | null = null;

function getHTMLTemplate(): string {
  if (!htmlTemplate) {
    try {
      htmlTemplate = readFileSync(join(process.cwd(), 'client', 'index.html'), 'utf-8');
    } catch (error) {
      console.error('Failed to read HTML template:', error);
      htmlTemplate = '<!DOCTYPE html><html><head><title>Pool Design Consultant</title></head><body><div id="root"></div></body></html>';
    }
  }
  return htmlTemplate;
}

// Generate meta tags for a route
function generateMetaTags(path: string): string {
  const seoData = seoRoutes[path];
  if (!seoData) return '';

  const absoluteCanonical = getAbsoluteUrl(seoData.canonical);
  const absoluteOgImage = seoData.ogImage ? getAbsoluteUrl(seoData.ogImage) : getAbsoluteUrl('/attached_assets/stock_images/luxury_swimming_pool_068a5e23.jpg');

  return `
    <!-- SEO Meta Tags -->
    <title>${seoData.title}</title>
    <meta name="description" content="${seoData.description}">
    <meta name="keywords" content="${seoData.keywords}">
    <link rel="canonical" href="${absoluteCanonical}">
    
    <!-- Open Graph Tags -->
    <meta property="og:title" content="${seoData.title}">
    <meta property="og:description" content="${seoData.description}">
    <meta property="og:url" content="${absoluteCanonical}">
    <meta property="og:site_name" content="Pool Design Consultant">
    <meta property="og:type" content="${seoData.ogType || 'website'}">
    <meta property="og:image" content="${absoluteOgImage}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    
    <!-- Twitter Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${seoData.title}">
    <meta name="twitter:description" content="${seoData.description}">
    <meta name="twitter:image" content="${absoluteOgImage}">
    
    <!-- Additional Meta -->
    <meta name="robots" content="index, follow">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  `;
}

// Generate structured data for a route
function generateStructuredData(path: string): string {
  const seoData = seoRoutes[path];
  if (!seoData?.schemaType) return '';

  const schemas: string[] = [];

  // LocalBusiness schema for home and contact pages
  if (seoData.schemaType === 'home' || seoData.schemaType === 'contact') {
    schemas.push(`{
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Pool Design Consultant",
      "alternateName": "Kayne Marzetti Pool Design",
      "description": "Expert pool design and construction services with 47+ years experience. Custom 3D pool design, construction planning, and complete outdoor living solutions.",
      "url": "${SITE_URL}",
      "telephone": "(407) 314-0857",
      "email": "kayne@pooldesignconsultant.com",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "4300 W Lake Mary Blvd, Suite 1010",
        "addressLocality": "Lake Mary",
        "addressRegion": "FL",
        "postalCode": "32746",
        "addressCountry": "US"
      },
      "areaServed": [
        {
          "@type": "Country",
          "name": "United States"
        }
      ],
      "openingHours": [
        "Mo-Fr 08:00-18:00",
        "Sa 09:00-16:00"
      ],
      "priceRange": "$$$$",
      "paymentAccepted": "Cash, Check, Credit Card, Bank Transfer",
      "foundingDate": "1977",
      "founder": {
        "@type": "Person",
        "name": "Kayne Marzetti",
        "jobTitle": "Pool Design Consultant",
        "description": "47+ years experience in custom pool design and landscape architecture"
      },
      "sameAs": [
        "https://www.facebook.com/pooldesignconsultant",
        "https://www.instagram.com/pooldesignconsultant",
        "https://www.linkedin.com/in/kayne-marzetti"
      ],
      "knowsAbout": [
        "Pool Design",
        "Swimming Pool Construction",
        "Landscape Architecture",
        "3D Pool Visualization",
        "Pool Safety Design",
        "Spa Design",
        "Outdoor Living Spaces"
      ]
    }`);
  }

  // Service schema for service pages
  if (seoData.schemaType === 'services' || seoData.schemaType === 'diy') {
    schemas.push(`{
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "${seoData.title.split('|')[0].trim()}",
      "description": "${seoData.description}",
      "provider": {
        "@type": "LocalBusiness",
        "name": "Pool Design Consultant",
        "url": "${SITE_URL}"
      },
      "serviceType": "Pool Design and Construction",
      "areaServed": {
        "@type": "Country",
        "name": "United States"
      }
    }`);
  }

  // FAQ schema for home and DIY pages
  if (seoData.schemaType === 'home' || seoData.schemaType === 'diy') {
    schemas.push(`{
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How much does a custom pool design cost?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Custom pool design costs vary based on complexity, size, and features. Our packages start at consultation-only options and include full 3D design and construction plans. Contact us for a personalized quote."
          }
        },
        {
          "@type": "Question",
          "name": "How long does the pool design process take?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The pool design process typically takes 2-6 weeks depending on the package selected and design complexity. This includes initial consultation, 3D design creation, revisions, and final construction plans."
          }
        },
        {
          "@type": "Question",
          "name": "Do you provide construction services or just design?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We specialize in pool design and provide detailed construction plans. We work with a network of qualified pool builders nationwide and can recommend trusted contractors in your area."
          }
        }
      ]
    }`);
  }

  if (schemas.length === 0) return '';

  return `<script type="application/ld+json">[${schemas.join(',')}]</script>`;
}

// SEO middleware
export function seoMiddleware(req: Request, res: Response, next: NextFunction) {
  // Only handle GET requests for HTML pages
  if (req.method !== 'GET' || req.path.startsWith('/api/') || req.path.includes('.')) {
    return next();
  }

  // Check if this is a SEO bot or social crawler
  const userAgent = req.get('User-Agent') || '';
  const isBot = isSEOBot(userAgent);

  // If not a bot, continue to normal SPA handling
  if (!isBot) {
    return next();
  }

  // Check if we have SEO data for this route
  const seoData = seoRoutes[req.path];
  if (!seoData) {
    return next();
  }

  console.log(`🤖 SEO Bot detected: ${userAgent.substring(0, 50)}... serving pre-rendered HTML for ${req.path}`);

  try {
    const htmlTemplate = getHTMLTemplate();
    const metaTags = generateMetaTags(req.path);
    const structuredData = generateStructuredData(req.path);

    // Replace head content with SEO optimized version
    const seoHTML = htmlTemplate.replace(
      /<head>[\s\S]*?<\/head>/i,
      `<head>
        <meta charset="UTF-8">
        ${metaTags}
        ${structuredData}
      </head>`
    );

    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    res.send(seoHTML);
  } catch (error) {
    console.error('SEO middleware error:', error);
    next();
  }
}