import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';

export interface UserSession {
  userId: string;
  sessionId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number; // in seconds
  pageViews: number;
  actions: UserAction[];
}

export interface UserAction {
  type: 'page_view' | 'feature_use' | 'button_click' | 'form_submit' | 'api_call';
  target: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface EngagementMetrics {
  sessions: UserSession[];
  avgSessionDuration: number;
  avgPageViews: number;
  mostUsedFeatures: { feature: string; count: number }[];
  activeHours: { hour: number; count: number }[];
}

class EngagementTracker {
  private supabase = createClientComponentClient<Database>();
  private currentSession: UserSession | null = null;

  // Track page view
  async trackPageView(page: string, userId?: string) {
    if (!userId) return;

    await this.logEvent({
      type: 'page_view',
      target: page,
      userId,
      metadata: {
        url: window.location.href,
        referrer: document.referrer,
        userAgent: navigator.userAgent
      }
    });
  }

  // Track feature usage
  async trackFeatureUse(feature: string, userId?: string, metadata?: Record<string, any>) {
    if (!userId) return;

    await this.logEvent({
      type: 'feature_use',
      target: feature,
      userId,
      metadata
    });
  }

  // Track button clicks
  async trackButtonClick(buttonId: string, userId?: string, metadata?: Record<string, any>) {
    if (!userId) return;

    await this.logEvent({
      type: 'button_click',
      target: buttonId,
      userId,
      metadata
    });
  }

  // Track form submissions
  async trackFormSubmit(formId: string, userId?: string, metadata?: Record<string, any>) {
    if (!userId) return;

    await this.logEvent({
      type: 'form_submit',
      target: formId,
      userId,
      metadata
    });
  }

  // Track API calls
  async trackApiCall(endpoint: string, userId?: string, metadata?: Record<string, any>) {
    if (!userId) return;

    await this.logEvent({
      type: 'api_call',
      target: endpoint,
      userId,
      metadata
    });
  }

  // Start a new session
  async startSession(userId: string): Promise<void> {
    const sessionId = crypto.randomUUID();

    this.currentSession = {
      userId,
      sessionId,
      startTime: new Date(),
      pageViews: 0,
      actions: []
    };

    // Log session start
    await this.logEvent({
      type: 'session_start',
      target: 'app',
      userId,
      metadata: { sessionId }
    });
  }

  // End the current session
  async endSession(): Promise<void> {
    if (!this.currentSession) return;

    const endTime = new Date();
    const duration = Math.floor((endTime.getTime() - this.currentSession.startTime.getTime()) / 1000);

    // Log session end
    await this.logEvent({
      type: 'session_end',
      target: 'app',
      userId: this.currentSession.userId,
      metadata: {
        sessionId: this.currentSession.sessionId,
        duration,
        pageViews: this.currentSession.pageViews
      }
    });

    this.currentSession = null;
  }

  // Get engagement metrics for a user
  async getUserEngagementMetrics(userId: string, days: number = 30): Promise<EngagementMetrics> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Fetch audit logs for the user
    const { data: logs } = await this.supabase
      .from('audit_logs')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    if (!logs) {
      return {
        sessions: [],
        avgSessionDuration: 0,
        avgPageViews: 0,
        mostUsedFeatures: [],
        activeHours: []
      };
    }

    // Process sessions
    const sessions = this.processSessions(logs);

    // Calculate metrics
    const avgSessionDuration = sessions.reduce((sum, s) => sum + (s.duration || 0), 0) / sessions.length || 0;
    const avgPageViews = sessions.reduce((sum, s) => sum + s.pageViews, 0) / sessions.length || 0;

    // Feature usage
    const featureUsage = new Map<string, number>();
    logs
      .filter(log => log.event_type === 'feature.accessed')
      .forEach(log => {
        const feature = log.metadata?.feature || log.resource_id || 'unknown';
        featureUsage.set(feature, (featureUsage.get(feature) || 0) + 1);
      });

    const mostUsedFeatures = Array.from(featureUsage.entries())
      .map(([feature, count]) => ({ feature, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Active hours
    const hourCounts = new Array(24).fill(0);
    logs.forEach(log => {
      const hour = new Date(log.created_at).getHours();
      hourCounts[hour]++;
    });

    const activeHours = hourCounts.map((count, hour) => ({ hour, count }));

    return {
      sessions,
      avgSessionDuration,
      avgPageViews,
      mostUsedFeatures,
      activeHours
    };
  }

  // Process logs into sessions
  private processSessions(logs: any[]): UserSession[] {
    const sessions: UserSession[] = [];
    const sessionMap = new Map<string, UserSession>();

    logs.forEach(log => {
      const sessionId = log.metadata?.sessionId;

      if (log.event_type === 'session_start' && sessionId) {
        const session: UserSession = {
          userId: log.user_id,
          sessionId,
          startTime: new Date(log.created_at),
          pageViews: 0,
          actions: []
        };
        sessionMap.set(sessionId, session);
      } else if (log.event_type === 'session_end' && sessionId) {
        const session = sessionMap.get(sessionId);
        if (session) {
          session.endTime = new Date(log.created_at);
          session.duration = log.metadata?.duration || 0;
          sessions.push(session);
          sessionMap.delete(sessionId);
        }
      } else if (sessionId) {
        const session = sessionMap.get(sessionId);
        if (session) {
          if (log.event_type === 'page_view') {
            session.pageViews++;
          }
          session.actions.push({
            type: this.mapEventType(log.event_type),
            target: log.resource_id || '',
            timestamp: new Date(log.created_at),
            metadata: log.metadata
          });
        }
      }
    });

    // Add any incomplete sessions
    sessionMap.forEach(session => sessions.push(session));

    return sessions;
  }

  // Map event types to action types
  private mapEventType(eventType: string): UserAction['type'] {
    const mapping: Record<string, UserAction['type']> = {
      'page_view': 'page_view',
      'feature.accessed': 'feature_use',
      'button.clicked': 'button_click',
      'form.submitted': 'form_submit',
      'api.called': 'api_call'
    };
    return mapping[eventType] || 'feature_use';
  }

  // Log event to audit logs
  private async logEvent(event: {
    type: string;
    target: string;
    userId: string;
    metadata?: Record<string, any>;
  }) {
    try {
      const { data: company } = await this.supabase
        .from('company_memberships')
        .select('company_id')
        .eq('user_id', event.userId)
        .eq('status', 'active')
        .single();

      if (company) {
        await this.supabase
          .from('audit_logs')
          .insert({
            user_id: event.userId,
            company_id: company.company_id,
            event_type: event.type,
            event_category: 'user',
            resource_type: 'engagement',
            resource_id: event.target,
            metadata: {
              ...event.metadata,
              timestamp: new Date().toISOString()
            }
          });
      }
    } catch (error) {
      console.error('Error logging engagement event:', error);
    }
  }
}

export const engagementTracker = new EngagementTracker();