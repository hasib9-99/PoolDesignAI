import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Eye, Palette, Rotate3D } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

const designSchema = z.object({
  poolShape: z.string().min(1, "Please select a pool shape"),
  poolSize: z.string().min(1, "Please select a pool size"),
  style: z.string().min(1, "Please select a design style"),
  features: z.array(z.string()).optional(),
});

type DesignForm = z.infer<typeof designSchema>;

interface PoolDesignResult {
  imageUrl: string;
  estimatedCost: number;
  timeline: string;
}

export default function AI3DDesign() {
  const [step, setStep] = useState(1);
  const [designGenerated, setDesignGenerated] = useState(false);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [designResult, setDesignResult] = useState<PoolDesignResult | null>(null);
  const { toast } = useToast();

  const form = useForm<DesignForm>({
    resolver: zodResolver(designSchema),
    defaultValues: {
      poolShape: "",
      poolSize: "",
      style: "",
      features: [],
    },
  });

  const generateDesignMutation = useMutation({
    mutationFn: async (data: DesignForm) => {
      const requestPayload = {
        poolShape: data.poolShape,
        poolSize: data.poolSize,
        style: data.style,
        features: selectedFeatures
      };
      console.log('API Request Payload:', requestPayload);
      
      const response = await fetch('/api/generate-pool-design', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestPayload)
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate design');
      }
      
      return response.json();
    },
    onSuccess: (result: any) => {
      setDesignResult({
        imageUrl: result.imageUrl,
        estimatedCost: result.estimatedCost,
        timeline: result.timeline
      });
      setDesignGenerated(true);
      toast({
        title: "Design Generated!",
        description: "Your AI pool design has been created successfully.",
      });
    },
    onError: (error: any) => {
      console.error('Design generation failed:', error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate pool design. Please try again.",
        variant: "destructive"
      });
    }
  });

  const features = [
    { id: "waterfall", name: "Waterfall", cost: "+$2,500" },
    { id: "spa", name: "Integrated Spa", cost: "+$8,000" },
    { id: "lighting", name: "LED Lighting", cost: "+$800" },
    { id: "heating", name: "Pool Heating", cost: "+$3,500" },
    { id: "tanning-ledge", name: "Tanning Ledge", cost: "+$2,200" },
    { id: "swim-up-bar", name: "Swim-up Bar", cost: "+$5,000" },
  ];

  const handleFeatureToggle = (featureId: string) => {
    setSelectedFeatures(prev => {
      const newFeatures = prev.includes(featureId) 
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId];
      console.log('Feature toggle - ID:', featureId, 'New features:', newFeatures);
      return newFeatures;
    });
  };

  const onSubmit = (data: DesignForm) => {
    console.log('onSubmit - Form data:', data);
    console.log('onSubmit - Selected features:', selectedFeatures);
    form.setValue("features", selectedFeatures);
    generateDesignMutation.mutate(data);
  };

  const handleDownload = async () => {
    if (!designResult?.imageUrl) {
      toast({
        title: "No Design Available",
        description: "Please generate a design first before downloading.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Use a backend proxy endpoint to avoid CORS issues
      const response = await fetch(`/api/download-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ imageUrl: designResult.imageUrl })
      });

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `pool-design-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Download Started",
        description: "Your pool design is being downloaded.",
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download the design. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSaveDesign = () => {
    if (!designResult) {
      toast({
        title: "No Design Available",
        description: "Please generate a design first before saving.",
        variant: "destructive"
      });
      return;
    }

    try {
      const designData = {
        ...designResult,
        poolShape: form.getValues('poolShape'),
        poolSize: form.getValues('poolSize'),
        style: form.getValues('style'),
        features: selectedFeatures,
        savedAt: new Date().toISOString()
      };

      // Save to localStorage
      const savedDesigns = JSON.parse(localStorage.getItem('savedPoolDesigns') || '[]');
      savedDesigns.push(designData);
      localStorage.setItem('savedPoolDesigns', JSON.stringify(savedDesigns));

      toast({
        title: "Design Saved!",
        description: "Your pool design has been saved to your browser.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save the design. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleGetQuote = () => {
    if (!designResult) {
      toast({
        title: "No Design Available",
        description: "Please generate a design first before requesting a quote.",
        variant: "destructive"
      });
      return;
    }

    // Navigate to contact page with design details in the URL parameters
    const designDetails = {
      cost: designResult.estimatedCost,
      timeline: designResult.timeline,
      shape: form.getValues('poolShape'),
      size: form.getValues('poolSize'),
      style: form.getValues('style'),
      features: selectedFeatures.join(',')
    };

    const params = new URLSearchParams(designDetails as any).toString();
    window.location.href = `/contact?design=true&${params}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" data-testid="button-back">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gradient">AI 3D Pool Designer</h1>
                <p className="text-muted-foreground">Create stunning 3D visualizations of your dream pool</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-gradient-to-r from-blue-50 to-orange-50">
              <Rotate3D className="w-4 h-4 mr-2" />
              AI-Powered
            </Badge>
          </div>

          {!designGenerated ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Design Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Palette className="w-5 h-5 mr-2 text-blue-600" />
                    Design Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="poolShape"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pool Shape</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-pool-shape">
                                  <SelectValue placeholder="Select pool shape" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="rectangular">Rectangular</SelectItem>
                                <SelectItem value="kidney">Kidney</SelectItem>
                                <SelectItem value="freeform">Freeform</SelectItem>
                                <SelectItem value="infinity">Infinity Edge</SelectItem>
                                <SelectItem value="lap">Lap Pool</SelectItem>
                                <SelectItem value="geometric">Geometric</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="poolSize"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pool Size</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-pool-size">
                                  <SelectValue placeholder="Select pool size" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="small">Small (12' x 24')</SelectItem>
                                <SelectItem value="medium">Medium (16' x 32')</SelectItem>
                                <SelectItem value="large">Large (20' x 40')</SelectItem>
                                <SelectItem value="xl">Extra Large (24' x 48')</SelectItem>
                                <SelectItem value="custom">Custom Dimensions</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="style"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Design Style</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-design-style">
                                  <SelectValue placeholder="Select design style" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="modern">Modern Minimalist</SelectItem>
                                <SelectItem value="tropical">Tropical Paradise</SelectItem>
                                <SelectItem value="luxury">Luxury Resort</SelectItem>
                                <SelectItem value="natural">Natural Stone</SelectItem>
                                <SelectItem value="mediterranean">Mediterranean</SelectItem>
                                <SelectItem value="contemporary">Contemporary</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div>
                        <FormLabel className="mb-4 block">Optional Features</FormLabel>
                        <div className="grid grid-cols-2 gap-3">
                          {features.map((feature) => (
                            <div
                              key={feature.id}
                              onClick={() => handleFeatureToggle(feature.id)}
                              className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
                                selectedFeatures.includes(feature.id)
                                  ? 'border-orange-500 bg-orange-50'
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                              data-testid={`feature-${feature.id}`}
                            >
                              <div className="font-medium text-sm">{feature.name}</div>
                              <div className="text-xs text-muted-foreground">{feature.cost}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full gradient-primary text-white py-3"
                        disabled={generateDesignMutation.isPending}
                        data-testid="button-generate-design"
                      >
                        {generateDesignMutation.isPending ? (
                          <>
                            <Rotate3D className="w-4 h-4 mr-2 animate-spin" />
                            Generating 3D Design...
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4 mr-2" />
                            Generate 3D Design
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              {/* AI Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>AI Design Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-96 bg-gradient-to-br from-blue-100 to-orange-100 rounded-lg flex items-center justify-center">
                    {generateDesignMutation.isPending ? (
                      <div className="text-center">
                        <Rotate3D className="w-12 h-12 mx-auto mb-4 text-blue-600 animate-spin" />
                        <p className="text-lg font-medium">AI is designing your pool...</p>
                        <p className="text-sm text-muted-foreground">This may take a few moments</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Eye className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-lg font-medium text-gray-600">Your 3D design will appear here</p>
                        <p className="text-sm text-muted-foreground">Configure your pool and click generate</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            /* Design Results */
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Your AI-Generated 3D Pool Design</span>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={handleDownload} data-testid="button-download">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setDesignGenerated(false)} data-testid="button-modify">
                        <Palette className="w-4 h-4 mr-2" />
                        Modify Design
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center mb-6 overflow-hidden">
                    {designResult?.imageUrl ? (
                      <img 
                        src={designResult.imageUrl} 
                        alt="AI Generated Pool Design" 
                        className="w-full h-full object-cover rounded-lg"
                        data-testid="generated-pool-image"
                      />
                    ) : (
                      <div className="text-center text-gray-500">
                        <Rotate3D className="w-16 h-16 mx-auto mb-4" />
                        <p className="text-xl font-bold">3D Pool Design Generated!</p>
                        <p className="opacity-90">Loading your design...</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <h4 className="font-bold mb-2">Estimated Cost</h4>
                        <p className="text-2xl font-bold text-orange-500">
                          ${designResult?.estimatedCost?.toLocaleString() || '67,500'}
                        </p>
                        <p className="text-sm text-muted-foreground">Including selected features</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <h4 className="font-bold mb-2">Timeline</h4>
                        <p className="text-2xl font-bold text-blue-600">
                          {designResult?.timeline || '8-12 weeks'}
                        </p>
                        <p className="text-sm text-muted-foreground">Construction duration</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <h4 className="font-bold mb-2">Efficiency Score</h4>
                        <p className="text-2xl font-bold text-green-600">92%</p>
                        <p className="text-sm text-muted-foreground">AI optimization rating</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="mt-6 flex justify-center space-x-4">
                    <Button className="gradient-primary text-white px-6" onClick={handleGetQuote} data-testid="button-get-quote">
                      Get Professional Quote
                    </Button>
                    <Button variant="outline" onClick={handleSaveDesign} data-testid="button-save-design">
                      Save Design
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}