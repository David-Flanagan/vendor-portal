'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Progress,
  Badge,
  Button,
  Alert,
  AlertDescription,
  Separator,
} from '@beach-box/unify-ui';
import {
  Users,
  HardDrive,
  Activity,
  CreditCard,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Zap
} from 'lucide-react';
import { CompanyWithMembership } from '@/types/supabase';
import { supabase } from '@/lib/supabase';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

interface UsageData {
  userCount: number;
  storageUsed: number;
  apiCalls: number;
  features: string[];
}

interface UsageLimitsDisplayProps {
  company: CompanyWithMembership;
}

export function UsageLimitsDisplay({ company }: UsageLimitsDisplayProps) {
  const [usage, setUsage] = useState<UsageData>({
    userCount: 0,
    storageUsed: 0,
    apiCalls: 0,
    features: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsageData();
  }, [company.id]);

  const fetchUsageData = async () => {
    try {
      setLoading(true);

      // Fetch current user count
      const { count: userCount } = await supabase
        .from('company_memberships')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', company.id)
        .eq('status', 'active');

      // For now, we'll use mock data for storage and API calls
      // In a real implementation, you'd track these metrics
      setUsage({
        userCount: userCount || 0,
        storageUsed: company.current_storage_gb || 0,
        apiCalls: Math.floor(Math.random() * 1000), // Mock data
        features: Object.keys(company.features || {}),
      });
    } catch (error) {
      console.error('Error fetching usage data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSubscriptionLimits = () => {
    const tier = company.subscription_tier;
    switch (tier) {
      case 'starter':
        return {
          users: 5,
          storage: 10, // GB
          apiCalls: 10000,
          features: ['Basic Analytics', 'Email Support', 'Standard Templates'],
        };
      case 'professional':
        return {
          users: 25,
          storage: 100, // GB
          apiCalls: 100000,
          features: ['Advanced Analytics', 'Priority Support', 'API Access', 'Custom Templates'],
        };
      case 'enterprise':
        return {
          users: -1, // Unlimited
          storage: 1000, // GB
          apiCalls: 1000000,
          features: ['Custom Analytics', 'Dedicated Support', 'SSO', 'Advanced API', 'White Labeling'],
        };
      default:
        return {
          users: 5,
          storage: 10,
          apiCalls: 10000,
          features: ['Basic Features'],
        };
    }
  };

  const limits = getSubscriptionLimits();

  const getUsagePercentage = (used: number, limit: number) => {
    if (limit === -1) return 0; // Unlimited
    return Math.min((used / limit) * 100, 100);
  };

  const getUsageStatus = (percentage: number) => {
    if (percentage >= 90) return 'critical';
    if (percentage >= 75) return 'warning';
    return 'normal';
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 GB';
    const gb = bytes;
    return `${gb.toFixed(1)} GB`;
  };

  const userUsagePercentage = getUsagePercentage(usage.userCount, limits.users);
  const storageUsagePercentage = getUsagePercentage(usage.storageUsed, limits.storage);
  const apiUsagePercentage = getUsagePercentage(usage.apiCalls, limits.apiCalls);

  const userStatus = getUsageStatus(userUsagePercentage);
  const storageStatus = getUsageStatus(storageUsagePercentage);
  const apiStatus = getUsageStatus(apiUsagePercentage);

  const isTrialExpiringSoon = company.subscription_status === 'trial' &&
    company.trial_ends_at &&
    new Date(company.trial_ends_at).getTime() - Date.now() < 3 * 24 * 60 * 60 * 1000; // 3 days

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Trial Status Alert */}
      {company.subscription_status === 'trial' && (
        <Alert variant={isTrialExpiringSoon ? "destructive" : "default"}>
          <Calendar className="h-4 w-4" />
          <AlertDescription>
            {company.trial_ends_at ? (
              <>
                Your trial {isTrialExpiringSoon ? 'expires' : 'ends'} {' '}
                {formatDistanceToNow(new Date(company.trial_ends_at), { addSuffix: true })}.
                {' '}
                <Link href="/billing" className="font-medium underline">
                  Upgrade to continue using all features
                </Link>
              </>
            ) : (
              'You are currently on a trial subscription.'
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Subscription Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Current Subscription</span>
            <Badge variant="outline" className="capitalize">
              {company.subscription_tier} Plan
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                Status: <span className="font-medium capitalize">{company.subscription_status}</span>
              </p>
              {company.trial_ends_at && company.subscription_status === 'trial' && (
                <p className="text-sm text-gray-600">
                  Trial ends: {new Date(company.trial_ends_at).toLocaleDateString()}
                </p>
              )}
            </div>
            <Link href="/billing">
              <Button variant="outline" size="sm">
                <CreditCard className="mr-2 h-4 w-4" />
                Manage Billing
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Usage Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Team Members */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{usage.userCount}</span>
                <span className="text-sm text-gray-500">
                  {limits.users === -1 ? 'Unlimited' : `of ${limits.users}`}
                </span>
              </div>
              {limits.users !== -1 && (
                <Progress
                  value={userUsagePercentage}
                  className={`h-2 ${userStatus === 'critical' ? 'bg-red-100' : userStatus === 'warning' ? 'bg-yellow-100' : 'bg-green-100'}`}
                />
              )}
              {userStatus === 'critical' && (
                <p className="text-xs text-red-600">
                  ⚠️ User limit reached
                </p>
              )}
              {userStatus === 'warning' && (
                <p className="text-xs text-yellow-600">
                  ⚠️ Approaching user limit
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Storage */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{formatBytes(usage.storageUsed)}</span>
                <span className="text-sm text-gray-500">
                  of {formatBytes(limits.storage)}
                </span>
              </div>
              <Progress
                value={storageUsagePercentage}
                className={`h-2 ${storageStatus === 'critical' ? 'bg-red-100' : storageStatus === 'warning' ? 'bg-yellow-100' : 'bg-green-100'}`}
              />
              {storageStatus === 'critical' && (
                <p className="text-xs text-red-600">
                  ⚠️ Storage limit reached
                </p>
              )}
              {storageStatus === 'warning' && (
                <p className="text-xs text-yellow-600">
                  ⚠️ Approaching storage limit
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* API Calls */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Calls</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{usage.apiCalls.toLocaleString()}</span>
                <span className="text-sm text-gray-500">
                  this month
                </span>
              </div>
              <Progress
                value={apiUsagePercentage}
                className={`h-2 ${apiStatus === 'critical' ? 'bg-red-100' : apiStatus === 'warning' ? 'bg-yellow-100' : 'bg-green-100'}`}
              />
              <p className="text-xs text-gray-500">
                Limit: {limits.apiCalls.toLocaleString()} per month
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="mr-2 h-5 w-5" />
            Available Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {limits.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Want more features?</span>
              <Link href="/billing">
                <Button variant="outline" size="sm">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Upgrade Plan
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}