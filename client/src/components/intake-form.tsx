import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Upload, FileText, Image, CheckCircle2, AlertCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

// Form validation schema
const intakeFormSchema = z.object({
  // Contact Information
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  
  // Property Information
  projectAddress: z.string().min(5, "Project address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(5, "ZIP code is required"),
  county: z.string().min(2, "County/Authority is required"),
  
  // HOA Information
  hasHOA: z.boolean(),
  hoaGuidelines: z.string().optional(),
  
  // Pool Design Specifications
  poolLength: z.coerce.number().min(10, "Pool length must be at least 10 feet"),
  poolWidth: z.coerce.number().min(8, "Pool width must be at least 8 feet"),
  shallowDepth: z.coerce.number().min(3, "Shallow depth must be at least 3 feet"),
  deepDepth: z.coerce.number().min(4, "Deep depth must be at least 4 feet"),
  deckMaterial: z.string().min(1, "Deck material is required"),
  deckSquareFootage: z.coerce.number().min(50, "Deck square footage is required"),
  
  // Features
  waterFeatures: z.array(z.string()).optional(),
  fireFeatures: z.array(z.string()).optional(),
  structures: z.array(z.string()).optional(),
  
  // Spa Information
  hasSpa: z.boolean(),
  spaSize: z.string().optional(),
  spaSpillover: z.boolean().optional(),
  
  // Equipment and Safety
  equipmentBrand: z.string().optional(),
  safetyFeatures: z.array(z.string()).optional(),
  
  // Project Details
  budgetRange: z.string().min(1, "Budget range is required"),
  targetStartDate: z.string().optional(),
  specialRequests: z.string().optional(),
  sketchNotes: z.string().optional(),
  
  // Consent
  consentGiven: z.boolean().refine(val => val === true, "You must consent to proceed")
});

type IntakeFormData = z.infer<typeof intakeFormSchema>;

const FORM_STEPS = [
  { id: 1, title: "Contact Information", description: "Your basic contact details" },
  { id: 2, title: "Property Information", description: "Project location and jurisdiction" },
  { id: 3, title: "File Uploads", description: "Survey, photos, and documents" },
  { id: 4, title: "Pool Specifications", description: "Size, depth, and design details" },
  { id: 5, title: "Features & Equipment", description: "Water features, spa, and equipment" },
  { id: 6, title: "Project Details", description: "Budget, timeline, and special requests" },
  { id: 7, title: "Review & Submit", description: "Confirm all details and submit" }
];


const deckMaterials = [
  "Concrete/Stamped Concrete",
  "Natural Stone (Travertine, Flagstone)",
  "Pavers (Brick, Stone, Concrete)",
  "Wood Decking",
  "Composite Decking",
  "Tile",
  "Other"
];

const budgetRanges = [
  "$25,000 - $50,000",
  "$50,000 - $75,000", 
  "$75,000 - $100,000",
  "$100,000 - $150,000",
  "$150,000 - $200,000",
  "$200,000+"
];

export default function IntakeForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<IntakeFormData>({
    resolver: zodResolver(intakeFormSchema),
    defaultValues: {
      hasHOA: false,
      hasSpa: false,
      spaSpillover: false,
      waterFeatures: [],
      fireFeatures: [],
      structures: [],
      safetyFeatures: [],
      consentGiven: false
    }
  });

  // Auto-save to localStorage
  useEffect(() => {
    const subscription = form.watch((value) => {
      localStorage.setItem('poolIntakeForm', JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Load saved data on mount
  useEffect(() => {
    const savedData = localStorage.getItem('poolIntakeForm');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        Object.keys(parsedData).forEach(key => {
          if (parsedData[key] !== undefined && parsedData[key] !== null) {
            form.setValue(key as keyof IntakeFormData, parsedData[key]);
          }
        });
      } catch (error) {
        console.error('Error loading saved form data:', error);
      }
    }
  }, [form]);

  const progress = (currentStep / FORM_STEPS.length) * 100;

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await form.trigger(fieldsToValidate);
    
    if (isValid && currentStep < FORM_STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getFieldsForStep = (step: number): (keyof IntakeFormData)[] => {
    switch (step) {
      case 1:
        return ['fullName', 'email', 'phone'];
      case 2:
        return ['projectAddress', 'city', 'state', 'zipCode', 'county'];
      case 4:
        return ['poolLength', 'poolWidth', 'shallowDepth', 'deepDepth', 'deckMaterial', 'deckSquareFootage'];
      case 6:
        return ['budgetRange'];
      case 7:
        return ['consentGiven'];
      default:
        return [];
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/heic', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const isValidType = allowedTypes.includes(file.type);
      
      // Validate file size (50MB max)
      const isValidSize = file.size <= 50 * 1024 * 1024;
      
      if (!isValidType) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a supported file type.`,
          variant: "destructive"
        });
        return false;
      }
      
      if (!isValidSize) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds the 50MB size limit.`,
          variant: "destructive"
        });
        return false;
      }
      
      return true;
    });

    setUploadedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: IntakeFormData) => {
    setIsSubmitting(true);
    
    try {
      // Create FormData for multipart upload
      const formData = new FormData();
      
      // Add form data
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value.toString());
          }
        }
      });
      
      // Add files
      uploadedFiles.forEach((file, index) => {
        formData.append(`file_${index}`, file);
      });
      
      // Submit to API
      const response = await fetch('/api/pool-intake', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Submission failed');
      }
      
      const result = await response.json();
      
      toast({
        title: "Submission Successful!",
        description: `Your ticket number is ${result.ticketNumber}. Check your email for confirmation.`,
      });
      
      // Clear form and localStorage
      form.reset();
      localStorage.removeItem('poolIntakeForm');
      setUploadedFiles([]);
      setCurrentStep(1);
      
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        title: "Submission Failed",
        description: "Please try again or contact us directly.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    const formValues = form.watch();

    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <Input {...field} data-testid="input-full-name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address *</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} data-testid="input-email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number *</FormLabel>
                  <FormControl>
                    <Input type="tel" {...field} data-testid="input-phone" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="projectAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Address *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="123 Main Street, City, State" data-testid="input-address" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City *</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-city" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="CA" data-testid="input-state" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ZIP Code *</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-zip" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="county"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>County/Authority *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter county or authority having jurisdiction" 
                        {...field} 
                        data-testid="input-county"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="hasHOA"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="checkbox-hoa"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Property has HOA</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              {formValues.hasHOA && (
                <FormField
                  control={form.control}
                  name="hoaGuidelines"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>HOA Guidelines/Requirements</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Describe any HOA pool requirements..." data-testid="textarea-hoa-guidelines" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <div className="mb-4">
                <label htmlFor="file-upload" className="cursor-pointer">
                  <span className="font-medium text-blue-600 hover:text-blue-500">
                    Click to upload files
                  </span>
                  <span className="text-gray-500"> or drag and drop</span>
                </label>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.heic,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  data-testid="input-file-upload"
                />
              </div>
              <p className="text-sm text-gray-500">
                Required: Survey/site plan, backyard photos<br />
                Optional: HOA documents, sketches<br />
                Supported: PDF, JPG, PNG, HEIC, DOC, DOCX (50MB max per file)
              </p>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium">Uploaded Files ({uploadedFiles.length})</h4>
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {file.type.startsWith('image/') ? (
                        <Image className="h-5 w-5 text-blue-500" />
                      ) : (
                        <FileText className="h-5 w-5 text-red-500" />
                      )}
                      <div>
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      data-testid={`button-remove-file-${index}`}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Pool Dimensions</h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="poolLength"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pool Length (feet) *</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} data-testid="input-pool-length" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="poolWidth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pool Width (feet) *</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} data-testid="input-pool-width" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="shallowDepth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shallow End Depth (feet) *</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.5" {...field} data-testid="input-shallow-depth" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="deepDepth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deep End Depth (feet) *</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.5" {...field} data-testid="input-deep-depth" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <h3 className="text-lg font-medium mt-8">Deck Information</h3>
            <FormField
              control={form.control}
              name="deckMaterial"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deck Material *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-deck-material">
                        <SelectValue placeholder="Select deck material" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {deckMaterials.map((material) => (
                        <SelectItem key={material} value={material}>
                          {material}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deckSquareFootage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Approximate Deck Square Footage *</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} data-testid="input-deck-sqft" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Water Features</h3>
              <div className="space-y-2">
                {['Scuppers', 'Sheer descents', 'Laminars', 'Bubblers', 'Deck jets', 'Spillway', 'Infinity/knife edge'].map((feature) => (
                  <FormField
                    key={feature}
                    control={form.control}
                    name="waterFeatures"
                    render={({ field }) => {
                      const currentFeatures = field.value || [];
                      return (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={currentFeatures.includes(feature)}
                              onCheckedChange={(checked) => {
                                const updatedFeatures = checked
                                  ? [...currentFeatures, feature]
                                  : currentFeatures.filter((f) => f !== feature);
                                field.onChange(updatedFeatures);
                              }}
                              data-testid={`checkbox-water-${feature.toLowerCase().replace(/\s+/g, '-')}`}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            {feature}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Fire Features</h3>
              <div className="space-y-2">
                {['Fire bowls', 'Fire pit (gas)', 'Fire pit (propane)', 'Fireplace'].map((feature) => (
                  <FormField
                    key={feature}
                    control={form.control}
                    name="fireFeatures"
                    render={({ field }) => {
                      const currentFeatures = field.value || [];
                      return (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={currentFeatures.includes(feature)}
                              onCheckedChange={(checked) => {
                                const updatedFeatures = checked
                                  ? [...currentFeatures, feature]
                                  : currentFeatures.filter((f) => f !== feature);
                                field.onChange(updatedFeatures);
                              }}
                              data-testid={`checkbox-fire-${feature.toLowerCase().replace(/\s+/g, '-')}`}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            {feature}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Spa</h3>
              <FormField
                control={form.control}
                name="hasSpa"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="checkbox-has-spa"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Include spa/hot tub</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              {formValues.hasSpa && (
                <div className="mt-4 space-y-4">
                  <FormField
                    control={form.control}
                    name="spaSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Spa Size</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-spa-size">
                              <SelectValue placeholder="Select spa size" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="small">Small (6-8 people)</SelectItem>
                            <SelectItem value="medium">Medium (8-10 people)</SelectItem>
                            <SelectItem value="large">Large (10+ people)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="spaSpillover"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            data-testid="checkbox-spa-spillover"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Spa spillover to pool</FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Equipment Preferences</h3>
              <FormField
                control={form.control}
                name="equipmentBrand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Equipment Brand (optional)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-equipment-brand">
                          <SelectValue placeholder="Select brand preference" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pentair">Pentair</SelectItem>
                        <SelectItem value="hayward">Hayward</SelectItem>
                        <SelectItem value="jandy">Jandy</SelectItem>
                        <SelectItem value="no-preference">No preference</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Safety Features</h3>
              <div className="space-y-2">
                {['Pool fence', 'Safety cover', 'Pool alarms', 'Gate alarms', 'Screen enclosure'].map((feature) => (
                  <FormField
                    key={feature}
                    control={form.control}
                    name="safetyFeatures"
                    render={({ field }) => {
                      const currentFeatures = field.value || [];
                      return (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={currentFeatures.includes(feature)}
                              onCheckedChange={(checked) => {
                                const updatedFeatures = checked
                                  ? [...currentFeatures, feature]
                                  : currentFeatures.filter((f) => f !== feature);
                                field.onChange(updatedFeatures);
                              }}
                              data-testid={`checkbox-safety-${feature.toLowerCase().replace(/\s+/g, '-')}`}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            {feature}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="budgetRange"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget Range *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-budget-range">
                        <SelectValue placeholder="Select budget range" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {budgetRanges.map((range) => (
                        <SelectItem key={range} value={range}>
                          {range}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="targetStartDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Start Date (optional)</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} data-testid="input-start-date" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="specialRequests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Special Requests or Requirements</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Any special design considerations, accessibility needs, or unique requirements..." data-testid="textarea-special-requests" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sketchNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Design Notes or Sketch Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Describe your vision, preferred pool shape, layout ideas..." data-testid="textarea-sketch-notes" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Review Your Submission</h3>
              <div className="space-y-3 text-sm">
                <div><strong>Contact:</strong> {formValues.fullName} ({formValues.email})</div>
                <div><strong>Project:</strong> {formValues.projectAddress}</div>
                <div><strong>Pool Size:</strong> {formValues.poolLength}' x {formValues.poolWidth}' (depth: {formValues.shallowDepth}' - {formValues.deepDepth}')</div>
                <div><strong>Budget:</strong> {formValues.budgetRange}</div>
                <div><strong>Files:</strong> {uploadedFiles.length} uploaded</div>
                {formValues.hasSpa && <div><strong>Spa:</strong> Included</div>}
                {formValues.waterFeatures && formValues.waterFeatures.length > 0 && (
                  <div><strong>Water Features:</strong> {formValues.waterFeatures.join(', ')}</div>
                )}
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Important:</strong> Please ensure all required files are uploaded, especially your survey/site plan 
                and backyard photos. Missing files may delay your design concepts.
              </p>
            </div>

            <FormField
              control={form.control}
              name="consentGiven"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      data-testid="checkbox-consent"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm">
                      I confirm I own or have written permission to submit this property information and agree to the{' '}
                      <Link href="/terms-conditions" target="_blank" className="text-blue-600 hover:underline">
                        Terms & Conditions
                      </Link>
                      {' '}and{' '}
                      <Link href="/privacy-policy" target="_blank" className="text-blue-600 hover:underline">
                        Privacy Policy
                      </Link>
                      . I understand this is a design service; engineering and permitting may be additional. *
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <FormMessage />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <CardTitle>Step {currentStep} of {FORM_STEPS.length}: {FORM_STEPS[currentStep - 1]?.title}</CardTitle>
          <span className="text-sm text-gray-500">{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="w-full" />
        <p className="text-sm text-gray-600 mt-2">{FORM_STEPS[currentStep - 1]?.description}</p>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {renderStepContent()}
            
            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                data-testid="button-previous"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              
              {currentStep < FORM_STEPS.length ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  data-testid="button-next"
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-orange-500 hover:bg-orange-600"
                  data-testid="button-submit"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Submit Application
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}