import { NextRequest, NextResponse } from 'next/server';
import { verifyStripeWebhookSignature } from '@/lib/stripe';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export const config = {
  runtime: 'edge',
  regions: ['iad1'], // Specify regions close to your Supabase instance
};

export async function POST(request: NextRequest) {
  try {
    // Get the signature from the headers
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    // Get the body as text for signature verification
    const body = await request.text();

    // Verify the webhook signature
    const event = await verifyStripeWebhookSignature(body, signature);

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        const invoiceId = paymentIntent.metadata.invoice_id;

        if (!invoiceId) {
          console.error('No invoice ID in payment intent metadata');
          return NextResponse.json(
            { error: 'No invoice ID in metadata' },
            { status: 400 }
          );
        }

        const supabase = createServerSupabaseClient();

        // Create a payment record
        const { error: paymentError } = await supabase
          .from('payments')
          .insert({
            invoice_id: invoiceId,
            amount_cents: paymentIntent.amount,
            provider: 'stripe',
            provider_payment_id: paymentIntent.id,
            status: 'succeeded',
          });

        if (paymentError) {
          console.error('Error creating payment record:', paymentError);
          return NextResponse.json(
            { error: 'Error creating payment record' },
            { status: 500 }
          );
        }

        // The invoice status update is handled by a Postgres trigger

        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        const invoiceId = paymentIntent.metadata.invoice_id;

        if (!invoiceId) {
          console.error('No invoice ID in payment intent metadata');
          return NextResponse.json(
            { error: 'No invoice ID in metadata' },
            { status: 400 }
          );
        }

        const supabase = createServerSupabaseClient();

        // Create a failed payment record
        const { error: paymentError } = await supabase
          .from('payments')
          .insert({
            invoice_id: invoiceId,
            amount_cents: paymentIntent.amount,
            provider: 'stripe',
            provider_payment_id: paymentIntent.id,
            status: 'failed',
          });

        if (paymentError) {
          console.error('Error creating failed payment record:', paymentError);
          return NextResponse.json(
            { error: 'Error creating failed payment record' },
            { status: 500 }
          );
        }

        break;
      }
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}