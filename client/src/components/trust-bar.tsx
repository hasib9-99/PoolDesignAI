import { Star } from "lucide-react";

export default function TrustBar() {
  return (
    <section className="gradient-soft py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <p className="text-lg text-muted-foreground mb-4">Professional pool design services you can trust</p>
          <div className="flex justify-center items-center space-x-6 flex-wrap gap-4">
            <div className="font-semibold text-blue-600">Licensed & Insured</div>
            <div className="text-muted-foreground">|</div>
            <div className="font-semibold text-blue-600">AI-Powered Design Tools</div>
            <div className="text-muted-foreground">|</div>
            <div className="font-semibold text-blue-600">Free Consultations</div>
          </div>
        </div>
      </div>
    </section>
  );
}
