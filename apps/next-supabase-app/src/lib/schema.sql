-- =============================================================================
-- COMPREHENSIVE SAAS MULTI-TENANT DATABASE SCHEMA
-- =============================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- =============================================================================
-- CORE TABLES
-- =============================================================================

-- Companies (Tenants) - The main organizational unit
CREATE TABLE companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  domain text UNIQUE,
  logo_url text,
  website text,
  description text,
  industry text,
  company_size text CHECK (company_size IN ('1-10', '11-50', '51-200', '201-1000', '1000+')),

  -- Subscription & Billing
  subscription_status text DEFAULT 'trial' CHECK (subscription_status IN ('trial', 'active', 'past_due', 'canceled', 'incomplete')),
  subscription_tier text DEFAULT 'starter' CHECK (subscription_tier IN ('starter', 'professional', 'enterprise')),
  trial_ends_at timestamptz DEFAULT (now() + interval '14 days'),

  -- Stripe Integration
  stripe_customer_id text UNIQUE,
  stripe_subscription_id text UNIQUE,

  -- Limits and Usage
  user_limit int DEFAULT 5,
  current_user_count int DEFAULT 0,
  storage_limit_gb int DEFAULT 10,
  current_storage_gb decimal(10,2) DEFAULT 0,

  -- Configuration
  settings jsonb DEFAULT '{}',
  features jsonb DEFAULT '{}',

  -- Metadata
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid,

  -- Soft delete
  deleted_at timestamptz,

  CONSTRAINT companies_name_not_empty CHECK (length(trim(name)) > 0),
  CONSTRAINT companies_slug_format CHECK (slug ~ '^[a-z0-9-]+$')
);

-- User Profiles - Extended user information
CREATE TABLE user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text,
  last_name text,
  avatar_url text,
  phone text,
  timezone text DEFAULT 'UTC',

  -- Preferences
  preferences jsonb DEFAULT '{}',
  notifications_enabled boolean DEFAULT true,

  -- System fields
  is_system_admin boolean DEFAULT false,
  last_active_at timestamptz DEFAULT now(),

  -- Metadata
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  CONSTRAINT user_profiles_name_not_empty CHECK (
    length(trim(coalesce(first_name, '') || coalesce(last_name, ''))) > 0
  )
);

-- Company Memberships - User-Company relationships with roles
CREATE TABLE company_memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Role and permissions
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'manager', 'member', 'viewer')),
  permissions jsonb DEFAULT '[]',

  -- Status
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),

  -- Invitation
  invited_by uuid REFERENCES auth.users(id),
  invited_at timestamptz,
  joined_at timestamptz DEFAULT now(),

  -- Metadata
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  UNIQUE(company_id, user_id)
);

