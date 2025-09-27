import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  Palette, 
  Brain, 
  Calculator, 
  Wrench, 
  Leaf, 
  Smartphone, 
  Handshake, 
  Headphones 
} from "lucide-react";

export default function ServicesGrid() {
  const services = [
    {
      icon: <Palette className="w-12 h-12 text-blue-600" />,
      title: "Custom 3D Pool Design",
      description: "Photorealistic 3D pool renderings and custom inground pool designs that bring your vision to life with stunning detail.",
      route: "/ai-3d-design",
      isInteractive: true
    },
    {
      icon: <Brain className="w-12 h-12 text-orange-500" />,
      title: "AI Optimization", 
      description: "Smart algorithms analyze your space and preferences for optimal pool design solutions.",
      route: "/ai-optimization",
      isInteractive: true
    },
    {
      icon: <Calculator className="w-12 h-12 text-blue-600" />,
      title: "Pool Cost Calculator",
      description: "Detailed swimming pool cost estimates and construction budget analysis to maximize your pool investment.",
      route: "#calculator",
      isInteractive: false
    },
    {
      icon: <Wrench className="w-12 h-12 text-orange-500" />,
      title: "Technical Plans",
      description: "Professional construction drawings and specifications for contractors to follow.",
      route: "#contact",
      isInteractive: false
    },
    {
      icon: <Leaf className="w-12 h-12 text-blue-600" />,
      title: "Eco Design",
      description: "Sustainable and energy-efficient pool designs that reduce environmental impact.",
      route: "/eco-design",
      isInteractive: true
    },
    {
      icon: <Smartphone className="w-12 h-12 text-orange-500" />,
      title: "Virtual Reality",
      description: "Immersive VR experiences to walk through your pool design before construction.",
      route: "/virtual-reality",
      isInteractive: true
    },
    {
      icon: <Handshake className="w-12 h-12 text-blue-600" />,
      title: "Pool Builder Network",
      description: "Access to our vetted network of professional swimming pool contractors and pool builders nationwide.",
      route: "#contact",
      isInteractive: false
    },
    {
      icon: <Headphones className="w-12 h-12 text-orange-500" />,
      title: "24/7 Support",
      description: "Round-the-clock customer support throughout your entire design process.",
      route: "#contact",
      isInteractive: false
    }
  ];

  return (
    <section id="services" className="py-20 gradient-soft">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">Our Design Services</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive pool design solutions powered by cutting-edge AI technology and expert craftsmanship.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => {
            const handleServiceClick = () => {
              if (service.isInteractive && service.route.startsWith('/')) {
                // For interactive AI services, navigate to the route
                window.location.href = service.route;
              } else if (service.route.startsWith('#')) {
                // For non-interactive services, scroll to section
                const sectionId = service.route.substring(1);
                const element = document.getElementById(sectionId);
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }
            };

            return (
              <Card 
                key={index}
                className="text-center border-2 border-border hover:border-primary hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden"
                data-testid={`service-card-${index}`}
              >
                {service.isInteractive && (
                  <div className="absolute top-2 right-2">
                    <div className="bg-gradient-to-r from-blue-500 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                      AI-Powered
                    </div>
                  </div>
                )}
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {service.icon}
                  </div>
                  <CardTitle className="text-xl font-bold text-foreground">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  
                  {service.isInteractive ? (
                    <Link href={service.route}>
                      <Button 
                        className="w-full gradient-primary text-white font-medium hover:opacity-90 transition-opacity"
                        data-testid={`button-try-${service.title.toLowerCase().replace(' ', '-')}`}
                      >
                        Try AI Tool
                      </Button>
                    </Link>
                  ) : (
                    <Button 
                      onClick={handleServiceClick}
                      variant="outline"
                      className="w-full border-primary text-primary hover:bg-primary hover:text-white transition-colors"
                      data-testid={`button-learn-${service.title.toLowerCase().replace(' ', '-')}`}
                    >
                      Learn More
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
