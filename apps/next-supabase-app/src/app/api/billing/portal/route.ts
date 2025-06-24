import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase-server';
import { createBillingPortalSession } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const supabase = createServiceClient();
    const body = await request.json();
    const { companyId, returnUrl } = body;

    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      );
    }

    // Get company with Stripe customer ID
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('stripe_customer_id')
      .eq('id', companyId)
      .single();

    if (companyError || !company?.stripe_customer_id) {
      return NextResponse.json(
        { error: 'Company not found or no billing setup' },
        { status: 404 }
      );
    }

    // Create billing portal session
    const session = await createBillingPortalSession(
      company.stripe_customer_id,
      returnUrl || `${process.env.NEXT_PUBLIC_APP_URL}/billing`
    );

    return NextResponse.json({ url: session.url });

  } catch (error) {
    console.error('Error creating billing portal session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}