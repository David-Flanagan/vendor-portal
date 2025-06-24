# SaaS Starter Refactoring Plan
## Comprehensive Build Plan for Multi-tenant SaaS Application

### Overview
Transform the current invoice-focused Next.js app into a generic, multi-tenant SaaS starter with comprehensive features including authentication, billing, team management, and admin capabilities.

## Phase 1: Foundation & Database ✅
### 1.1 Database Schema ✅
- [x] Replace simple organization schema with comprehensive multi-tenant structure
- [x] Add companies, user_profiles, company_memberships, subscriptions, invoices, payments, audit_logs, invitations tables
- [x] Implement Row Level Security (RLS) policies
- [x] Add database functions for analytics and audit logging
- [x] Create proper indexes for performance

### 1.2 Type System ✅
- [x] Update Supabase types with comprehensive database schema
- [x] Add convenience types and enums for better type safety
- [x] Create combined types for common use cases

### 1.3 Authentication Enhancement ✅
- [x] Multi-tenant authentication with company switching
- [x] User profile management
- [x] Role-based access control (RBAC)
- [x] Permission system
- [x] Higher-order components for route protection

## Phase 2: Core Application Structure

### 2.1 App Layout Refactoring
- [ ] Replace current layout with unify-ui AppShell
- [ ] Implement responsive navigation with company switcher
- [ ] Add notification system and user menu
- [ ] Create theme provider for dark/light mode

### 2.2 Landing Page & Marketing
- [ ] Create marketing landing page using unify-ui marketing blocks
- [ ] Implement pricing page with subscription tiers
- [ ] Add feature comparison and FAQ sections
- [ ] Create about and contact pages

### 2.3 Authentication Flow
- [ ] Replace auth forms with unify-ui auth blocks
- [ ] Implement comprehensive onboarding flow
- [ ] Add social login options
- [ ] Create email verification and password reset flows
- [ ] Add two-factor authentication support

## Phase 3: Multi-tenant Company Management

### 3.1 Company Onboarding
- [ ] Create company creation wizard
- [ ] Implement company settings management
- [ ] Add company branding customization
- [ ] Create team invitation system

### 3.2 User Management
- [ ] Build team management interface
- [ ] Implement role assignment and permissions
- [ ] Create user invitation flow
- [ ] Add user activity tracking

### 3.3 Company Settings
- [ ] General company settings
- [ ] Billing and subscription management
- [ ] API keys and integrations
- [ ] Security settings and audit logs

## Phase 4: Billing & Subscription System

### 4.1 Stripe Integration Enhancement
- [ ] Implement subscription management
- [ ] Add multiple pricing tiers (Starter, Professional, Enterprise)
- [ ] Create billing portal integration
- [ ] Add usage-based billing support
- [ ] Implement proration for plan changes

### 4.2 Billing Dashboard
- [ ] Current subscription status
- [ ] Billing history and invoices
- [ ] Payment method management
- [ ] Usage metrics and limits

### 4.3 Webhooks & Automation
- [ ] Stripe webhook handling for subscription events
- [ ] Automatic user limit enforcement
- [ ] Trial expiration handling
- [ ] Billing failure notifications

## Phase 5: Dashboard & Analytics

### 5.1 Company Dashboard
- [ ] Overview metrics and KPIs
- [ ] Usage analytics and trends
- [ ] Recent activity feed
- [ ] Quick actions and shortcuts

### 5.2 Analytics Implementation
- [ ] User engagement tracking
- [ ] Feature usage analytics
- [ ] Revenue and subscription metrics
- [ ] Custom dashboard widgets

## Phase 6: Global Admin Panel

### 6.1 System Administration
- [ ] Platform-wide analytics
- [ ] Company management and oversight
- [ ] User management across all tenants
- [ ] System health monitoring

### 6.2 Admin Tools
- [ ] Feature flag management
- [ ] Support ticket system
- [ ] Audit log viewer
- [ ] System notifications

## Phase 7: Advanced Features

### 7.1 API & Integrations
- [ ] RESTful API for third-party integrations
- [ ] API key management
- [ ] Webhook system for external services
- [ ] SDK and documentation

