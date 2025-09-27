import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
}

// Get absolute URL for canonical and OG tags
function getAbsoluteUrl(path: string): string {
  const siteUrl = import.meta.env.VITE_SITE_URL || 
    (import.meta.env.MODE === 'production' 
      ? 'https://pooldesignconsultant.com' 
      : 'http://localhost:5000');
  return path.startsWith('http') ? path : `${siteUrl}${path}`;
}

export function useSEO({ title, description, keywords, canonical, ogImage, ogType }: SEOProps) {
  useEffect(() => {
    // Update title
    document.title = title;

    // Helper function to update or create meta tags
    const updateMetaTag = (property: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${property}"]`);
      
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, property);
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };

    // Update meta description
    updateMetaTag('description', description);

    // Update keywords if provided
    if (keywords) {
      updateMetaTag('keywords', keywords);
    }

    // Update Open Graph tags with absolute URLs
    const currentUrl = getAbsoluteUrl(window.location.pathname);
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:url', currentUrl, true);
    updateMetaTag('og:site_name', 'Pool Design Consultant', true);
    updateMetaTag('og:type', ogType || 'website', true);
    
    if (ogImage) {
      const absoluteOgImage = getAbsoluteUrl(ogImage);
      updateMetaTag('og:image', absoluteOgImage, true);
      updateMetaTag('og:image:width', '1200', true);
      updateMetaTag('og:image:height', '630', true);
    }

    // Update canonical URL with absolute URL
    const absoluteCanonical = canonical ? getAbsoluteUrl(canonical) : currentUrl;
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', absoluteCanonical);

    // Twitter Card tags with absolute URLs
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    
    if (ogImage) {
      const absoluteOgImage = getAbsoluteUrl(ogImage);
      updateMetaTag('twitter:image', absoluteOgImage);
    }
    
  }, [title, description, keywords, canonical, ogImage, ogType]);
}