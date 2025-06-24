import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { createServiceClient } from '../supabase-server';
import { Tables, Database } from '@/types/supabase';
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns';

export interface DashboardMetrics {
  users: {
    total: number;
    active: number;
    growth: number; // percentage
    newThisMonth: number;
  };
  usage: {
    storage: { used: number; limit: number; unit: 'GB' };
    apiCalls: { used: number; limit: number; resetDate: Date };
    features: Record<string, boolean>;
  };
  billing: {
    currentPlan: string;
    nextBillDate: string | null;
    amount: number;
    trialDaysLeft: number | null;
    mrr: number; // Monthly Recurring Revenue
    currency: string;
  };
  activity: ActivityEvent[];
  performance: {
    uptime: number; // percentage
    responseTime: number; // ms
    errorRate: number; // percentage
  };
}

export interface ActivityEvent {
  id: string;
  type: 'user_joined' | 'user_invited' | 'subscription_updated' | 'payment_received' | 'feature_accessed' | 'settings_changed';
  title: string;
  description: string;
  timestamp: Date;
  userId?: string;
  userEmail?: string;
  metadata?: Record<string, any>;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color?: string;
  }[];
}

export interface UserEngagementData {
  dailyActiveUsers: ChartData;
  loginFrequency: ChartData;
  featureUsage: {
    feature: string;
    usage: number;
    trend: 'up' | 'down' | 'stable';
  }[];
  retentionRate: number;
}

export interface RevenueMetrics {
  mrr: number;
  arr: number; // Annual Recurring Revenue
  growth: number; // percentage
  churn: number; // percentage
  ltv: number; // Lifetime Value
  arpu: number; // Average Revenue Per User
  revenueByPlan: {
    plan: string;
    revenue: number;
    customerCount: number;
  }[];
  monthlyRevenue: ChartData;
}

class DashboardService {
  private supabase = createClientComponentClient<Database>();

