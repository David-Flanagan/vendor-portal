'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatMoney, formatDate } from '@/lib/utils';
import InvoiceStatusBadge from '@/components/invoice-status-badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { Tables } from '@/types/supabase';

interface OrgMembership {
  id: string;
  org_id: string;
  user_id: string;
  role: string;
}

interface Organization {
  id: string;
  name: string;
}

interface Stats {
  total_invoices: number;
  total_draft: number;
  total_sent: number;
  total_paid: number;
  total_overdue: number;
  total_amount_cents: number;
  total_paid_amount_cents: number;
}

function DashboardContent() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentInvoices, setRecentInvoices] = useState<Tables<'invoices'>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/signin');
        return;
      }
      setUser(user);
    };

    getUser();
  }, [router]);

  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      try {
        // Fetch user's organization
        const { data: orgMembership } = await supabase
          .from('org_memberships')
          .select('org_id, organizations(id, name)')
          .eq('user_id', user.id)
          .single();

        if (orgMembership?.organizations) {
          const org = orgMembership.organizations as Organization;
          setOrganization(org);

          // Fetch invoice stats
          const { data: invoices } = await supabase
            .from('invoices')
            .select('*')
            .eq('organization_id', org.id);

          if (invoices) {
            const stats: Stats = {
              total_invoices: invoices.length,
              total_draft: invoices.filter(inv => inv.status === 'draft').length,
              total_sent: invoices.filter(inv => inv.status === 'sent').length,
              total_paid: invoices.filter(inv => inv.status === 'paid').length,
              total_overdue: invoices.filter(inv => inv.status === 'overdue').length,
              total_amount_cents: invoices.reduce((sum, inv) => sum + (inv.total_cents || 0), 0),
              total_paid_amount_cents: invoices
                .filter(inv => inv.status === 'paid')
                .reduce((sum, inv) => sum + (inv.total_cents || 0), 0),
            };
            setStats(stats);

            // Get recent invoices
            const recent = invoices
              .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
              .slice(0, 5);
            setRecentInvoices(recent);
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">No Organization Found</h2>
          <p className="text-gray-600 mt-2">Please contact support to set up your organization.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to {organization.name}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Invoices</p>
              <p className="text-2xl font-bold">{stats?.total_invoices || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold">{formatMoney(stats?.total_amount_cents || 0)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Paid Amount</p>
              <p className="text-2xl font-bold">{formatMoney(stats?.total_paid_amount_cents || 0)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold">{(stats?.total_sent || 0) + (stats?.total_overdue || 0)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Invoices */}
      <div className="bg-white rounded-lg border">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Invoices</h2>
            <Link href="/invoices">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>
        </div>
        <div className="p-6">
          {recentInvoices.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 text-sm font-medium text-gray-600">Invoice #</th>
                    <th className="text-left py-2 text-sm font-medium text-gray-600">Customer</th>
                    <th className="text-left py-2 text-sm font-medium text-gray-600">Amount</th>
                    <th className="text-left py-2 text-sm font-medium text-gray-600">Status</th>
                    <th className="text-left py-2 text-sm font-medium text-gray-600">Date</th>
                    <th className="text-left py-2 text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentInvoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b last:border-b-0">
                      <td className="py-3">
                        <span className="font-medium">#{invoice.id.slice(0, 8)}</span>
                      </td>
                      <td className="py-3">
                        <span>{invoice.metadata?.customer_email || 'N/A'}</span>
                      </td>
                      <td className="py-3">
                        <span className="font-medium">{formatMoney(invoice.total_cents || 0)}</span>
                      </td>
                      <td className="py-3">
                        <InvoiceStatusBadge status={invoice.status} />
                      </td>
                      <td className="py-3">
                        <span className="text-gray-600">{formatDate(invoice.created_at)}</span>
                      </td>
                      <td className="py-3">
                        <Link href={`/invoices/${invoice.id}`}>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">No invoices yet</p>
              <Link href="/invoices/new">
                <Button className="mt-4">
                  Create Your First Invoice
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}