import { NextRequest, NextResponse } from 'next/server';
import { createAPISupabaseClient } from '@/lib/supabase-server';
import { createPaymentIntent } from '@/lib/stripe';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const invoiceId = params.id;

    // Create a Supabase client specifically for API routes
    const supabase = await createAPISupabaseClient();

    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();

    console.log("Payment API route session:", session ? "Session exists" : "No session");

		if (!session) {
			return NextResponse.json(
				{ error: 'Unauthorized' },
				{ status: 401 }
			);
		}

    // Get the invoice with related items
    const { data: invoice, error: fetchError } = await supabase
      .from('invoices')
      .select('*, items:invoice_items(*)')
      .eq('id', invoiceId)
      .single();

    if (fetchError || !invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    // Check if invoice is in a state where it can be paid
    if (invoice.status !== 'sent') {
      return NextResponse.json(
        { error: 'Invoice cannot be paid in its current state' },
        { status: 400 }
      );
    }

    // Create Stripe payment intent
    const { clientSecret, id } = await createPaymentIntent(invoice);

    // Add a pending payment record
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        invoice_id: invoiceId,
        amount_cents: invoice.amount_cents,
        provider: 'stripe',
        provider_payment_id: id,
        status: 'pending',
      });

    if (paymentError) {
      console.error('Error creating pending payment record:', paymentError);
      // Continue anyway, as the payment intent was created successfully
    }

    return NextResponse.json({
      clientSecret,
      invoiceAmount: invoice.amount_cents,
      currency: invoice.currency,
    });

  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}