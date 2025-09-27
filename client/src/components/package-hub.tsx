import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Palette, Crown, Settings, Home, Bot, FileCheck, Shield, Hammer, ArrowRight } from "lucide-react";
import PaymentCheckout from "./payment-checkout";
import { useToast } from "@/hooks/use-toast";

export default function PackageHub() {
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [quizResult, setQuizResult] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<typeof packages[0] | null>(null);
  const { toast } = useToast();

  const quizQuestions = [
    {
      question: "What's your primary goal for your pool project?",
      options: [
        { text: "Get detailed 3D visualizations and plans", value: "premium" },
        { text: "Engineering stamp for existing plans", value: "engineering" },
        { text: "Luxury high-end custom design", value: "luxury" },
        { text: "Handle all permit paperwork", value: "permits" },
        { text: "Build it myself with full support", value: "diy" }
      ]
    },
    {
      question: "What's your approximate budget range?",
      options: [
        { text: "Under $500", value: "low" },
        { text: "$500 - $700", value: "medium" },
        { text: "$700 - $1,000", value: "high" },
        { text: "$1,000+", value: "premium" }
      ]
    },
    {
      question: "Do you already have pool design plans?",
      options: [
        { text: "No, I need complete design from scratch", value: "no" },
        { text: "Yes, but need engineering review", value: "yes" },
        { text: "Yes, just need permits handled", value: "permits" }
      ]
    }
  ];

  const handleQuizAnswer = (value: string) => {
    const newAnswers = [...answers, value];
    setAnswers(newAnswers);

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate result based on answers
      const result = calculateQuizResult(newAnswers);
      setQuizResult(result);
    }
  };

  const calculateQuizResult = (userAnswers: string[]) => {
    // Simple logic to recommend package based on answers
    if (userAnswers.includes("diy") || userAnswers.includes("premium")) {
      return "DIY Pools and Build Your Own Pool Package";
    } else if (userAnswers.includes("engineering") || userAnswers.includes("yes")) {
      return "Standard Structural Engineering Stamp Package";
    } else if (userAnswers.includes("luxury") || userAnswers.includes("high")) {
      return "Luxury Resort Package";
    } else if (userAnswers.includes("permits")) {
      return "Permitting Services";
    } else {
      return "Premium 3D Design Package";
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setQuizResult(null);
    setShowQuiz(false);
  };
  const packages = [
    {
      icon: <Palette className="w-10 h-10 text-orange-500" />,
      title: "Premium 3D Design Package",
      price: "$495",
      description: "For clients who want detailed visuals and a complete design solution",
      features: [
        "High-Resolution 3D Renderings (Multiple views, including night lighting)",
        "Virtual Walkthrough Video – Experience the pool design before building",
        "Landscape Integration – Hardscaping, plants, patios, and outdoor features",
        "2–3 Revisions Included",
        "Basic Construction Plans (Dimensions and layouts for builders)"
      ],
      buttonText: "Select Package",
      popular: false,
      idealFor: "Custom pools with features like waterfalls, spas, and outdoor kitchens"
    },
    {
      icon: <Shield className="w-10 h-10 text-blue-600" />,
      title: "Standard Structural Engineering Stamp Package",
      price: "$695",
      description: "Engineering review and stamped plans for permit submission",
      features: [
        "Review of client-provided pool plans",
        "TDH calculations and analysis",
        "Standard Engineering stamp (digital or physical) for permit submission",
        "Compliance verification with Florida Building Code (FBC) and local regulations"
      ],
      buttonText: "Select Package",
      popular: false,
      idealFor: "Contractors or designers who already have pool designs but need stamped plans"
    },
    {
      icon: <Crown className="w-10 h-10 text-orange-500" />,
      title: "Luxury Resort Package",
      price: "$995",
      description: "Tailored for large, high-budget projects with complex features",
      features: [
        "Ultra-Realistic 3D Renderings – Lighting effects, textures, and reflections",
        "360° Interactive Views and Virtual Reality – Walk through the design in VR",
        "Custom Features – Infinity edges, grottos, swim-up bars, and fire features",
        "Fully Engineered Construction Plans – Plumbing, electrical, and structural layouts",
        "Permit-Ready Drawings – Detailed plans ready for approvals",
        "Unlimited Revisions – Ensure the design is flawless"
      ],
      buttonText: "Select Package",
      popular: false,
      idealFor: "Luxury homes, resorts, and clients looking for next-level pool designs"
    },
    {
      icon: <FileCheck className="w-10 h-10 text-blue-600" />,
      title: "Permitting Services",
      price: "$895",
      description: "We handle the paperwork so you can focus on your dream pool (Florida only)",
      features: [
        "Permit Application Preparation – All necessary forms and documents completed",
        "Submittal to Local Authorities – Streamlined submission process to avoid delays",
        "Follow-Ups and Revisions – Address comments or changes requested by permit reviewers",
        "Engineering Stamps and Approvals – Professional endorsements to meet local regulations",
        "Note: Customer may need to provide topographical survey and/or drainage plans per city or county requirements",
        "Note: All permits are processed through online portals. Occasionally, the city or county may require the owner to visit the department to sign an owner builder statement in person"
      ],
      buttonText: "Select Package",
      popular: false,
      idealFor: "Simplify the approval process for any pool project"
    },
    {
      icon: <Hammer className="w-10 h-10 text-orange-500" />,
      title: "DIY Pools and Build Your Own Pool Package",
      price: "$1,595",
      description: "For homeowners who build themselves",
      features: [
        "Ultra-Realistic 3D Renderings – Lighting effects, textures, and reflections",
        "360° Interactive Views and Virtual Reality – Walk through the design in VR",
        "Custom Features – Infinity edges, grottos, swim-up bars, and fire features",
        "Fully Engineered Construction Plans – Plumbing, electrical, and structural layouts",
        "Permit-Ready Drawings – Detailed plans ready for approvals",
        "Unlimited Revisions – Ensure the design is flawless",
        "Material and Equipment List – Detailed shopping guide",
        "Subcontractor referral list with 3-5 professionals",
        "Pool Cost: Cost breakdown of project",
        "Consultant Services: Phone, Text, Email support, Zoom Meetings"
      ],
      buttonText: "Select Package",
      popular: true,
      idealFor: "DIY enthusiasts or builders who need a detailed plan but no additional services"
    }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="packages" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">Choose Your Design Package</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From basic consultations to complete design and build packages, we have the right solution for your project.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
          {packages.map((pkg, index) => (
            <Card 
              key={index}
              className={`relative text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 ${
                pkg.popular 
                  ? 'bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-400' 
                  : 'hover:border-primary'
              }`}
              data-testid={`package-card-${index}`}
            >
              {pkg.popular && (
                <Badge className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                  Most Popular
                </Badge>
              )}
              <CardHeader>
                <div className="flex justify-center mb-4">
                  {pkg.icon}
                </div>
                <CardTitle className="text-xl font-bold mb-4 text-foreground">{pkg.title}</CardTitle>
                <div className="text-3xl font-bold text-orange-500 mb-2">{pkg.price}</div>
                <Badge variant="outline" className="text-xs bg-yellow-50 border-yellow-300 text-yellow-700 mb-4">
                  Jurisdictional extras not included
                </Badge>
                <p className="text-muted-foreground mb-2">{pkg.description}</p>
                {pkg.idealFor && (
                  <p className="text-sm text-blue-600 font-medium">Ideal For: {pkg.idealFor}</p>
                )}
              </CardHeader>
              <CardContent>
                <ul className="text-left space-y-3 mb-8">
                  {pkg.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button 
                  onClick={() => {
                    setSelectedPackage(pkg);
                    setShowPayment(true);
                  }}
                  className={`w-full py-3 px-6 rounded-lg font-bold transition-colors ${
                    pkg.popular 
                      ? 'bg-orange-500 text-white hover:bg-orange-600' 
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  }`}
                  data-testid={`button-select-package-${index}`}
                >
                  {pkg.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Quiz CTA */}
        <div id="ai-quiz" className="gradient-primary text-white rounded-xl p-8 text-center max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold mb-4">Not Sure Which Package is Right for You?</h3>
          <p className="text-xl mb-6 opacity-90">Take our AI-powered quiz to get personalized recommendations based on your needs and budget.</p>
          <Button 
            onClick={() => setShowQuiz(true)}
            className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors"
            data-testid="button-start-ai-quiz"
          >
            <Bot className="mr-2 h-5 w-5" />
            Start AI Quiz (2 minutes)
          </Button>
        </div>
      </div>

      {/* AI Quiz Modal */}
      <Dialog open={showQuiz} onOpenChange={setShowQuiz}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center text-2xl">
              <Bot className="mr-2 h-6 w-6 text-blue-600" />
              AI Package Recommendation Quiz
            </DialogTitle>
          </DialogHeader>
          
          <div className="p-6">
            {!quizResult ? (
              <div>
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-muted-foreground">
                      Question {currentQuestion + 1} of {quizQuestions.length}
                    </span>
                    <div className="bg-gray-200 rounded-full h-2 w-32">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-6">{quizQuestions[currentQuestion].question}</h3>
                </div>
                
                <div className="space-y-3">
                  {quizQuestions[currentQuestion].options.map((option, index) => (
                    <Button
                      key={index}
                      onClick={() => handleQuizAnswer(option.value)}
                      variant="outline"
                      className="w-full p-4 text-left hover:bg-blue-50 hover:border-blue-500 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span>{option.text}</span>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bot className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Perfect Match Found!</h3>
                  <p className="text-muted-foreground mb-6">
                    Based on your responses, we recommend:
                  </p>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-orange-50 p-6 rounded-lg mb-6">
                  <h4 className="text-xl font-bold text-blue-600 mb-2">{quizResult}</h4>
                  <p className="text-sm text-muted-foreground">
                    This package best matches your needs and budget requirements.
                  </p>
                </div>
                
                <div className="flex space-x-4">
                  <Button onClick={resetQuiz} variant="outline" className="flex-1">
                    Take Quiz Again
                  </Button>
                  <Button 
                    onClick={() => {
                      const recommendedPackage = packages.find(pkg => pkg.title === quizResult);
                      if (recommendedPackage) {
                        setSelectedPackage(recommendedPackage);
                        setShowPayment(true);
                      }
                      resetQuiz();
                    }} 
                    className="flex-1 gradient-primary text-white"
                  >
                    Select Recommended Package
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Package Payment Modal */}
      {showPayment && selectedPackage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b">
              <h2 className="text-xl font-bold text-center">{selectedPackage.title}</h2>
              <p className="text-center text-gray-600 mt-2">{selectedPackage.description}</p>
              <div className="text-center mt-2">
                <span className="text-2xl font-bold text-orange-500">{selectedPackage.price}</span>
              </div>
            </div>
            <div className="p-6">
              <PaymentCheckout
                amount={parseInt(selectedPackage.price.replace(/[$,]/g, ''))}
                description={selectedPackage.title}
                onSuccess={() => {
                  setShowPayment(false);
                  setSelectedPackage(null);
                  toast({
                    title: "Payment Successful!",
                    description: "We'll contact you within 24 hours to begin your project.",
                  });
                }}
                onCancel={() => {
                  setShowPayment(false);
                  setSelectedPackage(null);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Owner-Builder Pool Packages - Legal Disclaimers and Terms */}
      <div className="max-w-6xl mx-auto mt-20 pt-16 border-t border-gray-200">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Owner-Builder Pool Packages</h2>
        
        {/* What's Included */}
        <div id="whats-included" className="mb-12">
          <h3 className="text-2xl font-bold mb-6 text-foreground">What's Included</h3>
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                Full pool design drawings
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                Standard structural, plumbing, and electrical layouts
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                Basic energy compliance forms
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                Up to 2 revisions to ensure accuracy
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                Permit-ready digital plan set (PDF)
              </li>
            </ul>
          </div>
        </div>

        {/* Important Notes & Disclaimers */}
        <div id="disclaimers" className="mb-12">
          <h3 className="text-2xl font-bold mb-6 text-foreground">Important Notes & Disclaimers</h3>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="space-y-4 text-muted-foreground">
              <div>
                <h4 className="font-bold text-foreground mb-2">Jurisdictional Requirements Vary:</h4>
                <p>Cities and counties may request additional engineering or documentation beyond the standard package. These items are not included in the base package and may require additional fees.</p>
              </div>
              <div>
                <h4 className="font-bold text-foreground mb-2">Exclusions:</h4>
                <p>Packages do not include geotechnical (soil) reports; specialty structural engineering (retaining walls, stem walls, fire feature loads); advanced MEP schematics; plumbing isometric drawings; or third-party reports unless explicitly listed. Customer may need to provide topographical survey, as some counties and cities are starting to require this.</p>
              </div>
              <div>
                <h4 className="font-bold text-foreground mb-2">Engineering Services:</h4>
                <p>Pool Design Consultant is a design & planning consultancy. All structural/MEP engineering is performed by licensed third-party engineers. We coordinate these services, but responsibility for engineering lies with the licensed professional.</p>
              </div>
              <div>
                <h4 className="font-bold text-foreground mb-2">Permitting Disclaimer:</h4>
                <p>Our packages provide the documentation commonly required for most residential pool permits. We do not guarantee permit approval in all jurisdictions without additional services.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Terms & Conditions */}
        <div id="terms" className="mb-12">
          <h3 className="text-2xl font-bold mb-6 text-foreground">Terms & Conditions (applies to all packages)</h3>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <p className="text-muted-foreground mb-4">By purchasing, the client acknowledges that:</p>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start">
                <span className="text-blue-500 mr-3 mt-1">•</span>
                Additional fees may apply if the local jurisdiction requires extra engineering, studies, or plan modifications not included in the standard package.
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-3 mt-1">•</span>
                Final permit approval is at the discretion of the city/county building department.
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-3 mt-1">•</span>
                Pool Design Consultant does not act as the Engineer of Record; we facilitate and coordinate third-party licensed engineering.
              </li>
            </ul>
          </div>
        </div>

        {/* Comparison Table */}
        <div id="comparison" className="mb-12">
          <h3 className="text-2xl font-bold mb-6 text-foreground">Comparison Table</h3>
          <div className="overflow-x-auto w-full">
            <table className="min-w-[720px] md:min-w-0 md:w-full border-collapse bg-white rounded-lg shadow-sm border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-4 border-b border-gray-200 font-bold text-foreground whitespace-nowrap">Feature / Service</th>
                  <th className="text-center p-4 border-b border-gray-200 font-bold text-foreground whitespace-nowrap">Base Package</th>
                  <th className="text-center p-4 border-b border-gray-200 font-bold text-foreground whitespace-nowrap">Add-On / Upgrade</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="p-4 text-muted-foreground">Standard pool design & layout</td>
                  <td className="p-4 text-center text-green-600 font-bold">✔</td>
                  <td className="p-4 text-center text-gray-400">–</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-4 text-muted-foreground">Plumbing & electrical layout</td>
                  <td className="p-4 text-center text-green-600 font-bold">✔</td>
                  <td className="p-4 text-center text-gray-400">–</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-4 text-muted-foreground">Energy compliance worksheet</td>
                  <td className="p-4 text-center text-green-600 font-bold">✔</td>
                  <td className="p-4 text-center text-gray-400">–</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-4 text-muted-foreground">Unlimited revisions</td>
                  <td className="p-4 text-center text-gray-400">–</td>
                  <td className="p-4 text-center text-orange-600 font-bold">✔</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-4 text-muted-foreground">Specialty structural (retaining wall, stem wall, fire features)</td>
                  <td className="p-4 text-center text-gray-400">–</td>
                  <td className="p-4 text-center text-orange-600 font-bold">✔</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-4 text-muted-foreground">Soil/geotechnical reports</td>
                  <td className="p-4 text-center text-gray-400">–</td>
                  <td className="p-4 text-center text-orange-600 font-bold">✔</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-4 text-muted-foreground">Surge tank / advanced hydraulics</td>
                  <td className="p-4 text-center text-gray-400">–</td>
                  <td className="p-4 text-center text-orange-600 font-bold">✔</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-4 text-muted-foreground">Fire feature load engineering</td>
                  <td className="p-4 text-center text-gray-400">–</td>
                  <td className="p-4 text-center text-orange-600 font-bold">✔</td>
                </tr>
                <tr>
                  <td className="p-4 text-muted-foreground">Additional county-specific forms</td>
                  <td className="p-4 text-center text-gray-400">–</td>
                  <td className="p-4 text-center text-orange-600 font-bold">✔</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="text-center space-y-4 md:space-y-0 md:space-x-6 md:flex md:justify-center">
          <Button 
            onClick={() => scrollToSection('contact')}
            className="bg-orange-500 text-white px-8 py-3 rounded-full font-bold hover:bg-orange-600 transition-colors"
            data-testid="button-get-quote-extras"
          >
            Get a Quote for Extras
          </Button>
          <Button 
            onClick={() => scrollToSection('whats-included')}
            variant="outline"
            className="border-orange-500 text-orange-500 px-8 py-3 rounded-full font-bold hover:bg-orange-50 transition-colors"
            data-testid="button-see-whats-included"
          >
            See What's Included
          </Button>
        </div>
      </div>
    </section>
  );
}
