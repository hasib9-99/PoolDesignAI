import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "wouter";
import logoImage from "@assets/Pool Design Consultant Logo 12-16-23_1757295990927.jpg";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-white shadow-lg border-b border-gray-100">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <img 
              src={logoImage} 
              alt="Pool Design Consultant Logo" 
              className="h-20 w-auto object-contain"
            />
          </Link>
          
          <ul className="hidden md:flex items-center space-x-8">
            <li>
              <Link href="/about">
                <button className="text-gray-700 hover:text-orange-500 transition-colors duration-300 font-medium" data-testid="nav-about">
                  About
                </button>
              </Link>
            </li>
            <li>
              {location === '/' ? (
                <button 
                  onClick={() => scrollToSection('services')}
                  className="text-gray-700 hover:text-orange-500 transition-colors duration-300 font-medium"
                  data-testid="nav-services"
                >
                  Services
                </button>
              ) : (
                <Link href="/#services">
                  <button className="text-gray-700 hover:text-orange-500 transition-colors duration-300 font-medium" data-testid="nav-services">
                    Services
                  </button>
                </Link>
              )}
            </li>
            <li>
              {location === '/' ? (
                <button 
                  onClick={() => scrollToSection('portfolio')}
                  className="text-gray-700 hover:text-orange-500 transition-colors duration-300 font-medium"
                  data-testid="nav-portfolio"
                >
                  Portfolio
                </button>
              ) : (
                <Link href="/#portfolio">
                  <button className="text-gray-700 hover:text-orange-500 transition-colors duration-300 font-medium" data-testid="nav-portfolio">
                    Portfolio
                  </button>
                </Link>
              )}
            </li>
            <li>
              <Link href="/testimonials">
                <button className="text-gray-700 hover:text-orange-500 transition-colors duration-300 font-medium" data-testid="nav-testimonials">
                  Testimonials
                </button>
              </Link>
            </li>
            <li>
              <Link href="/faq">
                <button className="text-gray-700 hover:text-orange-500 transition-colors duration-300 font-medium" data-testid="nav-faq">
                  FAQ
                </button>
              </Link>
            </li>
            <li>
              <Link href="/child-safety">
                <button className="text-gray-700 hover:text-orange-500 transition-colors duration-300 font-medium" data-testid="nav-child-safety">
                  Child Safety
                </button>
              </Link>
            </li>
            <li>
              <Link href="/ai-design-tool">
                <button className="text-gray-700 hover:text-orange-500 transition-colors duration-300 font-medium" data-testid="nav-ai-design-tool">
                  AI Design Tool
                </button>
              </Link>
            </li>
            <li>
              <Link href="/intake">
                <button className="text-gray-700 hover:text-orange-500 transition-colors duration-300 font-medium" data-testid="nav-intake">
                  Submit Project
                </button>
              </Link>
            </li>
            <li>
              {location === '/' ? (
                <button 
                  onClick={() => scrollToSection('packages')}
                  className="text-gray-700 hover:text-orange-500 transition-colors duration-300 font-medium"
                  data-testid="nav-packages"
                >
                  Packages
                </button>
              ) : (
                <Link href="/#packages">
                  <button className="text-gray-700 hover:text-orange-500 transition-colors duration-300 font-medium" data-testid="nav-packages">
                    Packages
                  </button>
                </Link>
              )}
            </li>
            <li>
              {location === '/' ? (
                <button 
                  onClick={() => scrollToSection('calculator')}
                  className="text-gray-700 hover:text-orange-500 transition-colors duration-300 font-medium"
                  data-testid="nav-calculator"
                >
                  Calculator
                </button>
              ) : (
                <Link href="/#calculator">
                  <button className="text-gray-700 hover:text-orange-500 transition-colors duration-300 font-medium" data-testid="nav-calculator">
                    Calculator
                  </button>
                </Link>
              )}
            </li>
            <li>
              {location === '/' ? (
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="text-gray-700 hover:text-orange-500 transition-colors duration-300 font-medium"
                  data-testid="nav-contact"
                >
                  Contact
                </button>
              ) : (
                <Link href="/#contact">
                  <button className="text-gray-700 hover:text-orange-500 transition-colors duration-300 font-medium" data-testid="nav-contact">
                    Contact
                  </button>
                </Link>
              )}
            </li>
          </ul>
          
          <div className="flex items-center space-x-4">
            {location === '/' ? (
              <Button
                onClick={() => scrollToSection('contact')}
                className="hidden sm:inline-block gradient-primary text-white px-6 py-2 rounded-full hover:opacity-90 transition-all duration-300 font-medium"
                data-testid="button-get-quote"
              >
                Get Quote
              </Button>
            ) : (
              <Link href="/#contact">
                <Button
                  className="hidden sm:inline-block gradient-primary text-white px-6 py-2 rounded-full hover:opacity-90 transition-all duration-300 font-medium"
                  data-testid="button-get-quote"
                >
                  Get Quote
                </Button>
              </Link>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-gray-700"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-2">
              <Link href="/about">
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-700 hover:text-orange-500 transition-colors duration-300 font-medium py-2 text-left"
                  data-testid="mobile-nav-about"
                >
                  About
                </button>
              </Link>
              {location === '/' ? (
                <button 
                  onClick={() => scrollToSection('services')}
                  className="text-gray-700 hover:text-orange-500 transition-colors duration-300 font-medium py-2 text-left"
                  data-testid="mobile-nav-services"
                >
                  Services
                </button>
              ) : (
                <Link href="/#services">
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-gray-700 hover:text-orange-500 transition-colors duration-300 font-medium py-2 text-left"
                    data-testid="mobile-nav-services"
                  >
                    Services
                  </button>
                </Link>
              )}
              {location === '/' ? (
                <button 
                  onClick={() => scrollToSection('portfolio')}
                  className="text-gray-700 hover:text-orange-500 transition-colors duration-300 font-medium py-2 text-left"
                  data-testid="mobile-nav-portfolio"
                >
                  Portfolio
                </button>
              ) : (
                <Link href="/#portfolio">
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-gray-700 hover:text-orange-500 transition-colors duration-300 font-medium py-2 text-left"
                    data-testid="mobile-nav-portfolio"
                  >
                    Portfolio
                  </button>
                </Link>
              )}
              <Link href="/testimonials">
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-700 hover:text-orange-500 transition-colors duration-300 font-medium py-2 text-left"
                  data-testid="mobile-nav-testimonials"
                >
                  Testimonials
                </button>
              </Link>
              <Link href="/child-safety">
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-700 hover:text-orange-500 transition-colors duration-300 font-medium py-2 text-left"
                  data-testid="mobile-nav-child-safety"
                >
                  Child Safety
                </button>
              </Link>
              <Link href="/ai-design-tool">
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-700 hover:text-orange-500 transition-colors duration-300 font-medium py-2 text-left"
                  data-testid="mobile-nav-ai-design-tool"
                >
                  AI Design Tool
                </button>
              </Link>
              <Link href="/intake">
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-700 hover:text-orange-500 transition-colors duration-300 font-medium py-2 text-left"
                  data-testid="mobile-nav-intake"
                >
                  Submit Project
                </button>
              </Link>
              {location === '/' ? (
                <button 
                  onClick={() => scrollToSection('packages')}
                  className="text-gray-700 hover:text-orange-500 transition-colors duration-300 font-medium py-2 text-left"
                  data-testid="mobile-nav-packages"
                >
                  Packages
                </button>
              ) : (
                <Link href="/#packages">
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-gray-700 hover:text-orange-500 transition-colors duration-300 font-medium py-2 text-left"
                    data-testid="mobile-nav-packages"
                  >
                    Packages
                  </button>
                </Link>
              )}
              {location === '/' ? (
                <button 
                  onClick={() => scrollToSection('calculator')}
                  className="text-gray-700 hover:text-orange-500 transition-colors duration-300 font-medium py-2 text-left"
                  data-testid="mobile-nav-calculator"
                >
                  Calculator
                </button>
              ) : (
                <Link href="/#calculator">
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-gray-700 hover:text-orange-500 transition-colors duration-300 font-medium py-2 text-left"
                    data-testid="mobile-nav-calculator"
                  >
                    Calculator
                  </button>
                </Link>
              )}
              {location === '/' ? (
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="text-gray-700 hover:text-orange-500 transition-colors duration-300 font-medium py-2 text-left"
                  data-testid="mobile-nav-contact"
                >
                  Contact
                </button>
              ) : (
                <Link href="/#contact">
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-gray-700 hover:text-orange-500 transition-colors duration-300 font-medium py-2 text-left"
                    data-testid="mobile-nav-contact"
                  >
                    Contact
                  </button>
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
