import { Button } from "@/components/ui/button";
import { Bot, Play } from "lucide-react";

export default function Hero() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-3d-background relative text-white pt-24 pb-16 min-h-screen flex items-center overflow-hidden">
      {/* Magical gradient overlay for enhanced sunset effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="hero-heading text-5xl md:text-7xl font-bold mb-6 leading-tight fade-in text-white">
            Transform Your
            <span className="block">
              Dream Pool
            </span>
            Into Reality
          </h1>
          <p className="hero-description text-xl md:text-2xl mb-8 text-white max-w-3xl mx-auto leading-relaxed fade-in">
            Leading custom pool designer with 47+ years experience. Get personalized 3D inground pool designs, accurate construction cost estimates, and professional pool consultation nationwide.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 fade-in">
            <Button
              onClick={() => scrollToSection('ai-quiz')}
              className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transform hover:-translate-y-1 transition-all duration-300 shadow-lg"
              data-testid="button-ai-quiz"
            >
              <Bot className="mr-2 h-5 w-5" />
              Start AI Design Quiz
            </Button>
            <Button
              onClick={() => scrollToSection('portfolio')}
              variant="outline"
              className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 bg-white/10 backdrop-blur-sm"
              data-testid="button-view-work"
            >
              <Play className="mr-2 h-5 w-5" />
              View Our Work
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="glass-card p-4" data-testid="stat-pools-designed">
              <div className="text-2xl font-bold text-white drop-shadow-lg">5000+</div>
              <div className="text-sm opacity-90 text-white drop-shadow">Pools Designed</div>
            </div>
            <div className="glass-card p-4" data-testid="stat-satisfaction">
              <div className="text-2xl font-bold text-white drop-shadow-lg">98%</div>
              <div className="text-sm opacity-90 text-white drop-shadow">Client Satisfaction</div>
            </div>
            <div className="glass-card p-4" data-testid="stat-experience">
              <div className="text-2xl font-bold text-white drop-shadow-lg">34</div>
              <div className="text-sm opacity-90 text-white drop-shadow">Years Experience</div>
            </div>
            <div className="glass-card p-4" data-testid="stat-support">
              <div className="text-2xl font-bold text-white drop-shadow-lg">24/7</div>
              <div className="text-sm opacity-90 text-white drop-shadow">Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
