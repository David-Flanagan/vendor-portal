import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { createServiceClient } from './supabase-server';
import {
  createSubscription,
  cancelSubscription,
  updateSubscription,
  getSubscription,
  createStripeCustomer,
  getStripeCustomer,
  PLAN_LIMITS,
  formatStripeAmount,
  getSubscriptionStatus,
  getPlanFromPriceId
} from './stripe';
import { Tables, Database } from '@/types/supabase';
import Stripe from 'stripe';

type Company = Tables<'companies'>;
type Subscription = Tables<'subscriptions'>;

export interface BillingInfo {
  subscription: Subscription | null;
  stripeSubscription: Stripe.Subscription | null;
  upcomingInvoice: Stripe.UpcomingInvoice | null;
  paymentMethods: Stripe.PaymentMethod[];
  invoices: Tables<'invoices'>[];
  usage: UsageInfo;
}

export interface UsageInfo {
  users: { current: number; limit: number };
  storage: { current: number; limit: number };
  apiCalls: { current: number; limit: number };
}

export interface PlanInfo {
  name: string;
  displayName: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  limits: typeof PLAN_LIMITS.starter;
  popular?: boolean;
}

export const PLANS: Record<string, PlanInfo> = {
  starter: {
    name: 'starter',
    displayName: 'Starter',
    monthlyPrice: 2900, // $29.00 in cents
    yearlyPrice: 29000, // $290.00 in cents (save $58)
    features: [
      'Up to 5 team members',
      '10GB storage',
      '1,000 API calls/month',
      'Basic analytics',
      'Email support'
    ],
    limits: PLAN_LIMITS.starter,
    popular: true,
  },
  professional: {
    name: 'professional',
    displayName: 'Professional',
    monthlyPrice: 9900, // $99.00 in cents
    yearlyPrice: 99000, // $990.00 in cents (save $198)
    features: [
      'Up to 25 team members',
      '100GB storage',
      '10,000 API calls/month',
      'Advanced analytics',
      'Priority support',
      'API access',
      'Custom integrations'
    ],
    limits: PLAN_LIMITS.professional,
  },
  enterprise: {
    name: 'enterprise',
    displayName: 'Enterprise',
    monthlyPrice: 29900, // $299.00 in cents
    yearlyPrice: 299000, // $2,990.00 in cents (save $598)
    features: [
      'Unlimited team members',
      '1TB storage',
      '100,000 API calls/month',
      'Custom analytics',
      'Dedicated support',
      'SSO integration',
      'Custom integrations',
      'Advanced security'
    ],
    limits: PLAN_LIMITS.enterprise,
  },
};

class BillingService {
  private supabase = createClientComponentClient<Database>();

  async getCompanyBilling(companyId: string): Promise<BillingInfo> {
    // Get company with subscription info
    const { data: company, error: companyError } = await this.supabase
      .from('companies')
      .select('*')
      .eq('id', companyId)
      .single();

    if (companyError || !company) {
      throw new Error('Company not found');
    }

    // Get subscription from database
    const { data: subscription } = await this.supabase
      .from('subscriptions')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    let stripeSubscription: Stripe.Subscription | null = null;
    if (subscription?.stripe_subscription_id) {
      try {
        stripeSubscription = await getSubscription(subscription.stripe_subscription_id);
      } catch (error) {
        console.error('Error fetching Stripe subscription:', error);
      }
    }

    // Get invoices
    const { data: invoices = [] } = await this.supabase
      .from('invoices')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
      .limit(20);

    // Calculate usage
    const usage = this.calculateUsage(company, subscription);

    return {
      subscription,
      stripeSubscription,
      upcomingInvoice: null, // TODO: Implement upcoming invoice
      paymentMethods: [], // TODO: Implement payment methods
      invoices,
      usage,
    };
  }

