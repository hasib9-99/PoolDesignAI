import { useEffect } from 'react';

interface StructuredDataProps {
  type: 'LocalBusiness' | 'Service' | 'FAQ';
  data: any;
}

export default function StructuredData({ type, data }: StructuredDataProps) {
  useEffect(() => {
    // Create structured data script tag
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(data);
    
    // Add unique identifier to avoid duplicates
    script.id = `structured-data-${type.toLowerCase()}`;
    
    // Remove existing script if present
    const existingScript = document.getElementById(script.id);
    if (existingScript) {
      existingScript.remove();
    }
    
    // Add new script to head
    document.head.appendChild(script);
    
    // Cleanup function
    return () => {
      const scriptToRemove = document.getElementById(script.id);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [type, data]);

  return null; // This component doesn't render anything visible
}

// Predefined structured data for pool design business
export const poolBusinessData = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Pool Design Consultant",
  "description": "Professional pool design and construction services with 47+ years experience. Custom pool design, 3D visualization, and expert consultation.",
  "url": "https://pooldesignconsultant.com",
  "telephone": "+1-555-POOL-DESIGN",
  "email": "kayne@pooldesignconsultant.com",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Nationwide",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "39.8283",
    "longitude": "-98.5795"
  },
  "openingHours": "Mo-Fr 08:00-18:00, Sa 09:00-17:00",
  "priceRange": "$$$",
  "areaServed": {
    "@type": "Country",
    "name": "United States"
  },
  "serviceType": [
    "Pool Design",
    "Swimming Pool Construction", 
    "Pool Consultation",
    "3D Pool Visualization",
    "Pool Planning"
  ],
  "founder": {
    "@type": "Person",
    "name": "Kayne Marzetti",
    "jobTitle": "Pool Design Expert",
    "description": "47+ years combined experience in landscape and pool design"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "150"
  },
  "sameAs": [
    "https://www.facebook.com/pooldesignconsultant",
    "https://www.instagram.com/pooldesignconsultant",
    "https://www.linkedin.com/company/pooldesignconsultant"
  ]
};

export const poolServicesData = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Custom Pool Design Services",
  "description": "Professional custom pool design and consultation services including 3D visualization, cost estimation, and complete project planning.",
  "provider": {
    "@type": "LocalBusiness",
    "name": "Pool Design Consultant"
  },
  "areaServed": {
    "@type": "Country", 
    "name": "United States"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Pool Design Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Basic Pool Consultation",
          "description": "Initial pool design consultation and planning"
        }
      },
      {
        "@type": "Offer", 
        "itemOffered": {
          "@type": "Service",
          "name": "Premium 3D Pool Design",
          "description": "Complete 3D pool design with visualization and cost estimates"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service", 
          "name": "Luxury Full-Service Design",
          "description": "Comprehensive pool design with construction oversight"
        }
      }
    ]
  }
};

export const poolFAQData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How much does a custom pool design cost?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Pool design costs vary based on complexity and features. Our Basic consultation starts at $299, Premium 3D design at $899, and Luxury full-service design at $1,499. Final pool construction costs typically range from $30,000 to $100,000+ depending on size, materials, and features."
      }
    },
    {
      "@type": "Question", 
      "name": "How long does the pool design process take?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our design process typically takes 1-3 weeks depending on the package selected. Basic consultation provides initial concepts within 3-5 days, while Premium 3D design takes 1-2 weeks, and Luxury full-service design takes 2-3 weeks for complete planning."
      }
    },
    {
      "@type": "Question",
      "name": "Do you provide 3D visualization of pool designs?",
      "acceptedAnswer": {
        "@type": "Answer", 
        "text": "Yes! Our Premium and Luxury packages include detailed 3D visualization using advanced design software. You'll see exactly how your pool will look in your backyard before construction begins, including different angles, materials, and lighting options."
      }
    },
    {
      "@type": "Question",
      "name": "What areas do you serve for pool design?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We provide pool design services nationwide across the United States. Our design consultation and 3D visualization services can be delivered remotely, with optional on-site visits for luxury projects in select regions."
      }
    },
    {
      "@type": "Question",
      "name": "What makes your pool designs unique?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "With 47+ years combined experience (34 years in pools + 13 years in landscape design), we create pools that integrate seamlessly with your outdoor living space. We use AI-powered design tools, 3D visualization, and consider factors like local climate, soil conditions, and your lifestyle needs."
      }
    }
  ]
};