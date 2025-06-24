import { createServiceClient } from '../supabase-server';
import { Tables } from '@/types/supabase';
import { startOfMonth, endOfMonth, subMonths } from 'date-fns';

export interface RevenueMetrics {
  mrr: number; // Monthly Recurring Revenue
  arr: number; // Annual Recurring Revenue
  growth: number; // MRR growth percentage
  churn: number; // Customer churn rate percentage
  netRevenue: number; // Net revenue (after churn)
  ltv: number; // Customer Lifetime Value
  arpu: number; // Average Revenue Per User
  cac: number; // Customer Acquisition Cost (mock)
}

export interface RevenueBreakdown {
  byPlan: {
    plan: string;
    revenue: number;
    customerCount: number;
    percentage: number;
  }[];
  byBillingCycle: {
    cycle: 'monthly' | 'yearly';
    revenue: number;
    customerCount: number;
  }[];
  byStatus: {
    status: string;
    revenue: number;
    customerCount: number;
  }[];
}

export interface ChurnAnalysis {
  totalChurned: number;
  churnRate: number;
  churnedRevenue: number;
  reasonsBreakdown: {
    reason: string;
    count: number;
    revenue: number;
  }[];
  monthlyChurn: {
    month: string;
    count: number;
    revenue: number;
    rate: number;
  }[];
}

export interface GrowthMetrics {
  newCustomers: number;
  upgrades: number;
  downgrades: number;
  reactivations: number;
  expansionRevenue: number;
  contractionRevenue: number;
  netNewRevenue: number;
}

class RevenueCalculator {
  private supabase = createServiceClient();

  // Calculate current revenue metrics
  async calculateRevenueMetrics(): Promise<RevenueMetrics> {
    // Get all active subscriptions
    const { data: subscriptions } = await this.supabase
      .from('subscriptions')
      .select('*')
      .eq('status', 'active');

    if (!subscriptions || subscriptions.length === 0) {
      return this.getEmptyMetrics();
    }

    // Calculate MRR
    const mrr = subscriptions.reduce((sum, sub) => {
      const monthlyAmount = sub.billing_cycle === 'yearly'
        ? (sub.amount_cents || 0) / 12
        : (sub.amount_cents || 0);
      return sum + monthlyAmount;
    }, 0);

    // Calculate ARR
    const arr = mrr * 12;

    // Calculate growth (compare with last month)
    const lastMonthMrr = await this.getLastMonthMRR();
    const growth = lastMonthMrr > 0 ? ((mrr - lastMonthMrr) / lastMonthMrr) * 100 : 0;

    // Calculate churn
    const churnData = await this.calculateChurnRate();

    // Calculate metrics
    const activeCustomers = subscriptions.length;
    const arpu = activeCustomers > 0 ? mrr / activeCustomers : 0;
    const monthlyChurnRate = churnData.churnRate;
    const ltv = monthlyChurnRate > 0 ? arpu / (monthlyChurnRate / 100) : arpu * 24; // Default 24 months if no churn

    // Mock CAC (would come from marketing/sales data)
    const cac = 500 * 100; // $500 in cents

    return {
      mrr: Math.round(mrr),
      arr: Math.round(arr),
      growth: Math.round(growth * 100) / 100,
      churn: Math.round(monthlyChurnRate * 100) / 100,
      netRevenue: Math.round(mrr * (1 - monthlyChurnRate / 100)),
      ltv: Math.round(ltv),
      arpu: Math.round(arpu),
      cac
    };
  }

