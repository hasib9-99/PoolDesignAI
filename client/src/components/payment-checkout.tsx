import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ amount, description, onSuccess }: { amount: number, description: string, onSuccess?: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Payment Successful",
        description: "Thank you for your payment!",
      });
      onSuccess?.();
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{description}</h3>
        <p className="text-2xl font-bold text-orange-500">${amount}</p>
      </div>
      
      <PaymentElement 
        options={{
          layout: "tabs",
          paymentMethodOrder: ["card"]
        }}
      />
      
      <div className="border-t pt-4 mt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Alternative Payment Methods</h4>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded text-white flex items-center justify-center text-sm font-bold">Z</div>
            <div className="flex-1">
              <h5 className="font-medium text-gray-900">Zelle</h5>
              <p className="text-sm text-gray-600">Send payment to: <span className="font-mono font-medium">kayne@pooldesignconsultant.com</span></p>
              <p className="text-xs text-gray-500 mt-1">Please include your order reference in the payment memo</p>
            </div>
          </div>
        </div>
      </div>
      
      <Button 
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3"
        data-testid="button-complete-payment"
      >
        {isProcessing ? "Processing..." : `Pay $${amount}`}
      </Button>
    </form>
  );
};

interface PaymentCheckoutProps {
  amount: number;
  description: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function PaymentCheckout({ amount, description, onSuccess, onCancel }: PaymentCheckoutProps) {
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Create PaymentIntent as soon as the component loads
    apiRequest("POST", "/api/create-payment-intent", { 
      amount: amount,
      description: description 
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          throw new Error("Failed to create payment intent");
        }
      })
      .catch((error) => {
        console.error("Payment setup error:", error);
        toast({
          title: "Payment Setup Failed",
          description: "Unable to initialize payment. Please try again.",
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [amount, description, toast]);

  if (isLoading) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="h-32 flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full" aria-label="Loading"/>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!clientSecret) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-red-600 mb-4">Payment setup failed. Please try again.</p>
            <Button onClick={onCancel} variant="outline">
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Make SURE to wrap the form in <Elements> which provides the stripe context.
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Secure Payment</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm 
            amount={amount} 
            description={description}
            onSuccess={onSuccess}
          />
        </Elements>
        
        {onCancel && (
          <div className="mt-4 text-center">
            <Button onClick={onCancel} variant="outline" size="sm">
              Cancel
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}