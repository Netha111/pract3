import { NextResponse, NextRequest } from "next/server";
import Razorpay from "razorpay";
import shortid from "shortid";

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY as string,
    key_secret: process.env.RAZORPAY_API_SECRET as string,
  });
  console.log("hello")
export async function POST(req: NextRequest) {
    const body = await req.json(); // Parse the request body to get dynamic data
    const { useremail} = body;
    console.log(body)
    const payment_capture = 1;
    const amount = 1 * 5000 // amount in paisa. In our case it's INR 1
    const currency = "INR";
    const options = {
        amount: (amount).toString(),
        currency,
        receipt: shortid.generate(),
        payment_capture,
        notes: {
            // These notes will be added to your transaction. So you can search it within their dashboard.
            // Also, it's included in webhooks as well. So you can automate it.
            paymentFor: "thoughts",
            userId: "100",
            productId: 'P100',
            userEmail: `${useremail}`,
        }
    };
   const order = await instance.orders.create(options);
  return NextResponse.json({ msg: "success",order });
}
