import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Brain, Zap, Target, TrendingUp } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Link } from "wouter";

const optimizationSchema = z.object({
  yardLength: z.number().min(10, "Minimum 10 feet").max(200, "Maximum 200 feet"),
  yardWidth: z.number().min(10, "Minimum 10 feet").max(200, "Maximum 200 feet"),
  budget: z.number().min(10000, "Minimum $10,000").max(500000, "Maximum $500,000"),
  priority: z.string().min(1, "Please select a priority"),
});

type OptimizationForm = z.infer<typeof optimizationSchema>;

export default function AIOptimization() {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [yardLength, setYardLength] = useState([50]);
  const [yardWidth, setYardWidth] = useState([30]);
  const [budget, setBudget] = useState([75000]);

  const form = useForm<OptimizationForm>({
    resolver: zodResolver(optimizationSchema),
    defaultValues: {
      yardLength: 50,
      yardWidth: 30,
      budget: 75000,
      priority: "",
    },
  });

  const runOptimization = async () => {
    setAnalyzing(true);
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 4000));
    setAnalyzing(false);
    setAnalysisComplete(true);
  };

  const onSubmit = (data: OptimizationForm) => {
    runOptimization();
  };

  const optimizationResults = [
    {
      aspect: "Space Utilization",
      score: 94,
      recommendation: "Excellent use of available space with optimal pool positioning",
      improvement: "Consider adding a spa to maximize relaxation area"
    },
    {
      aspect: "Cost Efficiency",
      score: 87,
      recommendation: "Good balance between features and budget constraints",
      improvement: "Switch to fiberglass for 15% cost savings"
    },
    {
      aspect: "Functionality",
      score: 91,
      recommendation: "Design meets all specified priorities and use cases",
      improvement: "Add shallow play area for enhanced family use"
    },
    {
      aspect: "Maintenance",
      score: 89,
      recommendation: "Low-maintenance design with automated systems",
      improvement: "Upgrade to saltwater system for easier upkeep"
    },
  ];

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
                <h1 className="text-3xl font-bold text-gradient">AI Pool Optimization</h1>
                <p className="text-muted-foreground">Smart algorithms optimize your space and budget for the perfect pool</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-gradient-to-r from-blue-50 to-orange-50">
              <Brain className="w-4 h-4 mr-2" />
              AI-Powered
            </Badge>
          </div>

          {!analysisComplete ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Input Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="w-5 h-5 mr-2 text-blue-600" />
                    Space & Budget Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div>
                        <FormLabel>Yard Length: {yardLength[0]} feet</FormLabel>
                        <Slider
                          value={yardLength}
                          onValueChange={(value) => {
                            setYardLength(value);
                            form.setValue("yardLength", value[0]);
                          }}
                          max={200}
                          min={10}
                          step={5}
                          className="mt-2"
                          data-testid="slider-yard-length"
                        />
                      </div>

                      <div>
                        <FormLabel>Yard Width: {yardWidth[0]} feet</FormLabel>
                        <Slider
                          value={yardWidth}
                          onValueChange={(value) => {
                            setYardWidth(value);
                            form.setValue("yardWidth", value[0]);
                          }}
                          max={200}
                          min={10}
                          step={5}
                          className="mt-2"
                          data-testid="slider-yard-width"
                        />
                      </div>

                      <div>
                        <FormLabel>Budget: ${budget[0].toLocaleString()}</FormLabel>
                        <Slider
                          value={budget}
                          onValueChange={(value) => {
                            setBudget(value);
                            form.setValue("budget", value[0]);
                          }}
                          max={500000}
                          min={10000}
                          step={5000}
                          className="mt-2"
                          data-testid="slider-budget"
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="priority"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Primary Priority</FormLabel>
                            <div className="grid grid-cols-2 gap-3">
                              {[
                                { value: "family", label: "Family Fun" },
                                { value: "fitness", label: "Fitness & Laps" },
                                { value: "entertaining", label: "Entertaining" },
                                { value: "relaxation", label: "Relaxation" },
                                { value: "aesthetics", label: "Visual Appeal" },
                                { value: "value", label: "Property Value" },
                              ].map((priority) => (
                                <div
                                  key={priority.value}
                                  onClick={() => field.onChange(priority.value)}
                                  className={`p-3 border-2 rounded-lg cursor-pointer transition-all text-center ${
                                    field.value === priority.value
                                      ? 'border-orange-500 bg-orange-50'
                                      : 'border-gray-200 hover:border-gray-300'
                                  }`}
                                  data-testid={`priority-${priority.value}`}
                                >
                                  <div className="font-medium text-sm">{priority.label}</div>
                                </div>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        className="w-full gradient-primary text-white py-3"
                        disabled={analyzing}
                        data-testid="button-optimize"
                      >
                        {analyzing ? (
                          <>
                            <Brain className="w-4 h-4 mr-2 animate-pulse" />
                            AI is Analyzing...
                          </>
                        ) : (
                          <>
                            <Zap className="w-4 h-4 mr-2" />
                            Optimize My Pool Design
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              {/* Real-time Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>Space Visualization</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-96 bg-gradient-to-br from-blue-100 to-orange-100 rounded-lg flex items-center justify-center">
                    {analyzing ? (
                      <div className="text-center">
                        <Brain className="w-12 h-12 mx-auto mb-4 text-blue-600 animate-pulse" />
                        <p className="text-lg font-medium">AI is analyzing your space...</p>
                        <div className="mt-4 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Space Analysis</span>
                            <span>78%</span>
                          </div>
                          <Progress value={78} className="h-2" />
                        </div>
                      </div>
                    ) : (
                      <div className="text-center w-full">
                        <div className="border-2 border-dashed border-gray-300 h-48 rounded-lg flex items-center justify-center mb-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-600">{yardLength[0]}' × {yardWidth[0]}'</div>
                            <div className="text-sm text-muted-foreground">Yard Dimensions</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="bg-white p-3 rounded">
                            <div className="font-medium">Available Space</div>
                            <div className="text-2xl font-bold text-blue-600">{(yardLength[0] * yardWidth[0]).toLocaleString()} sq ft</div>
                          </div>
                          <div className="bg-white p-3 rounded">
                            <div className="font-medium">Budget</div>
                            <div className="text-2xl font-bold text-orange-500">${budget[0].toLocaleString()}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            /* Optimization Results */
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                    AI Optimization Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {optimizationResults.map((result, index) => (
                      <Card key={index} className="text-center">
                        <CardContent className="p-4">
                          <h4 className="font-bold mb-2">{result.aspect}</h4>
                          <div className="text-3xl font-bold text-gradient mb-2">{result.score}%</div>
                          <Progress value={result.score} className="h-2 mb-2" />
                          <p className="text-xs text-muted-foreground">{result.recommendation}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">AI Recommendations</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {optimizationResults.map((result, index) => (
                            <div key={index} className="border-l-4 border-orange-500 pl-4">
                              <h5 className="font-medium">{result.aspect}</h5>
                              <p className="text-sm text-muted-foreground">{result.improvement}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Optimized Pool Specs</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span>Recommended Size:</span>
                            <span className="font-medium">18' × 36'</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Pool Type:</span>
                            <span className="font-medium">Rectangular with Spa</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Material:</span>
                            <span className="font-medium">Fiberglass</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Features:</span>
                            <span className="font-medium">LED Lighting, Heating</span>
                          </div>
                          <div className="flex justify-between border-t pt-2">
                            <span className="font-bold">Optimized Cost:</span>
                            <span className="font-bold text-orange-500">${(budget[0] * 0.92).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-green-600">Savings:</span>
                            <span className="text-green-600 font-medium">${(budget[0] * 0.08).toLocaleString()}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="mt-6 flex justify-center space-x-4">
                    <Button className="gradient-primary text-white px-6" data-testid="button-apply-optimization">
                      Apply Optimization
                    </Button>
                    <Button variant="outline" onClick={() => setAnalysisComplete(false)} data-testid="button-run-again">
                      Run Analysis Again
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