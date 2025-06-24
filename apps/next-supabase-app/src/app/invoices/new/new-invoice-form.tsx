'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import InvoiceForm from '@/components/invoice-form';
import toast from 'react-hot-toast';

interface NewInvoiceFormProps {
  orgId: string;
}

export default function NewInvoiceForm({ orgId }: NewInvoiceFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);

    try {
      const invoiceData = {
        ...data,
        org_id: orgId,
      };

      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(invoiceData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create invoice');
      }

      toast.success('Invoice created successfully');
      router.push(`/invoices/${result.invoice_id}`);

    } catch (error: any) {
      console.error('Error creating invoice:', error);
      toast.error(error.message || 'Failed to create invoice');

    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <InvoiceForm
      onSubmit={handleSubmit}
      isLoading={isSubmitting}
    />
  );
}