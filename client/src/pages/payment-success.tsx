import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home, Mail } from "lucide-react";
import { Link } from "wouter";

export default function PaymentSuccess() {
  const [paymentIntent, setPaymentIntent] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentIntentId = urlParams.get('payment_intent');
    setPaymentIntent(paymentIntentId);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 dark:from-blue-950 dark:to-orange-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto text-center">
        <CardHeader className="pb-4">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl text-green-600 dark:text-green-400">
            Payment Successful!
          </CardTitle>
          <CardDescription className="text-lg">
            Thank you for choosing our pool design services
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">What happens next?</h3>
            <ul className="text-sm text-left space-y-2">
              <li>• You'll receive a confirmation email within 5 minutes</li>
              <li>• We'll contact you within 24 hours to schedule your consultation</li>
              <li>• Our team will begin preparing your personalized design</li>
            </ul>
          </div>

          {paymentIntent && (
            <div className="text-sm text-muted-foreground">
              <p>Reference ID: {paymentIntent.slice(-8)}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="flex-1" data-testid="button-home">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <Button variant="outline" asChild className="flex-1" data-testid="button-contact">
              <Link href="#contact">
                <Mail className="mr-2 h-4 w-4" />
                Contact Us
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}