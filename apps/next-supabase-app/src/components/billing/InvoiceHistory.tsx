'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@beach-box/unify-ui';
import { Badge } from '@beach-box/unify-ui';
import { Button } from '@beach-box/unify-ui';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@beach-box/unify-ui';
import { Input } from '@beach-box/unify-ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@beach-box/unify-ui';
import {
  Receipt,
  Download,
  Search,
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  Calendar,
  DollarSign
} from 'lucide-react';
import { useBilling, usePlanInfo } from '@/lib/hooks/useBilling';
import { format } from 'date-fns';

export function InvoiceHistory() {
  const { data: billingInfo, isLoading } = useBilling();
  const { formatPrice } = usePlanInfo();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  if (isLoading) {
    return <InvoiceHistorySkeleton />;
  }

  const invoices = billingInfo?.invoices || [];

  // Filter invoices based on search and filters
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch = searchTerm === '' ||
      invoice.number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.stripe_invoice_id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;

    const matchesDate = dateFilter === 'all' || (() => {
      const invoiceDate = new Date(invoice.invoice_date);
      const now = new Date();

      switch (dateFilter) {
        case 'last-month':
          const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          return invoiceDate >= lastMonth;
        case 'last-3-months':
          const last3Months = new Date(now.getFullYear(), now.getMonth() - 3, 1);
          return invoiceDate >= last3Months;
        case 'last-year':
          const lastYear = new Date(now.getFullYear() - 1, 0, 1);
          return invoiceDate >= lastYear;
        default:
          return true;
      }
    })();

    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'open': return <Clock className="h-4 w-4 text-orange-500" />;
      case 'void': return <XCircle className="h-4 w-4 text-gray-500" />;
      case 'uncollectible': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'paid': return 'default';
      case 'open': return 'secondary';
      case 'void': return 'outline';
      case 'uncollectible': return 'destructive';
      default: return 'outline';
    }
  };

  const downloadInvoice = async (invoiceId: string) => {
    try {
      // In a real implementation, this would call an API to generate and download the invoice PDF
      console.log('Downloading invoice:', invoiceId);
      // TODO: Implement invoice download functionality
    } catch (error) {
      console.error('Error downloading invoice:', error);
    }
  };

  // Calculate summary statistics
  const totalAmount = filteredInvoices.reduce((sum, invoice) => sum + invoice.total_cents, 0);
  const paidAmount = filteredInvoices
    .filter(invoice => invoice.status === 'paid')
    .reduce((sum, invoice) => sum + invoice.total_cents, 0);
  const unpaidAmount = filteredInvoices
    .filter(invoice => invoice.status === 'open')
    .reduce((sum, invoice) => sum + invoice.total_cents, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center space-x-2">
              <DollarSign className="h-4 w-4" />
              <span>Total Billed</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(totalAmount)}</div>
            <p className="text-sm text-gray-600 mt-1">
              {filteredInvoices.length} invoice{filteredInvoices.length !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center space-x-2">
              <CheckCircle className="h-4 w-4" />
              <span>Paid Amount</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatPrice(paidAmount)}</div>
            <p className="text-sm text-gray-600 mt-1">
              {filteredInvoices.filter(i => i.status === 'paid').length} paid
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Outstanding</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{formatPrice(unpaidAmount)}</div>
            <p className="text-sm text-gray-600 mt-1">
              {filteredInvoices.filter(i => i.status === 'open').length} pending
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Invoice List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Receipt className="h-5 w-5" />
            <span>Invoice History</span>
          </CardTitle>
          <CardDescription>
            View and download all your past invoices
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="void">Void</SelectItem>
                <SelectItem value="uncollectible">Uncollectible</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="last-month">Last Month</SelectItem>
                <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                <SelectItem value="last-year">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Invoice Table */}
          {filteredInvoices.length > 0 ? (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {invoice.number || `#${invoice.id.substring(0, 8)}`}
                          </div>
                          <div className="text-sm text-gray-600">
                            {invoice.description || 'Subscription invoice'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {format(new Date(invoice.invoice_date), 'MMM d, yyyy')}
                          </div>
                          {invoice.due_date && (
                            <div className="text-sm text-gray-600">
                              Due: {format(new Date(invoice.due_date), 'MMM d, yyyy')}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={getStatusVariant(invoice.status)}
                          className="flex items-center space-x-1 w-fit"
                        >
                          {getStatusIcon(invoice.status)}
                          <span className="capitalize">{invoice.status}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {formatPrice(invoice.total_cents, invoice.currency)}
                          </div>
                          {invoice.tax_cents > 0 && (
                            <div className="text-sm text-gray-600">
                              Tax: {formatPrice(invoice.tax_cents, invoice.currency)}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadInvoice(invoice.id)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-600 mb-2">No invoices found</p>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== 'all' || dateFilter !== 'all'
                  ? 'Try adjusting your search criteria'
                  : 'Your invoices will appear here once you have a subscription'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function InvoiceHistorySkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-3">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="h-10 flex-1 bg-gray-200 rounded animate-pulse" />
              <div className="h-10 w-full sm:w-[180px] bg-gray-200 rounded animate-pulse" />
              <div className="h-10 w-full sm:w-[180px] bg-gray-200 rounded animate-pulse" />
            </div>

            <div className="border rounded-lg">
              <div className="p-4 space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                      <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                    </div>
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                    <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}