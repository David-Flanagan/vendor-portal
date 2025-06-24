import { Tables } from '@/types/supabase';
import { formatMoney, formatDate } from '@/lib/utils';
import InvoiceStatusBadge from './invoice-status-badge';
import Button from './ui/button';
import Link from 'next/link';

interface InvoiceDetailProps {
  invoice: Tables['invoices'] & {
    items: Tables['invoice_items'][];
    payments?: Tables['payments'][];
  };
  onSendInvoice?: (invoiceId: string) => void;
  isSending?: boolean;
}

export default function InvoiceDetail({
  invoice,
  onSendInvoice,
  isSending = false,
}: InvoiceDetailProps) {
  const total = invoice.items.reduce(
    (sum, item) => sum + item.qty * item.unit_price_cents,
    0
  );

  const canSend = invoice.status === 'draft';
  const canPay = invoice.status === 'sent';
  const isPaid = invoice.status === 'paid';

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="border-b border-gray-200 bg-gray-50 px-4 py-4 sm:px-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Invoice #{invoice.id.substring(0, 8)}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Created on {formatDate(invoice.created_at)}
          </p>
        </div>
        <InvoiceStatusBadge status={invoice.status} />
      </div>

      <div className="px-4 py-5 sm:p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <h4 className="text-sm font-medium text-gray-500">Customer</h4>
            <p className="mt-1 text-sm text-gray-900">{invoice.customer_email}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-500">Due Date</h4>
            <p className="mt-1 text-sm text-gray-900">
              {invoice.due_date ? formatDate(invoice.due_date) : 'Not set'}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-500">Line Items</h4>
          <div className="mt-2 flex flex-col">
            <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead>
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        Description
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Qty
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Unit Price
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900"
                      >
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {invoice.items.map((item) => (
                      <tr key={item.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {item.description}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {item.qty}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {formatMoney(item.unit_price_cents, invoice.currency)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 text-right">
                          {formatMoney(
                            item.qty * item.unit_price_cents,
                            invoice.currency
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <th
                        colSpan={3}
                        scope="row"
                        className="pl-4 pr-3 pt-4 text-right text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        Total
                      </th>
                      <td className="pl-3 pr-4 pt-4 text-right text-sm font-semibold text-gray-900 sm:pr-6">
                        {formatMoney(total, invoice.currency)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>

        {invoice.payments && invoice.payments.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-500">Payments</h4>
            <div className="mt-2 space-y-2">
              {invoice.payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-md"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Payment #{payment.id.substring(0, 8)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(payment.created_at)}
                    </p>
                  </div>
                  <div className="text-sm text-right">
                    <p className="font-medium text-gray-900">
                      {formatMoney(payment.amount_cents, invoice.currency)}
                    </p>
                    <p
                      className={`text-xs ${
                        payment.status === 'succeeded'
                          ? 'text-green-600'
                          : payment.status === 'failed'
                          ? 'text-red-600'
                          : 'text-yellow-600'
                      }`}
                    >
                      {payment.status.toUpperCase()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 bg-gray-50 px-4 py-4 sm:px-6 flex justify-end space-x-3">
        {canSend && onSendInvoice && (
          <Button
            onClick={() => onSendInvoice(invoice.id)}
            isLoading={isSending}
          >
            Send Invoice
          </Button>
        )}
        {canPay && (
          <Link href={`/invoices/${invoice.id}/pay`} passHref>
            <Button>Pay Now</Button>
          </Link>
        )}
        {isPaid && (
          <Button variant="outline" disabled>
            Invoice Paid
          </Button>
        )}
      </div>
    </div>
  );
}