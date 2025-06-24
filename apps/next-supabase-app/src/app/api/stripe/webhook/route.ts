import { NextRequest, NextResponse } from 'next/server';
import { verifyStripeWebhookSignature } from '@/lib/stripe';
import { createServiceClient } from '@/lib/supabase-server';
import Stripe from 'stripe';

export const config = {
  runtime: 'edge',
  regions: ['iad1'], // Specify regions close to your Supabase instance
};

export async function POST(request: NextRequest) {
  const supabase = createServiceClient();

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

    console.log(`Processing Stripe webhook: ${event.type}`);

    // Handle different event types
    switch (event.type) {
      // Subscription Events
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.trial_will_end':
        await handleTrialWillEnd(event.data.object as Stripe.Subscription);
        break;

      // Invoice Events
      case 'invoice.created':
        await handleInvoiceCreated(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.finalized':
        await handleInvoiceFinalized(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      // Payment Events
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.requires_action':
        await handlePaymentIntentRequiresAction(event.data.object as Stripe.PaymentIntent);
        break;

      // Customer Events
      case 'customer.created':
        await handleCustomerCreated(event.data.object as Stripe.Customer);
        break;

      case 'customer.updated':
        await handleCustomerUpdated(event.data.object as Stripe.Customer);
        break;

      case 'customer.deleted':
        await handleCustomerDeleted(event.data.object as Stripe.Customer);
        break;

      // Payment Method Events
      case 'payment_method.attached':
        await handlePaymentMethodAttached(event.data.object as Stripe.PaymentMethod);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }

  // Webhook handler functions
  async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
    const companyId = subscription.metadata.company_id;
    if (!companyId) {
      console.error('No company_id in subscription metadata');
      return;
    }

    // Insert subscription record
    const { error } = await supabase
      .from('subscriptions')
      .insert({
        company_id: companyId,
        stripe_subscription_id: subscription.id,
        stripe_customer_id: subscription.customer as string,
        stripe_price_id: subscription.items.data[0].price.id,
        status: subscription.status as any,
        tier: subscription.metadata.plan as any || 'starter',
        billing_cycle: subscription.metadata.billing_cycle as any || 'monthly',
        amount_cents: subscription.items.data[0].price.unit_amount || 0,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        trial_start: subscription.trial_start
          ? new Date(subscription.trial_start * 1000).toISOString()
          : null,
        trial_end: subscription.trial_end
          ? new Date(subscription.trial_end * 1000).toISOString()
          : null,
      });

    if (error) {
      console.error('Error inserting subscription:', error);
    }

    // Update company status
    await supabase
      .from('companies')
      .update({
        subscription_status: subscription.status === 'trialing' ? 'trial' : 'active',
        stripe_subscription_id: subscription.id,
      })
      .eq('id', companyId);

    // Log audit event
    await logAuditEvent(companyId, 'subscription_created', 'Subscription created', {
      subscription_id: subscription.id,
      status: subscription.status,
    });
  }

  async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    const companyId = subscription.metadata.company_id;
    if (!companyId) {
      console.error('No company_id in subscription metadata');
      return;
    }

    // Update subscription record
    const { error } = await supabase
      .from('subscriptions')
      .update({
        status: subscription.status as any,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        canceled_at: subscription.canceled_at
          ? new Date(subscription.canceled_at * 1000).toISOString()
          : null,
        ended_at: subscription.ended_at
          ? new Date(subscription.ended_at * 1000).toISOString()
          : null,
      })
      .eq('stripe_subscription_id', subscription.id);

    if (error) {
      console.error('Error updating subscription:', error);
    }

    // Update company status
    let companyStatus = 'active';
    if (subscription.status === 'trialing') companyStatus = 'trial';
    else if (subscription.status === 'past_due') companyStatus = 'past_due';
    else if (subscription.status === 'canceled') companyStatus = 'canceled';
    else if (subscription.status === 'incomplete') companyStatus = 'incomplete';

    await supabase
      .from('companies')
      .update({
        subscription_status: companyStatus as any,
      })
      .eq('id', companyId);

    // Log audit event
    await logAuditEvent(companyId, 'subscription_updated', 'Subscription updated', {
      subscription_id: subscription.id,
      status: subscription.status,
      canceled_at: subscription.canceled_at,
    });
  }

  async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    const companyId = subscription.metadata.company_id;
    if (!companyId) {
      console.error('No company_id in subscription metadata');
      return;
    }

    // Update subscription record
    await supabase
      .from('subscriptions')
      .update({
        status: 'canceled',
        ended_at: new Date().toISOString(),
      })
      .eq('stripe_subscription_id', subscription.id);

    // Update company status
    await supabase
      .from('companies')
      .update({
        subscription_status: 'canceled',
      })
      .eq('id', companyId);

    // Log audit event
    await logAuditEvent(companyId, 'subscription_canceled', 'Subscription canceled', {
      subscription_id: subscription.id,
    });
  }

  async function handleTrialWillEnd(subscription: Stripe.Subscription) {
    const companyId = subscription.metadata.company_id;
    if (!companyId) {
      console.error('No company_id in subscription metadata');
      return;
    }

    // TODO: Send trial ending notification email
    console.log(`Trial will end for company ${companyId} on ${subscription.trial_end}`);

    // Log audit event
    await logAuditEvent(companyId, 'trial_will_end', 'Trial will end soon', {
      subscription_id: subscription.id,
      trial_end: subscription.trial_end,
    });
  }

  async function handleInvoiceCreated(invoice: Stripe.Invoice) {
    const companyId = invoice.metadata?.company_id || invoice.subscription_details?.metadata?.company_id;
    if (!companyId) {
      console.error('No company_id in invoice metadata');
      return;
    }

    // Insert invoice record
    const { error } = await supabase
      .from('invoices')
      .insert({
        company_id: companyId,
        subscription_id: invoice.subscription ?
          (await getSubscriptionId(invoice.subscription as string)) : null,
        stripe_invoice_id: invoice.id,
        number: invoice.number,
        status: invoice.status as any,
        subtotal_cents: invoice.subtotal,
        tax_cents: invoice.tax || 0,
        total_cents: invoice.total,
        amount_due_cents: invoice.amount_due,
        amount_paid_cents: invoice.amount_paid,
        currency: invoice.currency.toUpperCase(),
        invoice_date: new Date(invoice.created * 1000).toISOString(),
        due_date: invoice.due_date ? new Date(invoice.due_date * 1000).toISOString() : null,
        metadata: invoice.metadata || {},
      });

    if (error) {
      console.error('Error inserting invoice:', error);
    }
  }

  async function handleInvoiceFinalized(invoice: Stripe.Invoice) {
    // Update invoice status
    await supabase
      .from('invoices')
      .update({
        status: 'open',
        number: invoice.number,
      })
      .eq('stripe_invoice_id', invoice.id);
  }

  async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
    // Update invoice status
    await supabase
      .from('invoices')
      .update({
        status: 'paid',
        amount_paid_cents: invoice.amount_paid,
        paid_at: new Date().toISOString(),
      })
      .eq('stripe_invoice_id', invoice.id);

    // Log audit event
    const companyId = invoice.metadata?.company_id;
    if (companyId) {
      await logAuditEvent(companyId, 'invoice_paid', 'Invoice payment succeeded', {
        invoice_id: invoice.id,
        amount: invoice.amount_paid,
      });
    }
  }

  async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
    // Keep invoice as open/past_due
    await supabase
      .from('invoices')
      .update({
        status: 'open',
      })
      .eq('stripe_invoice_id', invoice.id);

    // TODO: Send payment failed notification
    const companyId = invoice.metadata?.company_id;
    if (companyId) {
      await logAuditEvent(companyId, 'invoice_payment_failed', 'Invoice payment failed', {
        invoice_id: invoice.id,
        amount: invoice.amount_due,
      });
    }
  }

  async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
    const invoiceId = paymentIntent.metadata.invoice_id;
    const companyId = paymentIntent.metadata.company_id;

    if (!invoiceId || !companyId) {
      console.error('Missing invoice_id or company_id in payment intent metadata');
      return;
    }

    // Create payment record
    const { error } = await supabase
      .from('payments')
      .insert({
        company_id: companyId,
        invoice_id: invoiceId,
        stripe_payment_intent_id: paymentIntent.id,
        stripe_charge_id: paymentIntent.latest_charge as string,
        amount_cents: paymentIntent.amount,
        currency: paymentIntent.currency.toUpperCase(),
        status: 'succeeded',
        payment_method_type: paymentIntent.payment_method_types[0],
        metadata: paymentIntent.metadata || {},
      });

    if (error) {
      console.error('Error creating payment record:', error);
    }
  }

  async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
    const invoiceId = paymentIntent.metadata.invoice_id;
    const companyId = paymentIntent.metadata.company_id;

    if (!invoiceId || !companyId) {
      console.error('Missing invoice_id or company_id in payment intent metadata');
      return;
    }

    // Create failed payment record
    const { error } = await supabase
      .from('payments')
      .insert({
        company_id: companyId,
        invoice_id: invoiceId,
        stripe_payment_intent_id: paymentIntent.id,
        amount_cents: paymentIntent.amount,
        currency: paymentIntent.currency.toUpperCase(),
        status: 'failed',
        payment_method_type: paymentIntent.payment_method_types[0],
        failure_reason: paymentIntent.last_payment_error?.message || 'Payment failed',
        failure_code: paymentIntent.last_payment_error?.code || 'unknown',
        metadata: paymentIntent.metadata || {},
      });

    if (error) {
      console.error('Error creating failed payment record:', error);
    }
  }

  async function handlePaymentIntentRequiresAction(paymentIntent: Stripe.PaymentIntent) {
    // TODO: Send notification that payment requires action
    console.log(`Payment requires action: ${paymentIntent.id}`);
  }

  async function handleCustomerCreated(customer: Stripe.Customer) {
    // Customer is typically created when subscription is created
    // This event is mainly for logging
    console.log(`Customer created: ${customer.id}`);
  }

  async function handleCustomerUpdated(customer: Stripe.Customer) {
    // Update company with customer details if needed
    const { error } = await supabase
      .from('companies')
      .update({
        // Update any relevant customer fields
        settings: {
          stripe_customer_email: customer.email,
          stripe_customer_name: customer.name,
        }
      })
      .eq('stripe_customer_id', customer.id);

    if (error) {
      console.error('Error updating company customer info:', error);
    }
  }

  async function handleCustomerDeleted(customer: Stripe.Customer) {
    // Clean up customer reference
    await supabase
      .from('companies')
      .update({
        stripe_customer_id: null,
      })
      .eq('stripe_customer_id', customer.id);
  }

  async function handlePaymentMethodAttached(paymentMethod: Stripe.PaymentMethod) {
    // Payment methods are typically handled in the frontend
    // This is mainly for logging
    console.log(`Payment method attached: ${paymentMethod.id}`);
  }

  // Utility functions
  async function getSubscriptionId(stripeSubscriptionId: string): Promise<string | null> {
    const { data } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('stripe_subscription_id', stripeSubscriptionId)
      .single();

    return data?.id || null;
  }

  async function logAuditEvent(
    companyId: string,
    eventType: string,
    description: string,
    metadata: Record<string, any> = {}
  ) {
    await supabase
      .from('audit_logs')
      .insert({
        company_id: companyId,
        event_type: eventType,
        event_category: 'billing',
        event_description: description,
        metadata,
        ip_address: request.headers.get('x-forwarded-for') || null,
        user_agent: request.headers.get('user-agent') || null,
      });
  }
}