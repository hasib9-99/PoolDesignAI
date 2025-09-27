import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Heart, 
  Baby, 
  Users, 
  MapPin,
  FileText,
  Zap,
  Eye,
  Waves,
  Lock,
  Phone,
  Clock,
  Home,
  Scale
} from "lucide-react";

interface SafetyAssessment {
  poolType: string;
  childrenAges: string[];
  propertyType: string;
  state: string;
  hasExistingFence: boolean;
  fenceType: string;
  fenceHeight: number;
  hasPoolCover: boolean;
  hasAlarm: boolean;
  hasPerimeterFence: boolean;
  perimeterFenceType: string;
  hasScreenEnclosure: boolean;
  hasElectricCover: boolean;
  supervisionLevel: string;
}

interface SafetyRecommendation {
  category: string;
  priority: 'critical' | 'high' | 'medium';
  title: string;
  description: string;
  cost: string;
  compliance: boolean;
  icon: React.ElementType;
}

export default function ChildSafety() {
  const [assessment, setAssessment] = useState<SafetyAssessment>({
    poolType: '',
    childrenAges: [],
    propertyType: '',
    state: '',
    hasExistingFence: false,
    fenceType: '',
    fenceHeight: 0,
    hasPoolCover: false,
    hasAlarm: false,
    hasPerimeterFence: false,
    perimeterFenceType: '',
    hasScreenEnclosure: false,
    hasElectricCover: false,
    supervisionLevel: ''
  });

  const [showRecommendations, setShowRecommendations] = useState(false);
  const [safetyScore, setSafetyScore] = useState(0);
  const [recommendations, setRecommendations] = useState<SafetyRecommendation[]>([]);

  const drowningStats = [
    { stat: "100%", description: "of drowning deaths are preventable with proper safety measures" },
    { stat: "1-4 years", description: "age group with highest drowning risk" },
    { stat: "20 seconds", description: "how quickly drowning can occur" },
    { stat: "88%", description: "of drowning incidents happen with adult supervision nearby" }
  ];

  const safetyLayers = [
    {
      title: "Barriers & Fencing",
      description: "Physical barriers are your first line of defense - Best protection is prevention",
      requirements: [
        "54\" (4.5 feet) minimum fence height in many states",
        "Self-closing, spring-loaded gates with automatic latching",
        "Gate latches positioned 54+ inches from ground",
        "Vertical bars spaced no more than 4 inches apart",
        "No horizontal rails that children can climb",
        "Child safety fence blocking direct home-to-pool access",
        "Screen enclosures act as protective barriers from outsiders"
      ],
      icon: Shield,
      color: "text-blue-600"
    },
    {
      title: "Advanced Alarm Systems", 
      description: "Multi-layer detection technology for comprehensive protection",
      requirements: [
        "Door alarms on all access points under 54\" inside pool area",
        "Window alarms on all openings under 54\" to pool area",
        "Pool surface wave detection alarms",
        "Perimeter alarms around pool fence line",
        "Wearable child alarms for young swimmers",
        "Smart home integration with mobile alerts"
      ],
      icon: Zap,
      color: "text-orange-600"
    },
    {
      title: "Safety Covers & Barriers", 
      description: "Physical protection when pool is not in use",
      requirements: [
        "ASTM-compliant safety covers that support adult weight",
        "Electric safety covers (act as child barriers in some areas)",
        "Automatic pool covers with key-lock operation",
        "Removable mesh safety fencing for temporary protection",
        "Pool safety nets (temporary barrier option)"
      ],
      icon: Lock,
      color: "text-purple-600"
    },
    {
      title: "Supervision & Education",
      description: "Human oversight and safety knowledge",
      requirements: [
        "Constant adult supervision within arm's reach",
        "CPR certification for all adults",
        "Swimming lessons for children 1+ years old",
        "Clear pool rules and emergency procedures"
      ],
      icon: Eye,
      color: "text-green-600"
    },
    {
      title: "Emergency Preparedness",
      description: "Ready response when seconds count",
      requirements: [
        "Posted emergency contact numbers",
        "Pool rescue equipment within 20 feet",
        "First aid kit poolside",
        "Clear path to pool for emergency responders"
      ],
      icon: Phone,
      color: "text-red-600"
    }
  ];

  const generateSafetyAssessment = () => {
    let score = 0;
    const newRecommendations: SafetyRecommendation[] = [];

    // Enhanced fence assessment with 54" requirements
    if (!assessment.hasExistingFence) {
      newRecommendations.push({
        category: "Barriers",
        priority: 'critical',
        title: "Install 54\" Safety Fence with Spring Gates",
        description: "Many states now require 54\" minimum fence height with self-closing, spring-loaded gates and child-resistant latches positioned 54+ inches high.",
        cost: "$2,000 - $5,500",
        compliance: true,
        icon: Shield
      });
    } else if (assessment.fenceHeight < 4.5) {
      newRecommendations.push({
        category: "Barriers", 
        priority: 'high',
        title: "Upgrade to 54\" Fence Height",
        description: "Current fence may not meet newer 54\" minimum requirements. Upgrade includes spring-loaded gates and proper latch height.",
        cost: "$1,200 - $3,000",
        compliance: true,
        icon: Shield
      });
      score += 30;
    } else {
      score += 60;
    }

    // Perimeter fence assessment
    if (!assessment.hasPerimeterFence) {
      newRecommendations.push({
        category: "Barriers",
        priority: 'medium',
        title: "Install Perimeter Yard Fence",
        description: "Perimeter fencing (black aluminum, stockade, chain link, or vinyl) provides additional property security and pool access control.",
        cost: "$15 - $40 per linear foot",
        compliance: false,
        icon: Shield
      });
    } else {
      score += 10;
    }

    // Screen enclosure assessment
    if (!assessment.hasScreenEnclosure) {
      newRecommendations.push({
        category: "Barriers",
        priority: 'medium',
        title: "Consider Screen Enclosure",
        description: "Screen enclosures provide protection from outsiders entering pool area while creating a controlled environment.",
        cost: "$6,000 - $15,000",
        compliance: false,
        icon: Home
      });
    } else {
      score += 15;
    }

    // Electric cover assessment
    if (!assessment.hasElectricCover && !assessment.hasPoolCover) {
      // Only recommend if they don't have any cover
      newRecommendations.push({
        category: "Covers",
        priority: 'high',
        title: "Install Safety Electric Pool Cover",
        description: "ASTM-compliant electric cover that can support adult weight and prevents accidental entry. Acts as child barrier in many jurisdictions.",
        cost: "$12,000 - $18,000",
        compliance: false,
        icon: Lock
      });
    } else if (assessment.hasElectricCover) {
      score += 30;
    }

    // Add comprehensive alarm system recommendations if not already installed
    if (!assessment.hasAlarm) {
      newRecommendations.push({
        category: "Alarms",
        priority: 'critical',
        title: "Door & Window Alarms Under 54\"",
        description: "Install alarms on all doors and windows under 54\" height that provide access to pool area from inside the home.",
        cost: "$300 - $800",
        compliance: true,
        icon: Zap
      });
    }

    // Fence type specific recommendations
    if (assessment.hasExistingFence && assessment.fenceType) {
      const fenceTypeRecommendations = {
        'mesh': {
          priority: 'medium' as const,
          title: 'Consider Permanent Fence Upgrade',
          description: 'Mesh safety fences are temporary. Consider upgrading to permanent aluminum, vinyl, or glass for long-term safety.',
          cost: '$2,500 - $6,000'
        },
        'chain-link': {
          priority: 'medium' as const,
          title: 'Add Privacy Slats for Enhanced Safety',
          description: 'Chain link fences can be climbed. Consider adding privacy slats or upgrading to solid panel fencing.',
          cost: '$500 - $1,500'
        }
      };

      const fenceRec = fenceTypeRecommendations[assessment.fenceType as keyof typeof fenceTypeRecommendations];
      if (fenceRec) {
        newRecommendations.push({
          category: "Barriers",
          priority: fenceRec.priority,
          title: fenceRec.title,
          description: fenceRec.description,
          cost: fenceRec.cost,
          compliance: false,
          icon: Shield
        });
      }
    }

    // Perimeter fence type specific recommendations
    if (assessment.hasPerimeterFence && assessment.perimeterFenceType) {
      const perimeterFenceRecommendations = {
        'chain-link': {
          priority: 'medium' as const,
          title: 'Enhance Chain Link Perimeter Security',
          description: 'Chain link perimeter fencing can be climbed and provides limited privacy. Consider adding privacy slats, barbed wire deterrent, or upgrading to solid panel fencing for enhanced security.',
          cost: '$800 - $2,500'
        },
        'stockade': {
          priority: 'medium' as const,
          title: 'Maintain Stockade Fencing',
          description: 'Stockade wood fencing provides good privacy and security. Ensure regular maintenance to prevent rot and gaps that could compromise perimeter security.',
          cost: '$300 - $800'
        },
        'black-aluminum': {
          priority: 'medium' as const,
          title: 'Optimize Aluminum Fence Height',
          description: 'Black aluminum fencing provides excellent security and low maintenance. Consider adding decorative spear tops for additional deterrent value.',
          cost: '$500 - $1,200'
        }
      };

      const perimeterRec = perimeterFenceRecommendations[assessment.perimeterFenceType as keyof typeof perimeterFenceRecommendations];
      if (perimeterRec) {
        newRecommendations.push({
          category: "Perimeter Security",
          priority: perimeterRec.priority,
          title: perimeterRec.title,
          description: perimeterRec.description,
          cost: perimeterRec.cost,
          compliance: false,
          icon: Shield
        });
      }
    }

    // Pool cover assessment
    if (!assessment.hasPoolCover) {
      newRecommendations.push({
        category: "Covers",
        priority: 'high', 
        title: "Install Safety Electric Pool Cover",
        description: "ASTM-compliant cover that can support adult weight and prevents accidental entry.",
        cost: "$12,000 - $18,000",
        compliance: false,
        icon: Shield
      });
    } else {
      score += 25;
    }

    // Alarm assessment
    if (!assessment.hasAlarm) {
      newRecommendations.push({
        category: "Alarms",
        priority: 'medium',
        title: "Install Pool Alarm System", 
        description: "Surface wave detection alarm that triggers when someone enters the pool area.",
        cost: "$200 - $800",
        compliance: false,
        icon: Zap
      });
    } else {
      score += 15;
    }

    // Age-specific recommendations
    if (assessment.childrenAges.includes('0-2') || assessment.childrenAges.includes('3-5')) {
      newRecommendations.push({
        category: "Education",
        priority: 'critical',
        title: "Constant Supervision Protocol",
        description: "Children under 5 require adult within arm's reach at all times around water.",
        cost: "Free",
        compliance: true,
        icon: Eye
      });
      
      newRecommendations.push({
        category: "Education", 
        priority: 'high',
        title: "Early Swimming Lessons",
        description: "American Academy of Pediatrics recommends swimming lessons starting at age 1.",
        cost: "$60 - $120/month",
        compliance: false,
        icon: Waves
      });
    }

    setSafetyScore(score);
    setRecommendations(newRecommendations);
    setShowRecommendations(true);
  };

  const handleChildAgeChange = (age: string, checked: boolean) => {
    if (checked) {
      setAssessment(prev => ({
        ...prev,
        childrenAges: [...prev.childrenAges, age]
      }));
    } else {
      setAssessment(prev => ({
        ...prev,
        childrenAges: prev.childrenAges.filter(a => a !== age)
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Shield className="h-12 w-12 text-blue-600" />
            <Heart className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Child Safety First
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Every pool we design prioritizes your family's safety. Our AI-powered safety assessment ensures your children can enjoy the water with maximum protection.
          </p>
          
          <Alert className="max-w-2xl mx-auto border-red-200 bg-red-50 mb-8" data-testid="alert-drowning-prevention">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <AlertTitle className="text-red-800">Drowning is Silent and Fast</AlertTitle>
            <AlertDescription className="text-red-700">
              Unlike movies, real drowning doesn't involve splashing or calling for help. It happens in 15-20 seconds, often while adults are nearby.
            </AlertDescription>
          </Alert>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {drowningStats.map((item, index) => (
            <Card key={index} className="text-center" data-testid={`stat-card-${index}`}>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">{item.stat}</div>
                <p className="text-sm text-gray-600">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="assessment" className="mb-16">
          <TabsList className="grid w-full grid-cols-3 mb-8" data-testid="safety-tabs">
            <TabsTrigger value="assessment">AI Safety Assessment</TabsTrigger>
            <TabsTrigger value="layers">Safety Layers</TabsTrigger>
            <TabsTrigger value="compliance">Legal Requirements</TabsTrigger>
          </TabsList>

          {/* AI Safety Assessment */}
          <TabsContent value="assessment">
            <Card data-testid="safety-assessment-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Baby className="h-6 w-6 text-blue-600" />
                  AI-Powered Child Safety Assessment
                </CardTitle>
                <CardDescription>
                  Get personalized safety recommendations based on your specific situation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="pool-type">Pool Type</Label>
                      <Select onValueChange={(value) => setAssessment(prev => ({...prev, poolType: value}))}>
                        <SelectTrigger data-testid="select-pool-type">
                          <SelectValue placeholder="Select pool type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="inground">In-Ground Pool</SelectItem>
                          <SelectItem value="aboveground">Above-Ground Pool</SelectItem>
                          <SelectItem value="spa">Spa/Hot Tub</SelectItem>
                          <SelectItem value="natural">Natural Pool</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Children's Ages (select all that apply)</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {['0-2', '3-5', '6-8', '9-12', '13+'].map(age => (
                          <div key={age} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`age-${age}`}
                              data-testid={`checkbox-age-${age}`}
                              onCheckedChange={(checked) => handleChildAgeChange(age, checked as boolean)}
                            />
                            <Label htmlFor={`age-${age}`} className="text-sm">{age} years</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="property-type">Property Type</Label>
                      <Select onValueChange={(value) => setAssessment(prev => ({...prev, propertyType: value}))}>
                        <SelectTrigger data-testid="select-property-type">
                          <SelectValue placeholder="Select property type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single-family">Single Family Home</SelectItem>
                          <SelectItem value="condo">Condominium</SelectItem>
                          <SelectItem value="apartment">Apartment Complex</SelectItem>
                          <SelectItem value="commercial">Commercial Property</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="state">State/Location</Label>
                      <Input
                        id="state"
                        data-testid="input-state"
                        placeholder="e.g., Florida, California"
                        onChange={(e) => setAssessment(prev => ({...prev, state: e.target.value}))}
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="existing-fence"
                          data-testid="checkbox-existing-fence"
                          onCheckedChange={(checked) => setAssessment(prev => ({...prev, hasExistingFence: checked as boolean}))}
                        />
                        <Label htmlFor="existing-fence">I have an existing pool fence</Label>
                      </div>

                      {assessment.hasExistingFence && (
                        <div className="space-y-3">
                          <div>
                            <Label htmlFor="fence-type">Pool Fence Type</Label>
                            <Select onValueChange={(value) => setAssessment(prev => ({...prev, fenceType: value}))}>
                              <SelectTrigger data-testid="select-fence-type">
                                <SelectValue placeholder="Select fence type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="black-aluminum">Black Aluminum</SelectItem>
                                <SelectItem value="stockade">Stockade Wood</SelectItem>
                                <SelectItem value="chain-link">Chain Link</SelectItem>
                                <SelectItem value="vinyl">Vinyl Fence</SelectItem>
                                <SelectItem value="glass">Glass Panel</SelectItem>
                                <SelectItem value="wrought-iron">Wrought Iron</SelectItem>
                                <SelectItem value="mesh">Mesh Safety Fence</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="fence-height">Fence Height (feet)</Label>
                            <Input
                              id="fence-height"
                              type="number"
                              step="0.5"
                              data-testid="input-fence-height"
                              placeholder="4.5"
                              onChange={(e) => setAssessment(prev => ({...prev, fenceHeight: parseFloat(e.target.value) || 0}))}
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="perimeter-fence"
                          data-testid="checkbox-perimeter-fence"
                          onCheckedChange={(checked) => setAssessment(prev => ({...prev, hasPerimeterFence: checked as boolean}))}
                        />
                        <Label htmlFor="perimeter-fence">I have a perimeter yard fence</Label>
                      </div>

                      {assessment.hasPerimeterFence && (
                        <div>
                          <Label htmlFor="perimeter-fence-type">Perimeter Fence Type</Label>
                          <Select onValueChange={(value) => setAssessment(prev => ({...prev, perimeterFenceType: value}))}>
                            <SelectTrigger data-testid="select-perimeter-fence-type">
                              <SelectValue placeholder="Select perimeter fence type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="black-aluminum">Black Aluminum</SelectItem>
                              <SelectItem value="stockade">Stockade Wood</SelectItem>
                              <SelectItem value="chain-link">Chain Link</SelectItem>
                              <SelectItem value="vinyl">Vinyl Fence</SelectItem>
                              <SelectItem value="privacy-wood">Privacy Wood</SelectItem>
                              <SelectItem value="composite">Composite Fencing</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="pool-cover"
                          data-testid="checkbox-pool-cover"
                          onCheckedChange={(checked) => setAssessment(prev => ({...prev, hasPoolCover: checked as boolean}))}
                        />
                        <Label htmlFor="pool-cover">I have a safety pool cover</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="electric-cover"
                          data-testid="checkbox-electric-cover"
                          onCheckedChange={(checked) => setAssessment(prev => ({...prev, hasElectricCover: checked as boolean}))}
                        />
                        <Label htmlFor="electric-cover">I have an electric pool cover</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="screen-enclosure"
                          data-testid="checkbox-screen-enclosure"
                          onCheckedChange={(checked) => setAssessment(prev => ({...prev, hasScreenEnclosure: checked as boolean}))}
                        />
                        <Label htmlFor="screen-enclosure">I have a screen enclosure</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="pool-alarm"
                          data-testid="checkbox-pool-alarm"
                          onCheckedChange={(checked) => setAssessment(prev => ({...prev, hasAlarm: checked as boolean}))}
                        />
                        <Label htmlFor="pool-alarm">I have pool alarms installed</Label>
                      </div>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={generateSafetyAssessment}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  data-testid="button-generate-assessment"
                >
                  Generate AI Safety Assessment
                </Button>

                {showRecommendations && (
                  <div className="mt-8 space-y-6">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="text-xl font-semibold">Your Safety Score</h3>
                        <Progress value={safetyScore} className="w-full mt-2" />
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-blue-600">{safetyScore}%</div>
                        <p className="text-sm text-gray-600">Safety Rating</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold">Personalized Recommendations</h4>
                      {recommendations.map((rec, index) => (
                        <Card key={index} className={`border-l-4 ${
                          rec.priority === 'critical' ? 'border-l-red-500' :
                          rec.priority === 'high' ? 'border-l-orange-500' : 'border-l-yellow-500'
                        }`} data-testid={`recommendation-${index}`}>
                          <CardContent className="pt-4">
                            <div className="flex items-start gap-4">
                              <rec.icon className={`h-6 w-6 mt-1 ${
                                rec.priority === 'critical' ? 'text-red-500' :
                                rec.priority === 'high' ? 'text-orange-500' : 'text-yellow-500'
                              }`} />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h5 className="font-semibold">{rec.title}</h5>
                                  <Badge variant={rec.priority === 'critical' ? 'destructive' : 
                                               rec.priority === 'high' ? 'secondary' : 'outline'}>
                                    {rec.priority}
                                  </Badge>
                                  {rec.compliance && (
                                    <Badge variant="outline" className="text-blue-600 border-blue-600">
                                      <Scale className="h-3 w-3 mr-1" />
                                      Legal Requirement
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-gray-600 mb-2">{rec.description}</p>
                                <p className="text-sm font-semibold text-green-600">Estimated Cost: {rec.cost}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Safety Layers */}
          <TabsContent value="layers">
            <div className="grid md:grid-cols-2 gap-6">
              {safetyLayers.map((layer, index) => (
                <Card key={index} data-testid={`safety-layer-${index}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <layer.icon className={`h-6 w-6 ${layer.color}`} />
                      {layer.title}
                    </CardTitle>
                    <CardDescription>{layer.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {layer.requirements.map((req, reqIndex) => (
                        <li key={reqIndex} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                          <span className="text-sm">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Legal Compliance */}
          <TabsContent value="compliance">
            <Card data-testid="compliance-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-6 w-6 text-blue-600" />
                  Legal Requirements by State
                </CardTitle>
                <CardDescription>
                  Pool safety regulations vary by location. Always check local codes.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="border-blue-200 bg-blue-50">
                    <CardHeader>
                      <CardTitle className="text-lg text-blue-800">Florida</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1 text-sm">
                        <li>• 54\" fence minimum (some counties)</li>
                        <li>• Self-closing, spring-loaded gates</li>
                        <li>• Gate latch 54+ inches high</li>
                        <li>• Door/window alarms under 54\"</li>
                        <li>• Pool alarms or safety covers</li>
                        <li>• Electric covers accepted as barriers</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-orange-200 bg-orange-50">
                    <CardHeader>
                      <CardTitle className="text-lg text-orange-800">California</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1 text-sm">
                        <li>• 60\" fence height minimum</li>
                        <li>• No gaps larger than 4 inches</li>
                        <li>• Gates open away from pool</li>
                        <li>• Self-closing, self-latching gates</li>
                        <li>• Multiple safety measures required</li>
                        <li>• Comprehensive alarm systems</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-green-200 bg-green-50">
                    <CardHeader>
                      <CardTitle className="text-lg text-green-800">Texas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1 text-sm">
                        <li>• 48\" minimum fence height</li>
                        <li>• Isolation fencing required</li>
                        <li>• Gate latch 54+ inches high</li>
                        <li>• Spring-loaded gate mechanisms</li>
                        <li>• Door alarms for home access</li>
                        <li>• Regular safety inspections</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-purple-200 bg-purple-50">
                    <CardHeader>
                      <CardTitle className="text-lg text-purple-800">Arizona</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1 text-sm">
                        <li>• 5-foot fence requirement</li>
                        <li>• Self-closing gates mandatory</li>
                        <li>• Latch height 54+ inches</li>
                        <li>• Pool barrier isolation required</li>
                        <li>• Safety cover or alarm systems</li>
                        <li>• Window/door alarm requirements</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-indigo-200 bg-indigo-50">
                    <CardHeader>
                      <CardTitle className="text-lg text-indigo-800">Nevada</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1 text-sm">
                        <li>• 54\" minimum fence height</li>
                        <li>• Self-closing, self-latching gates</li>
                        <li>• Gate opens away from pool</li>
                        <li>• Door/window alarms required</li>
                        <li>• Pool safety covers or alarms</li>
                        <li>• Child safety fence options</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-teal-200 bg-teal-50">
                    <CardHeader>
                      <CardTitle className="text-lg text-teal-800">New York</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1 text-sm">
                        <li>• 48\" minimum barrier height</li>
                        <li>• Self-closing gate mechanisms</li>
                        <li>• Latch 54+ inches from ground</li>
                        <li>• Pool alarms mandatory</li>
                        <li>• Safety covers meet ASTM standards</li>
                        <li>• Home access point alarms</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-cyan-200 bg-cyan-50">
                    <CardHeader>
                      <CardTitle className="text-lg text-cyan-800">Georgia</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1 text-sm">
                        <li>• 48\" minimum fence height</li>
                        <li>• Self-closing, self-latching gates</li>
                        <li>• Gate latch 54+ inches high</li>
                        <li>• Pool isolation required</li>
                        <li>• Door/window alarms or covers</li>
                        <li>• ASTM-compliant safety equipment</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-rose-200 bg-rose-50">
                    <CardHeader>
                      <CardTitle className="text-lg text-rose-800">North Carolina</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1 text-sm">
                        <li>• 54\" fence height requirement</li>
                        <li>• Spring-loaded gates mandatory</li>
                        <li>• Gate latches 54+ inches from ground</li>
                        <li>• Pool alarms or safety covers</li>
                        <li>• Perimeter fencing guidelines</li>
                        <li>• Child-resistant access points</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-amber-200 bg-amber-50">
                    <CardHeader>
                      <CardTitle className="text-lg text-amber-800">Pennsylvania</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1 text-sm">
                        <li>• 48\" minimum barrier height</li>
                        <li>• Self-closing gate requirements</li>
                        <li>• Latch height 54+ inches</li>
                        <li>• Multiple safety layer approach</li>
                        <li>• Alarm systems encouraged</li>
                        <li>• Regular safety inspections</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-lime-200 bg-lime-50">
                    <CardHeader>
                      <CardTitle className="text-lg text-lime-800">Illinois</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1 text-sm">
                        <li>• 54\" fence height recommended</li>
                        <li>• Self-closing, spring-loaded gates</li>
                        <li>• Child-resistant latches required</li>
                        <li>• Pool covers or alarm systems</li>
                        <li>• Perimeter yard fence consideration</li>
                        <li>• Screen enclosure guidelines</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-slate-200 bg-slate-50">
                    <CardHeader>
                      <CardTitle className="text-lg text-slate-800">Ohio</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1 text-sm">
                        <li>• 48\" minimum fence height</li>
                        <li>• Gate latches 54+ inches high</li>
                        <li>• Self-closing mechanisms required</li>
                        <li>• Pool alarms or safety covers</li>
                        <li>• Multiple barrier approach</li>
                        <li>• Door/window alarm systems</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <Card className="mt-6 border-emerald-200 bg-emerald-50">
                  <CardHeader>
                    <CardTitle className="text-lg text-emerald-800">Best Protection Strategy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-emerald-700 space-y-2">
                      <p><strong>Prevention is Key:</strong> The best protection is preventing situations by installing the most reliable child safety features:</p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li><strong>Screen Enclosure:</strong> Acts as protective barrier from outsiders entering pool area</li>
                        <li><strong>Door & Window Alarms:</strong> Protects individuals from entering pool from the home</li>
                        <li><strong>Child Safety Fence:</strong> Blocks direct access to pool area from house</li>
                        <li><strong>Electric Covers:</strong> In some states, counties, and cities act as child safety barriers</li>
                        <li><strong>54\" Fencing:</strong> Higher barriers provide better protection than minimum requirements</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Alert className="mt-6 border-amber-200 bg-amber-50">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <AlertTitle className="text-amber-800">Important Legal Notice</AlertTitle>
                  <AlertDescription className="text-amber-700">
                    Pool safety requirements vary significantly by state, county, and city. Always consult local building codes and obtain proper permits before pool construction. This information is for general guidance only.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Emergency Response Section */}
        <Card className="mb-16 border-red-200 bg-red-50" data-testid="emergency-response-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <Phone className="h-6 w-6" />
              Emergency Response Protocol
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold text-red-800 mb-2">If Someone is Drowning:</h4>
                <ol className="space-y-1 text-sm text-red-700">
                  <li>1. Call 911 immediately</li>
                  <li>2. Get the person out of water</li>
                  <li>3. Start CPR if trained</li>
                  <li>4. Continue until help arrives</li>
                </ol>
              </div>
              <div>
                <h4 className="font-semibold text-red-800 mb-2">Prevention Checklist:</h4>
                <ul className="space-y-1 text-sm text-red-700">
                  <li>• Constant supervision</li>
                  <li>• Swim lessons for children</li>
                  <li>• CPR training for adults</li>
                  <li>• Emergency equipment ready</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-red-800 mb-2">Emergency Numbers:</h4>
                <ul className="space-y-1 text-sm text-red-700">
                  <li>• 911 - Emergency Services</li>
                  <li>• Poison Control: 1-800-222-1222</li>
                  <li>• Local Hospital: ___________</li>
                  <li>• Pool Service: ___________</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <CardContent className="pt-8">
            <Shield className="h-16 w-16 mx-auto mb-6 text-white/80" />
            <h2 className="text-3xl font-bold mb-4">Design a Safer Pool Today</h2>
            <p className="text-xl mb-6 text-white/90">
              Let us design a pool that puts your family's safety first, without compromising on beauty or fun.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="secondary" 
                size="lg"
                data-testid="button-free-consultation"
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                Get Free Safety Consultation
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                data-testid="button-ai-design"
                className="border-white text-white hover:bg-white/10"
              >
                Try AI Pool Designer
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}