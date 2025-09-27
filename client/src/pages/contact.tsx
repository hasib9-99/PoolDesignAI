import { useEffect } from "react";
import { useLocation } from "wouter";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ContactSection from "@/components/contact-section";
import { useSEO } from "@/hooks/use-seo";
import { seoData } from "@/utils/seo-data";

export default function Contact() {
  const [, setLocation] = useLocation();

  // Apply SEO optimization for contact page
  useSEO(seoData.contact);

  useEffect(() => {
    // Parse URL parameters for design details
    const urlParams = new URLSearchParams(window.location.search);
    const isFromDesign = urlParams.get('design');
    
    if (isFromDesign) {
      // Scroll to contact form
      setTimeout(() => {
        const contactElement = document.getElementById('contact');
        if (contactElement) {
          contactElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">Contact Us</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Ready to start your pool project? Get in touch with our experts for a free consultation.
            </p>
          </div>
        </div>
        
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
}