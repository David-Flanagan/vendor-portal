// =============================================================================
// SUPABASE DATABASE TYPES - AUTO-GENERATED AND EXTENDED
// =============================================================================

export type Database = {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string
          name: string
          slug: string
          domain: string | null
          logo_url: string | null
          website: string | null
          description: string | null
          industry: string | null
          company_size: 'small' | 'medium' | 'large' | 'enterprise' | null
          subscription_status: 'trial' | 'active' | 'past_due' | 'canceled' | 'incomplete'
          subscription_tier: 'starter' | 'professional' | 'enterprise'
          trial_ends_at: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          user_limit: number
          current_user_count: number
          storage_limit_gb: number
          current_storage_gb: number
          settings: Record<string, any>
          features: Record<string, any>
          created_at: string
          updated_at: string
          created_by: string | null
          deleted_at: string | null
        }
        Insert: {
          id?: string
          name: string
          slug: string
          domain?: string | null
          logo_url?: string | null
          website?: string | null
          description?: string | null
          industry?: string | null
          company_size?: 'small' | 'medium' | 'large' | 'enterprise' | null
          subscription_status?: 'trial' | 'active' | 'past_due' | 'canceled' | 'incomplete'
          subscription_tier?: 'starter' | 'professional' | 'enterprise'
          trial_ends_at?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          user_limit?: number
          current_user_count?: number
          storage_limit_gb?: number
          current_storage_gb?: number
          settings?: Record<string, any>
          features?: Record<string, any>
          created_at?: string
          updated_at?: string
          created_by?: string | null
          deleted_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          domain?: string | null
          logo_url?: string | null
          website?: string | null
          description?: string | null
          industry?: string | null
          company_size?: 'small' | 'medium' | 'large' | 'enterprise' | null
          subscription_status?: 'trial' | 'active' | 'past_due' | 'canceled' | 'incomplete'
          subscription_tier?: 'starter' | 'professional' | 'enterprise'
          trial_ends_at?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          user_limit?: number
          current_user_count?: number
          storage_limit_gb?: number
          current_storage_gb?: number
          settings?: Record<string, any>
          features?: Record<string, any>
          created_at?: string
          updated_at?: string
          created_by?: string | null
          deleted_at?: string | null
        }
      }
      user_profiles: {
        Row: {
          id: string
          first_name: string | null
          last_name: string | null
          avatar_url: string | null
          phone: string | null
          timezone: string
          preferences: Record<string, any>
          notifications_enabled: boolean
          is_system_admin: boolean
          last_active_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          timezone?: string
          preferences?: Record<string, any>
          notifications_enabled?: boolean
          is_system_admin?: boolean
          last_active_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          timezone?: string
          preferences?: Record<string, any>
          notifications_enabled?: boolean
          is_system_admin?: boolean
          last_active_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      company_memberships: {
        Row: {
          id: string
          company_id: string
          user_id: string
          role: 'owner' | 'admin' | 'manager' | 'member' | 'viewer'
          permissions: string[]
          status: 'active' | 'inactive' | 'pending'
          invited_by: string | null
          invited_at: string | null
          joined_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          user_id: string
          role?: 'owner' | 'admin' | 'manager' | 'member' | 'viewer'
          permissions?: string[]
          status?: 'active' | 'inactive' | 'pending'
          invited_by?: string | null
          invited_at?: string | null
          joined_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          user_id?: string
          role?: 'owner' | 'admin' | 'manager' | 'member' | 'viewer'
          permissions?: string[]
          status?: 'active' | 'inactive' | 'pending'
          invited_by?: string | null
          invited_at?: string | null
          joined_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          company_id: string
          stripe_subscription_id: string
          stripe_customer_id: string
          stripe_price_id: string
          status: 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'trialing' | 'unpaid'
          tier: 'starter' | 'professional' | 'enterprise'
          billing_cycle: 'monthly' | 'yearly'
          amount_cents: number
          currency: string
          current_period_start: string
          current_period_end: string
          trial_start: string | null
          trial_end: string | null
          canceled_at: string | null
          ended_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          stripe_subscription_id: string
          stripe_customer_id: string
          stripe_price_id: string
          status: 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'trialing' | 'unpaid'
          tier: 'starter' | 'professional' | 'enterprise'
          billing_cycle: 'monthly' | 'yearly'
          amount_cents: number
          currency?: string
          current_period_start: string
          current_period_end: string
          trial_start?: string | null
          trial_end?: string | null
          canceled_at?: string | null
          ended_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          stripe_subscription_id?: string
          stripe_customer_id?: string
          stripe_price_id?: string
          status?: 'active' | 'canceled' | 'incomplete' | 'incomplete_expired' | 'past_due' | 'trialing' | 'unpaid'
          tier?: 'starter' | 'professional' | 'enterprise'
          billing_cycle?: 'monthly' | 'yearly'
          amount_cents?: number
          currency?: string
          current_period_start?: string
          current_period_end?: string
          trial_start?: string | null
          trial_end?: string | null
          canceled_at?: string | null
          ended_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      invoices: {
        Row: {
          id: string
          company_id: string
          subscription_id: string | null
          stripe_invoice_id: string
          stripe_payment_intent_id: string | null
          number: string | null
          status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible'
          subtotal_cents: number
          tax_cents: number
          total_cents: number
          amount_paid_cents: number
          amount_due_cents: number
          currency: string
          invoice_date: string
          due_date: string | null
          paid_at: string | null
          description: string | null
          metadata: Record<string, any>
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          subscription_id?: string | null
          stripe_invoice_id: string
          stripe_payment_intent_id?: string | null
          number?: string | null
          status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible'
          subtotal_cents: number
          tax_cents?: number
          total_cents: number
          amount_paid_cents?: number
          amount_due_cents: number
          currency?: string
          invoice_date: string
          due_date?: string | null
          paid_at?: string | null
          description?: string | null
          metadata?: Record<string, any>
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          subscription_id?: string | null
          stripe_invoice_id?: string
          stripe_payment_intent_id?: string | null
          number?: string | null
          status?: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible'
          subtotal_cents?: number
          tax_cents?: number
          total_cents?: number
          amount_paid_cents?: number
          amount_due_cents?: number
          currency?: string
          invoice_date?: string
          due_date?: string | null
          paid_at?: string | null
          description?: string | null
          metadata?: Record<string, any>
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          company_id: string
          invoice_id: string | null
          stripe_payment_intent_id: string
          stripe_charge_id: string | null
          amount_cents: number
          currency: string
          status: 'pending' | 'succeeded' | 'failed' | 'canceled'
          payment_method_type: string | null
          last_four: string | null
          brand: string | null
          failure_reason: string | null
          failure_code: string | null
          metadata: Record<string, any>
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          invoice_id?: string | null
          stripe_payment_intent_id: string
          stripe_charge_id?: string | null
          amount_cents: number
          currency?: string
          status: 'pending' | 'succeeded' | 'failed' | 'canceled'
          payment_method_type?: string | null
          last_four?: string | null
          brand?: string | null
          failure_reason?: string | null
          failure_code?: string | null
          metadata?: Record<string, any>
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          invoice_id?: string | null
          stripe_payment_intent_id?: string
          stripe_charge_id?: string | null
          amount_cents?: number
          currency?: string
          status?: 'pending' | 'succeeded' | 'failed' | 'canceled'
          payment_method_type?: string | null
          last_four?: string | null
          brand?: string | null
          failure_reason?: string | null
          failure_code?: string | null
          metadata?: Record<string, any>
          created_at?: string
          updated_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          company_id: string | null
          user_id: string | null
          event_type: string
          event_category: 'auth' | 'user' | 'company' | 'billing' | 'system'
          event_description: string
          resource_type: string | null
          resource_id: string | null
          metadata: Record<string, any>
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          company_id?: string | null
          user_id?: string | null
          event_type: string
          event_category: 'auth' | 'user' | 'company' | 'billing' | 'system'
          event_description: string
          resource_type?: string | null
          resource_id?: string | null
          metadata?: Record<string, any>
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          company_id?: string | null
          user_id?: string | null
          event_type?: string
          event_category?: 'auth' | 'user' | 'company' | 'billing' | 'system'
          event_description?: string
          resource_type?: string | null
          resource_id?: string | null
          metadata?: Record<string, any>
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
      invitations: {
        Row: {
          id: string
          company_id: string
          email: string
          role: 'admin' | 'manager' | 'member' | 'viewer'
          token: string
          expires_at: string
          status: 'pending' | 'accepted' | 'expired' | 'revoked'
          accepted_at: string | null
          invited_by: string
          message: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_id: string
          email: string
          role?: 'admin' | 'manager' | 'member' | 'viewer'
          token: string
          expires_at?: string
          status?: 'pending' | 'accepted' | 'expired' | 'revoked'
          accepted_at?: string | null
          invited_by: string
          message?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_id?: string
          email?: string
          role?: 'admin' | 'manager' | 'member' | 'viewer'
          token?: string
          expires_at?: string
          status?: 'pending' | 'accepted' | 'expired' | 'revoked'
          accepted_at?: string | null
          invited_by?: string
          message?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_company_dashboard_stats: {
        Args: {
          p_company_id: string
        }
        Returns: {
          total_users: number
          active_subscriptions: number
          total_revenue_cents: number
          current_period_revenue_cents: number
          trial_days_remaining: number
        }[]
      }
      create_audit_log: {
        Args: {
          p_company_id: string
          p_user_id: string
          p_event_type: string
          p_event_category: string
          p_event_description: string
          p_resource_type?: string
          p_resource_id?: string
          p_metadata?: Record<string, any>
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Convenience type exports
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Specific table types for easier usage
export type Company = Tables<'companies'>
export type UserProfile = Tables<'user_profiles'>
export type CompanyMembership = Tables<'company_memberships'>
export type Subscription = Tables<'subscriptions'>
export type Invoice = Tables<'invoices'>
export type Payment = Tables<'payments'>
export type AuditLog = Tables<'audit_logs'>
export type Invitation = Tables<'invitations'>

// Combined types for common use cases
export type CompanyWithMembership = Company & {
  membership: CompanyMembership
}

export type UserWithProfile = {
  id: string
  email: string
  profile: UserProfile
}

export type CompanyMembershipWithUser = CompanyMembership & {
  user_profiles: UserProfile
}

export type CompanyWithStats = Company & {
  stats: {
    total_users: number
    active_subscriptions: number
    total_revenue_cents: number
    current_period_revenue_cents: number
    trial_days_remaining: number
  }
}

// Enums for better type safety
export const COMPANY_SIZES = ['1-10', '11-50', '51-200', '201-1000', '1000+'] as const
export const SUBSCRIPTION_STATUSES = ['trial', 'active', 'past_due', 'canceled', 'incomplete'] as const
export const SUBSCRIPTION_TIERS = ['starter', 'professional', 'enterprise'] as const
export const USER_ROLES = ['owner', 'admin', 'manager', 'member', 'viewer'] as const
export const MEMBERSHIP_STATUSES = ['active', 'inactive', 'pending'] as const
export const BILLING_CYCLES = ['monthly', 'yearly'] as const
export const INVOICE_STATUSES = ['draft', 'open', 'paid', 'void', 'uncollectible'] as const
export const PAYMENT_STATUSES = ['pending', 'succeeded', 'failed', 'canceled'] as const
export const EVENT_CATEGORIES = ['auth', 'user', 'company', 'billing', 'system'] as const
export const INVITATION_STATUSES = ['pending', 'accepted', 'expired', 'revoked'] as const