### 7.2 Advanced Security
- [ ] Enhanced audit logging
- [ ] IP whitelisting
- [ ] Session management
- [ ] Security incident tracking

### 7.3 Communication Features
- [ ] In-app notifications
- [ ] Email notification system
- [ ] Activity feed
- [ ] Team communication tools

## Implementation Details

### Key Components to Build

#### 1. Layout Components
```typescript
// Using unify-ui components
- AppShell with responsive sidebar
- CompanySelector dropdown
- UserMenu with profile management
- NotificationCenter
- ThemeProvider for customization
```

#### 2. Authentication Components
```typescript
// Enhanced auth forms
- LoginForm with social providers
- RegisterForm with company creation
- OnboardingWizard (multi-step)
- EmailVerification
- PasswordReset
- TwoFactorAuth
```

#### 3. Company Management
```typescript
// Company-centric components
- CompanyCreationWizard
- CompanySettings
- TeamManagement
- UserInvitations
- RolePermissionManager
```

#### 4. Billing Components
```typescript
// Stripe integration
- SubscriptionManager
- BillingPortal
- PlanSelector
- UsageMetrics
- InvoiceHistory
```

#### 5. Dashboard Components
```typescript
// Analytics and insights
- MetricCards using unify-ui
- ActivityFeed
- ChartComponents
- QuickActions
- RecentActivity
```

#### 6. Admin Panel
```typescript
// System administration
- AdminDashboard
- CompanyManagement
- SystemAnalytics
- AuditLogViewer
- FeatureFlagManager
```

### API Routes Structure
```
/api/
├── auth/
│   ├── signup/
│   ├── signin/
│   └── verify/
├── companies/
│   ├── create/
│   ├── [id]/
│   │   ├── settings/
│   │   ├── members/
│   │   └── billing/
├── billing/
│   ├── subscriptions/
│   ├── invoices/
│   └── webhooks/
├── admin/
│   ├── companies/
│   ├── users/
│   └── analytics/
└── integrations/
    ├── stripe/
    └── webhooks/
```

### Database Migration Strategy
1. **Backup Current Data**: Export existing data
2. **Schema Migration**: Apply new schema with data migration scripts
3. **Data Transformation**: Convert existing organizations to companies
4. **RLS Policies**: Apply row-level security
5. **Testing**: Comprehensive testing of all migrations

### Environment Variables
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://ueybksdaeahljswgijbi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Application Configuration
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
APP_URL=http://localhost:3000
```

### Testing Strategy
1. **Unit Tests**: Component and function testing
2. **Integration Tests**: API and database integration
3. **E2E Tests**: Complete user workflows
4. **Load Testing**: Multi-tenant performance
5. **Security Testing**: Authentication and authorization

### Deployment Considerations
1. **Database Migrations**: Automated migration scripts
2. **Feature Flags**: Gradual rollout capability
3. **Monitoring**: Application and database monitoring
4. **Scaling**: Multi-tenant resource isolation
5. **Backup Strategy**: Regular backups and disaster recovery

## Success Metrics
- Multi-tenant architecture with proper data isolation
- Comprehensive authentication and authorization
- Seamless billing and subscription management
- Intuitive admin and user interfaces
- Scalable and performant architecture
- Complete audit trail and security features

## Timeline Estimate
- **Phase 1**: 1 week (Foundation) ✅
- **Phase 2**: 2 weeks (Core Structure)
- **Phase 3**: 2 weeks (Company Management)
- **Phase 4**: 2 weeks (Billing System)
- **Phase 5**: 1 week (Dashboard)
- **Phase 6**: 1 week (Admin Panel)
- **Phase 7**: 2 weeks (Advanced Features)

**Total Estimated Time**: 11 weeks for complete transformation

## Next Steps
1. Execute Phase 2: Core Application Structure
2. Set up development environment with new database schema
3. Begin building core components with unify-ui
4. Implement authentication flows
5. Create company management system
6. Integrate billing and subscriptions
7. Build admin panel and advanced features