  async createCompanySubscription(
    companyId: string,
    planName: string,
    billingCycle: 'monthly' | 'yearly',
    trialDays?: number
  ): Promise<{ subscription: Stripe.Subscription; clientSecret: string }> {
    const supabase = createServiceClient();

    // Get company
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('*')
      .eq('id', companyId)
      .single();

    if (companyError || !company) {
      throw new Error('Company not found');
    }

    // Create or get Stripe customer
    let customerId = company.stripe_customer_id;
    if (!customerId) {
      // Get company owner for customer creation
      const { data: owner } = await supabase
        .from('company_memberships')
        .select('user_profiles(*)')
        .eq('company_id', companyId)
        .eq('role', 'owner')
        .single();

      if (!owner?.user_profiles) {
        throw new Error('Company owner not found');
      }

      const customer = await createStripeCustomer(
        owner.user_profiles.email || '',
        owner.user_profiles.full_name || '',
        company.name
      );

      customerId = customer.id;

      // Update company with customer ID
      await supabase
        .from('companies')
        .update({ stripe_customer_id: customerId })
        .eq('id', companyId);
    }

    // Get price ID based on plan and billing cycle
    const plan = PLANS[planName];
    if (!plan) {
      throw new Error('Invalid plan');
    }

    // Note: In a real implementation, you'd have these price IDs from Stripe
    const priceId = billingCycle === 'monthly'
      ? `price_${planName}_monthly`
      : `price_${planName}_yearly`;

    // Create Stripe subscription
    const stripeSubscription = await createSubscription(
      customerId,
      priceId,
      trialDays,
      {
        company_id: companyId,
        plan: planName,
        billing_cycle: billingCycle,
      }
    );

    // Save subscription to database
    const { error: subscriptionError } = await supabase
      .from('subscriptions')
      .insert({
        company_id: companyId,
        stripe_subscription_id: stripeSubscription.id,
        stripe_customer_id: customerId,
        stripe_price_id: priceId,
        status: stripeSubscription.status as any,
        tier: planName as any,
        billing_cycle: billingCycle,
        amount_cents: billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice,
        current_period_start: new Date(stripeSubscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(stripeSubscription.current_period_end * 1000).toISOString(),
        trial_start: stripeSubscription.trial_start
          ? new Date(stripeSubscription.trial_start * 1000).toISOString()
          : null,
        trial_end: stripeSubscription.trial_end
          ? new Date(stripeSubscription.trial_end * 1000).toISOString()
          : null,
      });

    if (subscriptionError) {
      console.error('Error saving subscription:', subscriptionError);
      // TODO: Handle cleanup of Stripe subscription
      throw new Error('Failed to save subscription');
    }

    // Update company subscription info
    await supabase
      .from('companies')
      .update({
        subscription_status: stripeSubscription.status === 'trialing' ? 'trial' : 'active',
        subscription_tier: planName as any,
        stripe_subscription_id: stripeSubscription.id,
        user_limit: plan.limits.users === -1 ? 999999 : plan.limits.users,
        storage_limit_gb: plan.limits.storage_gb,
      })
      .eq('id', companyId);

    // Get client secret from latest invoice
    const latestInvoice = stripeSubscription.latest_invoice as Stripe.Invoice;
    const clientSecret = latestInvoice.payment_intent
      ? (latestInvoice.payment_intent as Stripe.PaymentIntent).client_secret
      : null;

    return {
      subscription: stripeSubscription,
      clientSecret: clientSecret || '',
    };
  }

  async updateCompanySubscription(
    companyId: string,
    newPlanName: string,
    newBillingCycle: 'monthly' | 'yearly'
  ): Promise<Stripe.Subscription> {
    const supabase = createServiceClient();

    // Get current subscription
    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (subscriptionError || !subscription) {
      throw new Error('Subscription not found');
    }

    const newPlan = PLANS[newPlanName];
    if (!newPlan) {
      throw new Error('Invalid plan');
    }

    // Get new price ID
    const newPriceId = newBillingCycle === 'monthly'
      ? `price_${newPlanName}_monthly`
      : `price_${newPlanName}_yearly`;

    // Update Stripe subscription
    const stripeSubscription = await getSubscription(subscription.stripe_subscription_id);
    const updatedSubscription = await updateSubscription(subscription.stripe_subscription_id, {
      items: [{
        id: stripeSubscription.items.data[0].id,
        price: newPriceId,
      }],
      proration_behavior: 'create_prorations',
    });

    // Update database
    await supabase
      .from('subscriptions')
      .update({
        stripe_price_id: newPriceId,
        tier: newPlanName as any,
        billing_cycle: newBillingCycle,
        amount_cents: newBillingCycle === 'monthly' ? newPlan.monthlyPrice : newPlan.yearlyPrice,
        status: updatedSubscription.status as any,
      })
      .eq('id', subscription.id);

    // Update company
    await supabase
      .from('companies')
      .update({
        subscription_tier: newPlanName as any,
        user_limit: newPlan.limits.users === -1 ? 999999 : newPlan.limits.users,
        storage_limit_gb: newPlan.limits.storage_gb,
      })
      .eq('id', companyId);

    return updatedSubscription;
  }

  async cancelCompanySubscription(
    companyId: string,
    cancelAtPeriodEnd: boolean = true
  ): Promise<Stripe.Subscription> {
    const supabase = createServiceClient();

    // Get current subscription
    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (subscriptionError || !subscription) {
      throw new Error('Subscription not found');
    }

    // Cancel Stripe subscription
    const canceledSubscription = await cancelSubscription(
      subscription.stripe_subscription_id,
      cancelAtPeriodEnd
    );

    // Update database
    await supabase
      .from('subscriptions')
      .update({
        status: canceledSubscription.status as any,
        canceled_at: canceledSubscription.canceled_at
          ? new Date(canceledSubscription.canceled_at * 1000).toISOString()
          : null,
        ended_at: canceledSubscription.ended_at
          ? new Date(canceledSubscription.ended_at * 1000).toISOString()
          : null,
      })
      .eq('id', subscription.id);

    // Update company status if canceled immediately
    if (!cancelAtPeriodEnd) {
      await supabase
        .from('companies')
        .update({
          subscription_status: 'canceled',
        })
        .eq('id', companyId);
    }

    return canceledSubscription;
  }

  private calculateUsage(company: Company, subscription: Subscription | null): UsageInfo {
    const limits = subscription ? PLAN_LIMITS[subscription.tier] : PLAN_LIMITS.starter;

    return {
      users: {
        current: company.current_user_count || 0,
        limit: limits.users === -1 ? Infinity : limits.users,
      },
      storage: {
        current: Number(company.current_storage_gb) || 0,
        limit: limits.storage_gb,
      },
      apiCalls: {
        current: 0, // TODO: Implement API call tracking
        limit: limits.api_calls,
      },
    };
  }

  // Utility methods
  formatPrice(amountCents: number, currency: string = 'usd'): string {
    return formatStripeAmount(amountCents, currency);
  }

  calculateSavings(monthlyPrice: number, yearlyPrice: number): number {
    const monthlyCost = monthlyPrice * 12;
    return monthlyCost - yearlyPrice;
  }

  isUsageLimitExceeded(usage: UsageInfo): boolean {
    return (
      usage.users.current > usage.users.limit ||
      usage.storage.current > usage.storage.limit ||
      usage.apiCalls.current > usage.apiCalls.limit
    );
  }
}

export const billingService = new BillingService();