'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@beach-box/unify-ui';
import { Badge } from '@beach-box/unify-ui';
import { Button } from '@beach-box/unify-ui';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@beach-box/unify-ui';
import { RadioGroup, RadioGroupItem } from '@beach-box/unify-ui';
import { Label } from '@beach-box/unify-ui';
import { Switch } from '@beach-box/unify-ui';
import { Alert, AlertDescription } from '@beach-box/unify-ui';
import {
  CreditCard,
  Check,
  ArrowUpRight,
  ArrowDownRight,
  X,
  AlertTriangle,
  Star,
  Zap,
  Shield
} from 'lucide-react';
import { useSubscriptionStatus, useSubscriptionActions, usePlanInfo } from '@/lib/hooks/useBilling';
import { PLANS } from '@/lib/billing-service';

export function SubscriptionManager() {
  const subscriptionStatus = useSubscriptionStatus();
  const { createSubscription, updateSubscription, cancelSubscription, isLoading } = useSubscriptionActions();
  const { formatPrice, calculateSavings } = usePlanInfo();

  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [selectedBilling, setSelectedBilling] = useState<'monthly' | 'yearly'>('monthly');
  const [showPlanDialog, setShowPlanDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const currentPlan = subscriptionStatus.subscription?.tier;
  const currentBilling = subscriptionStatus.subscription?.billing_cycle;

  const handlePlanChange = () => {
    if (!selectedPlan || !selectedBilling) return;

    if (subscriptionStatus.subscription) {
      // Update existing subscription
      updateSubscription({
        planName: selectedPlan,
        billingCycle: selectedBilling,
      });
    } else {
      // Create new subscription
      createSubscription({
        planName: selectedPlan,
        billingCycle: selectedBilling,
        trialDays: 14, // Offer 14-day trial for new subscriptions
      });
    }
    setShowPlanDialog(false);
  };

  const handleCancelSubscription = () => {
    cancelSubscription({ cancelAtPeriodEnd: true });
    setShowCancelDialog(false);
  };

  const isPlanUpgrade = (planName: string) => {
    if (!currentPlan) return true;
    const planOrder = ['starter', 'professional', 'enterprise'];
    return planOrder.indexOf(planName) > planOrder.indexOf(currentPlan);
  };

  const isPlanDowngrade = (planName: string) => {
    if (!currentPlan) return false;
    const planOrder = ['starter', 'professional', 'enterprise'];
    return planOrder.indexOf(planName) < planOrder.indexOf(currentPlan);
  };

  const getPlanIcon = (planName: string) => {
    switch (planName) {
      case 'starter': return <Zap className="h-5 w-5" />;
      case 'professional': return <Star className="h-5 w-5" />;
      case 'enterprise': return <Shield className="h-5 w-5" />;
      default: return <CreditCard className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Subscription */}
      {subscriptionStatus.subscription ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center space-x-2">
                {getPlanIcon(subscriptionStatus.subscription.tier)}
                <span>Current Subscription</span>
              </span>
              <Badge variant="outline" className="capitalize">
                {subscriptionStatus.subscription.tier}
              </Badge>
            </CardTitle>
            <CardDescription>
              Your current plan and billing information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Plan Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plan</span>
                    <span className="font-medium capitalize">{subscriptionStatus.subscription.tier}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Billing</span>
                    <span className="font-medium capitalize">{subscriptionStatus.subscription.billing_cycle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount</span>
                    <span className="font-medium">{formatPrice(subscriptionStatus.subscription.amount_cents)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Plan Features</h4>
                <div className="space-y-1">
                  {PLANS[subscriptionStatus.subscription.tier]?.features.slice(0, 3).map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <Check className="h-3 w-3 text-green-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                  {PLANS[subscriptionStatus.subscription.tier]?.features.length > 3 && (
                    <div className="text-sm text-gray-600">
                      +{PLANS[subscriptionStatus.subscription.tier].features.length - 3} more features
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-4 border-t">
              <Dialog open={showPlanDialog} onOpenChange={setShowPlanDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <ArrowUpRight className="h-4 w-4 mr-2" />
                    Change Plan
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Change Your Plan</DialogTitle>
                    <DialogDescription>
                      Choose a new plan that fits your needs. Changes take effect immediately.
                    </DialogDescription>
                  </DialogHeader>
                  <PlanSelector
                    currentPlan={currentPlan}
                    selectedPlan={selectedPlan}
                    selectedBilling={selectedBilling}
                    onPlanChange={setSelectedPlan}
                    onBillingChange={setSelectedBilling}
                    onConfirm={handlePlanChange}
                    isLoading={isLoading}
                  />
                </DialogContent>
              </Dialog>

              {subscriptionStatus.cancelAtPeriodEnd ? (
                <Button
                  variant="outline"
                  onClick={() => cancelSubscription({ cancelAtPeriodEnd: false })}
                  disabled={isLoading}
                >
                  Reactivate Subscription
                </Button>
              ) : (
                <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <X className="h-4 w-4 mr-2" />
                      Cancel Subscription
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Cancel Subscription</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to cancel your subscription? You'll continue to have access until the end of your current billing period.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          Your subscription will remain active until{' '}
                          {subscriptionStatus.nextBillingDate?.toLocaleDateString()}, then you'll lose access to premium features.
                        </AlertDescription>
                      </Alert>
                      <div className="flex justify-end space-x-3">
                        <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
                          Keep Subscription
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={handleCancelSubscription}
                          disabled={isLoading}
                        >
                          Cancel Subscription
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            {subscriptionStatus.cancelAtPeriodEnd && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Your subscription is set to cancel at the end of the current billing period on{' '}
                  {subscriptionStatus.nextBillingDate?.toLocaleDateString()}.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Choose Your Plan</CardTitle>
            <CardDescription>
              Select a plan to get started with premium features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">No Active Subscription</p>
              <p className="text-gray-600 mb-6">
                Choose a plan to unlock all features and start growing your business.
              </p>
              <Dialog open={showPlanDialog} onOpenChange={setShowPlanDialog}>
                <DialogTrigger asChild>
                  <Button size="lg">
                    <ArrowUpRight className="h-4 w-4 mr-2" />
                    Choose a Plan
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>Choose Your Plan</DialogTitle>
                    <DialogDescription>
                      Start with a free 14-day trial. No credit card required.
                    </DialogDescription>
                  </DialogHeader>
                  <PlanSelector
                    selectedPlan={selectedPlan}
                    selectedBilling={selectedBilling}
                    onPlanChange={setSelectedPlan}
                    onBillingChange={setSelectedBilling}
                    onConfirm={handlePlanChange}
                    isLoading={isLoading}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface PlanSelectorProps {
  currentPlan?: string;
  selectedPlan: string;
  selectedBilling: 'monthly' | 'yearly';
  onPlanChange: (plan: string) => void;
  onBillingChange: (billing: 'monthly' | 'yearly') => void;
  onConfirm: () => void;
  isLoading: boolean;
}

function PlanSelector({
  currentPlan,
  selectedPlan,
  selectedBilling,
  onPlanChange,
  onBillingChange,
  onConfirm,
  isLoading
}: PlanSelectorProps) {
  const { formatPrice, calculateSavings } = usePlanInfo();

  const getPlanIcon = (planName: string) => {
    switch (planName) {
      case 'starter': return <Zap className="h-5 w-5" />;
      case 'professional': return <Star className="h-5 w-5" />;
      case 'enterprise': return <Shield className="h-5 w-5" />;
      default: return <CreditCard className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Billing Toggle */}
      <div className="flex items-center justify-center space-x-4">
        <Label htmlFor="billing-monthly" className={selectedBilling === 'monthly' ? 'font-medium' : 'text-gray-600'}>
          Monthly
        </Label>
        <Switch
          checked={selectedBilling === 'yearly'}
          onCheckedChange={(checked) => onBillingChange(checked ? 'yearly' : 'monthly')}
        />
        <Label htmlFor="billing-yearly" className={selectedBilling === 'yearly' ? 'font-medium' : 'text-gray-600'}>
          Yearly
          <Badge variant="secondary" className="ml-2">Save up to 20%</Badge>
        </Label>
      </div>

      {/* Plan Cards */}
      <RadioGroup value={selectedPlan} onValueChange={onPlanChange}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(PLANS).map(([planName, plan]) => {
            const isCurrentPlan = currentPlan === planName;
            const price = selectedBilling === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
            const savings = selectedBilling === 'yearly' ? calculateSavings(plan.monthlyPrice, plan.yearlyPrice) : 0;

            return (
              <div key={planName} className="relative">
                <RadioGroupItem value={planName} id={planName} className="sr-only" />
                <Label
                  htmlFor={planName}
                  className={`block cursor-pointer transition-all ${
                    selectedPlan === planName
                      ? 'ring-2 ring-blue-500'
                      : 'hover:ring-1 hover:ring-gray-300'
                  }`}
                >
                  <Card className={`h-full ${isCurrentPlan ? 'ring-2 ring-blue-200' : ''}`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getPlanIcon(planName)}
                          <CardTitle className="capitalize">{plan.displayName}</CardTitle>
                        </div>
                        {plan.popular && (
                          <Badge className="bg-blue-500">Popular</Badge>
                        )}
                        {isCurrentPlan && (
                          <Badge variant="outline">Current</Badge>
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="text-3xl font-bold">
                          {formatPrice(price)}
                          <span className="text-lg font-normal text-gray-600">
                            /{selectedBilling === 'monthly' ? 'mo' : 'year'}
                          </span>
                        </div>
                        {selectedBilling === 'yearly' && savings > 0 && (
                          <p className="text-sm text-green-600">
                            Save {formatPrice(savings)} per year
                          </p>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {plan.features.map((feature, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm">
                            <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Label>
              </div>
            );
          })}
        </div>
      </RadioGroup>

      {selectedPlan && (
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onPlanChange('')}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={isLoading}>
            {isLoading ? 'Processing...' : (currentPlan ? 'Update Plan' : 'Start Free Trial')}
          </Button>
        </div>
      )}
    </div>
  );
}