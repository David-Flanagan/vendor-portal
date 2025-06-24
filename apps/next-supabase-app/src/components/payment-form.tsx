import React, { useState } from 'react';
import Button from './ui/button';
import { formatMoney } from '@/lib/utils';
import { Tables } from '@/types/supabase';

interface PaymentFormProps {
  invoice: Tables['invoices'] & {
    items: Tables['invoice_items'][];
  };
  onPaymentSubmit: (paymentData: { cardNumber: string; cardName: string; }) => Promise<void>;
}

export default function PaymentForm({ invoice, onPaymentSubmit }: PaymentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [errors, setErrors] = useState<{ cardNumber?: string; cardName?: string }>({});

  const total = invoice.items.reduce(
    (sum, item) => sum + item.qty * item.unit_price_cents,
    0
  );

  const formatCardNumber = (value: string) => {
    // Remove non-digits
    const digits = value.replace(/\D/g, '');

    // Format with spaces every 4 digits
    let formatted = '';
    for (let i = 0; i < digits.length; i += 4) {
      formatted += digits.slice(i, i + 4) + ' ';
    }

    return formatted.trim();
  };

  const validateForm = () => {
    const newErrors: { cardNumber?: string; cardName?: string } = {};

    if (!cardNumber.trim() || cardNumber.replace(/\D/g, '').length < 16) {
      newErrors.cardNumber = 'Please enter a valid card number';
    }

    if (!cardName.trim()) {
      newErrors.cardName = 'Please enter the name on card';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await onPaymentSubmit({ cardNumber, cardName });
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="border-b border-gray-200 bg-gray-50 px-4 py-4 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Pay Invoice #{invoice.id.substring(0, 8)}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Total Amount: {formatMoney(total, invoice.currency)}
        </p>
      </div>

      <div className="px-4 py-5 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="cardName" className="block text-sm font-medium text-gray-700">
              Name on Card
            </label>
            <input
              type="text"
              id="cardName"
              className={`mt-1 block w-full rounded-md border ${
                errors.cardName ? 'border-red-500' : 'border-gray-300'
              } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm`}
              placeholder="John Doe"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
            />
            {errors.cardName && (
              <p className="mt-1 text-sm text-red-600">{errors.cardName}</p>
            )}
          </div>

          <div>
            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
              Card Number
            </label>
            <input
              type="text"
              id="cardNumber"
              className={`mt-1 block w-full rounded-md border ${
                errors.cardNumber ? 'border-red-500' : 'border-gray-300'
              } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm`}
              placeholder="4242 4242 4242 4242"
              value={cardNumber}
              onChange={(e) => {
                const formatted = formatCardNumber(e.target.value);
                // Limit to 19 characters (16 digits + 3 spaces)
                setCardNumber(formatted.substring(0, 19));
              }}
              maxLength={19}
            />
            {errors.cardNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                Expiry Date
              </label>
              <input
                type="text"
                id="expiryDate"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                placeholder="MM / YY"
                defaultValue="12 / 25"
              />
            </div>
            <div>
              <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">
                CVC
              </label>
              <input
                type="text"
                id="cvc"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                placeholder="123"
                defaultValue="123"
                maxLength={3}
              />
            </div>
          </div>

          <div className="mt-6">
            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
            >
              Pay {formatMoney(total, invoice.currency)}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}