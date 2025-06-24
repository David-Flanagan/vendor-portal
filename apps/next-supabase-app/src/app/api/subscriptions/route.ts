import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase-server';
import {
  createSubscription,
  updateSubscription,
  cancelSubscription,
  createBillingPortalSession
} from '@/lib/stripe';
import { billingService } from '@/lib/billing-service';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServiceClient();
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');

    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      );
    }

    // Get company billing information
    const billingInfo = await billingService.getCompanyBilling(companyId);

    return NextResponse.json(billingInfo);

  } catch (error) {
    console.error('Error fetching subscription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServiceClient();
    const body = await request.json();
    const { companyId, planName, billingCycle, trialDays } = body;

    if (!companyId || !planName || !billingCycle) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create subscription
    const result = await billingService.createCompanySubscription(
      companyId,
      planName,
      billingCycle,
      trialDays
    );

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createServiceClient();
    const body = await request.json();
    const { companyId, planName, billingCycle } = body;

    if (!companyId || !planName || !billingCycle) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Update subscription
    const subscription = await billingService.updateCompanySubscription(
      companyId,
      planName,
      billingCycle
    );

    return NextResponse.json({ subscription });

  } catch (error) {
    console.error('Error updating subscription:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createServiceClient();
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');
    const cancelAtPeriodEnd = searchParams.get('cancelAtPeriodEnd') === 'true';

    if (!companyId) {
      return NextResponse.json(
        { error: 'Company ID is required' },
        { status: 400 }
      );
    }

    // Cancel subscription
    const subscription = await billingService.cancelCompanySubscription(
      companyId,
      cancelAtPeriodEnd
    );

    return NextResponse.json({ subscription });

  } catch (error) {
    console.error('Error canceling subscription:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}