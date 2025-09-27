import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProtectedImage } from "@/components/image-protection";
// High-Definition 3D Pool Design Images
import hdImage1 from "@assets/image 1.png";
import hdImage2 from "@assets/image 2.png";
import hdImage3 from "@assets/image 3.png";
import hdImage4 from "@assets/image 4.png";
import hdImage5 from "@assets/image 5.png";
import hdImage6 from "@assets/image 6.png";
import hdImage7 from "@assets/image 7.png";
import hdImage8 from "@assets/image 8.png";
import hdImage9 from "@assets/image 9.png";
import hdImage10 from "@assets/image 10.png";
import hdImage11 from "@assets/image 11.png";
import hdImage12 from "@assets/image 12.png";
import hdImage13 from "@assets/image 13.png";
import hdImage14 from "@assets/image 14.png";
import hdImage15 from "@assets/image 15.png";
import hdImage16 from "@assets/image 16.png";
import hdImage17 from "@assets/image 17.png";
import hdImage18 from "@assets/image 18.png";
import hdImage19 from "@assets/image 19.png";
import hdImage20 from "@assets/image 20.png";
import hdImage21 from "@assets/image 21.png";
import hdImage22 from "@assets/image 22.png";
import hdImage23 from "@assets/image 23.png";
import hdImage24 from "@assets/image 24.png";
import hdImage25 from "@assets/image 25.png";
import hdImage26 from "@assets/image 26.png";
import hdImage27 from "@assets/image 27.png";
import hdImage28 from "@assets/image 28.png";
import hdImage29 from "@assets/image 29.png";
import hdImage30 from "@assets/image 30.png";
import hdImage31 from "@assets/image 31.png";
import hdImage32 from "@assets/image 32.png";
import hdImage33 from "@assets/image 33.png";
import hdImage34 from "@assets/image 34.png";
import hdImage35 from "@assets/image 35.png";
import hdImage36 from "@assets/image 36.png";
import hdImage37 from "@assets/image 37.png";
import hdImage38 from "@assets/image 38.png";
import hdImage39 from "@assets/image 39.png";
import hdImage40 from "@assets/image 40.png";
import hdImage41 from "@assets/image 41.png";
import hdImage42 from "@assets/image 42.png";

