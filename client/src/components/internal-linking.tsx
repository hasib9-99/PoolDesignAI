import { Link } from "wouter";

// Strategic internal linking component for SEO
interface InternalLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export function InternalLink({ href, children, className, title }: InternalLinkProps) {
  return (
    <Link href={href}>
      <a className={className} title={title}>
        {children}
      </a>
    </Link>
  );
}

// SEO-optimized footer links for internal linking
export const seoFooterLinks = [
  {
    title: "Pool Design Services",
    links: [
      { href: "/ai-3d-design", text: "3D Pool Design", title: "Custom 3D pool design and visualization services" },
      { href: "/packages", text: "Design Packages", title: "Pool design packages and pricing options" },
      { href: "/ai-optimization", text: "AI Pool Optimization", title: "AI-powered pool design optimization" },
      { href: "/eco-design", text: "Eco-Friendly Pools", title: "Sustainable and eco-friendly pool designs" },
      { href: "/virtual-reality", text: "VR Pool Experience", title: "Virtual reality pool design experience" }
    ]
  },
  {
    title: "Pool Planning",
    links: [
      { href: "/ai-design-tool", text: "Pool Design Tool", title: "Interactive pool design and planning tool" },
      { href: "/child-safety", text: "Pool Safety Design", title: "Child-safe pool design features" },
      { href: "/contact", text: "Pool Consultation", title: "Free pool design consultation" },
      { href: "/testimonials", text: "Customer Reviews", title: "Pool design customer testimonials and reviews" }
    ]
  },
  {
    title: "Company Info",
    links: [
      { href: "/about", text: "About Our Experts", title: "Meet our pool design experts and team" },
      { href: "/testimonials", text: "Success Stories", title: "Pool design success stories and case studies" },
      { href: "/contact", text: "Get Quote", title: "Get free pool design quote and estimate" }
    ]
  }
];

// Related services component for internal linking
interface RelatedServicesProps {
  currentPage: string;
  className?: string;
}

export function RelatedServices({ currentPage, className = "" }: RelatedServicesProps) {
  const relatedServices = {
    "ai-3d-design": [
      { href: "/ai-optimization", text: "AI Pool Optimization", desc: "Optimize your pool design with AI technology" },
      { href: "/virtual-reality", text: "VR Pool Experience", desc: "Experience your pool in virtual reality" },
      { href: "/packages", text: "Design Packages", desc: "View our pool design service packages" }
    ],
    "packages": [
      { href: "/ai-3d-design", text: "3D Pool Design", desc: "See our 3D pool design capabilities" },
      { href: "/contact", text: "Free Consultation", desc: "Schedule your free pool design consultation" },
      { href: "/testimonials", text: "Customer Reviews", desc: "Read what our customers say about our services" }
    ],
    "about": [
      { href: "/packages", text: "Our Services", desc: "Explore our pool design packages and services" },
      { href: "/testimonials", text: "Client Testimonials", desc: "Success stories from satisfied customers" },
      { href: "/contact", text: "Contact Our Team", desc: "Get in touch with our pool design experts" }
    ],
    "contact": [
      { href: "/packages", text: "Service Packages", desc: "Choose the right pool design package for you" },
      { href: "/ai-design-tool", text: "Design Tool", desc: "Try our interactive pool design tool" },
      { href: "/about", text: "Meet the Team", desc: "Learn about our pool design expertise" }
    ]
  };

  const services = relatedServices[currentPage as keyof typeof relatedServices] || [];

  if (services.length === 0) return null;

  return (
    <div className={`bg-gradient-to-r from-blue-50 to-orange-50 rounded-lg p-6 ${className}`}>
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Related Pool Services</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {services.map((service, index) => (
          <Link key={index} href={service.href}>
            <a className="block p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 hover:border-blue-200">
              <h4 className="font-medium text-blue-600 mb-2">{service.text}</h4>
              <p className="text-sm text-gray-600">{service.desc}</p>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}