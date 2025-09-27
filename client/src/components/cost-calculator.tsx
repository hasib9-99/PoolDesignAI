import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Sparkles } from "lucide-react";

const calculatorSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  size: z.string().min(1, "Please select a pool size"),
  type: z.string().min(1, "Please select a pool type"),
  material: z.string().min(1, "Please select a material"),
  features: z.string().optional(),
  location: z.string().min(1, "Please select your location"),
  timeline: z.string().min(1, "Please select a timeline"),
});

type CalculatorForm = z.infer<typeof calculatorSchema>;

interface FeatureOptions {
  heating: boolean;
  lighting: boolean;
  waterfall: boolean;
  spa: boolean;
}

export default function CostCalculator() {
  const [features, setFeatures] = useState<FeatureOptions>({
    heating: false,
    lighting: false,
    waterfall: false,
    spa: false
  });
  const [contractorCost, setContractorCost] = useState("$45,000 - $65,000");
  const [ownerBuilderCost, setOwnerBuilderCost] = useState("$22,500 - $32,500");
  const [savings, setSavings] = useState("$22,500 - $32,500");
  const [isFromAI, setIsFromAI] = useState(false);
  const [aiDesignData, setAiDesignData] = useState<any>(null);
  const { toast } = useToast();

  const form = useForm<CalculatorForm>({
    resolver: zodResolver(calculatorSchema),
    defaultValues: {
      email: "",
      size: "",
      type: "",
      material: "",
      features: "",
      location: "",
      timeline: "",
    },
  });

  // Check for URL parameters from AI design tool
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const fromAI = urlParams.get('fromAI');
    
    if (fromAI === 'true') {
      setIsFromAI(true);
      
      // Extract AI design data
      const aiData = {
        size: urlParams.get('size') || '',
        type: urlParams.get('type') || '',
        material: urlParams.get('material') || '',
        features: urlParams.get('features') || '',
        timeline: urlParams.get('timeline') || '',
        poolLength: urlParams.get('poolLength') || '',
        poolStyle: urlParams.get('poolStyle') || '',
        estimatedRange: urlParams.get('estimatedRange') || ''
      };
      
      setAiDesignData(aiData);
      
      // Pre-populate form fields
      form.setValue('size', aiData.size);
      form.setValue('type', aiData.type);
      form.setValue('material', aiData.material);
      form.setValue('timeline', aiData.timeline);
      
      // Parse and set features
      try {
        const featuresArray = JSON.parse(aiData.features);
        const newFeatures = {
          heating: featuresArray.includes('heating'),
          lighting: featuresArray.includes('lighting'),
          waterfall: featuresArray.includes('waterfall'),
          spa: featuresArray.includes('spa')
        };
        setFeatures(newFeatures);
      } catch (e) {
        console.warn('Failed to parse features:', e);
      }
      
      // Trigger form change to update calculations
      setTimeout(handleFormChange, 100);
      
      toast({
        title: "AI Design Loaded!",
        description: "Your pool design has been pre-populated. Review and adjust as needed.",
      });
    }
  }, [form, toast]);

  const calculateCostMutation = useMutation({
    mutationFn: async (data: CalculatorForm & { estimatedCost: number }) => {
      return apiRequest("POST", "/api/cost-calculation", data);
    },
    onSuccess: async (response: Response) => {
      const result = await response.json();
      toast({
        title: result.emailSent ? "Estimate Sent!" : "Estimate Saved",
        description: result.message || "Your cost calculation has been processed.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to process calculation. Please try again.",
        variant: "destructive",
      });
    },
  });

  const calculateEstimate = (formData: Partial<CalculatorForm>) => {
    let basePrice = 45000;
    
    // Size adjustments
    if (formData.size?.includes('medium')) basePrice += 15000;
    if (formData.size?.includes('large')) basePrice += 30000;
    if (formData.size?.includes('custom')) basePrice += 50000;
    
    // Type adjustments
    if (formData.type?.includes('freeform')) basePrice += 10000;
    if (formData.type?.includes('infinity')) basePrice += 25000;
    if (formData.type?.includes('lap')) basePrice += 5000;
    
    // Material adjustments
    if (formData.material?.includes('fiberglass')) basePrice += 5000;
    if (formData.material?.includes('concrete')) basePrice += 15000;
    if (formData.material?.includes('natural-stone')) basePrice += 25000;
    
    // Feature adjustments
    if (features.heating) basePrice += 3500;
    if (features.lighting) basePrice += 1800;
    if (features.waterfall) basePrice += 2500;
    if (features.spa) basePrice += 8000;
    
    const minPrice = basePrice;
    const maxPrice = Math.round(basePrice * 1.3);
    
    // Calculate owner-builder costs (50% less)
    const ownerBuilderMin = Math.round(minPrice * 0.5);
    const ownerBuilderMax = Math.round(maxPrice * 0.5);
    const savingsMin = minPrice - ownerBuilderMin;
    const savingsMax = maxPrice - ownerBuilderMax;
    
    return {
      contractorRange: `$${minPrice.toLocaleString()} - $${maxPrice.toLocaleString()}`,
      ownerBuilderRange: `$${ownerBuilderMin.toLocaleString()} - $${ownerBuilderMax.toLocaleString()}`,
      savingsRange: `$${savingsMin.toLocaleString()} - $${savingsMax.toLocaleString()}`,
      estimated: Math.round((minPrice + maxPrice) / 2)
    };
  };

  const handleFormChange = () => {
    const values = form.getValues();
    const cost = calculateEstimate(values);
    setContractorCost(cost.contractorRange);
    setOwnerBuilderCost(cost.ownerBuilderRange);
    setSavings(cost.savingsRange);
  };

  const handleFeatureChange = (feature: keyof FeatureOptions, checked: boolean) => {
    setFeatures(prev => ({ ...prev, [feature]: checked }));
    setTimeout(handleFormChange, 0);
  };

  const onSubmit = (data: CalculatorForm) => {
    const cost = calculateEstimate(data);
    const featuresSelected = Object.entries(features)
      .filter(([, selected]) => selected)
      .map(([feature]) => feature);
    
    calculateCostMutation.mutate({
      ...data,
      features: JSON.stringify(featuresSelected),
      estimatedCost: cost.estimated
    });
  };

  return (
    <section id="calculator" className="py-20 gradient-primary text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Pool Cost Calculator</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Get an instant estimate for your dream pool with our AI-powered cost calculator.
          </p>
        </div>

        <Card className="bg-white text-gray-900 max-w-4xl mx-auto">
          <CardContent className="p-8">
            {isFromAI && aiDesignData && (
              <Alert className="mb-6 border-blue-200 bg-blue-50" data-testid="alert-ai-design-loaded">
                <Sparkles className="h-5 w-5 text-blue-600" />
                <AlertTitle className="text-blue-800">AI Design Loaded</AlertTitle>
                <AlertDescription className="text-blue-700">
                  Your {aiDesignData.poolStyle} pool design ({aiDesignData.poolLength}ft) has been pre-populated. 
                  Estimated range: {aiDesignData.estimatedRange}. Review and adjust the details below.
                </AlertDescription>
              </Alert>
            )}
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Email Field */}
                <div className="mb-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-bold text-blue-600">Email Address</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="Enter your email to receive detailed estimate"
                            className="border-2 focus:border-orange-500"
                            data-testid="input-email"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="size"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-bold text-blue-600">Pool Size</FormLabel>
                        <Select 
                          onValueChange={(value) => {
                            field.onChange(value);
                            setTimeout(handleFormChange, 0);
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger data-testid="select-pool-size">
                              <SelectValue placeholder="Select pool size" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="small">Small (12' x 24')</SelectItem>
                            <SelectItem value="medium">Medium (16' x 32')</SelectItem>
                            <SelectItem value="large">Large (20' x 40')</SelectItem>
                            <SelectItem value="custom">Custom Size</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-bold text-blue-600">Pool Type</FormLabel>
                        <Select 
                          onValueChange={(value) => {
                            field.onChange(value);
                            setTimeout(handleFormChange, 0);
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger data-testid="select-pool-type">
                              <SelectValue placeholder="Select pool type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="rectangular">Rectangular</SelectItem>
                            <SelectItem value="freeform">Freeform</SelectItem>
                            <SelectItem value="kidney">Kidney</SelectItem>
                            <SelectItem value="lap">Lap Pool</SelectItem>
                            <SelectItem value="infinity">Infinity Pool</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="material"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-bold text-blue-600">Material</FormLabel>
                        <Select 
                          onValueChange={(value) => {
                            field.onChange(value);
                            setTimeout(handleFormChange, 0);
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger data-testid="select-material">
                              <SelectValue placeholder="Select material" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="vinyl">Vinyl Liner</SelectItem>
                            <SelectItem value="fiberglass">Fiberglass</SelectItem>
                            <SelectItem value="concrete">Concrete/Gunite</SelectItem>
                            <SelectItem value="natural-stone">Natural Stone</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div>
                    <FormLabel className="text-sm font-bold text-blue-600 mb-2 block">Features</FormLabel>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="heating"
                          checked={features.heating}
                          onCheckedChange={(checked) => handleFeatureChange('heating', checked as boolean)}
                          data-testid="checkbox-heating"
                        />
                        <label htmlFor="heating" className="text-sm">Pool Heating (+$3,500)</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="lighting"
                          checked={features.lighting}
                          onCheckedChange={(checked) => handleFeatureChange('lighting', checked as boolean)}
                          data-testid="checkbox-lighting"
                        />
                        <label htmlFor="lighting" className="text-sm">LED Lighting (+$1,800)</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="waterfall"
                          checked={features.waterfall}
                          onCheckedChange={(checked) => handleFeatureChange('waterfall', checked as boolean)}
                          data-testid="checkbox-waterfall"
                        />
                        <label htmlFor="waterfall" className="text-sm">Waterfall Feature (+$2,500)</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="spa"
                          checked={features.spa}
                          onCheckedChange={(checked) => handleFeatureChange('spa', checked as boolean)}
                          data-testid="checkbox-spa"
                        />
                        <label htmlFor="spa" className="text-sm">Integrated Spa (+$8,000)</label>
                      </div>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-bold text-blue-600">Location</FormLabel>
                        <Select 
                          onValueChange={(value) => {
                            field.onChange(value);
                            setTimeout(handleFormChange, 0);
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger data-testid="select-location">
                              <SelectValue placeholder="Select your state" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="california">California</SelectItem>
                            <SelectItem value="florida">Florida</SelectItem>
                            <SelectItem value="texas">Texas</SelectItem>
                            <SelectItem value="arizona">Arizona</SelectItem>
                            <SelectItem value="nevada">Nevada</SelectItem>
                            <SelectItem value="other">Other State</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="timeline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-bold text-blue-600">Timeline</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-timeline">
                              <SelectValue placeholder="Select timeline" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="immediate">Ready to start immediately</SelectItem>
                            <SelectItem value="3months">Within 3 months</SelectItem>
                            <SelectItem value="6months">Within 6 months</SelectItem>
                            <SelectItem value="planning">Just planning ahead</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mt-8 p-6 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border-2 border-orange-200">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-blue-600 mb-6">Cost Comparison</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      {/* Professional Contractor Cost */}
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h4 className="text-lg font-bold text-blue-600 mb-2">Professional Contractor</h4>
                        <div className="text-2xl font-bold text-orange-500 mb-1" data-testid="contractor-cost">
                          {contractorCost}
                        </div>
                        <p className="text-sm text-gray-600">Full-service installation</p>
                      </div>
                      
                      {/* Owner-Builder Cost */}
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <h4 className="text-lg font-bold text-green-600 mb-2">Owner-Builder Cost</h4>
                        <div className="text-2xl font-bold text-green-500 mb-1" data-testid="owner-builder-cost">
                          {ownerBuilderCost}
                        </div>
                        <p className="text-sm text-gray-600">50% savings with our guidance</p>
                      </div>
                      
                      {/* Your Savings */}
                      <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border-2 border-green-200">
                        <h4 className="text-lg font-bold text-green-700 mb-2">Your Savings</h4>
                        <div className="text-2xl font-bold text-green-600 mb-1" data-testid="savings-amount">
                          {savings}
                        </div>
                        <p className="text-sm text-green-700 font-medium">Build it yourself!</p>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4">*Estimates based on current selections. Final pricing may vary. Owner-builder option includes our design plans and guidance.</p>
                    
                    <div className="flex justify-center">
                      <Button 
                        type="submit"
                        className="bg-orange-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-orange-600 transition-colors"
                        disabled={calculateCostMutation.isPending}
                        data-testid="button-get-detailed-estimate"
                      >
{calculateCostMutation.isPending ? "Sending Estimate..." : "Send Detailed Estimate to Email"}
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
