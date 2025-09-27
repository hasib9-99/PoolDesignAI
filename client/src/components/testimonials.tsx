import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Sarah & Mike Johnson",
      location: "Beverly Hills, CA",
      initials: "SM",
      bgColor: "bg-orange-200",
      textColor: "text-orange-600",
      content: "The AI-powered design process was incredible. They captured exactly what we envisioned and delivered a pool that exceeded our expectations. The whole family loves it!"
    },
    {
      name: "Robert Kim",
      location: "Austin, TX", 
      initials: "RK",
      bgColor: "bg-blue-200",
      textColor: "text-blue-600",
      content: "From design to completion, the process was seamless. The 3D visualizations helped us make informed decisions, and the final result is absolutely stunning."
    },
    {
      name: "Lisa Chen",
      location: "Phoenix, AZ",
      initials: "LC", 
      bgColor: "bg-green-200",
      textColor: "text-green-600",
      content: "Professional, responsive, and incredibly talented. They turned our small backyard into a resort-like oasis. Best investment we've ever made!"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">What Our Clients Say</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it. Hear from satisfied homeowners who transformed their backyards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index}
              className="border-2 border-border hover:border-primary transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
              data-testid={`testimonial-card-${index}`}
            >
              <CardContent className="p-8">
                <div className="flex text-orange-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className={`w-12 h-12 ${testimonial.bgColor} rounded-full flex items-center justify-center mr-4`}>
                    <span className={`font-bold ${testimonial.textColor}`}>{testimonial.initials}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
