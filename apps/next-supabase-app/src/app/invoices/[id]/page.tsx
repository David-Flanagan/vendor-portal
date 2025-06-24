'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import InvoiceDetail from '@/components/invoice-detail';
import InvoiceActions from './invoice-actions';
import { useInvoice } from '@/lib/hooks/useInvoices';
import { useAuth } from '@/lib/auth';

export default function InvoiceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuth();
  const invoiceId = params.id as string;

  const { data: invoice, isLoading, error } = useInvoice(invoiceId);

  useEffect(() => {
    if (!user && !isLoading) {
      router.push('/signin');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-red-500">
          {error instanceof Error ? error.message : 'An error occurred while fetching the invoice'}
        </p>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p>Invoice not found. <Link href="/invoices" className="text-blue-600">Return to invoices</Link></p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/invoices" className="text-blue-600 hover:underline">
              Invoices
            </Link>
            <span className="text-gray-500">/</span>
            <span>Invoice #{invoiceId.substring(0, 8)}</span>
          </div>
          <h1 className="text-2xl font-bold mt-2">Invoice Details</h1>
        </div>
        <Link href="/invoices">
          <Button variant="outline">Back to Invoices</Button>
        </Link>
      </div>

      <InvoiceDetail
        invoice={invoice}
      />

      <div className="mt-6">
        <InvoiceActions invoice={invoice} />
      </div>
    </div>
  );
}