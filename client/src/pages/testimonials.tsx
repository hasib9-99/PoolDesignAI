import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Calendar, Trophy } from "lucide-react";

export default function TestimonialsPage() {
  const featuredTestimonials = [
    {
      name: "Brent Hill",
      location: "Client",
      package: "Custom Pool Design",
      projectType: "Pool Design & Planning",
      completionDate: "July 2024",
      initials: "BH",
      bgColor: "bg-orange-200",
      textColor: "text-orange-600",
      rating: 5,
      content: "Highly recommend Pool Design Consultant / Custom 3D Designs & Plans. We had the privilege of working with Kayne Marzetti and his expertise and attention to detail made our pool design process seamless and enjoyable.",
      projectDetails: "Custom pool design with detailed planning and consultation",
      savings: "Professional guidance throughout entire process"
    },
    {
      name: "Oscar Beltran",
      location: "Pool Company Owner",
      package: "Professional Services",
      projectType: "Commercial Pool Design",
      completionDate: "15+ Years Partnership",
      initials: "OB",
      bgColor: "bg-blue-200",
      textColor: "text-blue-600",
      rating: 5,
      content: "Great designer. I have been using him for over 15 years. Knows what he is doing. Very professional. I have referred him to at least 3 other pool companies.",
      projectDetails: "Multiple commercial and residential pool designs over 15 years",
      savings: "Long-term partnership with proven results"
    },
    {
      name: "Michael Boghos",
      location: "First-Time Pool Builder",
      package: "DIY Support Package",
      projectType: "Owner-Builder Pool",
      completionDate: "Recent Project",
      initials: "MB",
      bgColor: "bg-green-200",
      textColor: "text-green-600",
      rating: 5,
      content: "I'm doing my first owner build pool. I have no experience in this. Kayne has been informative and very responsive with all my questions and concerns. I would highly recommend him to anyone looking to build a pool.",
      projectDetails: "First-time owner-builder with comprehensive guidance",
      savings: "Expert support for DIY pool construction"
    },
    {
      name: "Laurie Sandoval",
      location: "Homeowner",
      package: "Design Consultation", 
      projectType: "New Home Pool Design",
      completionDate: "December 2023",
      initials: "LS",
      bgColor: "bg-purple-200",
      textColor: "text-purple-600",
      rating: 5,
      content: "Kayne is designing the pool for our new home and I can't say enough good things. He was so very patient on our zoom call walking me through all the details and explaining everything clearly.",
      projectDetails: "New home pool design with detailed consultation",
      savings: "Patient, thorough design process"
    }
  ];

  const quickTestimonials = [
    {
      name: "Ryan Nichols",
      location: "Recent Client",
      package: "Pool Design Services",
      content: "Kayne is excellent to work with and would highly recommend to others. Plan to work with him on other projects.",
      rating: 5
    },
    {
      name: "Sam Tolleson", 
      location: "Client",
      package: "Professional Design",
      content: "I would highly recommend working with Kayne. He was a serious professional with great experience.",
      rating: 5
    },
    {
      name: "Josue Rivera",
      location: "Pool Owner", 
      package: "Custom Design",
      content: "I had an amazing experience working with Kayne on my pool design. From start to finish, the process was smooth.",
      rating: 5
    },
    {
      name: "Hope Hazelwood",
      location: "Homeowner",
      package: "Design Plans", 
      content: "Kayne was really wonderful to work with and very knowledgeable. He was able to deliver plans that fit exactly what we needed.",
      rating: 5
    },
    {
      name: "Jamara Johnson",
      location: "Client",
      package: "Complete Design",
      content: "Best designer I have ever worked with definitely top notch. From the beginning to the end. Very responsive and knowledgeable.",
      rating: 5
    },
    {
      name: "James Noble",
      location: "Pool Owner",
      package: "Design Consultation",
      content: "Kayne was extremely helpful and had great insight that helped us with the design of our pool. It was a pleasure to work with him.",
      rating: 5
    },
    {
      name: "Ronald Davis",
      location: "Repeat Client",
      package: "Multiple Projects",
      content: "Kayne has designed multiple pools for me over the years. His custom pool designs and attention to detail is exceptional.",
      rating: 5
    },
    {
      name: "Coley McClendon",
      location: "Homeowner",
      package: "Custom Design",
      content: "Fantastic to work with and attention to detail based on what we are looking for in our design. Highly recommended.",
      rating: 5
    },
    {
      name: "Emily Biggs",
      location: "Client",
      package: "Design Services",
      content: "Great company to work with! Quick turnaround and great designs.",
      rating: 5
    }
  ];

  const stats = [
    { number: "5,000+", label: "Pools Designed", icon: Trophy },
    { number: "47", label: "Years Experience", icon: Calendar }, 
    { number: "$2.1M+", label: "Client Savings", icon: Star },
    { number: "98%", label: "Satisfaction Rate", icon: Trophy }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="pt-32 pb-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-blue-50 to-orange-50">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gradient">Client Success Stories</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
              Discover how homeowners across the country have transformed their backyards with our AI-driven pool design services. From DIY builders to luxury resort-style projects, see the results of 47 years of expertise.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <Card key={index} className="text-center border-2 hover:border-primary transition-colors">
                  <CardContent className="p-6">
                    <stat.icon className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                    <div className="text-3xl font-bold text-gradient mb-1">{stat.number}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Testimonials */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-4">Featured Success Stories</h2>
            <p className="text-xl text-muted-foreground text-center mb-16 max-w-2xl mx-auto">
              Detailed case studies showing the complete journey from design to dream pool completion.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
              {featuredTestimonials.map((testimonial, index) => (
                <Card 
                  key={index}
                  className="border-2 hover:border-primary transition-all duration-300 shadow-lg hover:shadow-xl"
                  data-testid={`featured-testimonial-${index}`}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <div className={`w-16 h-16 ${testimonial.bgColor} rounded-full flex items-center justify-center mr-4`}>
                          <span className={`text-xl font-bold ${testimonial.textColor}`}>{testimonial.initials}</span>
                        </div>
                        <div>
                          <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                          <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <MapPin className="w-4 h-4 mr-1" />
                            {testimonial.location}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <Calendar className="w-4 h-4 mr-1" />
                            {testimonial.completionDate}
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-orange-600 border-orange-300">
                        {testimonial.package}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex text-orange-400 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-current" />
                      ))}
                    </div>
                    
                    <p className="text-muted-foreground mb-6 italic">"{testimonial.content}"</p>
                    
                    <div className="space-y-3 pt-4 border-t">
                      <div>
                        <span className="font-semibold text-foreground">Project:</span>
                        <span className="text-muted-foreground ml-2">{testimonial.projectDetails}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-green-600">Savings:</span>
                        <span className="text-green-600 ml-2 font-medium">{testimonial.savings}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Reviews Grid */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-4">More Happy Clients</h2>
            <p className="text-xl text-muted-foreground text-center mb-16 max-w-2xl mx-auto">
              Quick reviews from clients across all our service packages.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {quickTestimonials.map((testimonial, index) => (
                <Card 
                  key={index}
                  className="hover:shadow-md transition-shadow"
                  data-testid={`quick-testimonial-${index}`}
                >
                  <CardContent className="p-6">
                    <div className="flex text-orange-400 mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4 italic text-sm">"{testimonial.content}"</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">{testimonial.name}</div>
                        <div className="text-xs text-muted-foreground">{testimonial.location}</div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {testimonial.package}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-orange-500 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Join Our Success Stories?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              With 47 years of experience and 5,000+ pools designed, we're ready to help you create your dream backyard oasis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/#packages" className="bg-white text-orange-500 px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-colors">
                View Our Packages
              </a>
              <a href="/#calculator" className="border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-orange-500 transition-colors">
                Get Free Estimate
              </a>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}