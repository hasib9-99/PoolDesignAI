import Header from "@/components/header";
import Footer from "@/components/footer";
import IntakeForm from "@/components/intake-form";
import { useSEO } from "@/hooks/use-seo";

const intakeSEOData = {
  title: "Pool Design Intake Form - Submit Your Project Details | Pool Design Consultant",
  description: "Submit your pool design project details, site plans, and photos. Get professional pool design concepts in 2-4 business days. Upload survey, photos, and project specifications.",
  keywords: "pool design intake, project submission, pool plans, site survey, design consultation"
};

export default function IntakePage() {
  // Apply SEO optimization for intake page
  useSEO(intakeSEOData);

  return (
    <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="pt-20 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Pool Design Intake Form
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Submit your project details and we'll create professional pool design concepts in 2-4 business days. 
                Please provide complete information for the most accurate designs.
              </p>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>What to expect:</strong> After submission, you'll receive a confirmation email with your ticket number. 
                  Our team will review your materials and deliver concepts within 2-4 business days.
                </p>
              </div>
            </div>

            {/* Progress and Form */}
            <IntakeForm />
          </div>
        </main>

      <Footer />
    </div>
  );
}