-- Subscriptions - Detailed billing information
CREATE TABLE subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,

  -- Stripe details
  stripe_subscription_id text UNIQUE NOT NULL,
  stripe_customer_id text NOT NULL,
  stripe_price_id text NOT NULL,

  -- Subscription details
  status text NOT NULL CHECK (status IN ('active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'trialing', 'unpaid')),
  tier text NOT NULL CHECK (tier IN ('starter', 'professional', 'enterprise')),

  -- Billing cycle
  billing_cycle text NOT NULL CHECK (billing_cycle IN ('monthly', 'yearly')),
  amount_cents int NOT NULL,
  currency text DEFAULT 'USD',

  -- Dates
  current_period_start timestamptz NOT NULL,
  current_period_end timestamptz NOT NULL,
  trial_start timestamptz,
  trial_end timestamptz,
  canceled_at timestamptz,
  ended_at timestamptz,

  -- Metadata
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  UNIQUE(company_id)
);

-- Invoices - Billing history
CREATE TABLE invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  subscription_id uuid REFERENCES subscriptions(id),

  -- Stripe details
  stripe_invoice_id text UNIQUE NOT NULL,
  stripe_payment_intent_id text,

  -- Invoice details
  number text,
  status text NOT NULL CHECK (status IN ('draft', 'open', 'paid', 'void', 'uncollectible')),

  -- Amounts
  subtotal_cents int NOT NULL,
  tax_cents int DEFAULT 0,
  total_cents int NOT NULL,
  amount_paid_cents int DEFAULT 0,
  amount_due_cents int NOT NULL,
  currency text DEFAULT 'USD',

  -- Dates
  invoice_date timestamptz NOT NULL,
  due_date timestamptz,
  paid_at timestamptz,

  -- Additional data
  description text,
  metadata jsonb DEFAULT '{}',

  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Payments - Payment history
CREATE TABLE payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  invoice_id uuid REFERENCES invoices(id),

  -- Stripe details
  stripe_payment_intent_id text UNIQUE NOT NULL,
  stripe_charge_id text,

  -- Payment details
  amount_cents int NOT NULL,
  currency text DEFAULT 'USD',
  status text NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed', 'canceled')),

  -- Payment method
  payment_method_type text,
  last_four text,
  brand text,

  -- Metadata
  failure_reason text,
  failure_code text,
  metadata jsonb DEFAULT '{}',

  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Audit Logs - System activity tracking
CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Event details
  event_type text NOT NULL,
  event_category text NOT NULL CHECK (event_category IN ('auth', 'user', 'company', 'billing', 'system')),
  event_description text NOT NULL,

  -- Context
  resource_type text,
  resource_id text,

  -- Additional data
  metadata jsonb DEFAULT '{}',
  ip_address inet,
  user_agent text,

  -- Timestamp
  created_at timestamptz DEFAULT now(),

  -- Indexes for performance
  INDEX idx_audit_logs_company_id ON audit_logs(company_id),
  INDEX idx_audit_logs_user_id ON audit_logs(user_id),
  INDEX idx_audit_logs_event_type ON audit_logs(event_type),
  INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC)
);

-- Invitations - Pending user invitations
CREATE TABLE invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'manager', 'member', 'viewer')),

  -- Invitation details
  token text UNIQUE NOT NULL,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '7 days'),

  -- Status
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'revoked')),
  accepted_at timestamptz,

  -- Metadata
  invited_by uuid NOT NULL REFERENCES auth.users(id),
  message text,

  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  UNIQUE(company_id, email)
);

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

-- Companies
CREATE INDEX idx_companies_slug ON companies(slug);
CREATE INDEX idx_companies_domain ON companies(domain);
CREATE INDEX idx_companies_subscription_status ON companies(subscription_status);
CREATE INDEX idx_companies_created_at ON companies(created_at DESC);

-- User profiles
CREATE INDEX idx_user_profiles_is_system_admin ON user_profiles(is_system_admin);
CREATE INDEX idx_user_profiles_last_active ON user_profiles(last_active_at DESC);

-- Company memberships
CREATE INDEX idx_memberships_company_id ON company_memberships(company_id);
CREATE INDEX idx_memberships_user_id ON company_memberships(user_id);
CREATE INDEX idx_memberships_role ON company_memberships(role);
CREATE INDEX idx_memberships_status ON company_memberships(status);

-- Subscriptions
CREATE INDEX idx_subscriptions_company_id ON subscriptions(company_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);

