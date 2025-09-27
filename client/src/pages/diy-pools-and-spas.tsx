import { useSEO } from "@/hooks/use-seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Link } from "wouter";
import { 
  Wrench, 
  Calculator, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  Users, 
  Phone,
  Download,
  Waves,
  ThermometerSun,
  Shield,
  BookOpen,
  HelpCircle
} from "lucide-react";
import { RelatedServices } from "@/components/internal-linking";

export default function DIYPoolsAndSpas() {
  useSEO({
    title: "DIY Pools and Spas | Owner-Builder Pool Construction Guide & Expert Support",
    description: "Complete DIY pool and spa construction guide for owner-builders. Expert consultation, detailed plans, permit assistance, and step-by-step construction support from experienced pool designer Kayne Marzetti.",
    keywords: "DIY pool construction, owner builder pools, DIY spa installation, pool construction guide, self build pools, DIY pool plans, pool building permits, owner builder support, DIY pool design",
    canonical: "/diy-pools-and-spas",
    ogImage: "/attached_assets/stock_images/swimming_pool_constr_79599bd9.jpg",
    ogType: "website"
  });

  const constructionSteps = [
    {
      step: 1,
      title: "Site Planning & Permits",
      description: "Layout planning, utility marking, permit applications, and neighbor notifications",
      duration: "2-4 weeks",
      difficulty: "Moderate"
    },
    {
      step: 2,
      title: "Excavation & Access",
      description: "Professional excavation, soil removal, and equipment access preparation",
      duration: "3-5 days",
      difficulty: "Professional Required"
    },
    {
      step: 3,
      title: "Plumbing & Electrical Rough-In",
      description: "Install main drains, skimmers, returns, and electrical conduits",
      duration: "2-3 days",
      difficulty: "Experienced DIY"
    },
    {
      step: 4,
      title: "Steel Reinforcement",
      description: "Rebar installation following engineering specifications",
      duration: "1-2 days",
      difficulty: "Moderate"
    },
    {
      step: 5,
      title: "Gunite/Shotcrete Application",
      description: "Professional concrete application for shell structure",
      duration: "1 day",
      difficulty: "Professional Required"
    },
    {
      step: 6,
      title: "Interior Finish & Tile",
      description: "Plaster, tile work, and waterline finishing",
      duration: "1-2 weeks",
      difficulty: "Experienced DIY"
    },
    {
      step: 7,
      title: "Equipment Installation",
      description: "Pumps, filters, heaters, and automation systems",
      duration: "2-3 days",
      difficulty: "Moderate"
    },
    {
      step: 8,
      title: "Final Inspection & Startup",
      description: "Water filling, chemical balancing, and system testing",
      duration: "3-5 days",
      difficulty: "Easy"
    }
  ];

  const costBreakdown = [
    { category: "Excavation", contractor: "$8,000-$15,000", diy: "$3,000-$5,000 (equipment rental)", savings: "60-70%" },
    { category: "Steel & Concrete", contractor: "$12,000-$20,000", diy: "$6,000-$10,000", savings: "50%" },
    { category: "Plumbing", contractor: "$3,000-$6,000", diy: "$1,500-$3,000", savings: "50%" },
    { category: "Electrical", contractor: "$2,500-$4,000", diy: "$1,000-$2,000", savings: "50-60%" },
    { category: "Interior Finish", contractor: "$8,000-$15,000", diy: "$4,000-$8,000", savings: "50%" },
    { category: "Equipment", contractor: "$8,000-$12,000", diy: "$6,000-$10,000", savings: "20-25%" },
    { category: "Decking", contractor: "$6,000-$12,000", diy: "$2,500-$6,000", savings: "50-60%" }
  ];

  const requiredTools = [
    "Concrete mixer or pump access",
    "Rebar cutting and bending tools",
    "PVC pipe cutting and joining tools",
    "Tile wet saw and notched trowels",
    "Level, measuring tools, and string lines",
    "Safety equipment (hard hats, gloves, boots)",
    "Excavation equipment rental",
    "Compaction and grading tools"
  ];

  const permitRequirements = [
    "Building permit for pool construction",
    "Electrical permit for pool equipment",
    "Plumbing permit for water connections",
    "Fence permit for safety barriers",
    "Setback compliance verification",
    "Utility location and clearance",
    "Soil engineering report (if required)",
    "Homeowner's insurance notification"
  ];

  const safetyConsiderations = [
    {
      title: "Structural Safety",
      items: ["Professional engineering review", "Proper rebar placement", "Concrete thickness verification", "Soil stability assessment"]
    },
    {
      title: "Electrical Safety",
      items: ["GFCI protection on all circuits", "Proper grounding and bonding", "Licensed electrician for connections", "Code-compliant equipment placement"]
    },
    {
      title: "Construction Safety",
      items: ["Fall protection systems", "Excavation shoring if needed", "Equipment operation training", "First aid and emergency planning"]
    },
    {
      title: "Water Safety Features",
      items: ["Safety barriers and gates", "Pool alarms and covers", "Anti-entrapment devices", "Emergency equipment accessibility"]
    }
  ];

  const faqs = [
    {
      question: "Can I legally build my own pool?",
      answer: "Yes, in most areas homeowners can build their own pools as owner-builders. However, you'll need proper permits, inspections, and must follow local building codes. Some areas require licensed professionals for electrical and plumbing work."
    },
    {
      question: "How much can I save building my own pool?",
      answer: "Owner-builders typically save 30-50% on total project costs, ranging from $15,000-$40,000 depending on pool size and features. Savings come primarily from eliminating contractor markup and doing finish work yourself."
    },
    {
      question: "What parts require professional contractors?",
      answer: "Most areas require licensed contractors for: excavation (unless you have equipment), electrical connections, plumbing connections to main lines, and often gunite/shotcrete application. Check local codes for specific requirements."
    },
    {
      question: "How long does a DIY pool project take?",
      answer: "DIY pool projects typically take 3-6 months from start to finish, depending on your schedule, weather, and complexity. Weekend and evening work extends the timeline but allows you to maintain other commitments."
    },
    {
      question: "What's the most challenging part for DIY builders?",
      answer: "Most DIY builders find plumbing layout and tile work the most challenging. These require precision and experience. Consider professional consultation for these phases even if doing other work yourself."
    },
    {
      question: "Do I need special insurance for DIY construction?",
      answer: "Yes, notify your homeowner's insurance about the project. Consider additional liability coverage during construction. Some insurers require professional work for coverage to remain valid."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 text-blue-600 bg-blue-100">
              <Wrench className="w-4 h-4 mr-2" />
              Owner-Builder Guide
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-800">
              DIY Pools & Spas
              <span className="block text-2xl md:text-3xl text-blue-600 mt-2">Complete Owner-Builder Guide</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Build your dream pool yourself with expert guidance from pool designer Kayne Marzetti. 
              Comprehensive plans, permit assistance, and step-by-step construction support for owner-builders.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white" data-testid="button-diy-consultation">
                  <Phone className="w-5 h-5 mr-2" />
                  Get DIY Consultation
                </Button>
              </Link>
              <Link href="/ai-design-tool">
                <Button variant="outline" size="lg" data-testid="button-design-tool">
                  <Calculator className="w-5 h-5 mr-2" />
                  Pool Cost Calculator
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Cost Savings Overview */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">Owner-Builder Cost Savings</h2>
            <p className="text-lg text-gray-600">See how much you can save by building your own pool</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <Card className="text-center">
              <CardHeader>
                <DollarSign className="w-12 h-12 mx-auto text-green-600 mb-2" />
                <CardTitle className="text-2xl text-green-600">$20,000 - $50,000</CardTitle>
                <p className="text-gray-600">Average Savings</p>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">Owner-builders typically save 30-50% on total project costs through eliminated contractor markup and self-performed work.</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Clock className="w-12 h-12 mx-auto text-blue-600 mb-2" />
                <CardTitle className="text-2xl text-blue-600">3-6 Months</CardTitle>
                <p className="text-gray-600">Project Timeline</p>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">DIY projects take longer than contractor builds but allow flexible scheduling around your other commitments.</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="w-12 h-12 mx-auto text-orange-600 mb-2" />
                <CardTitle className="text-2xl text-orange-600">Expert Support</CardTitle>
                <p className="text-gray-600">Professional Guidance</p>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">Get professional consultation, detailed plans, and ongoing support throughout your DIY pool construction project.</p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Cost Breakdown Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Detailed Cost Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-semibold">Category</th>
                      <th className="text-right p-3 font-semibold">Contractor Cost</th>
                      <th className="text-right p-3 font-semibold">DIY Cost</th>
                      <th className="text-right p-3 font-semibold text-green-600">Savings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {costBreakdown.map((item, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-medium">{item.category}</td>
                        <td className="p-3 text-right">{item.contractor}</td>
                        <td className="p-3 text-right">{item.diy}</td>
                        <td className="p-3 text-right text-green-600 font-semibold">{item.savings}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Step-by-Step Construction Guide */}
      <section className="py-16 px-4 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">Step-by-Step Construction Process</h2>
            <p className="text-lg text-gray-600">Professional guidance for each phase of your DIY pool project</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {constructionSteps.map((step) => (
              <Card key={step.step} className="relative overflow-hidden">
                <div className="absolute top-4 left-4 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  {step.step}
                </div>
                <CardHeader className="pt-20">
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                  <div className="flex gap-2 text-sm">
                    <Badge variant="outline">{step.duration}</Badge>
                    <Badge variant={step.difficulty === 'Professional Required' ? 'destructive' : step.difficulty === 'Experienced DIY' ? 'default' : 'secondary'}>
                      {step.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tools and Materials */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Wrench className="w-6 h-6 mr-3 text-blue-600" />
                  Required Tools & Equipment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {requiredTools.map((tool, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 mr-3 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{tool}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <FileText className="w-6 h-6 mr-3 text-blue-600" />
                  Permits & Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {permitRequirements.map((permit, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 mr-3 text-orange-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{permit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Safety Considerations */}
      <section className="py-16 px-4 bg-gradient-to-b from-orange-50 to-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              <Shield className="w-10 h-10 inline mr-3 text-orange-600" />
              Safety First: Critical Considerations
            </h2>
            <p className="text-lg text-gray-600">Comprehensive safety guidelines for DIY pool construction</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {safetyConsiderations.map((category, index) => (
              <Card key={index} className="border-orange-200">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <CheckCircle className="w-4 h-4 mr-2 text-orange-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Spa Integration */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              <ThermometerSun className="w-10 h-10 inline mr-3 text-blue-600" />
              DIY Spa Integration
            </h2>
            <p className="text-lg text-gray-600">Add a spa to your DIY pool project for the ultimate backyard retreat</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Attached Spa Design</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Share equipment and filtration with your pool for cost efficiency and easier maintenance.</p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Shared circulation system</li>
                  <li>• Spillway water feature</li>
                  <li>• Coordinated heating</li>
                  <li>• Unified control system</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Standalone Spa</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Independent spa with dedicated equipment for maximum flexibility and year-round use.</p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Dedicated filtration</li>
                  <li>• Independent heating</li>
                  <li>• Separate water chemistry</li>
                  <li>• Custom placement options</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Portable Hot Tub</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Easy DIY option that doesn't require additional construction permits or permanent installation.</p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• No additional permits</li>
                  <li>• Plug-and-play setup</li>
                  <li>• Deck integration possible</li>
                  <li>• Moveable if needed</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              <HelpCircle className="w-10 h-10 inline mr-3 text-blue-600" />
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">Common questions from DIY pool builders</p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg text-blue-700">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Expert Support CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your DIY Pool Project?</h2>
          <p className="text-xl mb-8 opacity-90">
            Get expert guidance from pool designer Kayne Marzetti. Professional consultation, detailed plans, 
            and ongoing support to ensure your DIY pool project is successful and safe.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-80" />
              <h3 className="text-lg font-semibold mb-2">Detailed Plans</h3>
              <p className="text-sm opacity-80">Construction drawings, material lists, and step-by-step guides</p>
            </div>
            <div className="text-center">
              <Phone className="w-12 h-12 mx-auto mb-3 opacity-80" />
              <h3 className="text-lg font-semibold mb-2">Expert Support</h3>
              <p className="text-sm opacity-80">Ongoing consultation throughout your construction project</p>
            </div>
            <div className="text-center">
              <Download className="w-12 h-12 mx-auto mb-3 opacity-80" />
              <h3 className="text-lg font-semibold mb-2">Resource Library</h3>
              <p className="text-sm opacity-80">Checklists, templates, and troubleshooting guides</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100" data-testid="button-start-diy-project">
                Start Your DIY Project
              </Button>
            </Link>
            <Link href="/packages">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600" data-testid="button-view-diy-packages">
                View DIY Packages
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Related Services */}
      <RelatedServices currentPage="diy-pools-and-spas" className="my-16" />
    </div>
  );
}