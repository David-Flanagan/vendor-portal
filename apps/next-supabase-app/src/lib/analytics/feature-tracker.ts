import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { subDays, format } from 'date-fns';

export interface FeatureUsage {
  featureId: string;
  featureName: string;
  category: 'core' | 'billing' | 'team' | 'settings' | 'api' | 'analytics';
  totalUsage: number;
  uniqueUsers: number;
  avgUsagePerUser: number;
  trend: 'up' | 'down' | 'stable';
  lastUsed: Date;
}

export interface FeatureAdoption {
  featureId: string;
  adoptionRate: number; // percentage of users who have used this feature
  firstTimeUsers: number;
  returningUsers: number;
  avgTimeToAdopt: number; // days from account creation
}

export interface FeaturePerformance {
  featureId: string;
  avgLoadTime: number; // milliseconds
  errorRate: number; // percentage
  successRate: number; // percentage
  userSatisfaction: number; // 1-5 scale
}

class FeatureTracker {
  private supabase = createClientComponentClient<Database>();

  // Track feature usage
  async trackFeature(
    featureId: string,
    userId: string,
    companyId: string,
    metadata?: {
      action?: string;
      duration?: number;
      success?: boolean;
      error?: string;
    }
  ) {
    try {
      await this.supabase
        .from('audit_logs')
        .insert({
          user_id: userId,
          company_id: companyId,
          event_type: 'feature.accessed',
          event_category: 'user',
          resource_type: 'feature',
          resource_id: featureId,
          description: `Feature ${featureId} accessed`,
          metadata: {
            ...metadata,
            timestamp: new Date().toISOString()
          }
        });
    } catch (error) {
      console.error('Error tracking feature:', error);
    }
  }

  // Get feature usage stats for a company
  async getFeatureUsageStats(
    companyId: string,
    days: number = 30
  ): Promise<FeatureUsage[]> {
    const startDate = subDays(new Date(), days);

    // Fetch feature access logs
    const { data: logs } = await this.supabase
      .from('audit_logs')
      .select('*')
      .eq('company_id', companyId)
      .eq('event_type', 'feature.accessed')
      .gte('created_at', startDate.toISOString());

    if (!logs || logs.length === 0) {
      return [];
    }

    // Group by feature
    const featureMap = new Map<string, {
      users: Set<string>;
      usage: number;
      lastUsed: Date;
      previousUsage?: number;
    }>();

    logs.forEach(log => {
      const featureId = log.resource_id || 'unknown';
      const existing = featureMap.get(featureId) || {
        users: new Set<string>(),
        usage: 0,
        lastUsed: new Date(log.created_at)
      };

      existing.users.add(log.user_id);
      existing.usage++;
      if (new Date(log.created_at) > existing.lastUsed) {
        existing.lastUsed = new Date(log.created_at);
      }

      featureMap.set(featureId, existing);
    });

    // Get previous period data for trend calculation
    const previousStartDate = subDays(startDate, days);
    const { data: previousLogs } = await this.supabase
      .from('audit_logs')
      .select('resource_id')
      .eq('company_id', companyId)
      .eq('event_type', 'feature.accessed')
      .gte('created_at', previousStartDate.toISOString())
      .lt('created_at', startDate.toISOString());

    // Count previous usage
    const previousUsageMap = new Map<string, number>();
    previousLogs?.forEach(log => {
      const featureId = log.resource_id || 'unknown';
      previousUsageMap.set(featureId, (previousUsageMap.get(featureId) || 0) + 1);
    });

    // Build feature usage array
    const features: FeatureUsage[] = Array.from(featureMap.entries()).map(([featureId, data]) => {
      const previousUsage = previousUsageMap.get(featureId) || 0;
      const trend = this.calculateTrend(data.usage, previousUsage);

      return {
        featureId,
        featureName: this.getFeatureName(featureId),
        category: this.getFeatureCategory(featureId),
        totalUsage: data.usage,
        uniqueUsers: data.users.size,
        avgUsagePerUser: data.usage / data.users.size,
        trend,
        lastUsed: data.lastUsed
      };
    });

    return features.sort((a, b) => b.totalUsage - a.totalUsage);
  }

