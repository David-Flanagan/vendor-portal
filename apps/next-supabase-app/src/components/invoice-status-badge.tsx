import { cn } from '@/lib/utils';

interface InvoiceStatusBadgeProps {
  status: string;
}

export default function InvoiceStatusBadge({ status }: InvoiceStatusBadgeProps) {
  const getClasses = (status: string) => {
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
  };

  const getLabel = (status: string) => {
    switch (status) {
      case 'draft':
        return 'Draft';
      case 'sent':
        return 'Sent';
      case 'paid':
        return 'Paid';
      case 'overdue':
        return 'Overdue';
      default:
        return status;
    }
  };

  return (
    <span className={cn(
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
      getClasses(status)
    )}>
      {getLabel(status)}
    </span>
  );
}