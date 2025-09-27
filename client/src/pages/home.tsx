import Header from "@/components/header";
import Hero from "@/components/hero";
import TrustBar from "@/components/trust-bar";
import PackageHub from "@/components/package-hub";
import ServicesGrid from "@/components/services-grid";
import Portfolio from "@/components/portfolio";
import CostCalculator from "@/components/cost-calculator";
import Testimonials from "@/components/testimonials";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";
import { useSEO } from "@/hooks/use-seo";
import { seoData } from "@/utils/seo-data";
import StructuredData, { poolBusinessData, poolFAQData } from "@/components/structured-data";

export default function Home() {
  // Apply SEO optimization for homepage
  useSEO(seoData.home);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Structured Data for SEO */}
      <StructuredData type="LocalBusiness" data={poolBusinessData} />
      <StructuredData type="FAQ" data={poolFAQData} />
      
      <Header />
      <Hero />
      <TrustBar />
      <PackageHub />
      <ServicesGrid />
      <Portfolio />
      <CostCalculator />
      <Testimonials />
      <ContactSection />
      <Footer />
    </div>
  );
}
