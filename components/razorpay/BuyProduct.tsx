"use client";

import React, { Suspense, useEffect } from "react";
import Buy from "./Buy";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  name: string;
  currency: string;
  amount: number;
  order_id: string;
  description: string;
  handler: (response: RazorpayResponse) => Promise<void>;
  prefill: {
    name: string;
    email: string;
  };
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
      on: (event: string, callback: (response: RazorpayResponse) => void) => void;
    };
  }
}

const Loading = () => <div>Loading...</div>;

const BuyProduct = () => {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const makePayment = async () => {
    if (!session?.user?.email) return;

    try {
      if (typeof window.Razorpay === 'undefined') {
        alert("Payment system is loading. Please try again later.");
        return;
      }

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const response = await fetch(`${baseUrl}/api/razorpay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          useremail: session.user.email,
        }),
      });

      const { order } = await response.json();

      if (!order) {
        throw new Error("Order creation failed");
      }

      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_API_KEY || "rH7E54G",
        name: "Thoughts & Tales",
        currency: "INR",
        amount: 10000, // ₹100 in paise
        order_id: order.id,
        description: "Blog Subscription",
        handler: async function (response: RazorpayResponse) {
          try {
            // First verify the payment
            const verifyResponse = await fetch(`${baseUrl}/api/paymentverify`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyData?.message === "success") {
                router.push("/blog");
              } else {
                throw new Error("Failed to update user status");
              }
            
          } catch (error) {
            console.error("Payment verification failed:", error);
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: "Thoughts & Tales",
          email: session.user.email,
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

      paymentObject.on("payment.failed", function () {
        alert("Payment failed. Please try again");
      });
    } catch (error) {
      console.error("Payment initialization failed:", error);
      alert("Something went wrong. Please try again later.");
    }
  };

  return (
    <Suspense fallback={<Loading />}>
      <Buy makePayment={makePayment} useremail={session?.user?.email || ''} />
    </Suspense>
  );
};

export default BuyProduct;




