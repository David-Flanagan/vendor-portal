'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@beach-box/unify-ui';
import { Badge } from '@beach-box/unify-ui';
import { Button } from '@beach-box/unify-ui';
import { Progress } from '@beach-box/unify-ui';
import { Alert, AlertDescription } from '@beach-box/unify-ui';
import {
  CreditCard,
  Calendar,
  Users,
  HardDrive,
  Activity,
  ArrowUpRight,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useBilling, useSubscriptionStatus, useUsageInfo, usePlanInfo } from '@/lib/hooks/useBilling';
import { formatDistanceToNow, format } from 'date-fns';

export function BillingOverview() {
  const { data: billingInfo, isLoading } = useBilling();
  const subscriptionStatus = useSubscriptionStatus();
  const { usage, warnings } = useUsageInfo();
  const { formatPrice } = usePlanInfo();

  if (isLoading) {
    return <BillingOverviewSkeleton />;
  }

  const getStatusIcon = () => {
    if (subscriptionStatus.isTrialing) return <Clock className="h-4 w-4 text-blue-500" />;
    if (subscriptionStatus.isActive) return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (subscriptionStatus.isPastDue) return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    if (subscriptionStatus.isCanceled) return <AlertTriangle className="h-4 w-4 text-red-500" />;
    return <AlertTriangle className="h-4 w-4 text-gray-500" />;
  };

  const getStatusText = () => {
    if (subscriptionStatus.isTrialing && subscriptionStatus.trialDaysLeft !== null) {
      return `Trial (${subscriptionStatus.trialDaysLeft} days left)`;
    }
    if (subscriptionStatus.isActive) return 'Active';
    if (subscriptionStatus.isPastDue) return 'Past Due';
    if (subscriptionStatus.isCanceled) return 'Canceled';
    return 'Inactive';
  };

  const getStatusVariant = (): "default" | "secondary" | "destructive" | "outline" => {
    if (subscriptionStatus.isTrialing) return 'default';
    if (subscriptionStatus.isActive) return 'default';
    if (subscriptionStatus.isPastDue) return 'destructive';
    if (subscriptionStatus.isCanceled) return 'secondary';
    return 'outline';
  };

  return (
    <div className="space-y-6">
      {/* Current Subscription Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Current Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold capitalize">
                {subscriptionStatus.subscription?.tier || 'No Plan'}
              </div>
              <Badge variant={getStatusVariant()} className="flex items-center space-x-1">
                {getStatusIcon()}
                <span>{getStatusText()}</span>
              </Badge>
            </div>
            {subscriptionStatus.subscription && (
              <p className="text-sm text-gray-600 mt-1">
                {formatPrice(subscriptionStatus.subscription.amount_cents)}/{subscriptionStatus.subscription.billing_cycle}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Next Billing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subscriptionStatus.nextBillingDate ? (
                format(subscriptionStatus.nextBillingDate, 'MMM d')
              ) : (
                'N/A'
              )}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {subscriptionStatus.nextBillingDate ? (
                formatDistanceToNow(subscriptionStatus.nextBillingDate, { addSuffix: true })
              ) : (
                'No upcoming billing'
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {usage?.users.current || 0}
              <span className="text-lg font-normal text-gray-600">
                /{usage?.users.limit === Infinity ? '∞' : usage?.users.limit || 0}
              </span>
            </div>
            {usage && (
              <Progress
                value={(usage.users.current / (usage.users.limit === Infinity ? usage.users.current + 1 : usage.users.limit)) * 100}
                className="mt-2"
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Storage Used</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {usage?.storage.current.toFixed(1) || 0}
              <span className="text-lg font-normal text-gray-600">
                /{usage?.storage.limit || 0} GB
              </span>
            </div>
            {usage && (
              <Progress
                value={(usage.storage.current / usage.storage.limit) * 100}
                className="mt-2"
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Subscription Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Subscription Details</span>
            </CardTitle>
            <CardDescription>
              Your current subscription information and billing cycle
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {subscriptionStatus.subscription ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Plan</span>
                  <span className="font-medium capitalize">{subscriptionStatus.subscription.tier}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Billing Cycle</span>
                  <span className="font-medium capitalize">{subscriptionStatus.subscription.billing_cycle}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Amount</span>
                  <span className="font-medium">{formatPrice(subscriptionStatus.subscription.amount_cents)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <Badge variant={getStatusVariant()}>{getStatusText()}</Badge>
                </div>
                {subscriptionStatus.cancelAtPeriodEnd && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Your subscription will be canceled at the end of the current billing period.
                    </AlertDescription>
                  </Alert>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No active subscription</p>
                <Button>
                  <ArrowUpRight className="h-4 w-4 mr-2" />
                  Choose a Plan
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Usage Summary</span>
            </CardTitle>
            <CardDescription>
              Current usage across all plan limits
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {usage ? (
              <>
                {/* Users */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span>Team Members</span>
                    </span>
                    <span className="font-medium">
                      {usage.users.current}/{usage.users.limit === Infinity ? '∞' : usage.users.limit}
                    </span>
                  </div>
                  <Progress
                    value={usage.users.limit === Infinity ? 0 : (usage.users.current / usage.users.limit) * 100}
                    className="h-2"
                  />
                </div>

                {/* Storage */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center space-x-2">
                      <HardDrive className="h-4 w-4 text-gray-500" />
                      <span>Storage</span>
                    </span>
                    <span className="font-medium">
                      {usage.storage.current.toFixed(1)}/{usage.storage.limit} GB
                    </span>
                  </div>
                  <Progress
                    value={(usage.storage.current / usage.storage.limit) * 100}
                    className="h-2"
                  />
                </div>

                {/* API Calls */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center space-x-2">
                      <Activity className="h-4 w-4 text-gray-500" />
                      <span>API Calls</span>
                    </span>
                    <span className="font-medium">
                      {usage.apiCalls.current.toLocaleString()}/{usage.apiCalls.limit.toLocaleString()}
                    </span>
                  </div>
                  <Progress
                    value={(usage.apiCalls.current / usage.apiCalls.limit) * 100}
                    className="h-2"
                  />
                </div>

                {warnings.length > 0 && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-1">
                        <p className="font-medium">Usage Warnings:</p>
                        {warnings.map((warning, index) => (
                          <p key={index} className="text-sm">{warning}</p>
                        ))}
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-gray-600">
                No usage data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Manage your subscription and billing settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline">
              <CreditCard className="h-4 w-4 mr-2" />
              Manage Payment Methods
            </Button>
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              View Billing History
            </Button>
            {subscriptionStatus.subscription && (
              <Button variant="outline">
                <ArrowUpRight className="h-4 w-4 mr-2" />
                Upgrade Plan
              </Button>
            )}
            {!subscriptionStatus.subscription && (
              <Button>
                <ArrowUpRight className="h-4 w-4 mr-2" />
                Choose a Plan
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function BillingOverviewSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-3">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="flex justify-between">
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}