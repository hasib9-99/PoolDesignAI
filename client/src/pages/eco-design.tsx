import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Leaf, Zap, Droplets, Sun, TreePine } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Link } from "wouter";

const ecoSchema = z.object({
  poolSize: z.string().min(1, "Please select a pool size"),
  location: z.string().min(1, "Please select your location"),
  energyPriority: z.string().min(1, "Please select energy priority"),
});

type EcoForm = z.infer<typeof ecoSchema>;

export default function EcoDesign() {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  const form = useForm<EcoForm>({
    resolver: zodResolver(ecoSchema),
    defaultValues: {
      poolSize: "",
      location: "",
      energyPriority: "",
    },
  });

  const ecoFeatures = [
    { id: "solar-heating", name: "Solar Heating System", impact: "Reduces energy by 70%", cost: "+$4,500" },
    { id: "led-lighting", name: "LED Pool Lighting", impact: "90% less energy usage", cost: "+$1,200" },
    { id: "variable-pump", name: "Variable Speed Pump", impact: "50-90% energy savings", cost: "+$800" },
    { id: "pool-cover", name: "Automatic Pool Cover", impact: "Reduces evaporation by 95%", cost: "+$3,200" },
    { id: "saltwater", name: "Saltwater System", impact: "Eliminates chlorine chemicals", cost: "+$1,500" },
    { id: "natural-filter", name: "Natural Filtration", impact: "Bio-friendly water treatment", cost: "+$2,800" },
  ];

  const handleFeatureToggle = (featureId: string) => {
    setSelectedFeatures(prev => 
      prev.includes(featureId) 
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    );
  };

  const runEcoAnalysis = async () => {
    setAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 3500));
    setAnalyzing(false);
    setAnalysisComplete(true);
  };

  const onSubmit = (data: EcoForm) => {
    runEcoAnalysis();
  };

  const ecoScore = useMemo(() => {
    let score = 45; // Base score
    selectedFeatures.forEach(feature => {
      switch(feature) {
        case "solar-heating": score += 25; break;
        case "led-lighting": score += 8; break;
        case "variable-pump": score += 15; break;
        case "pool-cover": score += 12; break;
        case "saltwater": score += 10; break;
        case "natural-filter": score += 15; break;
      }
    });
    return Math.min(score, 100);
  }, [selectedFeatures]);

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
                <h1 className="text-3xl font-bold text-gradient">Eco-Friendly Pool Design</h1>
                <p className="text-muted-foreground">Sustainable pool solutions that protect our planet</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-gradient-to-r from-green-50 to-blue-50">
              <Leaf className="w-4 h-4 mr-2" />
              Eco-Friendly
            </Badge>
          </div>

          {!analysisComplete ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Configuration Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TreePine className="w-5 h-5 mr-2 text-green-600" />
                    Eco Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location (for solar calculations)</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-location">
                                  <SelectValue placeholder="Select your location" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="southwest">Southwest (AZ, NV, CA)</SelectItem>
                                <SelectItem value="southeast">Southeast (FL, TX, GA)</SelectItem>
                                <SelectItem value="west">West Coast (CA, OR, WA)</SelectItem>
                                <SelectItem value="northeast">Northeast (NY, MA, CT)</SelectItem>
                                <SelectItem value="midwest">Midwest (IL, OH, MI)</SelectItem>
                                <SelectItem value="mountain">Mountain States (CO, UT, MT)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="energyPriority"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Energy Efficiency Priority</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-energy-priority">
                                  <SelectValue placeholder="Select priority level" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="maximum">Maximum Efficiency (Premium Investment)</SelectItem>
                                <SelectItem value="high">High Efficiency (Balanced Approach)</SelectItem>
                                <SelectItem value="moderate">Moderate Efficiency (Budget Conscious)</SelectItem>
                                <SelectItem value="basic">Basic Efficiency (Minimal Investment)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div>
                        <FormLabel className="mb-4 block">Eco-Friendly Features</FormLabel>
                        <div className="space-y-3">
                          {ecoFeatures.map((feature) => {
                            const isSelected = selectedFeatures.includes(feature.id);
                            return (
                              <div
                                key={feature.id}
                                className={`p-4 border-2 rounded-lg transition-all ${
                                  isSelected
                                    ? 'border-green-500 bg-green-50'
                                    : 'border-gray-200'
                                }`}
                                data-testid={`feature-${feature.id}`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <div className="font-medium">{feature.name}</div>
                                    <div className="text-sm text-green-600">{feature.impact}</div>
                                    <div className="text-xs text-muted-foreground">{feature.cost}</div>
                                  </div>
                                  <Checkbox 
                                    checked={isSelected}
                                    onCheckedChange={() => handleFeatureToggle(feature.id)}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
                        disabled={analyzing}
                        data-testid="button-analyze-eco"
                      >
                        {analyzing ? (
                          <>
                            <Leaf className="w-4 h-4 mr-2 animate-pulse" />
                            Analyzing Eco Impact...
                          </>
                        ) : (
                          <>
                            <Zap className="w-4 h-4 mr-2" />
                            Analyze Eco Impact
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              {/* Real-time Eco Score */}
              <Card>
                <CardHeader>
                  <CardTitle>Real-time Eco Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-96 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg p-6 flex flex-col justify-center">
                    {analyzing ? (
                      <div className="text-center">
                        <Leaf className="w-12 h-12 mx-auto mb-4 text-green-600 animate-pulse" />
                        <p className="text-lg font-medium">Calculating environmental impact...</p>
                        <div className="mt-4 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Carbon Footprint Analysis</span>
                            <span>65%</span>
                          </div>
                          <Progress value={65} className="h-2" />
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="mb-6">
                          <div className="text-6xl font-bold text-green-600 mb-2">{ecoScore}</div>
                          <div className="text-xl font-medium text-gray-700">Eco Score</div>
                          <Progress value={ecoScore} className="h-4 mt-2" />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="bg-white p-3 rounded-lg">
                            <Sun className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                            <div className="font-medium">Solar Potential</div>
                            <div className="text-green-600">High</div>
                          </div>
                          <div className="bg-white p-3 rounded-lg">
                            <Droplets className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                            <div className="font-medium">Water Conservation</div>
                            <div className="text-green-600">{selectedFeatures.includes('pool-cover') ? 'Excellent' : 'Good'}</div>
                          </div>
                        </div>

                        <div className="mt-4 text-sm text-muted-foreground">
                          Select more eco features to improve your score
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            /* Eco Analysis Results */
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Leaf className="w-5 h-5 mr-2 text-green-600" />
                    Environmental Impact Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <Card className="text-center bg-green-50">
                      <CardContent className="p-4">
                        <Leaf className="w-8 h-8 text-green-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-green-600">{ecoScore}%</div>
                        <div className="text-sm">Eco Score</div>
                      </CardContent>
                    </Card>
                    <Card className="text-center bg-blue-50">
                      <CardContent className="p-4">
                        <Droplets className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-blue-600">2,400</div>
                        <div className="text-sm">Gallons Saved/Year</div>
                      </CardContent>
                    </Card>
                    <Card className="text-center bg-yellow-50">
                      <CardContent className="p-4">
                        <Zap className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-yellow-600">68%</div>
                        <div className="text-sm">Energy Reduction</div>
                      </CardContent>
                    </Card>
                    <Card className="text-center bg-orange-50">
                      <CardContent className="p-4">
                        <Sun className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-orange-600">$1,850</div>
                        <div className="text-sm">Annual Savings</div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Environmental Benefits</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                            <span>CO₂ Reduction</span>
                            <span className="font-bold text-green-600">3.2 tons/year</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                            <span>Chemical Reduction</span>
                            <span className="font-bold text-blue-600">85%</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded">
                            <span>Renewable Energy</span>
                            <span className="font-bold text-yellow-600">70%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Cost vs. Savings (10 Years)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span>Initial Investment:</span>
                            <span className="font-medium">$14,000</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Annual Savings:</span>
                            <span className="font-medium text-green-600">$1,850</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total 10-Year Savings:</span>
                            <span className="font-medium text-green-600">$18,500</span>
                          </div>
                          <div className="flex justify-between border-t pt-2">
                            <span className="font-bold">Net Benefit:</span>
                            <span className="font-bold text-green-600">+$4,500</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Payback period: 7.6 years
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="mt-6 flex justify-center space-x-4">
                    <Button className="bg-green-600 hover:bg-green-700 text-white px-6" data-testid="button-apply-eco-design">
                      Apply Eco Design
                    </Button>
                    <Button variant="outline" onClick={() => setAnalysisComplete(false)} data-testid="button-modify-features">
                      Modify Features
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