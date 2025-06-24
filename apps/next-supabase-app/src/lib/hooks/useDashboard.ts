import { useQuery } from '@tanstack/react-query';
import { dashboardService, DashboardMetrics, UserEngagementData, RevenueMetrics } from '../analytics/dashboard-service';
import { revenueCalculator, RevenueBreakdown, ChurnAnalysis, GrowthMetrics } from '../analytics/revenue-calculator';
import { featureTracker, FeatureUsage, FeatureAdoption, FeaturePerformance } from '../analytics/feature-tracker';
import { useOrganization } from './useOrganization';

// Main dashboard metrics hook
export function useDashboardMetrics() {
  const { currentOrganization } = useOrganization();

  return useQuery({
    queryKey: ['dashboard-metrics', currentOrganization?.id],
    queryFn: () => dashboardService.getDashboardMetrics(currentOrganization!.id),
    enabled: !!currentOrganization?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchInterval: 1000 * 60 * 5, // Refetch every 5 minutes
  });
}

// User engagement data hook
export function useUserEngagement() {
  const { currentOrganization } = useOrganization();

  return useQuery({
    queryKey: ['user-engagement', currentOrganization?.id],
    queryFn: () => dashboardService.getUserEngagementData(currentOrganization!.id),
    enabled: !!currentOrganization?.id,
    staleTime: 1000 * 60 * 15, // 15 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
}

// Revenue metrics hook
export function useRevenueMetrics() {
  const { currentOrganization } = useOrganization();

  return useQuery({
    queryKey: ['revenue-metrics', currentOrganization?.id],
    queryFn: () => dashboardService.getRevenueMetrics(currentOrganization!.id),
    enabled: !!currentOrganization?.id,
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 20, // 20 minutes
  });
}

// Revenue breakdown hook
export function useRevenueBreakdown() {
  return useQuery({
    queryKey: ['revenue-breakdown'],
    queryFn: () => revenueCalculator.getRevenueBreakdown(),
    staleTime: 1000 * 60 * 15, // 15 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });
}

// Churn analysis hook
export function useChurnAnalysis(months: number = 6) {
  return useQuery({
    queryKey: ['churn-analysis', months],
    queryFn: () => revenueCalculator.analyzeChurn(months),
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60, // 60 minutes
  });
}

// Growth metrics hook
export function useGrowthMetrics(month?: Date) {
  return useQuery({
    queryKey: ['growth-metrics', month?.toISOString()],
    queryFn: () => revenueCalculator.calculateGrowthMetrics(month),
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60, // 60 minutes
  });
}

// Feature usage hook
export function useFeatureUsage(days: number = 30) {
  const { currentOrganization } = useOrganization();

  return useQuery({
    queryKey: ['feature-usage', currentOrganization?.id, days],
    queryFn: () => featureTracker.getFeatureUsageStats(currentOrganization!.id, days),
    enabled: !!currentOrganization?.id,
    staleTime: 1000 * 60 * 20, // 20 minutes
    gcTime: 1000 * 60 * 40, // 40 minutes
  });
}

// Feature adoption hook
export function useFeatureAdoption() {
  const { currentOrganization } = useOrganization();

  return useQuery({
    queryKey: ['feature-adoption', currentOrganization?.id],
    queryFn: () => featureTracker.getFeatureAdoptionMetrics(currentOrganization!.id),
    enabled: !!currentOrganization?.id,
    staleTime: 1000 * 60 * 30, // 30 minutes
    gcTime: 1000 * 60 * 60, // 60 minutes
  });
}

// Feature performance hook
export function useFeaturePerformance(days: number = 7) {
  const { currentOrganization } = useOrganization();

  return useQuery({
    queryKey: ['feature-performance', currentOrganization?.id, days],
    queryFn: () => featureTracker.getFeaturePerformanceMetrics(currentOrganization!.id, days),
    enabled: !!currentOrganization?.id,
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 20, // 20 minutes
  });
}

// Combined dashboard data hook
export function useDashboard() {
  const metrics = useDashboardMetrics();
  const engagement = useUserEngagement();
  const revenue = useRevenueMetrics();
  const featureUsage = useFeatureUsage();

  const isLoading = metrics.isLoading || engagement.isLoading || revenue.isLoading || featureUsage.isLoading;
  const error = metrics.error || engagement.error || revenue.error || featureUsage.error;

  return {
    isLoading,
    error,
    metrics: metrics.data,
    engagement: engagement.data,
    revenue: revenue.data,
    featureUsage: featureUsage.data,
    refetch: () => {
      metrics.refetch();
      engagement.refetch();
      revenue.refetch();
      featureUsage.refetch();
    }
  };
}

// Quick stats hook for dashboard cards
export function useQuickStats() {
  const { data: metrics } = useDashboardMetrics();
  const { data: revenue } = useRevenueMetrics();

  if (!metrics || !revenue) {
    return null;
  }

  return {
    users: {
      total: metrics.users.total,
      active: metrics.users.active,
      growth: metrics.users.growth,
      label: 'Total Users'
    },
    revenue: {
      mrr: revenue.mrr,
      growth: revenue.growth,
      label: 'Monthly Revenue'
    },
    usage: {
      storage: metrics.usage.storage,
      apiCalls: metrics.usage.apiCalls,
      label: 'Resource Usage'
    },
    performance: {
      uptime: metrics.performance.uptime,
      responseTime: metrics.performance.responseTime,
      errorRate: metrics.performance.errorRate,
      label: 'System Health'
    }
  };
}