import { useForm as useReactHookForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Phone, Mail, MapPin, Send, Facebook, Twitter, Instagram, Linkedin, Sparkles, Youtube } from "lucide-react";
import { SiPinterest, SiTiktok, SiHouzz } from "react-icons/si";

const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  location: z.string().optional(),
  details: z.string().optional(),
  budget: z.string().optional(),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function ContactSection() {
  const { toast } = useToast();
  const [isFromAI, setIsFromAI] = useState(false);
  const [aiDesignData, setAiDesignData] = useState<any>(null);

  // Keep React Hook Form for validation and UI
  const form = useReactHookForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      location: "",
      details: "",
      budget: "",
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
        details: urlParams.get('details') || '',
        budget: urlParams.get('budget') || '',
        poolStyle: urlParams.get('poolStyle') || '',
        poolLength: urlParams.get('poolLength') || '',
        features: urlParams.get('features') || ''
      };
      
      setAiDesignData(aiData);
      
      // Pre-populate form fields
      form.setValue('details', aiData.details);
      form.setValue('budget', aiData.budget);
      
      toast({
        title: "AI Design Loaded!",
        description: "Your pool design details have been pre-loaded into the contact form.",
      });
    }
  }, [form, toast]);


  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const onSubmit = async (data: ContactForm) => {
    setIsSubmitting(true);
    setSubmitSuccess(false); // Clear any previous success state
    setSuccessMessage("");
    
    try {
      // Prepare data for SendGrid API
      const emailData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone || undefined,
        location: data.location || undefined,
        details: data.details || undefined,
        budget: data.budget || undefined,
        // Include AI design data if present
        isFromAI: isFromAI,
        poolStyle: aiDesignData?.poolStyle || undefined,
        poolLength: aiDesignData?.poolLength || undefined,
        features: aiDesignData?.features || undefined,
      };

      // Submit to SendGrid API endpoint
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json' 
        },
        body: JSON.stringify(emailData)
      });

      const result = await response.json();

      console.log('API Response:', { status: response.status, ok: response.ok, result });
      
      if (response.ok && result.success) {
        console.log('Setting success state: true');
        console.log('Success message:', result.message);
        
        // Set success state FIRST
        setSubmitSuccess(true);
        setSuccessMessage(result.message || "We'll get back to you within 24 hours with your free consultation details.");
        
        // Log current state for debugging
        console.log('Submit success state should now be true');
        
        // Also try the toast
        toast({
          title: "✅ Thank you for your inquiry!",
          description: result.message || "We'll get back to you within 24 hours with your free consultation details.",
          duration: 6000,
        });
        
        // Clear AI design data after successful submission
        if (isFromAI) {
          setIsFromAI(false);
          setAiDesignData(null);
        }
        
        // Reset form AFTER setting success state
        form.reset();
        
        // Auto-hide success message after 20 seconds (even longer)
        setTimeout(() => {
          console.log('Auto-hiding success message after 20 seconds');
          setSubmitSuccess(false);
          setSuccessMessage("");
        }, 20000);
      } else {
        console.error('SendGrid API error response:', result);
        throw new Error(result.error || 'Email submission failed');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitSuccess(false);
      setSuccessMessage("");
      toast({
        title: "Submission failed",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 gradient-soft">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">Ready to Start Your Pool Project?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get in touch with our pool design experts for a free consultation and personalized quote.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-foreground">Free Consultation</CardTitle>
            </CardHeader>
            <CardContent>
              {isFromAI && aiDesignData && (
                <Alert className="mb-6 border-blue-200 bg-blue-50" data-testid="alert-ai-design-loaded">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  <AlertTitle className="text-blue-800">AI Design Details Loaded</AlertTitle>
                  <AlertDescription className="text-blue-700">
                    Your {aiDesignData.poolStyle} pool design ({aiDesignData.poolLength}ft) with features: {aiDesignData.features} has been pre-loaded. Complete the form to get your professional quote.
                  </AlertDescription>
                </Alert>
              )}
              
              {/* Success Message */}
              {submitSuccess && (
                <Alert className="mb-6 border-green-200 bg-green-50" data-testid="alert-success-message">
                  <Send className="h-5 w-5 text-green-600" />
                  <AlertTitle className="text-green-800">✅ Thank you for your inquiry!</AlertTitle>
                  <AlertDescription className="text-green-700">
                    {successMessage}
                  </AlertDescription>
                </Alert>
              )}
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-bold text-blue-600">First Name *</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-first-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-bold text-blue-600">Last Name *</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-last-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-bold text-blue-600">Email Address *</FormLabel>
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
                        <FormLabel className="text-sm font-bold text-blue-600">Phone Number</FormLabel>
                        <FormControl>
                          <Input type="tel" {...field} data-testid="input-phone" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-bold text-blue-600">Project Location</FormLabel>
                        <FormControl>
                          <Input placeholder="City, State" {...field} data-testid="input-location" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="details"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-bold text-blue-600">Project Details</FormLabel>
                        <FormControl>
                          <Textarea 
                            rows={4} 
                            placeholder="Tell us about your dream pool..." 
                            className="resize-none" 
                            {...field}
                            data-testid="textarea-details"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-bold text-blue-600">Budget Range</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-budget">
                              <SelectValue placeholder="Select budget range" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="25-50k">$25,000 - $50,000</SelectItem>
                            <SelectItem value="50-75k">$50,000 - $75,000</SelectItem>
                            <SelectItem value="75-100k">$75,000 - $100,000</SelectItem>
                            <SelectItem value="100k+">$100,000+</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Honeypot field for spam protection */}
                  <input
                    type="text"
                    name="_gotcha"
                    style={{ display: 'none' }}
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  <Button 
                    type="submit" 
                    className="w-full gradient-primary text-white py-4 px-6 rounded-lg font-bold text-lg hover:opacity-90 transition-opacity"
                    disabled={isSubmitting}
                    data-testid="button-submit-contact"
                  >
                    <Send className="mr-2 h-5 w-5" />
                    {isSubmitting ? "Sending..." : "Get My Free Consultation"}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    * Required fields. We respect your privacy and will never share your information.
                  </p>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Info Card */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-foreground">Get In Touch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">Phone</h4>
                    <p className="text-muted-foreground">(407) 314-0857</p>
                    <p className="text-sm text-muted-foreground">Mon-Fri 8AM-6PM</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">Email</h4>
                    <p className="text-muted-foreground">kayne@pooldesignconsultant.com</p>
                    <p className="text-sm text-muted-foreground">We respond within 2 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">Remote Office Location</h4>
                    <p className="text-muted-foreground">4300 W Lake Mary Blvd, Suite 1010</p>
                    <p className="text-sm text-muted-foreground">Lake Mary, FL 32746</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-bold text-foreground mb-3">Areas We Serve</h4>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p>
                      Pool Design Consultant provides custom 3D pool designs, construction plans, and permitting packages <strong>nationwide, throughout the Caribbean, across Australia, and worldwide</strong>.
                    </p>
                    <p>
                      We specialize in pool design services across the warm-weather states where swimming pools are most popular, including <strong>Florida, Texas, California, Arizona, Nevada, and the Carolinas</strong>.
                    </p>
                    <p>
                      Our remote design process allows us to collaborate seamlessly with homeowners, builders, and developers anywhere, delivering stunning 3D visualizations and permit-ready plans customized to meet local building department requirements.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card className="gradient-primary text-white text-center">
              <CardContent className="p-6">
                <h4 className="text-xl font-bold mb-2">Need Immediate Help?</h4>
                <p className="mb-4 opacity-90">Our design experts are standing by for emergency consultations</p>
                <Button
                  variant="secondary"
                  className="bg-white text-blue-600 px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors"
                  data-testid="button-call-now"
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Call Now: (407) 314-0857
                </Button>
              </CardContent>
            </Card>

            {/* Social Proof */}
            <Card className="text-center shadow-lg">
              <CardContent className="p-6">
                <h4 className="text-lg font-bold mb-3 text-foreground">Join over 5,000 Happy Customers</h4>
                <div className="flex justify-center flex-wrap gap-3">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-blue-600 hover:text-blue-800 transition-colors p-1"
                    asChild
                    data-testid="link-facebook"
                  >
                    <a href="https://www.facebook.com/pooldesignconsultant" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Facebook">
                      <Facebook className="w-6 h-6" />
                    </a>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-pink-500 hover:text-pink-700 transition-colors p-1"
                    asChild
                    data-testid="link-instagram"
                  >
                    <a href="https://www.instagram.com/aipooldesignconsultant" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Instagram">
                      <Instagram className="w-6 h-6" />
                    </a>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-600 hover:text-red-800 transition-colors p-1"
                    asChild
                    data-testid="link-youtube"
                  >
                    <a href="https://www.youtube.com/@pooldesignconsultant" target="_blank" rel="noopener noreferrer" aria-label="Subscribe to our YouTube channel">
                      <Youtube className="w-6 h-6" />
                    </a>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-black hover:text-gray-700 transition-colors p-1"
                    asChild
                    data-testid="link-tiktok"
                  >
                    <a href="https://www.tiktok.com/@pooldesignconsultant" target="_blank" rel="noopener noreferrer" aria-label="Follow us on TikTok">
                      <SiTiktok className="w-6 h-6" />
                    </a>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-700 hover:text-red-900 transition-colors p-1"
                    asChild
                    data-testid="link-pinterest"
                  >
                    <a href="https://www.pinterest.com/pooldesignconsultant" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Pinterest">
                      <SiPinterest className="w-6 h-6" />
                    </a>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-blue-700 hover:text-blue-900 transition-colors p-1"
                    asChild
                    data-testid="link-linkedin"
                  >
                    <a href="https://www.linkedin.com/in/aipooldesignconsultant" target="_blank" rel="noopener noreferrer" aria-label="Connect with us on LinkedIn">
                      <Linkedin className="w-6 h-6" />
                    </a>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-green-600 hover:text-green-800 transition-colors p-1"
                    asChild
                    data-testid="link-houzz"
                  >
                    <a href="https://www.houzz.com/pooldesignconsultant" target="_blank" rel="noopener noreferrer" aria-label="See our projects on Houzz">
                      <SiHouzz className="w-6 h-6" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