  // Get feature adoption metrics
  async getFeatureAdoptionMetrics(
    companyId: string
  ): Promise<FeatureAdoption[]> {
    // Get all company members
    const { data: members } = await this.supabase
      .from('company_memberships')
      .select('user_id, created_at')
      .eq('company_id', companyId)
      .eq('status', 'active');

    if (!members || members.length === 0) {
      return [];
    }

    const totalUsers = members.length;

    // Get all feature usage logs
    const { data: logs } = await this.supabase
      .from('audit_logs')
      .select('resource_id, user_id, created_at')
      .eq('company_id', companyId)
      .eq('event_type', 'feature.accessed')
      .order('created_at', { ascending: true });

    if (!logs) {
      return [];
    }

    // Build adoption metrics
    const featureAdoptionMap = new Map<string, {
      users: Set<string>;
      firstTimeUsers: Set<string>;
      returningUsers: Set<string>;
      totalTimeToAdopt: number;
      adoptionCount: number;
    }>();

    // Track first use of each feature by each user
    const userFirstUse = new Map<string, Map<string, Date>>();

    logs.forEach(log => {
      const featureId = log.resource_id || 'unknown';
      const userId = log.user_id;
      const useDate = new Date(log.created_at);

      // Initialize feature data
      if (!featureAdoptionMap.has(featureId)) {
        featureAdoptionMap.set(featureId, {
          users: new Set(),
          firstTimeUsers: new Set(),
          returningUsers: new Set(),
          totalTimeToAdopt: 0,
          adoptionCount: 0
        });
      }

      const featureData = featureAdoptionMap.get(featureId)!;

      // Track user
      if (!featureData.users.has(userId)) {
        featureData.users.add(userId);
        featureData.firstTimeUsers.add(userId);

        // Calculate time to adopt
        const member = members.find(m => m.user_id === userId);
        if (member) {
          const joinDate = new Date(member.created_at);
          const daysToAdopt = Math.floor((useDate.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24));
          featureData.totalTimeToAdopt += daysToAdopt;
          featureData.adoptionCount++;
        }

        // Track first use
        if (!userFirstUse.has(userId)) {
          userFirstUse.set(userId, new Map());
        }
        userFirstUse.get(userId)!.set(featureId, useDate);
      } else {
        // Returning user
        featureData.returningUsers.add(userId);
      }
    });

    // Build adoption metrics array
    const adoptionMetrics: FeatureAdoption[] = Array.from(featureAdoptionMap.entries()).map(([featureId, data]) => {
      return {
        featureId,
        adoptionRate: (data.users.size / totalUsers) * 100,
        firstTimeUsers: data.firstTimeUsers.size,
        returningUsers: data.returningUsers.size,
        avgTimeToAdopt: data.adoptionCount > 0 ? data.totalTimeToAdopt / data.adoptionCount : 0
      };
    });

    return adoptionMetrics.sort((a, b) => b.adoptionRate - a.adoptionRate);
  }

  // Get feature performance metrics
  async getFeaturePerformanceMetrics(
    companyId: string,
    days: number = 7
  ): Promise<FeaturePerformance[]> {
    const startDate = subDays(new Date(), days);

    // Fetch feature logs with performance data
    const { data: logs } = await this.supabase
      .from('audit_logs')
      .select('*')
      .eq('company_id', companyId)
      .eq('event_type', 'feature.accessed')
      .gte('created_at', startDate.toISOString());

    if (!logs || logs.length === 0) {
      return [];
    }

    // Group performance metrics by feature
    const performanceMap = new Map<string, {
      totalDuration: number;
      count: number;
      errors: number;
      successes: number;
      satisfactionSum: number;
      satisfactionCount: number;
    }>();

    logs.forEach(log => {
      const featureId = log.resource_id || 'unknown';
      const metadata = log.metadata || {};

      if (!performanceMap.has(featureId)) {
        performanceMap.set(featureId, {
          totalDuration: 0,
          count: 0,
          errors: 0,
          successes: 0,
          satisfactionSum: 0,
          satisfactionCount: 0
        });
      }

      const perf = performanceMap.get(featureId)!;
      perf.count++;

      if (metadata.duration) {
        perf.totalDuration += metadata.duration;
      }

      if (metadata.success === false || metadata.error) {
        perf.errors++;
      } else {
        perf.successes++;
      }

      if (metadata.satisfaction) {
        perf.satisfactionSum += metadata.satisfaction;
        perf.satisfactionCount++;
      }
    });

    // Build performance metrics array
    const performanceMetrics: FeaturePerformance[] = Array.from(performanceMap.entries()).map(([featureId, data]) => {
      return {
        featureId,
        avgLoadTime: data.count > 0 ? data.totalDuration / data.count : 0,
        errorRate: data.count > 0 ? (data.errors / data.count) * 100 : 0,
        successRate: data.count > 0 ? (data.successes / data.count) * 100 : 100,
        userSatisfaction: data.satisfactionCount > 0 ? data.satisfactionSum / data.satisfactionCount : 4
      };
    });

    return performanceMetrics;
  }

  // Helper methods
  private calculateTrend(current: number, previous: number): 'up' | 'down' | 'stable' {
    if (previous === 0) return current > 0 ? 'up' : 'stable';
    const change = ((current - previous) / previous) * 100;
    if (change > 10) return 'up';
    if (change < -10) return 'down';
    return 'stable';
  }

  private getFeatureName(featureId: string): string {
    const featureNames: Record<string, string> = {
      'dashboard': 'Dashboard',
      'billing': 'Billing & Subscriptions',
      'team': 'Team Management',
      'settings': 'Settings',
      'api': 'API Access',
      'analytics': 'Analytics',
      'invoices': 'Invoices',
      'payments': 'Payments',
      'profile': 'User Profile',
      'notifications': 'Notifications',
      'security': 'Security Settings',
      'integrations': 'Integrations'
    };
    return featureNames[featureId] || featureId;
  }

  private getFeatureCategory(featureId: string): FeatureUsage['category'] {
    const categoryMap: Record<string, FeatureUsage['category']> = {
      'dashboard': 'core',
      'billing': 'billing',
      'team': 'team',
      'settings': 'settings',
      'api': 'api',
      'analytics': 'analytics',
      'invoices': 'billing',
      'payments': 'billing',
      'profile': 'settings',
      'notifications': 'settings',
      'security': 'settings',
      'integrations': 'api'
    };
    return categoryMap[featureId] || 'core';
  }
}

export const featureTracker = new FeatureTracker();