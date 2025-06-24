import Stripe from 'stripe';
import { Tables } from '@/types/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

// Stripe Products and Prices Configuration
export const STRIPE_PLANS = {
  starter: {
    monthly: process.env.STRIPE_STARTER_MONTHLY_PRICE_ID!,
    yearly: process.env.STRIPE_STARTER_YEARLY_PRICE_ID!,
  },
  professional: {
    monthly: process.env.STRIPE_PROFESSIONAL_MONTHLY_PRICE_ID!,
    yearly: process.env.STRIPE_PROFESSIONAL_YEARLY_PRICE_ID!,
  },
  enterprise: {
    monthly: process.env.STRIPE_ENTERPRISE_MONTHLY_PRICE_ID!,
    yearly: process.env.STRIPE_ENTERPRISE_YEARLY_PRICE_ID!,
  },
} as const;

export const PLAN_LIMITS = {
  starter: {
    users: 5,
    storage_gb: 10,
    api_calls: 1000,
    features: ['basic_analytics', 'email_support'],
  },
  professional: {
    users: 25,
    storage_gb: 100,
    api_calls: 10000,
    features: ['advanced_analytics', 'priority_support', 'api_access'],
  },
  enterprise: {
    users: -1, // unlimited
    storage_gb: 1000,
    api_calls: 100000,
    features: ['custom_analytics', 'dedicated_support', 'sso', 'custom_integrations'],
  },
} as const;

// Customer Management
export async function createStripeCustomer(email: string, name: string, companyName: string) {
  return await stripe.customers.create({
    email,
    name,
    metadata: {
      company_name: companyName,
    },
  });
}

export async function getStripeCustomer(customerId: string) {
  return await stripe.customers.retrieve(customerId);
}

export async function updateStripeCustomer(customerId: string, params: Stripe.CustomerUpdateParams) {
  return await stripe.customers.update(customerId, params);
}

// Subscription Management
export async function createSubscription(
  customerId: string,
  priceId: string,
  trialDays?: number,
  metadata?: Record<string, string>
) {
  const subscriptionParams: Stripe.SubscriptionCreateParams = {
    customer: customerId,
    items: [{ price: priceId }],
    payment_behavior: 'default_incomplete',
    payment_settings: { save_default_payment_method: 'on_subscription' },
    expand: ['latest_invoice.payment_intent'],
    metadata: metadata || {},
  };

  if (trialDays && trialDays > 0) {
    subscriptionParams.trial_period_days = trialDays;
  }

  return await stripe.subscriptions.create(subscriptionParams);
}

export async function updateSubscription(
  subscriptionId: string,
  params: Stripe.SubscriptionUpdateParams
) {
  return await stripe.subscriptions.update(subscriptionId, params);
}

export async function cancelSubscription(
  subscriptionId: string,
  cancelAtPeriodEnd: boolean = true
) {
  if (cancelAtPeriodEnd) {
    return await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });
  }
  return await stripe.subscriptions.cancel(subscriptionId);
}

export async function reactivateSubscription(subscriptionId: string) {
  return await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
  });
}

export async function getSubscription(subscriptionId: string) {
  return await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ['latest_invoice', 'customer', 'items.data.price'],
  });
}

// Billing Portal
export async function createBillingPortalSession(customerId: string, returnUrl: string) {
  return await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
}

// Invoice Management
export async function createInvoice(
  customerId: string,
  items: Array<{
    price?: string;
    quantity?: number;
    description?: string;
    amount?: number;
  }>,
  metadata?: Record<string, string>
) {
  const invoice = await stripe.invoices.create({
    customer: customerId,
    metadata: metadata || {},
    auto_advance: false,
  });

  // Add invoice items
  for (const item of items) {
    await stripe.invoiceItems.create({
      customer: customerId,
      invoice: invoice.id,
      price: item.price,
      quantity: item.quantity || 1,
      description: item.description,
      amount: item.amount,
    });
  }

  return await stripe.invoices.finalize(invoice.id);
}

export async function getInvoice(invoiceId: string) {
  return await stripe.invoices.retrieve(invoiceId, {
    expand: ['payment_intent'],
  });
}

export async function getInvoices(customerId: string, limit: number = 10) {
  return await stripe.invoices.list({
    customer: customerId,
    limit,
    expand: ['data.payment_intent'],
  });
}

// Payment Intent Management
export async function createPaymentIntent(invoice: Tables<'invoices'>) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: invoice.total_cents,
      currency: invoice.currency.toLowerCase(),
      automatic_payment_methods: { enabled: true },
      metadata: {
        invoice_id: invoice.id,
        company_id: invoice.company_id,
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

// Payment Methods
export async function getPaymentMethods(customerId: string) {
  return await stripe.paymentMethods.list({
    customer: customerId,
    type: 'card',
  });
}

export async function createSetupIntent(customerId: string) {
  return await stripe.setupIntents.create({
    customer: customerId,
    payment_method_types: ['card'],
    usage: 'off_session',
  });
}

export async function detachPaymentMethod(paymentMethodId: string) {
  return await stripe.paymentMethods.detach(paymentMethodId);
}

// Webhook Verification
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

// Usage Tracking
export async function reportUsage(subscriptionItemId: string, quantity: number, timestamp?: number) {
  return await stripe.subscriptionItems.createUsageRecord(subscriptionItemId, {
    quantity,
    timestamp: timestamp || Math.floor(Date.now() / 1000),
  });
}

// Proration and Plan Changes
export async function previewSubscriptionChange(
  subscriptionId: string,
  newPriceId: string,
  prorationDate?: number
) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  return await stripe.invoices.createPreview({
    customer: subscription.customer as string,
    subscription: subscriptionId,
    subscription_items: [
      {
        id: subscription.items.data[0].id,
        price: newPriceId,
      },
    ],
    proration_date: prorationDate || Math.floor(Date.now() / 1000),
  });
}

// Utility Functions
export function formatStripeAmount(amount: number, currency: string = 'usd') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}

export function getSubscriptionStatus(subscription: Stripe.Subscription) {
  const status = subscription.status;
  const trialEnd = subscription.trial_end;
  const currentPeriodEnd = subscription.current_period_end;

  if (status === 'trialing' && trialEnd) {
    const daysLeft = Math.ceil((trialEnd * 1000 - Date.now()) / (1000 * 60 * 60 * 24));
    return {
      status: 'trial',
      daysLeft,
      isTrialExpiringSoon: daysLeft <= 3,
    };
  }

  return {
    status,
    nextBillingDate: new Date(currentPeriodEnd * 1000),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
  };
}

export function getPlanFromPriceId(priceId: string) {
  for (const [planName, prices] of Object.entries(STRIPE_PLANS)) {
    if (prices.monthly === priceId || prices.yearly === priceId) {
      return {
        name: planName,
        isYearly: prices.yearly === priceId,
        limits: PLAN_LIMITS[planName as keyof typeof PLAN_LIMITS],
      };
    }
  }
  return null;
}

export default stripe;