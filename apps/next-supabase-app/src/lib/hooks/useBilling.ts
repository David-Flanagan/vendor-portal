import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { billingService, BillingInfo, PLANS } from '../billing-service';
import { useOrganization } from './useOrganization';
import { toast } from 'react-hot-toast';

export function useBilling() {
  const { currentOrganization } = useOrganization();

  return useQuery({
    queryKey: ['billing', currentOrganization?.id],
    queryFn: () => billingService.getCompanyBilling(currentOrganization!.id),
    enabled: !!currentOrganization?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useCreateSubscription() {
  const queryClient = useQueryClient();
  const { currentOrganization } = useOrganization();

  return useMutation({
    mutationFn: async ({
      planName,
      billingCycle,
      trialDays,
    }: {
      planName: string;
      billingCycle: 'monthly' | 'yearly';
      trialDays?: number;
    }) => {
      if (!currentOrganization) throw new Error('No organization selected');

      return billingService.createCompanySubscription(
        currentOrganization.id,
        planName,
        billingCycle,
        trialDays
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing'] });
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      toast.success('Subscription created successfully!');
    },
    onError: (error) => {
      console.error('Error creating subscription:', error);
      toast.error('Failed to create subscription. Please try again.');
    },
  });
}

export function useUpdateSubscription() {
  const queryClient = useQueryClient();
  const { currentOrganization } = useOrganization();

  return useMutation({
    mutationFn: async ({
      planName,
      billingCycle,
    }: {
      planName: string;
      billingCycle: 'monthly' | 'yearly';
    }) => {
      if (!currentOrganization) throw new Error('No organization selected');

      return billingService.updateCompanySubscription(
        currentOrganization.id,
        planName,
        billingCycle
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billing'] });
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      toast.success('Subscription updated successfully!');
    },
    onError: (error) => {
      console.error('Error updating subscription:', error);
      toast.error('Failed to update subscription. Please try again.');
    },
  });
}

export function useCancelSubscription() {
  const queryClient = useQueryClient();
  const { currentOrganization } = useOrganization();

  return useMutation({
    mutationFn: async ({ cancelAtPeriodEnd = true }: { cancelAtPeriodEnd?: boolean } = {}) => {
      if (!currentOrganization) throw new Error('No organization selected');

      return billingService.cancelCompanySubscription(
        currentOrganization.id,
        cancelAtPeriodEnd
      );
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['billing'] });
      queryClient.invalidateQueries({ queryKey: ['organizations'] });

      const message = variables.cancelAtPeriodEnd
        ? 'Subscription will be canceled at the end of the billing period.'
        : 'Subscription canceled immediately.';

      toast.success(message);
    },
    onError: (error) => {
      console.error('Error canceling subscription:', error);
      toast.error('Failed to cancel subscription. Please try again.');
    },
  });
}

export function useSubscriptionStatus() {
  const { data: billingInfo, isLoading } = useBilling();

  if (isLoading || !billingInfo) {
    return {
      status: 'loading' as const,
      subscription: null,
      isTrialing: false,
      isActive: false,
      isCanceled: false,
      isPastDue: false,
      trialDaysLeft: null,
      nextBillingDate: null,
    };
  }

  const { subscription, stripeSubscription } = billingInfo;
  const status = subscription?.status || 'inactive';

  const isTrialing = status === 'trialing';
  const isActive = status === 'active';
  const isCanceled = status === 'canceled';
  const isPastDue = status === 'past_due';

  let trialDaysLeft: number | null = null;
  if (isTrialing && subscription?.trial_end) {
    const trialEnd = new Date(subscription.trial_end);
    const now = new Date();
    trialDaysLeft = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  }

  let nextBillingDate: Date | null = null;
  if (subscription?.current_period_end) {
    nextBillingDate = new Date(subscription.current_period_end);
  }

  return {
    status,
    subscription,
    stripeSubscription,
    isTrialing,
    isActive,
    isCanceled,
    isPastDue,
    trialDaysLeft,
    nextBillingDate,
    cancelAtPeriodEnd: stripeSubscription?.cancel_at_period_end || false,
  };
}

export function useUsageInfo() {
  const { data: billingInfo, isLoading } = useBilling();

  if (isLoading || !billingInfo) {
    return {
      isLoading: true,
      usage: null,
      isOverLimit: false,
      warnings: [],
    };
  }

  const { usage } = billingInfo;
  const warnings: string[] = [];

  // Check for usage warnings (80% of limit)
  if (usage.users.current / usage.users.limit > 0.8) {
    warnings.push(`You're using ${usage.users.current} of ${usage.users.limit} users`);
  }

  if (usage.storage.current / usage.storage.limit > 0.8) {
    warnings.push(`You're using ${usage.storage.current}GB of ${usage.storage.limit}GB storage`);
  }

  if (usage.apiCalls.current / usage.apiCalls.limit > 0.8) {
    warnings.push(`You're using ${usage.apiCalls.current} of ${usage.apiCalls.limit} API calls`);
  }

  const isOverLimit = billingService.isUsageLimitExceeded(usage);

  return {
    isLoading: false,
    usage,
    isOverLimit,
    warnings,
  };
}

export function usePlanInfo() {
  return {
    plans: PLANS,
    formatPrice: billingService.formatPrice.bind(billingService),
    calculateSavings: billingService.calculateSavings.bind(billingService),
  };
}

export function useSubscriptionActions() {
  const createSubscription = useCreateSubscription();
  const updateSubscription = useUpdateSubscription();
  const cancelSubscription = useCancelSubscription();

  return {
    createSubscription: createSubscription.mutate,
    updateSubscription: updateSubscription.mutate,
    cancelSubscription: cancelSubscription.mutate,
    isCreating: createSubscription.isPending,
    isUpdating: updateSubscription.isPending,
    isCanceling: cancelSubscription.isPending,
    isLoading: createSubscription.isPending || updateSubscription.isPending || cancelSubscription.isPending,
  };
}