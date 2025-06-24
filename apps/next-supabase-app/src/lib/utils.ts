import { format } from 'date-fns';
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMoney(amount: number, currency = 'USD'): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  });

  return formatter.format(amount / 100);
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'MMM d, yyyy');
}

export function calculateInvoiceTotal(items: { qty: number; unit_price_cents: number }[]): number {
  return items.reduce((sum, item) => sum + (item.qty * item.unit_price_cents), 0);
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'draft':
      return 'bg-gray-100 text-gray-800';
    case 'sent':
      return 'bg-blue-100 text-blue-800';
    case 'paid':
      return 'bg-green-100 text-green-800';
    case 'overdue':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}