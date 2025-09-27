import Header from "@/components/header";
import Footer from "@/components/footer";
import PackageHub from "@/components/package-hub";
import { useSEO } from "@/hooks/use-seo";
import { seoData } from "@/utils/seo-data";
import StructuredData from "@/components/structured-data";

// FAQ schema data for packages page
const packagesFAQData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Are specialty engineering services included?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No; specialty engineering services are available as add-ons via licensed third-party engineers. Our base packages include standard documentation, but additional engineering like retaining walls, fire feature loads, or geotechnical reports are billed separately."
      }
    },
    {
      "@type": "Question",
      "name": "Do you guarantee permit approval?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We provide typical documentation needed for most residential pool permits, but some jurisdictions require extras. We cannot guarantee approval in all jurisdictions without additional services, as local requirements vary by city and county."
      }
    },
    {
      "@type": "Question",
      "name": "What if my county asks for more documentation?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We'll quote add-on services as needed. If your local jurisdiction requires additional engineering, studies, or documentation beyond our standard package, we'll coordinate with licensed professionals and provide quotes for these extra services."
      }
    }
  ]
};

export default function Packages() {
  // Apply SEO optimization for packages page
  useSEO(seoData.packages);

  return (
    <div className="min-h-screen bg-background">
      {/* FAQ Structured Data for SEO */}
      <StructuredData type="FAQ" data={packagesFAQData} />
      
      <Header />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
              Pool Design Packages
            </h1>
            <div id="packages-intro" className="max-w-4xl mx-auto">
              <p className="text-xl text-muted-foreground mb-4">
                Choose the perfect package for your pool project. From basic consultations to comprehensive design solutions, we have options for every budget and timeline.
              </p>
              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mt-6 text-left">
                <p className="text-muted-foreground">
                  <strong>Important:</strong> Packages provide standard documents needed in most jurisdictions. Some cities/counties require additional items billed separately.
                </p>
              </div>
            </div>
          </div>
          <PackageHub />
        </div>
      </main>
      <Footer />
    </div>
  );
}