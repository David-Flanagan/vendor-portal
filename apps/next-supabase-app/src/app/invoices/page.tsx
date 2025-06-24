'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { formatMoney, formatDate } from '@/lib/utils';
import InvoiceStatusBadge from '@/components/invoice-status-badge';
import { Button } from '@beach-box/unify-ui';
import NewInvoiceButton from '@/components/new-invoice-button';
import { useInvoices } from '@/lib/hooks/useInvoices';
import { useOrganization } from '@/lib/hooks/useOrganization';
import { useAuth } from '@/lib/auth';

function InvoicesContent() {
  const router = useRouter();
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get('status');

  const { data: organization, isLoading: orgLoading } = useOrganization();

  const { data: invoices, isLoading: invoicesLoading } = useInvoices(
    organization?.id,
    statusFilter || undefined
  );

  useEffect(() => {
    if (!user && !orgLoading) {
      router.push('/signin');
    }
  }, [user, orgLoading, router]);

  useEffect(() => {
    if (!organization && !orgLoading) {
      router.push('/dashboard');
    }
  }, [organization, orgLoading, router]);

  const isLoading = orgLoading || invoicesLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">Invoices</h1>
          <p className="text-gray-600">
            Manage your invoices for {organization?.name}
          </p>
        </div>
        <NewInvoiceButton />
      </div>

      <div className="mb-6 flex space-x-2">
        <Link
          href="/invoices"
          className={`px-3 py-2 rounded-md text-sm font-medium ${
            !statusFilter
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          All
        </Link>
        <Link
          href="/invoices?status=draft"
          className={`px-3 py-2 rounded-md text-sm font-medium ${
            statusFilter === 'draft'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          Draft
        </Link>
        <Link
          href="/invoices?status=sent"
          className={`px-3 py-2 rounded-md text-sm font-medium ${
            statusFilter === 'sent'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          Sent
        </Link>
        <Link
          href="/invoices?status=paid"
          className={`px-3 py-2 rounded-md text-sm font-medium ${
            statusFilter === 'paid'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          Paid
        </Link>
        <Link
          href="/invoices?status=overdue"
          className={`px-3 py-2 rounded-md text-sm font-medium ${
            statusFilter === 'overdue'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
          }`}
        >
          Overdue
        </Link>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-lg">
        {invoices && invoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Invoice #
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Customer
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Amount
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Due Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{invoice.id.substring(0, 8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {invoice.customer_email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatMoney(invoice.amount_cents, invoice.currency)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(invoice.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {invoice.due_date ? formatDate(invoice.due_date) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <InvoiceStatusBadge status={invoice.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/invoices/${invoice.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-6 py-12 text-center text-gray-500">
            <p className="text-lg font-medium">No invoices found.</p>
            <p className="mt-1">
              {statusFilter ? (
                <>
                  No {statusFilter} invoices. <Link href="/invoices" className="text-blue-600 hover:underline">View all invoices</Link>
                </>
              ) : (
                <>
                  <Link href="/invoices/new" className="text-blue-600 hover:underline">
                    Create your first invoice
                  </Link>
                </>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function InvoicesPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-[60vh]"><p>Loading...</p></div>}>
      <InvoicesContent />
    </Suspense>
  );
}