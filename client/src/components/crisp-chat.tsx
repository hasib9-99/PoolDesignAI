import { useEffect } from 'react';

interface CrispChatProps {
  websiteId?: string;
}

declare global {
  interface Window {
    $crisp: any[];
    CRISP_WEBSITE_ID: string;
  }
}

export default function CrispChat({ websiteId }: CrispChatProps) {
  useEffect(() => {
    // Use provided websiteId or the actual Crisp Website ID
    const crispWebsiteId = websiteId || 'd4573884-3c5f-4fef-87bc-ebeb6c03e25f';
    
    // Check if Crisp is already loaded to avoid duplicate loading
    if (window.$crisp || document.querySelector('script[src="https://client.crisp.chat/l.js"]')) {
      return;
    }
    
    // Initialize Crisp with minimal configuration
    window.$crisp = [];
    window.CRISP_WEBSITE_ID = crispWebsiteId;
    
    // Create and load Crisp script
    const script = document.createElement('script');
    script.src = 'https://client.crisp.chat/l.js';
    script.async = true;
    document.head.appendChild(script);
    
    // Cleanup function
    return () => {
      // Remove script if component unmounts
      const crispScript = document.querySelector('script[src="https://client.crisp.chat/l.js"]');
      if (crispScript) {
        crispScript.remove();
      }
      // Clear Crisp variables
      if (window.$crisp) {
        (window as any).$crisp = undefined;
      }
      if (window.CRISP_WEBSITE_ID) {
        (window as any).CRISP_WEBSITE_ID = undefined;
      }
    };
  }, [websiteId]);

  return null; // This component doesn't render anything visible
}