import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Mic, MicOff, Sparkles, Play, RotateCcw, Send, Lightbulb, Save, Users, Calculator, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { PoolSpecs, CostEstimate, ConstructionPlan } from "@shared/schema";

const demoPrompts = [
  "Design me a lagoon-style pool with a fire feature, a swim-up bar, and a shallow sunshelf for kids.",
  "Create a modern rectangular lap pool about 40ft long with two LED lights, a raised spa, and a pergola.",
  "I want a natural freeform pool with rock waterfall, tanning ledge, and integrated solar heating.",
];

export default function AIDesignTool() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [parsed, setParsed] = useState<PoolSpecs | null>(null);
  const [renderSeed, setRenderSeed] = useState(1);
  const [est, setEst] = useState<CostEstimate | null>(null);
  const [plan, setPlan] = useState<ConstructionPlan | null>(null);
  const [aiImageUrl, setAiImageUrl] = useState<string | null>(null);
  const [activePrompt, setActivePrompt] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  // Web Speech API setup
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.lang = "en-US";
      recog.continuous = false;
      recog.interimResults = true;
      recog.onresult = (e: any) => {
        let final = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const chunk = e.results[i][0].transcript;
          if (e.results[i].isFinal) final += chunk;
        }
        if (final) setTranscript((prev) => (prev ? prev + " " : "") + final.trim());
      };
      recog.onend = () => setListening(false);
      recognitionRef.current = recog;
    }
  }, []);

  // AI Processing mutation
  const processDesignMutation = useMutation({
    mutationFn: async (text: string) => {
      const response = await apiRequest('POST', '/api/ai-design-process', { transcript: text });
      const data = await response.json();
      return data;
    },
    onSuccess: (data) => {
      setParsed(data.specs);
      setEst(data.estimate);
      setPlan(data.plan);
      setAiImageUrl(data.imageUrl);
      setRenderSeed((s) => s + 1);
      toast({
        title: "Design Generated!",
        description: "Your AI pool design is ready to review.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Processing Error",
        description: error.message || "Failed to process design. Please try again.",
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsProcessing(false);
    }
  });


  function startListening() {
    if (!recognitionRef.current) return;
    setTranscript("");
    setListening(true);
    recognitionRef.current.start();
  }

  function stopListening() {
    recognitionRef.current?.stop();
  }

  function handleInterpret() {
    if (!transcript.trim()) return;
    setIsProcessing(true);
    processDesignMutation.mutate(transcript);
  }

  function resetAll() {
    setListening(false);
    setTranscript("");
    setParsed(null);
    setEst(null);
    setPlan(null);
    setAiImageUrl(null);
    setRenderSeed((s) => s + 1);
  }

  // Helper functions for data conversion
  const mapAIFeaturesToCalculatorTokens = (aiFeatures: string[]): string[] => {
    const featureMap: { [key: string]: string } = {
      // Spa variants
      'raised spa': 'spa',
      'spa': 'spa',
      'hot tub': 'spa',
      'jacuzzi': 'spa',
      
      // Waterfall variants
      'waterfall': 'waterfall',
      'rock waterfall': 'waterfall',
      'water feature': 'waterfall',
      'natural waterfall': 'waterfall',
      
      // Lighting variants
      'led lights': 'lighting',
      'lighting': 'lighting',
      'led lighting': 'lighting',
      'pool lights': 'lighting',
      
      // Heating variants
      'heating': 'heating',
      'pool heating': 'heating',
      'solar heating': 'heating',
      'heater': 'heating'
    };
    
    const mappedFeatures: string[] = [];
    
    aiFeatures.forEach(feature => {
      const normalizedFeature = feature.toLowerCase().trim();
      if (featureMap[normalizedFeature]) {
        const mappedFeature = featureMap[normalizedFeature];
        if (!mappedFeatures.includes(mappedFeature)) {
          mappedFeatures.push(mappedFeature);
        }
      }
    });
    
    return mappedFeatures;
  };

  const convertToCalculatorData = () => {
    if (!parsed || !est) return null;
    
    // Map AI specs to calculator format
    const sizeMapping: { [key: string]: string } = {
      'small': 'small',
      'medium': 'medium', 
      'large': 'large',
      'extra large': 'custom',
      'xl': 'custom'
    };
    
    const typeMapping: { [key: string]: string } = {
      'lagoon': 'freeform',
      'modern': 'rectangular',
      'natural': 'freeform',
      'luxury': 'infinity',
      'rectangular': 'rectangular',
      'freeform': 'freeform'
    };
    
    // Determine size based on length
    let size = 'small';
    if (parsed.approxLengthFt > 35) size = 'medium';
    if (parsed.approxLengthFt > 45) size = 'large';
    if (parsed.approxLengthFt > 55) size = 'custom';
    
    // Map AI features to calculator tokens
    const mappedFeatures = mapAIFeaturesToCalculatorTokens(parsed.features);
    
    return {
      size: sizeMapping[parsed.style.toLowerCase()] || size,
      type: typeMapping[parsed.style.toLowerCase()] || 'freeform',
      material: 'concrete', // Default material
      features: JSON.stringify(mappedFeatures),
      timeline: 'immediate'
    };
  };
  
  const handleSaveToCostCalculator = () => {
    const calculatorData = convertToCalculatorData();
    if (!calculatorData) {
      toast({ title: "No Design Available", description: "Please generate a pool design first.", variant: "destructive" });
      return;
    }
    
    // Navigate to cost calculator with pre-populated data
    const params = new URLSearchParams({
      fromAI: 'true',
      size: calculatorData.size,
      type: calculatorData.type,
      material: calculatorData.material,
      features: calculatorData.features,
      timeline: calculatorData.timeline,
      poolLength: parsed!.approxLengthFt.toString(),
      poolStyle: parsed!.style,
      estimatedRange: `$${est!.totalLow.toLocaleString()} - $${est!.totalHigh.toLocaleString()}`
    });
    
    // Navigate to home page with calculator section and parameters
    setLocation(`/?${params.toString()}#calculator`);
    
    toast({
      title: "Redirecting to Cost Calculator",
      description: "Your AI design has been pre-loaded into the cost calculator form.",
    });
  };
  
  const handleCreateContactInquiry = () => {
    if (!parsed || !est) {
      toast({ title: "No Design Available", description: "Please generate a pool design first.", variant: "destructive" });
      return;
    }
    
    const details = `Voice-to-Pool AI Design Request:\n\nPool Style: ${parsed.style}\nApproximate Length: ${parsed.approxLengthFt}ft\nFeatures: ${parsed.features.join(', ')}\nChild-Friendly: ${parsed.childFriendly ? 'Yes' : 'No'}\n\nEstimated Cost Range: $${est.totalLow.toLocaleString()} - $${est.totalHigh.toLocaleString()}\nTimeline: ${est.timelineWeeks} weeks\n\nOriginal Voice Request: "${parsed.raw}"`;
    
    // Navigate to contact form with pre-populated data
    const params = new URLSearchParams({
      fromAI: 'true',
      details: details,
      budget: `$${est.totalLow.toLocaleString()} - $${est.totalHigh.toLocaleString()}`,
      poolStyle: parsed.style,
      poolLength: parsed.approxLengthFt.toString(),
      features: parsed.features.join(', ')
    });
    
    setLocation(`/contact?${params.toString()}`);
    
    toast({
      title: "Redirecting to Contact Form",
      description: "Your AI design details have been pre-loaded into the contact form.",
    });
  };

  const planBullets = useMemo(() => {
    if (!parsed) return [];
    
    const bullets = [
      "Plan View: Pool outline with primary dimensions & depths",
      "Sections: Shallow, transition, and deep areas",
      "Hydraulics: Pump, filter, suction/return lines, skimmer locations",
      "Lighting: LED positions & GFCI notes",
      "Electrical: Equipment pad layout & conduit paths",
      "Decking & Coping: Material callouts and expansion joints",
      "Safety: Barrier, gates, alarms, anti-entrapment compliance",
    ];
    
    if (parsed.features.includes("Raised Spa")) bullets.push("Spa loop: Air/water lines, spillway, heater");
    if (parsed.features.includes("Swim-Up Bar")) bullets.push("Swim-up bar: Stools, counter footing, clearances");
    if (parsed.features.includes("Sunshelf")) bullets.push("Sunshelf: Ledge depth & bubblers (optional)");
    if (parsed.features.includes("Fire Feature")) bullets.push("Fire feature: Gas line route & isolation valve");
    if (parsed.features.includes("Solar Heating")) bullets.push("Solar loop: Roof array, check valve, controller");
    
    return bullets;
  }, [parsed]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Sparkles className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            AI Pool Design Tool
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Speak your pool vision into existence. Our AI analyzes your request, generates a schematic preview, 
            estimates costs, and creates a detailed construction plan—all in seconds.
          </p>
          
          <Alert className="max-w-2xl mx-auto border-blue-200 bg-blue-50 mb-8" data-testid="alert-ai-powered">
            <Lightbulb className="h-5 w-5 text-blue-600" />
            <AlertTitle className="text-blue-800">Powered by Advanced AI</AlertTitle>
            <AlertDescription className="text-blue-700">
              Uses OpenAI's latest models to understand natural language and generate professional pool designs.
            </AlertDescription>
          </Alert>
        </div>

        {/* Main Design Interface */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          
          {/* Voice/Text Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            <Card data-testid="voice-input-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="h-6 w-6 text-blue-600" />
                  Describe Your Dream Pool
                </CardTitle>
                <CardDescription>
                  Use voice or text to describe what you want. Be specific about features, size, style, and any special requirements.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                <div className="flex items-center gap-2 text-sm">
                  <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1">
                    <StatusDot active={!!parsed} />
                    Status: {parsed ? "Design Generated" : "Awaiting Input"}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setTranscript(demoPrompts[activePrompt]);
                      setActivePrompt((p) => (p + 1) % demoPrompts.length);
                    }}
                    data-testid="button-try-example"
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Try Example
                  </Button>
                </div>

                <div className="space-y-4">
                  <label className="text-sm font-medium">Your Pool Vision</label>
                  <Textarea
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    placeholder="e.g., Design me a lagoon-style pool with a fire feature, a swim-up bar, and a shallow sunshelf for kids."
                    className="min-h-[120px]"
                    data-testid="textarea-pool-vision"
                  />

                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      onClick={listening ? stopListening : startListening}
                      disabled={!recognitionRef.current}
                      variant={listening ? "destructive" : "secondary"}
                      data-testid="button-voice-record"
                    >
                      {listening ? (
                        <>
                          <MicOff className="h-4 w-4 mr-2" />
                          Stop Recording
                        </>
                      ) : (
                        <>
                          <Mic className="h-4 w-4 mr-2" />
                          {recognitionRef.current ? "Record Voice" : "Voice Unavailable"}
                        </>
                      )}
                    </Button>

                    <Button
                      onClick={handleInterpret}
                      disabled={!transcript.trim() || isProcessing}
                      className="bg-blue-600 hover:bg-blue-700"
                      data-testid="button-generate-design"
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin h-4 w-4 mr-2 rounded-full border-2 border-current border-t-transparent" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Generate Design
                        </>
                      )}
                    </Button>

                    <Button
                      onClick={resetAll}
                      variant="outline"
                      data-testid="button-reset"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* How It Works */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-sky-50 to-emerald-50" data-testid="how-it-works-card">
              <CardHeader>
                <CardTitle className="text-xl">How It Works</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3 text-sm">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">1</span>
                    <span>Voice or text input gets transcribed and analyzed</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">2</span>
                    <span>AI extracts pool style, features, and requirements</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">3</span>
                    <span>Generate schematic preview and specifications</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">4</span>
                    <span>Calculate costs, timeline, and construction plan</span>
                  </li>
                </ol>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Output Results */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          
          {/* AI Design Preview */}
          <Card data-testid="design-preview-card">
            <CardHeader>
              <CardTitle>AI Pool Design Rendering</CardTitle>
              <CardDescription>Realistic 3D visualization powered by DALL-E</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border border-gray-200 rounded-xl overflow-hidden bg-gradient-to-br from-blue-100 to-cyan-100">
                <AIDesignPreview imageUrl={aiImageUrl} specs={parsed} seed={renderSeed} />
              </div>
            </CardContent>
          </Card>

          {/* Specifications */}
          <Card data-testid="specifications-card">
            <CardHeader>
              <CardTitle>Interpreted Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              {!parsed ? (
                <EmptyState note="Generate a design to see detailed specifications." />
              ) : (
                <div className="space-y-4">
                  <SpecRow label="Style" value={parsed.style} />
                  <SpecRow label="Approx. Length" value={`${parsed.approxLengthFt} ft`} />
                  <SpecRow label="Features" value={parsed.features.join(", ") || "Basic pool"} />
                  <SpecRow 
                    label="Child-Friendly" 
                    value={parsed.childFriendly ? "Yes - includes safety features" : "Consider safety features"} 
                  />
                  
                  {planBullets.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-sm font-medium mb-3">Construction Plan Checklist</h4>
                      <ul className="space-y-2">
                        {planBullets.map((bullet, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Cost & Timeline */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Cost Breakdown */}
          <Card className="lg:col-span-2" data-testid="cost-breakdown-card">
            <CardHeader>
              <CardTitle>Cost & Timeline Estimate</CardTitle>
            </CardHeader>
            <CardContent>
              {!est ? (
                <EmptyState note="Generate a design to see cost estimates." />
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <CostItem label="Base Construction" value={`$${est.lineItems.base.toLocaleString()}`} />
                    <CostItem label="Features" value={`$${est.lineItems.featuresCost.toLocaleString()}`} />
                    <CostItem label="Design & Permits" value={`$${(est.lineItems.design + est.lineItems.permits).toLocaleString()}`} />
                    <CostItem label="Size Factor" value={`×${est.lineItems.sizeFactor.toFixed(2)}`} />
                    <CostItem label="Contingency" value={`$${est.lineItems.contingency.toLocaleString()}`} />
                    <CostItem label="Timeline" value={`${est.timelineWeeks} weeks`} />
                  </div>
                  
                  <div className="bg-gray-900 text-white rounded-xl p-6">
                    <div className="text-sm uppercase tracking-wide text-gray-300 mb-2">Estimated Investment Range</div>
                    <div className="text-3xl font-bold mb-2">
                      ${est.totalLow.toLocaleString()} – ${est.totalHigh.toLocaleString()}
                    </div>
                    <div className="text-gray-300">Projected completion: ~{est.timelineWeeks} weeks</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card data-testid="next-steps-card">
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={handleSaveToCostCalculator}
                disabled={!parsed || isProcessing}
                className="w-full justify-start"
                data-testid="button-save-to-calculator"
              >
                <Calculator className="h-4 w-4 mr-2" />
                Open Cost Calculator
              </Button>
              
              <Button
                onClick={handleCreateContactInquiry}
                disabled={!parsed || isProcessing}
                variant="outline"
                className="w-full justify-start"
                data-testid="button-contact-inquiry"
              >
                <Phone className="h-4 w-4 mr-2" />
                Get Professional Quote
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start"
                disabled={!parsed}
                data-testid="button-refine-design"
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                Refine Design
              </Button>
              
              <p className="text-xs text-gray-500 mt-4">
                *AI-generated estimates for planning purposes. Final costs require professional assessment.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function StatusDot({ active = false }: { active?: boolean }) {
  return (
    <span
      className={`inline-block h-2.5 w-2.5 rounded-full ${active ? "bg-emerald-500" : "bg-gray-300"}`}
      aria-label={active ? "active" : "inactive"}
    />
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-3 items-start gap-3 p-3 bg-gray-50 rounded-lg">
      <div className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</div>
      <div className="col-span-2 text-sm">{value}</div>
    </div>
  );
}

function CostItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}

function EmptyState({ note }: { note: string }) {
  return (
    <div className="border border-dashed border-gray-300 rounded-xl p-8 text-center text-gray-500">
      {note}
    </div>
  );
}

// AI Design Preview Component
function AIDesignPreview({ imageUrl, specs, seed }: { imageUrl: string | null; specs: PoolSpecs | null; seed: number }) {
  if (!specs && !imageUrl) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg">
        <div className="text-center text-gray-500">
          <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">AI pool rendering will appear here</p>
        </div>
      </div>
    );
  }

  if (imageUrl) {
    return (
      <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
        <img 
          src={imageUrl} 
          alt="AI-generated pool design"
          className="w-full h-full object-cover object-center"
          onError={(e) => {
            // Fallback if image fails to load
            e.currentTarget.style.display = 'none';
            e.currentTarget.nextElementSibling?.classList.remove('hidden');
          }}
        />
        <div className="hidden w-full h-full flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 text-red-600">
          <div className="text-center">
            <p className="text-sm">Image failed to load</p>
            <p className="text-xs opacity-75 mt-1">Please try generating a new design</p>
          </div>
        </div>
        {specs && (
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-3">
            <p className="text-sm font-medium">
              {specs.style} • {specs.approxLengthFt}ft • {specs.features.length} features
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full h-64 flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg">
      <div className="text-center text-amber-700">
        <div className="animate-spin h-6 w-6 mx-auto mb-2 rounded-full border-2 border-current border-t-transparent" />
        <p className="text-sm">Generating AI design...</p>
      </div>
    </div>
  );
}