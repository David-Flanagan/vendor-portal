'use client';

import React, { Suspense } from 'react';
import {
  DashboardShell,
  OverviewCards,
  MetricsDashboard,
  ActivityWidget,
  AnalyticsCard
} from '@beach-box/unify-ui';
import { useDashboard } from '@/lib/hooks/useDashboard';
import { Alert, AlertDescription, Card, CardContent, CardHeader, CardTitle, Button } from '@beach-box/unify-ui';
import { AlertTriangle, Users, DollarSign, HardDrive, Activity, UserPlus, CreditCard, FileText, Settings } from 'lucide-react';
import { formatMoney } from '@/lib/utils';

function DashboardContent() {
  const { isLoading, error, metrics, engagement, revenue } = useDashboard();

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to load dashboard data. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Transform data for unify-ui components
  const overviewCardsData = metrics ? [
    {
      title: 'Total Users',
      value: metrics.users.total.toString(),
      change: metrics.users.growth,
      trend: metrics.users.growth > 0 ? 'up' : metrics.users.growth < 0 ? 'down' : 'neutral',
      description: `${metrics.users.active} active users`,
      icon: <Users className="h-4 w-4" />
    } as const,
    {
      title: 'Monthly Revenue',
      value: formatMoney(metrics.billing.mrr * 100), // Convert cents to dollars
      change: revenue?.growth || 0,
      trend: (revenue?.growth || 0) > 0 ? 'up' : (revenue?.growth || 0) < 0 ? 'down' : 'neutral',
      description: 'Recurring revenue',
      icon: <DollarSign className="h-4 w-4" />
    } as const,
    {
      title: 'Storage Usage',
      value: `${metrics.usage.storage.used.toFixed(1)} GB`,
      description: `of ${metrics.usage.storage.limit} GB limit`,
      icon: <HardDrive className="h-4 w-4" />
    } as const,
    {
      title: 'System Health',
      value: `${metrics.performance.uptime}%`,
      description: `${metrics.performance.responseTime}ms avg response`,
      icon: <Activity className="h-4 w-4" />
    } as const
  ] : [];

  const activityData = metrics?.activity.map(activity => ({
    id: activity.id,
    type: 'action' as const,
    title: activity.title,
    description: activity.description,
    timestamp: activity.timestamp.toISOString(), // Convert Date to string
    user: {
      name: activity.userEmail || 'System'
    }
  })) || [];

  const dashboardMetrics = [
    {
      id: 'users',
      label: 'Active Users', // Changed from title to label
      value: metrics?.users.active || 0,
      trend: {
        value: metrics?.users.growth || 0,
        direction: (metrics?.users.growth || 0) > 0 ? 'up' as const : (metrics?.users.growth || 0) < 0 ? 'down' as const : 'neutral' as const
      },
      icon: Users
    },
    {
      id: 'revenue',
      label: 'Monthly Revenue', // Changed from title to label
      value: metrics?.billing.mrr || 0,
      unit: '$',
      trend: {
        value: revenue?.growth || 0,
        direction: (revenue?.growth || 0) > 0 ? 'up' as const : (revenue?.growth || 0) < 0 ? 'down' as const : 'neutral' as const
      },
      icon: DollarSign
    },
    {
      id: 'storage',
      label: 'Storage Used', // Changed from title to label
      value: metrics?.usage.storage.used || 0,
      unit: 'GB',
      icon: HardDrive
    },
    {
      id: 'uptime',
      label: 'System Uptime', // Changed from title to label
      value: metrics?.performance.uptime || 0,
      unit: '%',
      icon: Activity
    }
  ];

  return (
    <DashboardShell>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your organization's performance and activity</p>
        </div>

        {/* Overview Cards */}
        <OverviewCards cards={overviewCardsData} columns={4} />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Main Metrics */}
          <div className="lg:col-span-2">
            <MetricsDashboard metrics={dashboardMetrics} loading={isLoading} />
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href="/team?action=invite">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Invite Team Member
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href="/billing?tab=subscription">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Upgrade Plan
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href="/invoices/new">
                  <FileText className="mr-2 h-4 w-4" />
                  Create Invoice
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Account Settings
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Activity Feed */}
          <ActivityWidget
            activities={activityData}
            title="Recent Activity"
            maxItems={10}
          />

          {/* Analytics Card */}
          <AnalyticsCard
            title="User Engagement"
            description="User retention and activity metrics"
            metric={engagement ? {
              value: engagement.retentionRate,
              unit: '%',
              change: engagement.retentionRate > 50 ? 12 : -5,
              trend: engagement.retentionRate > 50 ? 'up' : 'down'
            } : undefined}
          />
        </div>
      </div>
    </DashboardShell>
  );
}

function DashboardSkeleton() {
  return (
    <DashboardShell>
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-96 bg-gray-200 rounded animate-pulse"></div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-80 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}