'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@beach-box/unify-ui';
import { Progress } from '@beach-box/unify-ui';
import { Alert, AlertDescription } from '@beach-box/unify-ui';
import { Badge } from '@beach-box/unify-ui';
import { Button } from '@beach-box/unify-ui';
import {
  Users,
  HardDrive,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  BarChart3
} from 'lucide-react';
import { useUsageInfo, usePlanInfo, useSubscriptionStatus } from '@/lib/hooks/useBilling';

export function UsageTracker() {
  const { usage, isOverLimit, warnings, isLoading } = useUsageInfo();
  const { formatPrice } = usePlanInfo();
  const subscriptionStatus = useSubscriptionStatus();

  if (isLoading) {
    return <UsageTrackerSkeleton />;
  }

  const getUsageLevel = (current: number, limit: number) => {
    const percentage = limit === Infinity ? 0 : (current / limit) * 100;
    if (percentage >= 100) return 'critical';
    if (percentage >= 80) return 'warning';
    if (percentage >= 60) return 'moderate';
    return 'good';
  };

  const getUsageColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-600';
      case 'warning': return 'text-orange-600';
      case 'moderate': return 'text-yellow-600';
      case 'good': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getProgressColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-500';
      case 'warning': return 'bg-orange-500';
      case 'moderate': return 'bg-yellow-500';
      case 'good': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getUsageIcon = (level: string) => {
    switch (level) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'moderate': return <TrendingUp className="h-4 w-4 text-yellow-500" />;
      case 'good': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <BarChart3 className="h-4 w-4 text-gray-500" />;
    }
  };

  if (!usage) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No usage data available</p>
        </CardContent>
      </Card>
    );
  }

  const usageMetrics = [
    {
      name: 'Team Members',
      icon: Users,
      current: usage.users.current,
      limit: usage.users.limit,
      unit: 'users',
      level: getUsageLevel(usage.users.current, usage.users.limit),
    },
    {
      name: 'Storage',
      icon: HardDrive,
      current: usage.storage.current,
      limit: usage.storage.limit,
      unit: 'GB',
      level: getUsageLevel(usage.storage.current, usage.storage.limit),
    },
    {
      name: 'API Calls',
      icon: Activity,
      current: usage.apiCalls.current,
      limit: usage.apiCalls.limit,
      unit: 'calls',
      level: getUsageLevel(usage.apiCalls.current, usage.apiCalls.limit),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Overall Usage Status */}
      {isOverLimit && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              <p className="font-medium">You've exceeded your plan limits!</p>
              <p className="text-sm">Please upgrade your plan to continue using all features.</p>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {warnings.length > 0 && !isOverLimit && (
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

      {/* Usage Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {usageMetrics.map((metric) => {
          const percentage = metric.limit === Infinity ? 0 : (metric.current / metric.limit) * 100;
          const Icon = metric.icon;

          return (
            <Card key={metric.name}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center space-x-2 text-sm font-medium">
                    <Icon className="h-4 w-4 text-gray-500" />
                    <span>{metric.name}</span>
                  </span>
                  {getUsageIcon(metric.level)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-bold">
                      {metric.name === 'Storage'
                        ? metric.current.toFixed(1)
                        : metric.current.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-600">
                      of {metric.limit === Infinity ? '∞' : metric.limit.toLocaleString()} {metric.unit}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className={getUsageColor(metric.level)}>
                        {percentage.toFixed(1)}% used
                      </span>
                      <Badge
                        variant={metric.level === 'critical' ? 'destructive' :
                               metric.level === 'warning' ? 'destructive' : 'outline'}
                        className="text-xs"
                      >
                        {metric.level === 'critical' ? 'Over Limit' :
                         metric.level === 'warning' ? 'High Usage' :
                         metric.level === 'moderate' ? 'Moderate' : 'Good'}
                      </Badge>
                    </div>
                    <Progress
                      value={Math.min(percentage, 100)}
                      className="h-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed Usage Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Usage Details</span>
          </CardTitle>
          <CardDescription>
            Detailed breakdown of your current plan usage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {usageMetrics.map((metric) => {
            const percentage = metric.limit === Infinity ? 0 : (metric.current / metric.limit) * 100;
            const Icon = metric.icon;

            return (
              <div key={metric.name} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Icon className="h-5 w-5 text-gray-500" />
                    <div>
                      <h4 className="font-medium">{metric.name}</h4>
                      <p className="text-sm text-gray-600">
                        {metric.current.toLocaleString()} of{' '}
                        {metric.limit === Infinity ? 'unlimited' : metric.limit.toLocaleString()}{' '}
                        {metric.unit}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${getUsageColor(metric.level)}`}>
                      {percentage.toFixed(1)}%
                    </div>
                    <Badge
                      variant={metric.level === 'critical' ? 'destructive' :
                             metric.level === 'warning' ? 'destructive' : 'outline'}
                      className="text-xs"
                    >
                      {metric.level === 'critical' ? 'Over Limit' :
                       metric.level === 'warning' ? 'High' :
                       metric.level === 'moderate' ? 'Moderate' : 'Good'}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <Progress
                    value={Math.min(percentage, 100)}
                    className="h-3"
                  />

                  {metric.level === 'critical' && (
                    <p className="text-sm text-red-600">
                      You've exceeded your {metric.name.toLowerCase()} limit.
                      {metric.name === 'Team Members' && ' Remove team members or upgrade your plan.'}
                      {metric.name === 'Storage' && ' Free up space or upgrade your plan.'}
                      {metric.name === 'API Calls' && ' Reduce API usage or upgrade your plan.'}
                    </p>
                  )}

                  {metric.level === 'warning' && (
                    <p className="text-sm text-orange-600">
                      You're approaching your {metric.name.toLowerCase()} limit.
                      Consider upgrading your plan soon.
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Plan Limits Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Current Plan Limits</CardTitle>
          <CardDescription>
            Your {subscriptionStatus.subscription?.tier || 'current'} plan includes the following limits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <Users className="h-8 w-8 text-gray-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {usage.users.limit === Infinity ? '∞' : usage.users.limit}
              </div>
              <div className="text-sm text-gray-600">Team Members</div>
              <div className="text-xs text-gray-500 mt-1">
                {usage.users.current} currently used
              </div>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <HardDrive className="h-8 w-8 text-gray-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{usage.storage.limit}</div>
              <div className="text-sm text-gray-600">GB Storage</div>
              <div className="text-xs text-gray-500 mt-1">
                {usage.storage.current.toFixed(1)} GB used
              </div>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <Activity className="h-8 w-8 text-gray-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {usage.apiCalls.limit.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">API Calls/Month</div>
              <div className="text-xs text-gray-500 mt-1">
                {usage.apiCalls.current.toLocaleString()} used
              </div>
            </div>
          </div>

          {(isOverLimit || warnings.length > 0) && (
            <div className="mt-6 pt-6 border-t text-center">
              <Button>
                <ArrowUpRight className="h-4 w-4 mr-2" />
                Upgrade Plan
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function UsageTrackerSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-4 bg-gray-200 rounded-full animate-pulse" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-baseline justify-between">
                  <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-5 w-5 bg-gray-200 rounded animate-pulse" />
                    <div className="space-y-1">
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                      <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="h-4 w-12 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
                <div className="h-3 w-full bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}