export default function Portfolio() {
  const [activeFilter, setActiveFilter] = useState('all');

  const portfolioItems = [
    {
      title: "Luxury Resort Entertainment Pool",
      description: "Spectacular outdoor living space with pool, spa, outdoor kitchen, and fire features.",
      category: "luxury",
      image: hdImage1
    },
    {
      title: "Natural Stone Waterfall Pool",
      description: "Organic design with rock formations, waterfalls, and lush tropical landscaping.",
      category: "natural",
      image: hdImage2
    },
    {
      title: "Stone Spa & Pool Combination",
      description: "Natural stone pool and spa with integrated rock features and designer landscaping.",
      category: "natural",
      image: hdImage3
    },
    {
      title: "Luxury Grotto Paradise",
      description: "Multi-level grotto design with dramatic rock formations and ambient lighting.",
      category: "luxury",
      image: hdImage4
    },
    {
      title: "Executive Outdoor Living",
      description: "Sophisticated pool and spa with pergola, outdoor kitchen, and mountain views.",
      category: "luxury",
      image: hdImage5
    },
    {
      title: "Mountain Estate Pool",
      description: "Rustic luxury design with natural stone, waterfalls, and complete landscape integration.",
      category: "natural",
      image: hdImage6
    },
    {
      title: "Compact Backyard Retreat",
      description: "Space-efficient design with spa and natural rock features for smaller yards.",
      category: "residential",
      image: hdImage7
    },
    {
      title: "Geometric Luxury Pool",
      description: "Contemporary design with clean lines, water features, and sophisticated lighting.",
      category: "modern",
      image: hdImage8
    },
    {
      title: "Modern Tropical Design",
      description: "Sleek contemporary pool with spa in lush tropical setting.",
      category: "modern",
      image: hdImage9
    },
    {
      title: "Resort-Style Paradise",
      description: "Expansive tropical pool with swim-up areas and luxurious landscaping.",
      category: "luxury",
      image: hdImage10
    },
    {
      title: "Contemporary Water Feature Pool",
      description: "Elegant modern design with decorative water fountains and premium lounging areas.",
      category: "modern",
      image: hdImage11
    },
    {
      title: "Natural Spa & Outdoor Dining",
      description: "Organic pool design with integrated spa and covered outdoor dining pavilion.",
      category: "natural",
      image: hdImage12
    },
    {
      title: "Estate Pool with Mountain Views",
      description: "Sophisticated rectangular pool design with stunning mountain vistas and formal landscaping.",
      category: "luxury",
      image: hdImage13
    },
    {
      title: "Modern Water Wall Feature",
      description: "Contemporary pool with dramatic vertical water wall and sleek architectural details.",
      category: "modern",
      image: hdImage14
    },
    {
      title: "Tropical Sunset Paradise",
      description: "Exotic tropical pool setting with lush landscaping and stunning sunset ambiance.",
      category: "luxury",
      image: hdImage15
    },
    {
      title: "Resort-Style Tropical Oasis",
      description: "Expansive tropical pool with swim-up areas and vibrant tropical landscaping.",
      category: "luxury",
      image: hdImage16
    },
    {
      title: "Geometric Family Pool",
      description: "Clean rectangular pool design with water features and traditional home integration.",
      category: "modern",
      image: hdImage17
    },
    {
      title: "Family Pool with Fire Feature",
      description: "Complete backyard transformation with pool, spa, fire bowl, and entertainment areas.",
      category: "residential",
      image: hdImage18
    },
    {
      title: "Enclosed Tropical Retreat",
      description: "Glass-enclosed pool area with tropical plants and year-round swimming comfort.",
      category: "modern",
      image: hdImage19
    },
    {
      title: "Pergola Paradise Pool",
      description: "Natural pool design with wooden pergola, tropical landscaping, and spa integration.",
      category: "natural",
      image: hdImage20
    },
    {
      title: "Mediterranean Pergola Oasis",
      description: "Elegant Mediterranean-style pool with stone pergola and sophisticated outdoor living spaces.",
      category: "luxury",
      image: hdImage21
    },
    {
      title: "Dramatic Nighttime Paradise",
      description: "Stunning natural pool with rock waterfalls, fire features, and enchanting night lighting.",
      category: "luxury",
      image: hdImage22
    },
    {
      title: "Contemporary Fountain Pool",
      description: "Modern pool design featuring elegant water fountains and sophisticated outdoor seating.",
      category: "modern",
      image: hdImage23
    },
    {
      title: "Glass-Enclosed Tropical Sanctuary",
      description: "Year-round swimming in a stunning glass-enclosed pool with lush tropical surroundings.",
      category: "modern",
      image: hdImage24
    },
    {
      title: "Classic Brick Estate Pool",
      description: "Traditional family pool with natural stone spa and complete outdoor entertainment area.",
      category: "residential",
      image: hdImage25
    },
    {
      title: "Minimalist Luxury Pool",
      description: "Ultra-modern pool with LED lighting, clean white walls, and contemporary water features.",
      category: "modern",
      image: hdImage26
    },
    {
      title: "Contemporary Water Wall Pool",
      description: "Sophisticated contemporary pool featuring dramatic water wall and premium spa integration.",
      category: "modern",
      image: hdImage27
    },
    {
      title: "Modern Stone & Spa Design",
      description: "Modern pool design with natural stone features, spa, and elegant water elements.",
      category: "modern",
      image: hdImage28
    },
    {
      title: "Private Tropical Resort Pool",
      description: "Expansive tropical paradise with fire pit, palm trees, and resort-style amenities.",
      category: "luxury",
      image: hdImage29
    },
    {
      title: "Geometric Excellence Pool",
      description: "Clean geometric pool design with integrated spa and modern outdoor living space.",
      category: "modern",
      image: hdImage30
    },
    {
      title: "Twilight Estate Paradise",
      description: "Sophisticated estate pool with elegant umbrellas and stunning twilight ambiance.",
      category: "luxury",
      image: hdImage31
    },
    {
      title: "Natural Stone Spa Oasis",
      description: "Organic freeform pool with integrated stone spa and enchanting night lighting.",
      category: "natural",
      image: hdImage32
    },
    {
      title: "Contemporary Colorful Design",
      description: "Modern pool with vibrant landscaping, spa, and clean geometric lines.",
      category: "modern",
      image: hdImage33
    },
    {
      title: "Modern Blue Estate Pool",
      description: "Striking contemporary design with blue architecture and integrated spa features.",
      category: "modern",
      image: hdImage34
    },
    {
      title: "Grand Estate Water Feature",
      description: "Expansive luxury estate with multi-level pool, spa, and comprehensive landscaping.",
      category: "luxury",
      image: hdImage35
    },
    {
      title: "Covered Water Wall Sanctuary",
      description: "Elegant covered pool area featuring dramatic mosaic water wall and spa seating.",
      category: "luxury",
      image: hdImage36
    },
    {
      title: "Estate Pool with Putting Green",
      description: "Luxury estate featuring infinity pool, spa, and private putting green amenity.",
      category: "luxury",
      image: hdImage37
    },
    {
      title: "Ultra-Modern Minimalist Pool",
      description: "Striking contemporary pool with unique geometric design and premium materials.",
      category: "modern",
      image: hdImage38
    },
    {
      title: "Traditional Pool with Pavilion",
      description: "Classic family pool design with outdoor kitchen pavilion and entertainment areas.",
      category: "residential",
      image: hdImage39
    },
    {
      title: "Luxury Nighttime Water Features",
      description: "Dramatic pool design with multiple fountains, pottery accents, and mood lighting.",
      category: "luxury",
      image: hdImage40
    },
    {
      title: "Natural Waterfall Paradise",
      description: "Organic pool design with rock waterfall, spa, and lush tropical landscaping.",
      category: "natural",
      image: hdImage41
    },
    {
      title: "Tropical Sunset Retreat",
      description: "Freeform natural pool with tropical plants and stunning sunset atmosphere.",
      category: "natural",
      image: hdImage42
    }
  ];

  const filters = [
    { id: 'all', label: 'All Projects' },
    { id: 'residential', label: 'Residential' },
    { id: 'luxury', label: 'Luxury' },
    { id: 'natural', label: 'Natural' },
    { id: 'modern', label: 'Modern' }
  ];

  const filteredItems = activeFilter === 'all' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeFilter);

  return (
    <section id="portfolio" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">Featured Projects</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our portfolio of stunning pool designs created for homeowners across the country.
          </p>
        </div>

        {/* Portfolio Filters */}
        <div className="flex justify-center mb-12 flex-wrap gap-4">
          {filters.map((filter) => (
            <Button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                activeFilter === filter.id
                  ? 'bg-orange-500 text-white hover:bg-orange-600'
                  : 'bg-muted text-muted-foreground hover:bg-orange-500 hover:text-white'
              }`}
              data-testid={`filter-button-${filter.id}`}
            >
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item, index) => (
            <Card 
              key={index}
              className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              data-testid={`portfolio-item-${index}`}
            >
              <ProtectedImage 
                src={item.image} 
                alt={item.title}
                className="w-full h-64 object-cover"
                loading="lazy"
                watermarkText="© Pool Design Consultant"
              />
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2 text-foreground">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-bold hover:bg-primary/90 transition-colors"
            data-testid="button-view-all-projects"
          >
            View All Projects
          </Button>
        </div>
      </div>
    </section>
  );
}
