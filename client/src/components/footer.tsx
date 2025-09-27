import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-primary text-primary-foreground py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold">Pool Design Consultant</h1>
                <p className="text-xs opacity-90">Kayne Marzetti - 47 Years Experience</p>
              </div>
            </div>
            <p className="text-sm opacity-80 mb-4">
              Expert pool and landscape design services with 47 years of combined experience. Custom 3D designs, construction plans, and complete outdoor living solutions.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-bold mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Button 
                  variant="ghost" 
                  className="text-primary-foreground/80 hover:text-white transition-colors p-0 h-auto font-normal"
                  onClick={() => scrollToSection('services')}
                >
                  3D Pool Design
                </Button>
              </li>
              <li>
                <Button 
                  variant="ghost" 
                  className="text-primary-foreground/80 hover:text-white transition-colors p-0 h-auto font-normal"
                  onClick={() => scrollToSection('ai-quiz')}
                >
                  AI Design Quiz
                </Button>
              </li>
              <li>
                <Button 
                  variant="ghost" 
                  className="text-primary-foreground/80 hover:text-white transition-colors p-0 h-auto font-normal"
                  onClick={() => scrollToSection('calculator')}
                >
                  Cost Calculator
                </Button>
              </li>
              <li>
                <Button 
                  variant="ghost" 
                  className="text-primary-foreground/80 hover:text-white transition-colors p-0 h-auto font-normal"
                >
                  Virtual Reality Tours
                </Button>
              </li>
              <li>
                <Button 
                  variant="ghost" 
                  className="text-primary-foreground/80 hover:text-white transition-colors p-0 h-auto font-normal"
                >
                  Construction Plans
                </Button>
              </li>
              <li>
                <Button 
                  variant="ghost" 
                  className="text-primary-foreground/80 hover:text-white transition-colors p-0 h-auto font-normal"
                >
                  Contractor Network
                </Button>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-bold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Button 
                  variant="ghost" 
                  className="text-primary-foreground/80 hover:text-white transition-colors p-0 h-auto font-normal"
                >
                  About Us
                </Button>
              </li>
              <li>
                <Button 
                  variant="ghost" 
                  className="text-primary-foreground/80 hover:text-white transition-colors p-0 h-auto font-normal"
                >
                  Our Process
                </Button>
              </li>
              <li>
                <Button 
                  variant="ghost" 
                  className="text-primary-foreground/80 hover:text-white transition-colors p-0 h-auto font-normal"
                  onClick={() => scrollToSection('portfolio')}
                >
                  Portfolio
                </Button>
              </li>
              <li>
                <Button 
                  variant="ghost" 
                  className="text-primary-foreground/80 hover:text-white transition-colors p-0 h-auto font-normal"
                >
                  Testimonials
                </Button>
              </li>
              <li>
                <Button 
                  variant="ghost" 
                  className="text-primary-foreground/80 hover:text-white transition-colors p-0 h-auto font-normal"
                >
                  Careers
                </Button>
              </li>
              <li>
                <Button 
                  variant="ghost" 
                  className="text-primary-foreground/80 hover:text-white transition-colors p-0 h-auto font-normal"
                  onClick={() => scrollToSection('contact')}
                >
                  Contact
                </Button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <Phone className="w-4 h-4 mt-1 opacity-80" />
                <div>
                  <p>(407) 314-0857</p>
                  <p className="opacity-70 text-xs">Mon-Fri 8AM-6PM</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <Mail className="w-4 h-4 mt-1 opacity-80" />
                <p>kayne@pooldesignconsultant.com</p>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 mt-1 opacity-80" />
                <div>
                  <p>4300 W Lake Mary Blvd, Suite 1010</p>
                  <p className="opacity-70 text-xs">Lake Mary, FL 32746</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <div className="mb-4 md:mb-0">
              <p className="opacity-80">&copy; 2024 Pool Design Consultant. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <Link href="/privacy-policy">
                <Button 
                  variant="ghost" 
                  className="text-primary-foreground/80 hover:text-white transition-colors p-0 h-auto font-normal text-sm"
                  data-testid="link-privacy-policy"
                >
                  Privacy Policy
                </Button>
              </Link>
              <Link href="/terms-conditions">
                <Button 
                  variant="ghost" 
                  className="text-primary-foreground/80 hover:text-white transition-colors p-0 h-auto font-normal text-sm"
                  data-testid="link-terms-conditions"
                >
                  Terms & Conditions
                </Button>
              </Link>
            </div>
          </div>
          {/* Legal Fine Print */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-xs opacity-70 text-center leading-relaxed">
              &copy; Pool Design Consultant. Packages constitute standard residential pool plan documentation. Additional jurisdictional requirements, specialty engineering, and third-party reports are billed separately. Pool Design Consultant is not an engineering firm. Engineering services are provided by licensed third-party professionals.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
