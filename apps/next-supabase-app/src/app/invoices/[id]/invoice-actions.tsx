'use client';

import { Tables } from '@/types/supabase';
import { Button } from '@beach-box/unify-ui';
import { useUpdateInvoiceStatus } from '@/lib/hooks/useInvoices';

interface InvoiceActionsProps {
  invoice: Tables<'invoices'> & {
    items: Tables<'invoice_items'>[];
    payments?: Tables<'payments'>[];
  };
}

export default function InvoiceActions({ invoice }: InvoiceActionsProps) {
  const updateInvoiceStatus = useUpdateInvoiceStatus();

  const canSend = invoice.status === 'draft';

  const handleSendInvoice = () => {
    updateInvoiceStatus.mutate({
      invoiceId: invoice.id,
      status: 'sent'
    });
  };

  const handleMarkOverdue = () => {
    updateInvoiceStatus.mutate({
      invoiceId: invoice.id,
      status: 'overdue'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-medium mb-4">Invoice Actions</h2>

      <div className="space-y-4">
        {canSend && (
          <div>
            <p className="text-sm text-gray-600 mb-2">
              This invoice is still in draft status. Send it to your customer to request payment.
            </p>
            <Button
              onClick={handleSendInvoice}
              isLoading={updateInvoiceStatus.isPending}
            >
              Send Invoice
            </Button>
          </div>
        )}

        {invoice.status === 'sent' && (
          <div>
            <p className="text-sm text-gray-600 mb-2">
              This invoice has been sent to the customer and is awaiting payment.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={handleMarkOverdue}
                isLoading={updateInvoiceStatus.isPending}
              >
                Mark as Overdue
              </Button>
            </div>
          </div>
        )}

        {invoice.status === 'paid' && (
          <p className="text-sm text-gray-600">
            This invoice has been paid in full.
          </p>
        )}

        {invoice.status === 'overdue' && (
          <p className="text-sm text-gray-600">
            This invoice is overdue. You may want to send a reminder to the customer.
          </p>
        )}
      </div>
    </div>
  );
}