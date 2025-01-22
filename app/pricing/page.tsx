"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useSession } from "next-auth/react";
import BuyProduct from "@/components/razorpay/BuyProduct";
import { signIn } from "next-auth/react";

const features = [
  "Unlimited blog posts forever",
  "Advanced editor with rich media",
  "Custom domain support",
  "Priority support",
  "Detailed analytics",
  "Monetization features",
  "Newsletter integration",
  "Custom branding",
  "API access",
  "Lifetime updates"
];

export default function PricingPage() {
  const { data: session } = useSession();

  const handlePurchase = () => {
    if (!session) {
      signIn('google');
      return;
    }
  };

  return (
    <div className="container py-16 mx-auto">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          One-Time Payment, Lifetime Access
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Get full access to all features with a single payment. No recurring fees, no hidden charges.
        </p>
      </div>

      {/* Pricing Card */}
      <div className="max-w-2xl mx-auto">
        <Card className="flex flex-col border-primary shadow-lg">
          <CardHeader className="text-center">
            <div className="px-4 py-1.5 text-sm text-primary-foreground bg-primary rounded-full w-fit mx-auto mb-4">
              Limited Time Offer
            </div>
            <CardTitle className="text-3xl mb-2">Lifetime Access</CardTitle>
            <div className="flex items-center justify-center gap-2 mt-4">
              <span className="text-5xl font-bold tracking-tight">
                ₹100
              </span>
              <div className="flex flex-col items-start text-muted-foreground">
                <span className="text-sm line-through">₹999</span>
                <span className="text-sm">one-time</span>
              </div>
            </div>
            <p className="text-muted-foreground mt-4">
              Get complete access to all premium features and future updates with a single payment.
            </p>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="grid md:grid-cols-2 gap-4">
              {features.map((feature) => (
                <div key={feature} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 p-6">
            {session ? (
              <BuyProduct />
            ) : (
              <Button 
                size="lg" 
                className="w-full text-lg py-6"
                onClick={handlePurchase}
              >
                Sign in to Purchase
              </Button>
            )}
            <p className="text-sm text-muted-foreground text-center">
              30-day money-back guarantee • Secure payment • Instant access
            </p>
          </CardFooter>
        </Card>

        {/* Trust Indicators */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <h3 className="font-semibold mb-2">30-Day Guarantee</h3>
            <p className="text-sm text-muted-foreground">
              Not satisfied? Get a full refund within 30 days.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Lifetime Updates</h3>
            <p className="text-sm text-muted-foreground">
              Access all future features and improvements.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Instant Access</h3>
            <p className="text-sm text-muted-foreground">
              Start using all premium features immediately.
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold tracking-tight mb-4">
            Have Questions?
          </h2>
          <p className="text-muted-foreground">
            Contact our support team at{" "}
            <Button variant="link" className="p-0">
              support@thoughtsandtales.com
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
} 