  // Get revenue breakdown
  async getRevenueBreakdown(): Promise<RevenueBreakdown> {
    const { data: subscriptions } = await this.supabase
      .from('subscriptions')
      .select('*')
      .eq('status', 'active');

    if (!subscriptions || subscriptions.length === 0) {
      return {
        byPlan: [],
        byBillingCycle: [],
        byStatus: []
      };
    }

    // Calculate total MRR for percentage calculations
    const totalMrr = subscriptions.reduce((sum, sub) => {
      const monthlyAmount = sub.billing_cycle === 'yearly'
        ? (sub.amount_cents || 0) / 12
        : (sub.amount_cents || 0);
      return sum + monthlyAmount;
    }, 0);

    // By Plan
    const planMap = new Map<string, { revenue: number; count: number }>();
    subscriptions.forEach(sub => {
      const plan = sub.tier || 'unknown';
      const monthlyAmount = sub.billing_cycle === 'yearly'
        ? (sub.amount_cents || 0) / 12
        : (sub.amount_cents || 0);

      const current = planMap.get(plan) || { revenue: 0, count: 0 };
      planMap.set(plan, {
        revenue: current.revenue + monthlyAmount,
        count: current.count + 1
      });
    });

    const byPlan = Array.from(planMap.entries()).map(([plan, data]) => ({
      plan,
      revenue: Math.round(data.revenue),
      customerCount: data.count,
      percentage: totalMrr > 0 ? Math.round((data.revenue / totalMrr) * 10000) / 100 : 0
    })).sort((a, b) => b.revenue - a.revenue);

    // By Billing Cycle
    const cycleMap = new Map<'monthly' | 'yearly', { revenue: number; count: number }>();
    subscriptions.forEach(sub => {
      const cycle = sub.billing_cycle || 'monthly';
      const monthlyAmount = cycle === 'yearly'
        ? (sub.amount_cents || 0) / 12
        : (sub.amount_cents || 0);

      const current = cycleMap.get(cycle) || { revenue: 0, count: 0 };
      cycleMap.set(cycle, {
        revenue: current.revenue + monthlyAmount,
        count: current.count + 1
      });
    });

    const byBillingCycle = Array.from(cycleMap.entries()).map(([cycle, data]) => ({
      cycle,
      revenue: Math.round(data.revenue),
      customerCount: data.count
    }));

    // By Status (including all statuses)
    const { data: allSubscriptions } = await this.supabase
      .from('subscriptions')
      .select('*');

    const statusMap = new Map<string, { revenue: number; count: number }>();
    allSubscriptions?.forEach(sub => {
      const status = sub.status || 'unknown';
      const monthlyAmount = sub.billing_cycle === 'yearly'
        ? (sub.amount_cents || 0) / 12
        : (sub.amount_cents || 0);

      const current = statusMap.get(status) || { revenue: 0, count: 0 };
      statusMap.set(status, {
        revenue: current.revenue + monthlyAmount,
        count: current.count + 1
      });
    });

    const byStatus = Array.from(statusMap.entries()).map(([status, data]) => ({
      status,
      revenue: Math.round(data.revenue),
      customerCount: data.count
    }));

    return { byPlan, byBillingCycle, byStatus };
  }

  // Analyze churn
  async analyzeChurn(months: number = 6): Promise<ChurnAnalysis> {
    const startDate = subMonths(new Date(), months);

    // Get churned subscriptions
    const { data: churnedSubs } = await this.supabase
      .from('subscriptions')
      .select('*')
      .in('status', ['canceled', 'past_due'])
      .gte('canceled_at', startDate.toISOString());

    const totalChurned = churnedSubs?.length || 0;
    const churnedRevenue = churnedSubs?.reduce((sum, sub) => {
      const monthlyAmount = sub.billing_cycle === 'yearly'
        ? (sub.amount_cents || 0) / 12
        : (sub.amount_cents || 0);
      return sum + monthlyAmount;
    }, 0) || 0;

    // Get total active subscriptions for rate calculation
    const { count: totalActive } = await this.supabase
      .from('subscriptions')
      .select('id', { count: 'exact' })
      .eq('status', 'active');

    const churnRate = totalActive && totalActive > 0
      ? (totalChurned / (totalActive + totalChurned)) * 100
      : 0;

    // Analyze reasons (would come from exit surveys or metadata)
    const reasonsBreakdown = this.analyzeChurnReasons(churnedSubs || []);

    // Monthly churn analysis
    const monthlyChurn = await this.getMonthlyChurnData(months);

    return {
      totalChurned,
      churnRate: Math.round(churnRate * 100) / 100,
      churnedRevenue: Math.round(churnedRevenue),
      reasonsBreakdown,
      monthlyChurn
    };
  }

  // Calculate growth metrics
  async calculateGrowthMetrics(month?: Date): Promise<GrowthMetrics> {
    const targetMonth = month || new Date();
    const monthStart = startOfMonth(targetMonth);
    const monthEnd = endOfMonth(targetMonth);

    // New customers
    const { count: newCustomers } = await this.supabase
      .from('subscriptions')
      .select('id', { count: 'exact' })
      .gte('created_at', monthStart.toISOString())
      .lte('created_at', monthEnd.toISOString());

    // Get subscription changes
    const { data: auditLogs } = await this.supabase
      .from('audit_logs')
      .select('*')
      .eq('event_type', 'subscription.updated')
      .gte('created_at', monthStart.toISOString())
      .lte('created_at', monthEnd.toISOString());

    let upgrades = 0;
    let downgrades = 0;
    let expansionRevenue = 0;
    let contractionRevenue = 0;

    // Analyze subscription changes
    auditLogs?.forEach(log => {
      const metadata = log.metadata || {};
      const oldAmount = metadata.old_amount || 0;
      const newAmount = metadata.new_amount || 0;
      const change = newAmount - oldAmount;

      if (change > 0) {
        upgrades++;
        expansionRevenue += change;
      } else if (change < 0) {
        downgrades++;
        contractionRevenue += Math.abs(change);
      }
    });

    // Reactivations
    const { count: reactivations } = await this.supabase
      .from('subscriptions')
      .select('id', { count: 'exact' })
      .eq('status', 'active')
      .not('canceled_at', 'is', null)
      .gte('updated_at', monthStart.toISOString())
      .lte('updated_at', monthEnd.toISOString());

    const netNewRevenue = expansionRevenue - contractionRevenue;

    return {
      newCustomers: newCustomers || 0,
      upgrades,
      downgrades,
      reactivations: reactivations || 0,
      expansionRevenue: Math.round(expansionRevenue),
      contractionRevenue: Math.round(contractionRevenue),
      netNewRevenue: Math.round(netNewRevenue)
    };
  }

