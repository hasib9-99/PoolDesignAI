import Header from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Award, Palette, Users, Clock, Lightbulb } from "lucide-react";
import { Link } from "wouter";
import { useSEO } from "@/hooks/use-seo";
import { seoData } from "@/utils/seo-data";

export default function About() {
  // Apply SEO optimization for about page
  useSEO(seoData.about);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-orange-100 text-orange-800 px-4 py-2">
              Pool Design Expert
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
              About Pool Design Consultant
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Bringing Vision to Life with Custom 3D Pool Designs
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Welcome to Pool Design Consultant, led by <strong>Kayne Marzetti</strong>, a pool and outdoor design expert with over <strong>47 years of combined experience</strong> in landscape and swimming pool design. From sketching with pencil and graph paper to mastering advanced 3D software, Kayne has transformed thousands of backyards into stunning outdoor retreats.
            </p>
          </div>
        </div>
      </section>

      {/* Kayne's Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="mb-16">
              <CardHeader>
                <CardTitle className="text-3xl text-center mb-6 text-gray-800">
                  Kayne Marzetti – A Story of Design Evolution
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <p className="text-lg text-gray-700 leading-relaxed">
                      Kayne began his career with <strong>13 years in landscape design</strong>, shaping outdoor environments with creativity and precision. He then transitioned his focus to pools, where he has dedicated <strong>34 years to custom pool design and planning</strong>, becoming one of the most trusted names in the industry.
                    </p>
                    <p className="text-lg text-gray-700 leading-relaxed mt-4">
                      This unique combination of expertise—13 years in landscape <em>plus</em> 34 years in pools—gives him an unmatched understanding of complete outdoor living spaces.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center bg-blue-50 p-6 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600">34</div>
                      <div className="text-sm text-gray-600">Years Pool Design</div>
                    </div>
                    <div className="text-center bg-orange-50 p-6 rounded-lg">
                      <div className="text-3xl font-bold text-orange-600">13</div>
                      <div className="text-sm text-gray-600">Years Landscape</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-orange-50 p-6 rounded-lg">
                  <p className="text-lg text-gray-700 leading-relaxed">
                    From early 2D drafting in Visio to today's Structure Studios Pool Studio 3D software, Kayne has always embraced innovation. This commitment allows him to deliver builder-ready plans, realistic 3D visuals, and permit-ready layouts that simplify construction for homeowners, builders, and contractors.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Why Choose Section */}
            <Card className="mb-16">
              <CardHeader>
                <CardTitle className="text-3xl text-center mb-6 text-gray-800">
                  Why Choose Pool Design Consultant?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-start space-x-4">
                    <Award className="w-8 h-8 text-orange-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-lg text-gray-800 mb-2">Proven Authority</h3>
                      <p className="text-gray-600">Over 47 years of outdoor design experience: 13 years in landscape <em>plus</em> 34 years in pools (separate periods).</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <Palette className="w-8 h-8 text-blue-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-lg text-gray-800 mb-2">Builder-Friendly Plans</h3>
                      <p className="text-gray-600">Permit-ready layouts with plumbing, electrical, and equipment details.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <CheckCircle className="w-8 h-8 text-orange-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-lg text-gray-800 mb-2">Complete Outdoor Living Expertise</h3>
                      <p className="text-gray-600">Integration of pools, patios, kitchens, and landscapes.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <Lightbulb className="w-8 h-8 text-blue-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-lg text-gray-800 mb-2">Cutting-Edge Visualization</h3>
                      <p className="text-gray-600">Realistic 3D renderings and virtual walkthroughs.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 md:col-span-2">
                    <Users className="w-8 h-8 text-orange-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-bold text-lg text-gray-800 mb-2">Client-Centered Process</h3>
                      <p className="text-gray-600">Personalized consultations tailored to your lifestyle and budget.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Services Section */}
            <Card className="mb-16">
              <CardHeader>
                <CardTitle className="text-3xl text-center mb-6 text-gray-800">
                  Our Services
                </CardTitle>
                <p className="text-center text-gray-600">
                  We provide comprehensive solutions for both homeowners and builders
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border-l-4 border-blue-500 pl-6">
                    <h3 className="font-bold text-xl text-gray-800 mb-2">1. Custom Pool Design & Visualization</h3>
                    <ul className="space-y-1 text-gray-600">
                      <li>• 3D designs with lifelike renderings</li>
                      <li>• Virtual walkthroughs of your dream pool</li>
                    </ul>
                  </div>
                  
                  <div className="border-l-4 border-orange-500 pl-6">
                    <h3 className="font-bold text-xl text-gray-800 mb-2">2. Plans & Permitting</h3>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Construction drawings (plumbing, electrical, equipment)</li>
                      <li>• Permit-ready packages for fast approvals</li>
                    </ul>
                  </div>
                  
                  <div className="border-l-4 border-blue-500 pl-6">
                    <h3 className="font-bold text-xl text-gray-800 mb-2">3. Remodels & Renovations</h3>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Transform outdated pools into modern showpieces</li>
                      <li>• Add features like infinity edges, tanning ledges, fire features, and LED lighting</li>
                    </ul>
                  </div>
                  
                  <div className="border-l-4 border-orange-500 pl-6">
                    <h3 className="font-bold text-xl text-gray-800 mb-2">4. Outdoor Living Integration</h3>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Decks, patios, outdoor kitchens, and landscaping layouts</li>
                      <li>• Complete backyard master planning</li>
                    </ul>
                  </div>
                  
                  <div className="border-l-4 border-blue-500 pl-6">
                    <h3 className="font-bold text-xl text-gray-800 mb-2">5. Project Guidance & Budgeting</h3>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Oversight to keep your project on time and within budget</li>
                      <li>• Cost estimates to support smart decision-making</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Owner-Builder Section */}
            <Card className="mb-16 bg-gradient-to-r from-orange-50 to-blue-50">
              <CardHeader>
                <CardTitle className="text-3xl text-center mb-6 text-gray-800">
                  Owner-Builder & DIY Pools
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  Many homeowners are looking to save money and take control of their projects. Kayne specializes in owner-builder pool packages that include:
                </p>
                
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <span className="text-gray-700">Permit-ready plans</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <span className="text-gray-700">Equipment specifications</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <span className="text-gray-700">Subcontractor guidance</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <span className="text-gray-700">Budget planning support</span>
                  </div>
                </div>
                
                <p className="text-lg text-gray-700 leading-relaxed bg-white p-6 rounded-lg">
                  This makes it possible to <strong>"build your own pool"</strong> with confidence, while avoiding costly mistakes.
                </p>
              </CardContent>
            </Card>

            {/* CTA Section */}
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4 text-gray-800">Ready to Start Your Pool Project?</h2>
              <p className="text-lg text-gray-600 mb-8">
                Let's bring your vision to life with our 47 years of combined expertise
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/#packages">
                  <Button 
                    className="gradient-primary text-white px-8 py-3 rounded-full hover:opacity-90 transition-all duration-300 font-medium"
                    data-testid="button-view-packages"
                  >
                    View Our Packages
                  </Button>
                </Link>
                <Link href="/#contact">
                  <Button 
                    variant="outline" 
                    className="border-blue-500 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-full transition-all duration-300 font-medium"
                    data-testid="button-get-consultation"
                  >
                    Get Free Consultation
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}