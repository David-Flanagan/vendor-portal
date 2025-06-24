'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Tables } from '@/types/supabase';
import PaymentForm from '@/components/payment-form';
import toast from 'react-hot-toast';

interface PaymentProcessorProps {
  invoice: Tables['invoices'] & {
    items: Tables['invoice_items'][];
  };
}

export default function PaymentProcessor({ invoice }: PaymentProcessorProps) {
  const router = useRouter();
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);

  const handlePaymentSubmit = async (paymentData: { cardNumber: string; cardName: string }) => {
    try {
      const intentResponse = await fetch(`/api/invoices/${invoice.id}/payment-intent`, {
        method: 'POST',
      });

      if (!intentResponse.ok) {
        const errorData = await intentResponse.json();
        throw new Error(errorData.error || 'Failed to create payment intent');
      }

      await new Promise(resolve => setTimeout(resolve, 1500));

      toast.success('Payment successful!');
      setIsPaymentComplete(true);

      setTimeout(() => {
        router.push(`/invoices/${invoice.id}`);
        router.refresh();
      }, 1500);

    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Payment failed. Please try again.');
    }
  };

  if (isPaymentComplete) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="mt-3 text-lg font-medium text-gray-900">Payment successful!</h3>
        <p className="mt-2 text-sm text-gray-500">
          Thank you for your payment. You will be redirected to the invoice details page.
        </p>
      </div>
    );
  }

  return (
    <PaymentForm
      invoice={invoice}
      onPaymentSubmit={handlePaymentSubmit}
    />
  );
}