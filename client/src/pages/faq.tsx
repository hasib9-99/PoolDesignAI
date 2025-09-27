import { useState } from 'react';
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, Phone, Calendar, Mail } from "lucide-react";
import { Link } from "wouter";
import { useSEO } from "@/hooks/use-seo";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSection {
  title: string;
  id: string;
  items: FAQItem[];
}

const faqSections: FAQSection[] = [
  {
    title: "Owner-Builder Permitting",
    id: "owner-builder",
    items: [
      {
        question: "Can I legally act as my own contractor to build a pool?",
        answer: "Yes. In Florida, Statute 489.103(7) allows homeowners to act as their own contractor for pools built for personal use, provided you supervise the work and hire licensed subcontractors for trades like electrical, gas, and plumbing."
      },
      {
        question: "Do I need to file an Owner-Builder affidavit?",
        answer: "Most counties require you to sign and submit an affidavit acknowledging you accept full responsibility as the contractor."
      },
      {
        question: "How long does county plan review take?",
        answer: "Typical reviews take 5–15 business days; rechecks on corrections take 2–5 business days."
      }
    ]
  },
  {
    title: "Engineering & Plans",
    id: "engineering",
    items: [
      {
        question: "Do I need signed/sealed engineering drawings?",
        answer: "Yes. Most jurisdictions require sealed structural drawings, sections, schedules, and specifications."
      },
      {
        question: "What is a TDH worksheet and why is it required?",
        answer: "A Total Dynamic Head (TDH) worksheet shows hydraulic calculations proving the pool equipment is sized correctly and meets efficiency codes."
      },
      {
        question: "What supporting documents are often missed?",
        answer: "Commonly missed: VGB drain compliance, energy efficiency form, barrier/fence details, and correctly scaled plot plans."
      }
    ]
  },
  {
    title: "Costs & Timelines",
    id: "costs",
    items: [
      {
        question: "How much does a permitting package cost?",
        answer: "Our typical permit coordination package is $895, which includes engineering drawings, TDH, barrier details, and submittal coordination."
      },
      {
        question: "What other fees should I expect?",
        answer: "Counties charge their own plan review and inspection fees, plus trade fees for electrical, gas, or screen enclosures."
      },
      {
        question: "How long from submission to permit approval?",
        answer: "On average, 2–4 weeks depending on county workload, completeness of submittal, and corrections required."
      }
    ]
  },
  {
    title: "DIY vs Hiring",
    id: "diy-vs-builder",
    items: [
      {
        question: "What's the difference between hiring a pool builder and acting as Owner-Builder?",
        answer: "Hiring a builder means they serve as contractor and assume liability. Acting as Owner-Builder saves money but puts responsibility for permits, compliance, and scheduling on you."
      },
      {
        question: "Can you just prepare drawings and I handle the rest?",
        answer: "Yes. We can provide engineered drawings only, or add permit coordination if you want help with submittals."
      },
      {
        question: "Do you coordinate resubmittals if the county rejects a sheet?",
        answer: "Yes. We handle plan reviewer comments, cloud revisions, and resubmittals until approval."
      }
    ]
  },
  {
    title: "Technical Issues",
    id: "technical",
    items: [
      {
        question: "What if my PDF file is over 10MB?",
        answer: "Counties often reject oversized files. We compress PDFs, split large sets, and ensure they meet digital submittal requirements."
      },
      {
        question: "How do I submit via Accela or Fast Track?",
        answer: "We guide you step-by-step: account creation, selecting the correct application type, uploading files, and clicking Submission Complete to start pre-verification."
      },
      {
        question: "Do I need a fence or alarm around my pool?",
        answer: "Yes. Most counties require at least one barrier such as a fence, door alarms, or safety covers. Requirements vary by county, but we include barrier details with every plan set."
      }
    ]
  }
];

export default function FAQ() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  
  useSEO({
    title: "Pool Design Consultant FAQs | Owner-Builder & DIY Pool Permit Help",
    description: "Answers to common questions about pool design, owner-builder permits, engineering plans, DIY pools, costs, timelines, and safety requirements.",
    canonical: "/faq"
  });

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6" data-testid="text-faq-title">
            Frequently Asked Questions
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90" data-testid="text-faq-subtitle">
            Owner-Builder & DIY pool permitting answers—engineering, TDH, VGB/barrier, portals (Accela/Fast Track), costs, timelines, and more.
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents */}
          <aside className="lg:col-span-1">
            <Card className="sticky top-6" data-testid="card-faq-toc">
              <CardHeader>
                <CardTitle className="text-lg">On this page</CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2">
                  {faqSections.map((section) => (
                    <Button
                      key={section.id}
                      variant="ghost"
                      className="w-full justify-start text-left h-auto p-3"
                      onClick={() => scrollToSection(section.id)}
                      data-testid={`button-toc-${section.id}`}
                    >
                      {section.title}
                    </Button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </aside>

          {/* FAQ Content */}
          <div className="lg:col-span-3 space-y-8">
            {faqSections.map((section) => (
              <Card key={section.id} id={section.id} data-testid={`section-${section.id}`}>
                <CardHeader>
                  <CardTitle className="text-2xl text-primary">{section.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {section.items.map((item, index) => (
                    <Collapsible
                      key={index}
                      open={openSections[`${section.id}-${index}`]}
                      onOpenChange={() => toggleSection(`${section.id}-${index}`)}
                    >
                      <CollapsibleTrigger 
                        className="w-full text-left"
                        data-testid={`button-question-${section.id}-${index}`}
                      >
                        <div className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 transition-colors rounded-lg border">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-orange-500 rounded-full flex-shrink-0"></div>
                            <h3 className="font-semibold text-gray-900 pr-4">{item.question}</h3>
                          </div>
                          {openSections[`${section.id}-${index}`] ? (
                            <ChevronDown className="w-5 h-5 text-gray-600 flex-shrink-0" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-600 flex-shrink-0" />
                          )}
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div 
                          className="p-4 text-gray-700 leading-relaxed"
                          data-testid={`text-answer-${section.id}-${index}`}
                        >
                          {item.answer}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </CardContent>
              </Card>
            ))}

            {/* CTA Section */}
            <Card className="bg-gradient-to-r from-primary/10 to-orange-100 border-primary/20">
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-bold text-primary mb-4" data-testid="text-cta-title">
                  Need permitting help now?
                </h2>
                <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                  We prepare code-correct drawings, TDH, VGB/barrier details, and coordinate portal submissions.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button asChild className="bg-primary hover:bg-primary/90" data-testid="button-get-help">
                    <Link href="/contact">
                      <Mail className="w-4 h-4 mr-2" />
                      Get Permitting Help
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    asChild
                    data-testid="button-book-call"
                  >
                    <a 
                      href="https://calendly.com/kayne-pooldesignconsultant/30min" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Book a 30-min Call
                    </a>
                  </Button>
                  <Button 
                    variant="outline" 
                    asChild
                    data-testid="button-email-us"
                  >
                    <a href="mailto:kayne@pooldesignconsultant.com">
                      <Phone className="w-4 h-4 mr-2" />
                      Email Us
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}