  async getDashboardMetrics(companyId: string): Promise<DashboardMetrics> {
    try {
      // Fetch company details with current subscription
      const { data: company } = await this.supabase
        .from('companies')
        .select(`
          *,
          subscriptions!company_id (
            *
          ),
          company_memberships!company_id (
            id,
            status
          )
        `)
        .eq('id', companyId)
        .single();

      if (!company) {
        throw new Error('Company not found');
      }

      // Get user metrics
      const activeUsers = (company.company_memberships || []).filter(m => m.status === 'active').length;
      const totalUsers = (company.company_memberships || []).length;

      // Calculate user growth (compare with last month)
      const lastMonthStart = startOfMonth(subMonths(new Date(), 1));
      const { data: lastMonthUsers } = await this.supabase
        .from('company_memberships')
        .select('id')
        .eq('company_id', companyId)
        .lte('created_at', lastMonthStart.toISOString())
        .eq('status', 'active');

      const lastMonthCount = lastMonthUsers?.length || 0;
      const growth = lastMonthCount > 0 ? ((totalUsers - lastMonthCount) / lastMonthCount) * 100 : 0;

      // Get new users this month
      const thisMonthStart = startOfMonth(new Date());
      const { data: newUsers } = await this.supabase
        .from('company_memberships')
        .select('id')
        .eq('company_id', companyId)
        .gte('created_at', thisMonthStart.toISOString());

      // Get current subscription
      const currentSubscription = company.subscriptions?.[0];
      const trialDaysLeft = this.calculateTrialDaysLeft(currentSubscription);

      // Get recent activity
      const activity = await this.getRecentActivity(companyId);

      // Calculate usage (these would come from actual usage tracking)
      const usage = {
        storage: {
          used: company.current_storage_gb || 0,
          limit: company.storage_limit_gb || 10,
          unit: 'GB' as const
        },
        apiCalls: {
          used: company.current_api_calls || 0,
          limit: company.api_call_limit || 1000,
          resetDate: new Date(company.api_calls_reset_date || new Date())
        },
        features: company.features || {}
      };

      // Performance metrics (mock data - would come from monitoring service)
      const performance = {
        uptime: 99.9,
        responseTime: 142,
        errorRate: 0.1
      };

      return {
        users: {
          total: totalUsers,
          active: activeUsers,
          growth: Math.round(growth * 100) / 100,
          newThisMonth: newUsers?.length || 0
        },
        usage,
        billing: {
          currentPlan: currentSubscription?.tier || 'free',
          nextBillDate: currentSubscription?.current_period_end || null,
          amount: currentSubscription?.amount_cents || 0,
          trialDaysLeft,
          mrr: currentSubscription?.amount_cents || 0,
          currency: 'usd'
        },
        activity,
        performance
      };
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error);
      throw error;
    }
  }

  async getUserEngagementData(companyId: string): Promise<UserEngagementData> {
    // Get audit logs for user activity
    const { data: logs } = await this.supabase
      .from('audit_logs')
      .select('*')
      .eq('company_id', companyId)
      .gte('created_at', subMonths(new Date(), 1).toISOString())
      .order('created_at', { ascending: true });

    // Process daily active users
    const dailyActiveUsers = this.processDailyActiveUsers(logs || []);

    // Process login frequency
    const loginFrequency = this.processLoginFrequency(logs || []);

    // Feature usage data
    const featureUsage = await this.getFeatureUsage(companyId);

    // Calculate retention rate
    const retentionRate = await this.calculateRetentionRate(companyId);

    return {
      dailyActiveUsers,
      loginFrequency,
      featureUsage,
      retentionRate
    };
  }

  async getRevenueMetrics(companyId: string): Promise<RevenueMetrics> {
    const supabase = createServiceClient();

    // Get all subscriptions for revenue calculation
    const { data: subscriptions } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('status', 'active');

    const mrr = subscriptions?.reduce((sum, sub) => sum + (sub.amount_cents || 0), 0) || 0;
    const arr = mrr * 12;

    // Calculate growth (compare with last month)
    const lastMonthMrr = await this.getLastMonthMRR();
    const growth = lastMonthMrr > 0 ? ((mrr - lastMonthMrr) / lastMonthMrr) * 100 : 0;

    // Calculate churn
    const churn = await this.calculateChurnRate();

    // Calculate metrics
    const activeCustomers = subscriptions?.length || 1;
    const arpu = mrr / activeCustomers;
    const ltv = arpu / (churn / 100 || 0.01); // Avoid division by zero

    // Revenue by plan
    const revenueByPlan = this.calculateRevenueByPlan(subscriptions || []);

    // Monthly revenue chart data
    const monthlyRevenue = await this.getMonthlyRevenueData();

    return {
      mrr,
      arr,
      growth: Math.round(growth * 100) / 100,
      churn: Math.round(churn * 100) / 100,
      ltv: Math.round(ltv),
      arpu: Math.round(arpu),
      revenueByPlan,
      monthlyRevenue
    };
  }

  private async getRecentActivity(companyId: string): Promise<ActivityEvent[]> {
    const { data: logs } = await this.supabase
      .from('audit_logs')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false })
      .limit(10);

    return (logs || []).map(log => ({
      id: log.id,
      type: this.mapEventType(log.event_type),
      title: this.getEventTitle(log.event_type),
      description: log.description || '',
      timestamp: new Date(log.created_at),
      userId: log.user_id,
      userEmail: log.metadata?.user_email,
      metadata: log.metadata
    }));
  }

  private mapEventType(eventType: string): ActivityEvent['type'] {
    const mapping: Record<string, ActivityEvent['type']> = {
      'user.created': 'user_joined',
      'user.invited': 'user_invited',
      'subscription.updated': 'subscription_updated',
      'payment.succeeded': 'payment_received',
      'feature.accessed': 'feature_accessed',
      'settings.updated': 'settings_changed'
    };
    return mapping[eventType] || 'feature_accessed';
  }

  private getEventTitle(eventType: string): string {
    const titles: Record<string, string> = {
      'user.created': 'New user joined',
      'user.invited': 'User invited',
      'subscription.updated': 'Subscription updated',
      'payment.succeeded': 'Payment received',
      'feature.accessed': 'Feature accessed',
      'settings.updated': 'Settings changed'
    };
    return titles[eventType] || eventType;
  }

  private calculateTrialDaysLeft(subscription: any): number | null {
    if (!subscription || subscription.status !== 'trialing' || !subscription.trial_end) {
      return null;
    }
    const trialEnd = new Date(subscription.trial_end);
    const now = new Date();
    const daysLeft = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, daysLeft);
  }

  private processDailyActiveUsers(logs: any[]): ChartData {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = subMonths(new Date(), 1);
      date.setDate(date.getDate() + i);
      return format(date, 'MMM d');
    });

    const usersByDay = new Map<string, Set<string>>();

    logs.forEach(log => {
      const date = format(new Date(log.created_at), 'MMM d');
      if (!usersByDay.has(date)) {
        usersByDay.set(date, new Set());
      }
      if (log.user_id) {
        usersByDay.get(date)!.add(log.user_id);
      }
    });

    const data = last30Days.map(date => usersByDay.get(date)?.size || 0);

    return {
      labels: last30Days,
      datasets: [{
        label: 'Daily Active Users',
        data,
        color: '#3B82F6'
      }]
    };
  }

  private processLoginFrequency(logs: any[]): ChartData {
    const hourCounts = new Array(24).fill(0);

    logs
      .filter(log => log.event_type === 'auth.login')
      .forEach(log => {
        const hour = new Date(log.created_at).getHours();
        hourCounts[hour]++;
      });

    return {
      labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
      datasets: [{
        label: 'Login Frequency',
        data: hourCounts,
        color: '#10B981'
      }]
    };
  }

  private async getFeatureUsage(companyId: string): Promise<UserEngagementData['featureUsage']> {
    // Mock data - would come from actual feature tracking
    return [
      { feature: 'Dashboard', usage: 95, trend: 'up' },
      { feature: 'Billing', usage: 78, trend: 'stable' },
      { feature: 'Team Management', usage: 65, trend: 'up' },
      { feature: 'API', usage: 42, trend: 'down' },
      { feature: 'Settings', usage: 38, trend: 'stable' }
    ];
  }

  private async calculateRetentionRate(companyId: string): Promise<number> {
    // Mock calculation - would use actual user cohort analysis
    return 87.5;
  }

  private async getLastMonthMRR(): Promise<number> {
    // Mock data - would query historical subscription data
    return 15000;
  }

  private async calculateChurnRate(): Promise<number> {
    // Mock calculation - would analyze canceled subscriptions
    return 5.2;
  }

  private calculateRevenueByPlan(subscriptions: any[]): RevenueMetrics['revenueByPlan'] {
    const revenueMap = new Map<string, { revenue: number; count: number }>();

    subscriptions.forEach(sub => {
      const plan = sub.tier || 'free';
      const current = revenueMap.get(plan) || { revenue: 0, count: 0 };
      revenueMap.set(plan, {
        revenue: current.revenue + (sub.amount_cents || 0),
        count: current.count + 1
      });
    });

    return Array.from(revenueMap.entries()).map(([plan, data]) => ({
      plan,
      revenue: data.revenue,
      customerCount: data.count
    }));
  }

  private async getMonthlyRevenueData(): Promise<ChartData> {
    const months = Array.from({ length: 12 }, (_, i) => {
      const date = subMonths(new Date(), 11 - i);
      return format(date, 'MMM yyyy');
    });

    // Mock data - would query actual revenue data
    const revenue = [
      12000, 13500, 14200, 14800, 15500, 16200,
      16800, 17500, 18200, 18900, 19600, 20300
    ];

    return {
      labels: months,
      datasets: [{
        label: 'Monthly Revenue',
        data: revenue,
        color: '#8B5CF6'
      }]
    };
  }
}

export const dashboardService = new DashboardService();