  // Private helper methods
  private async getLastMonthMRR(): Promise<number> {
    const lastMonth = subMonths(new Date(), 1);
    const lastMonthStart = startOfMonth(lastMonth);
    const lastMonthEnd = endOfMonth(lastMonth);

    // Get subscriptions that were active last month
    const { data: subscriptions } = await this.supabase
      .from('subscriptions')
      .select('*')
      .eq('status', 'active')
      .lte('created_at', lastMonthEnd.toISOString());

    if (!subscriptions) return 0;

    return subscriptions.reduce((sum, sub) => {
      const monthlyAmount = sub.billing_cycle === 'yearly'
        ? (sub.amount_cents || 0) / 12
        : (sub.amount_cents || 0);
      return sum + monthlyAmount;
    }, 0);
  }

  private async calculateChurnRate(): Promise<{ churnRate: number; count: number }> {
    const lastMonth = subMonths(new Date(), 1);
    const monthStart = startOfMonth(lastMonth);
    const monthEnd = endOfMonth(lastMonth);

    // Get churned customers last month
    const { count: churned } = await this.supabase
      .from('subscriptions')
      .select('id', { count: 'exact' })
      .in('status', ['canceled', 'past_due'])
      .gte('canceled_at', monthStart.toISOString())
      .lte('canceled_at', monthEnd.toISOString());

    // Get total active at start of month
    const { count: totalActive } = await this.supabase
      .from('subscriptions')
      .select('id', { count: 'exact' })
      .eq('status', 'active')
      .lte('created_at', monthStart.toISOString());

    const churnRate = totalActive && totalActive > 0
      ? ((churned || 0) / totalActive) * 100
      : 0;

    return { churnRate, count: churned || 0 };
  }

  private analyzeChurnReasons(churnedSubs: Tables<'subscriptions'>[]): ChurnAnalysis['reasonsBreakdown'] {
    // Mock reasons - would come from exit surveys or metadata
    const reasons = [
      { reason: 'Too expensive', percentage: 35 },
      { reason: 'Missing features', percentage: 25 },
      { reason: 'Found alternative', percentage: 20 },
      { reason: 'No longer needed', percentage: 15 },
      { reason: 'Other', percentage: 5 }
    ];

    const totalRevenue = churnedSubs.reduce((sum, sub) => {
      const monthlyAmount = sub.billing_cycle === 'yearly'
        ? (sub.amount_cents || 0) / 12
        : (sub.amount_cents || 0);
      return sum + monthlyAmount;
    }, 0);

    return reasons.map(r => ({
      reason: r.reason,
      count: Math.round(churnedSubs.length * (r.percentage / 100)),
      revenue: Math.round(totalRevenue * (r.percentage / 100))
    }));
  }

  private async getMonthlyChurnData(months: number): Promise<ChurnAnalysis['monthlyChurn']> {
    const monthlyData = [];

    for (let i = 0; i < months; i++) {
      const targetMonth = subMonths(new Date(), i);
      const monthStart = startOfMonth(targetMonth);
      const monthEnd = endOfMonth(targetMonth);

      const { data: churned } = await this.supabase
        .from('subscriptions')
        .select('*')
        .in('status', ['canceled', 'past_due'])
        .gte('canceled_at', monthStart.toISOString())
        .lte('canceled_at', monthEnd.toISOString());

      const { count: totalActive } = await this.supabase
        .from('subscriptions')
        .select('id', { count: 'exact' })
        .eq('status', 'active')
        .lte('created_at', monthStart.toISOString());

      const churnedRevenue = churned?.reduce((sum, sub) => {
        const monthlyAmount = sub.billing_cycle === 'yearly'
          ? (sub.amount_cents || 0) / 12
          : (sub.amount_cents || 0);
        return sum + monthlyAmount;
      }, 0) || 0;

      const rate = totalActive && totalActive > 0
        ? ((churned?.length || 0) / totalActive) * 100
        : 0;

      monthlyData.unshift({
        month: targetMonth.toLocaleString('default', { month: 'short', year: 'numeric' }),
        count: churned?.length || 0,
        revenue: Math.round(churnedRevenue),
        rate: Math.round(rate * 100) / 100
      });
    }

    return monthlyData;
  }

  private getEmptyMetrics(): RevenueMetrics {
    return {
      mrr: 0,
      arr: 0,
      growth: 0,
      churn: 0,
      netRevenue: 0,
      ltv: 0,
      arpu: 0,
      cac: 0
    };
  }
}

export const revenueCalculator = new RevenueCalculator();