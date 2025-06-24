# Atlas Payment & Invoicing System

A modern contract-to-cash workflow solution built with Next.js 14 and Supabase.

## Features

- **Invoice Creation**: Finance users can generate invoices with line items
- **Customer Payment**: Customers can pay invoices online
- **Real-time Events**: Events are emitted for invoice state changes

## Tech Stack

- **Frontend**: Next.js 14 (App Router)
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions)
- **Authentication**: Supabase Auth with Row-Level Security
- **Payments**: Stripe integration

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Stripe account (for payments)

### Installation

1. Clone the repository

   ``` bash
   git clone https://github.com/yourusername/atlas-payments.git
   cd atlas-payments
   ```

2. Install dependencies

   ``` bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:

   ``` bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   ```

4. Set up your Supabase database using the schema in `src/lib/schema.sql`

5. Deploy the Edge Function to Supabase:

   ``` bash
   supabase functions deploy invoice-events
   ```

6. Run the development server:

   ``` bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `src/app`: Next.js application routes
- `src/components`: Reusable React components
- `src/lib`: Utilities and client libraries
- `supabase/functions`: Supabase Edge Functions

## Data Model

The system uses the following main tables:

- Organizations: Multi-tenant company data
- Invoices: Core invoice metadata
- Invoice Items: Line items for each invoice
- Payments: Payment records linked to invoices

## Row-Level Security

All data is protected with Supabase Row-Level Security, ensuring users can only access their own organization's data.

## Event Flow

1. When an invoice is created, a trigger notifies the Edge Function
2. When a payment is made, a Stripe webhook updates the payment status
3. Invoice status changes trigger events that can be used for automated workflows

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Built with [Next.js](https://nextjs.org/)
- Powered by [Supabase](https://supabase.com/)
- Payments by [Stripe](https://stripe.com/)

## Technical Overview

### Architecture Overview

Atlas Payments demonstrates how Next.js and Supabase can be used together to rapidly develop a complex application with authentication, database operations, and third-party integrations.

#### Tech Stack Details

- **Frontend**: Next.js 14 with App Router, TailwindCSS, React Hook Form with Zod validation
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions)
- **Authentication**: Supabase Auth with JWT and Row-Level Security
- **Database**: PostgreSQL (managed by Supabase)
- **Payment Processing**: Stripe API
- **Notifications**: react-hot-toast

### Authentication & Authorization

Authentication is implemented through Supabase Auth with JWT tokens stored in cookies for session management. The `middleware.ts` intercepts requests to protect routes.

Row-Level Security ensures data isolation at the database level:

```sql
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Invoices by org" ON invoices
  USING (org_id IN (
    SELECT org_id FROM org_members WHERE user_id = auth.uid()
  ));
```

### Core User Flows

1. **Authentication Flow**
   - Signup/signin via Supabase Auth
   - Auto-organization creation for new users

2. **Invoice Management Flow**
   - Create invoices with customer details and line items
   - Manage invoice status (Draft → Sent → Paid/Overdue)

3. **Payment Flow**
   - Create Stripe payment intent
   - Customer payment form submission
   - Webhook handling for payment confirmation
   - Database trigger updates invoice status

### Next.js Implementation

- **App Router Structure**: Mix of server and client components
- **API Routes**: Handle data operations and third-party integrations
- **Server Components**: Initial data loading
- **Client Components**: Interactive elements marked with 'use client'

### Supabase Integration

- **Multiple Client Instances**: Browser, server and API-specific clients
- **Database Operations**: Direct access via Supabase client methods
- **Edge Functions**: Event processing and background tasks
- **Real-time Updates**: Available through Supabase Realtime (not fully implemented)

### Key Technical Patterns

- **Multi-tenancy**: Isolated organizations through schema design and RLS
- **Event-Driven Architecture**: Database triggers and edge functions
- **Form Handling**: Consistent pattern with Zod schemas and React Hook Form

This architecture allows developers to focus on building features rather than infrastructure, significantly reducing the time to market for SaaS applications.
