'use client';

import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@beach-box/unify-ui';
import { Alert, AlertDescription } from '@beach-box/unify-ui';
import { Badge } from '@beach-box/unify-ui';
import { Button } from '@beach-box/unify-ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@beach-box/unify-ui';
import {
  CreditCard,
  AlertTriangle,
  Calendar,
  Users,
  HardDrive,
  Activity,
  Receipt,
  Settings,
  ArrowUpRight,
  Download
} from 'lucide-react';
import { useBilling, useSubscriptionStatus, useUsageInfo, usePlanInfo } from '@/lib/hooks/useBilling';
import { formatDistanceToNow } from 'date-fns';
import { BillingOverview } from '@/components/billing/BillingOverview';
import { SubscriptionManager } from '@/components/billing/SubscriptionManager';
import { InvoiceHistory } from '@/components/billing/InvoiceHistory';
import { PaymentMethods } from '@/components/billing/PaymentMethods';
import { UsageTracker } from '@/components/billing/UsageTracker';

function BillingPageContent() {
  const { data: billingInfo, isLoading, error } = useBilling();
  const subscriptionStatus = useSubscriptionStatus();
  const { usage, isOverLimit, warnings } = useUsageInfo();
  const { formatPrice } = usePlanInfo();

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to load billing information. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Billing & Subscription</h1>
          <p className="text-gray-600 mt-1">
            Manage your subscription, usage, and billing information
          </p>
        </div>
        {subscriptionStatus.subscription && (
          <Badge variant="outline" className="capitalize">
            {subscriptionStatus.subscription.tier} Plan
          </Badge>
        )}
      </div>

      {/* Trial Warning */}
      {subscriptionStatus.isTrialing && subscriptionStatus.trialDaysLeft !== null && (
        <Alert variant={subscriptionStatus.trialDaysLeft <= 3 ? "destructive" : "default"}>
          <Calendar className="h-4 w-4" />
          <AlertDescription>
            Your trial {subscriptionStatus.trialDaysLeft <= 3 ? 'expires' : 'ends'} in{' '}
            <strong>{subscriptionStatus.trialDaysLeft} days</strong>.{' '}
            <Button variant="link" className="p-0 h-auto">
              Upgrade now to continue using all features
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Usage Warnings */}
      {warnings.length > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              <p className="font-medium">Usage Warning:</p>
              {warnings.map((warning, index) => (
                <p key={index} className="text-sm">{warning}</p>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Over Limit Alert */}
      {isOverLimit && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            You've exceeded your plan limits. Please upgrade to continue using all features.
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <BillingOverview />
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          <UsageTracker />
        </TabsContent>

        <TabsContent value="subscription" className="space-y-6">
          <SubscriptionManager />
        </TabsContent>

        <TabsContent value="invoices" className="space-y-6">
          <InvoiceHistory />
        </TabsContent>

        <TabsContent value="payment-methods" className="space-y-6">
          <PaymentMethods />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function BillingPageSkeleton() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-96 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
      </div>

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

      <div className="space-y-6">
        <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div key={j} className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function BillingPage() {
  return (
    <Suspense fallback={<BillingPageSkeleton />}>
      <BillingPageContent />
    </Suspense>
  );
}