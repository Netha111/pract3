import { dbConnection } from '@/app/lib/database';
import { UserLogin } from '@/app/lib/model';
import crypto from 'crypto';
import { NextResponse } from 'next/server';

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const clonedReq = req.clone();
    const rawBody = await clonedReq.text();
    console.log("Webhook triggered");

    // Retrieve headers
    const razorpaySignature = req.headers.get('X-Razorpay-signature') || '';
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || '';

    // Verify Razorpay signature
    const hmac = crypto.createHmac('sha256', webhookSecret);
    hmac.update(rawBody);
    const generatedSignature = hmac.digest('hex');

    if (razorpaySignature !== generatedSignature) {
      throw new Error('Invalid Razorpay signature');
    }

    // Parse the webhook payload
    const body = JSON.parse(rawBody);
    const notes = body.payload.order.entity.notes;
    const email = notes.userEmail;

    // Event Handling
    if (body.event === 'order.paid') {
      const status = body.payload.payment.entity.status;

      // Ensure the payment is captured
      if (status === 'captured') {
        // Connect to the database and update the user record
        await dbConnection();
        
        const updatedUser = await UserLogin.findOneAndUpdate(
          { email },
          { paid: true },
          { new: true }
        );

        if (!updatedUser) {
          console.error(`User not found for email: ${email}`);
          throw new Error('User not found');
        }

        console.log(`User ${email} marked as paid`);
      }
    }

    return NextResponse.json({ message: 'Webhook processed successfully' });
  } catch (err: Error | unknown) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    console.error('Error processing webhook:', error.message);
    return NextResponse.json(
      { message: 'Error processing webhook', error: error.message },
      { status: 500 }
    );
  }
}
