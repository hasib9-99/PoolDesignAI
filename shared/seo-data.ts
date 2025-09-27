// Shared SEO data for server-side and client-side rendering

export interface SEOData {
  title: string;
  description: string;
  keywords: string;
  canonical: string;
  ogImage?: string;
  ogType?: string;
  schemaType?: 'home' | 'about' | 'services' | 'contact' | 'diy';
}

export const SITE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://pooldesignconsultant.com' 
  : 'http://localhost:5000';

export const seoRoutes: Record<string, SEOData> = {
  '/': {
    title: 'Pool Design Consultant | Custom Pool Design & Construction by Expert Kayne Marzetti',
    description: 'Expert pool designer Kayne Marzetti offers custom 3D pool design, construction plans, and complete outdoor living solutions. 47+ years experience in luxury pool design and landscape architecture.',
    keywords: 'pool design, custom pool designer, pool construction, 3D pool design, pool builder, landscape design, outdoor living, pool consultant, swimming pool design, pool planning',
    canonical: '/',
    ogImage: '/attached_assets/stock_images/luxury_swimming_pool_068a5e23.jpg',
    ogType: 'website',
    schemaType: 'home'
  },
  '/about': {
    title: 'About Kayne Marzetti | 47+ Years Pool Design Expert & Landscape Architect',
    description: 'Meet Kayne Marzetti, leading pool design consultant with 47+ years experience. Specializing in custom luxury pools, spa design, and complete outdoor living transformations.',
    keywords: 'Kayne Marzetti, pool design expert, pool designer, landscape architect, pool construction specialist, custom pool builder, pool design experience',
    canonical: '/about',
    ogImage: '/attached_assets/stock_images/professional_pool_de_acbadb9f.jpg',
    ogType: 'profile',
    schemaType: 'about'
  },
  '/packages': {
    title: 'Pool Design Packages & Pricing | Custom Pool Design Services & Construction Plans',
    description: 'Explore our pool design packages from basic consultation to complete 3D design and construction plans. Transparent pricing for custom pool design services and landscape architecture.',
    keywords: 'pool design packages, pool design pricing, custom pool cost, pool construction plans, pool design services, pool consultant packages, pool builder quotes',
    canonical: '/packages',
    ogImage: '/attached_assets/stock_images/professional_pool_de_acbadb9f.jpg',
    ogType: 'website',
    schemaType: 'services'
  },
  '/contact': {
    title: 'Contact Pool Design Consultant | Get Your Free Pool Design Quote & Consultation',
    description: 'Contact expert pool designer Kayne Marzetti for your free consultation. Custom pool design quotes, construction planning, and complete outdoor living solutions nationwide.',
    keywords: 'pool design consultation, free pool quote, pool designer contact, custom pool estimate, pool construction quote, pool design services',
    canonical: '/contact',
    ogImage: '/attached_assets/stock_images/professional_pool_de_acbadb9f.jpg',
    ogType: 'website',
    schemaType: 'contact'
  },
  '/ai-3d-design': {
    title: '3D Pool Design & Visualization | AI-Powered Custom Pool Design Technology',
    description: 'Experience cutting-edge 3D pool design and visualization technology. Our AI-powered tools create stunning, realistic pool designs tailored to your space and preferences.',
    keywords: '3D pool design, AI pool design, pool visualization, virtual pool design, pool design technology, custom pool 3D, pool design software',
    canonical: '/ai-3d-design',
    ogImage: '/attached_assets/stock_images/luxury_swimming_pool_068a5e23.jpg',
    ogType: 'website',
    schemaType: 'services'
  },
  '/ai-optimization': {
    title: 'AI Pool Design Optimization | Smart Pool Planning & Cost Efficiency',
    description: 'Optimize your pool design with AI technology for maximum efficiency, cost savings, and aesthetic appeal. Smart pool planning that balances beauty with functionality.',
    keywords: 'AI pool optimization, smart pool design, pool cost optimization, efficient pool design, pool planning AI, automated pool design',
    canonical: '/ai-optimization',
    ogImage: '/attached_assets/stock_images/luxury_swimming_pool_068a5e23.jpg',
    ogType: 'website',
    schemaType: 'services'
  },
  '/eco-design': {
    title: 'Eco-Friendly Pool Design | Sustainable Swimming Pool & Spa Solutions',
    description: 'Sustainable pool design featuring energy-efficient equipment, natural filtration systems, and eco-friendly materials. Green pool solutions that protect the environment.',
    keywords: 'eco-friendly pool design, sustainable pools, green pool technology, energy efficient pools, natural pool systems, environmentally friendly pools',
    canonical: '/eco-design',
    ogImage: '/attached_assets/stock_images/luxury_swimming_pool_068a5e23.jpg',
    ogType: 'website',
    schemaType: 'services'
  },
  '/virtual-reality': {
    title: 'Virtual Reality Pool Design Experience | Immersive Pool Visualization',
    description: 'Experience your future pool in virtual reality before construction begins. Walk through your custom pool design in stunning VR detail and make informed decisions.',
    keywords: 'VR pool design, virtual reality pools, immersive pool experience, pool VR walkthrough, virtual pool tours, pool design visualization',
    canonical: '/virtual-reality',
    ogImage: '/attached_assets/stock_images/luxury_swimming_pool_068a5e23.jpg',
    ogType: 'website',
    schemaType: 'services'
  },
  '/child-safety': {
    title: 'Child-Safe Pool Design | Pool Safety Features & Family Pool Planning',
    description: 'Comprehensive child-safe pool design featuring safety barriers, alarms, covers, and family-friendly layouts. Expert pool safety consultation and compliance guidance.',
    keywords: 'child safe pool design, pool safety features, family pool design, pool safety barriers, pool alarms, safe pool planning, pool safety compliance',
    canonical: '/child-safety',
    ogImage: '/attached_assets/stock_images/luxury_swimming_pool_068a5e23.jpg',
    ogType: 'website',
    schemaType: 'services'
  },
  '/testimonials': {
    title: 'Pool Design Customer Reviews | Success Stories & Pool Design Testimonials',
    description: 'Read customer testimonials and success stories from satisfied pool design clients. Real reviews from homeowners who transformed their outdoor spaces with expert pool design.',
    keywords: 'pool design reviews, customer testimonials, pool design success stories, pool builder reviews, satisfied customers, pool design experience',
    canonical: '/testimonials',
    ogImage: '/attached_assets/stock_images/professional_pool_de_acbadb9f.jpg',
    ogType: 'website'
  },
  '/ai-design-tool': {
    title: 'AI Pool Design Tool | Interactive Pool Designer & Cost Calculator',
    description: 'Use our interactive AI pool design tool to create custom pool layouts, calculate costs, and explore design options. Free pool planning tool with instant estimates.',
    keywords: 'AI pool design tool, pool cost calculator, interactive pool designer, pool planning tool, pool design software, free pool tool',
    canonical: '/ai-design-tool',
    ogImage: '/attached_assets/stock_images/luxury_swimming_pool_068a5e23.jpg',
    ogType: 'website'
  },
  '/diy-pools-and-spas': {
    title: 'DIY Pools and Spas | Owner-Builder Pool Construction Guide & Support',
    description: 'Complete DIY pool and spa construction guide for owner-builders. Expert consultation, detailed plans, permit assistance, and step-by-step construction support.',
    keywords: 'DIY pool construction, owner builder pools, DIY spa installation, pool construction guide, self build pools, DIY pool plans, pool building permits',
    canonical: '/diy-pools-and-spas',
    ogImage: '/attached_assets/stock_images/swimming_pool_constr_79599bd9.jpg',
    ogType: 'website',
    schemaType: 'diy'
  },
  '/faq': {
    title: 'Pool Design Consultant FAQs | Owner-Builder & DIY Pool Permit Help',
    description: 'Answers to common questions about pool design, owner-builder permits, engineering plans, DIY pools, costs, timelines, and safety requirements.',
    keywords: 'pool design FAQ, owner builder questions, pool permit help, pool engineering questions, TDH worksheet, pool construction FAQ, DIY pool questions',
    canonical: '/faq',
    ogImage: '/attached_assets/stock_images/professional_pool_de_acbadb9f.jpg',
    ogType: 'website'
  }
};

// Function to get absolute URL
export function getAbsoluteUrl(path: string): string {
  return `${SITE_URL}${path}`;
}

// Function to get SEO data for a route
export function getSEOData(path: string): SEOData | null {
  return seoRoutes[path] || null;
}