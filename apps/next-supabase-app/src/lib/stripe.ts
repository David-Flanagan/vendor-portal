import Stripe from 'stripe';
import { Tables } from '@/types/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
});

export async function createPaymentIntent(invoice: Tables['invoices']) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: invoice.amount_cents,
      currency: invoice.currency.toLowerCase(),
      metadata: {
        invoice_id: invoice.id,
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id,
    };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
}

export async function verifyStripeWebhookSignature(
  payload: string,
  signature: string
) {
  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    return event;
  } catch (error) {
    console.error('Error verifying webhook signature:', error);
    throw error;
  }
}