-- Invoices
CREATE INDEX idx_invoices_company_id ON invoices(company_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_invoice_date ON invoices(invoice_date DESC);

-- Payments
CREATE INDEX idx_payments_company_id ON payments(company_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_created_at ON payments(created_at DESC);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

-- User profiles - users can only see their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (id = auth.uid());

-- Companies - users can only see companies they're members of
CREATE POLICY "Users can view their companies" ON companies
  FOR SELECT USING (
    id IN (
      SELECT company_id FROM company_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
    OR
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND is_system_admin = true
    )
  );

-- Company memberships - users can see memberships for their companies
CREATE POLICY "Users can view company memberships" ON company_memberships
  FOR SELECT USING (
    company_id IN (
      SELECT company_id FROM company_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
    OR
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND is_system_admin = true
    )
  );

-- Subscriptions - users can see subscriptions for their companies
CREATE POLICY "Users can view company subscriptions" ON subscriptions
  FOR SELECT USING (
    company_id IN (
      SELECT company_id FROM company_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
    OR
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND is_system_admin = true
    )
  );

-- Similar policies for other tables...
CREATE POLICY "Users can view company invoices" ON invoices
  FOR SELECT USING (
    company_id IN (
      SELECT company_id FROM company_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
    OR
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND is_system_admin = true
    )
  );

CREATE POLICY "Users can view company payments" ON payments
  FOR SELECT USING (
    company_id IN (
      SELECT company_id FROM company_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
    OR
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND is_system_admin = true
    )
  );

CREATE POLICY "Users can view company audit logs" ON audit_logs
  FOR SELECT USING (
    company_id IN (
      SELECT company_id FROM company_memberships
      WHERE user_id = auth.uid() AND status = 'active' AND role IN ('owner', 'admin')
    )
    OR
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND is_system_admin = true
    )
  );

-- =============================================================================
-- FUNCTIONS
-- =============================================================================

-- Function to create a user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, first_name, last_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update company user count
CREATE OR REPLACE FUNCTION update_company_user_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'active' THEN
    UPDATE companies
    SET current_user_count = current_user_count + 1,
        updated_at = now()
    WHERE id = NEW.company_id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status != 'active' AND NEW.status = 'active' THEN
      UPDATE companies
      SET current_user_count = current_user_count + 1,
          updated_at = now()
      WHERE id = NEW.company_id;
    ELSIF OLD.status = 'active' AND NEW.status != 'active' THEN
      UPDATE companies
      SET current_user_count = current_user_count - 1,
          updated_at = now()
      WHERE id = NEW.company_id;
    END IF;
  ELSIF TG_OP = 'DELETE' AND OLD.status = 'active' THEN
    UPDATE companies
    SET current_user_count = current_user_count - 1,
        updated_at = now()
    WHERE id = OLD.company_id;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update company user count
CREATE TRIGGER update_company_user_count_trigger
  AFTER INSERT OR UPDATE OR DELETE ON company_memberships
  FOR EACH ROW EXECUTE FUNCTION update_company_user_count();

-- Function to create audit log entries
CREATE OR REPLACE FUNCTION create_audit_log(
  p_company_id uuid,
  p_user_id uuid,
  p_event_type text,
  p_event_category text,
  p_event_description text,
  p_resource_type text DEFAULT NULL,
  p_resource_id text DEFAULT NULL,
  p_metadata jsonb DEFAULT '{}'
)
RETURNS uuid AS $$
DECLARE
  log_id uuid;
BEGIN
  INSERT INTO audit_logs (
    company_id, user_id, event_type, event_category,
    event_description, resource_type, resource_id, metadata
  )
  VALUES (
    p_company_id, p_user_id, p_event_type, p_event_category,
    p_event_description, p_resource_type, p_resource_id, p_metadata
  )
  RETURNING id INTO log_id;

  RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get company dashboard stats
CREATE OR REPLACE FUNCTION get_company_dashboard_stats(p_company_id uuid)
RETURNS TABLE (
  total_users int,
  active_subscriptions int,
  total_revenue_cents bigint,
  current_period_revenue_cents bigint,
  trial_days_remaining int
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT current_user_count FROM companies WHERE id = p_company_id)::int,
    (SELECT COUNT(*)::int FROM subscriptions WHERE company_id = p_company_id AND status = 'active'),
    COALESCE((SELECT SUM(amount_paid_cents) FROM invoices WHERE company_id = p_company_id AND status = 'paid'), 0)::bigint,
    COALESCE((
      SELECT SUM(amount_paid_cents)
      FROM invoices
      WHERE company_id = p_company_id
        AND status = 'paid'
        AND invoice_date >= date_trunc('month', now())
    ), 0)::bigint,
    GREATEST(0, (
      SELECT EXTRACT(DAY FROM trial_ends_at - now())::int
      FROM companies
      WHERE id = p_company_id
        AND subscription_status = 'trial'
    ));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;