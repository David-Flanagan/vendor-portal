'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import PaymentForm from '@/components/payment-form';
import PaymentProcessor from './payment-processor';
import { supabase } from '@/lib/supabase';
import { Tables } from '@/types/supabase';

type InvoiceWithItems = Tables<'invoices'> & {
  items: Tables<'invoice_items'>[];
};

export default function InvoicePaymentPage() {
  const router = useRouter();
  const params = useParams();
  const invoiceId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [invoice, setInvoice] = useState<InvoiceWithItems | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);

        const { data, error } = await supabase
          .from('invoices')
          .select('*, items:invoice_items(*)')
          .eq('id', invoiceId)
          .single();

        if (error || !data) {
          console.error('Error fetching invoice:', error);
          router.push('/');
          return;
        }

        if (data.status !== 'sent') {
          router.push(`/invoices/${invoiceId}`);
          return;
        }

        setInvoice(data as InvoiceWithItems);
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An error occurred while fetching the invoice');
      } finally {
        setIsLoading(false);
      }
    }

    if (invoiceId) {
      fetchData();
    }
  }, [invoiceId, router]);

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
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p>Invoice not found. <Link href="/" className="text-blue-600">Return home</Link></p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Pay Invoice #{invoiceId.substring(0, 8)}</h1>
        <p className="text-gray-600">
          Complete your payment to settle this invoice.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <PaymentProcessor invoice={invoice} />
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium mb-4">Invoice Summary</h2>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Customer:</span>
                <span>{invoice.customer_email}</span>
              </div>

              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Invoice Date:</span>
                <span>{new Date(invoice.created_at).toLocaleDateString()}</span>
              </div>

              {invoice.due_date && (
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Due Date:</span>
                  <span>{new Date(invoice.due_date).toLocaleDateString()}</span>
                </div>
              )}

              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Status:</span>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {invoice.status.toUpperCase()}
                </span>
              </div>

              <div className="border-t border-gray-200 mt-4 pt-4">
                <div className="flex justify-between font-medium">
                  <span>Total Amount:</span>
                  <span>${(invoice.amount_cents / 100).toFixed(2)} {invoice.currency}</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Link href={`/invoices/${invoiceId}`}>
                <Button variant="outline" className="w-full">
                  View Invoice Details
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}