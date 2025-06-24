import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Tables } from '@/types/supabase';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

export function useInvoices(orgId?: string, status?: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['invoices', orgId, status],
    queryFn: async () => {
      if (!orgId) return [];

      let query = supabase
        .from('invoices')
        .select('*')
        .eq('org_id', orgId)
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Tables['invoices'][];
    },
    enabled: !!orgId,
  });

  useEffect(() => {
    if (!orgId) return;

    const channel = supabase
      .channel('invoice-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'invoices', filter: `org_id=eq.${orgId}` },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ['invoices', orgId] });

          if (payload.eventType === 'INSERT') {
            toast.success('New invoice created');
          } else if (payload.eventType === 'UPDATE') {
            toast.success('Invoice updated');
          } else if (payload.eventType === 'DELETE') {
            toast.success('Invoice deleted');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orgId, queryClient]);

  return query;
}

export function useInvoice(invoiceId?: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['invoice', invoiceId],
    queryFn: async () => {
      if (!invoiceId) return null;

      const { data, error } = await supabase
        .from('invoices')
        .select('*, items:invoice_items(*), payments(*)')
        .eq('id', invoiceId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!invoiceId,
  });

  useEffect(() => {
    if (!invoiceId) return;

    const channel = supabase
      .channel(`invoice-${invoiceId}`)
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'invoices', filter: `id=eq.${invoiceId}` },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ['invoice', invoiceId] });
        }
      )
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'invoice_items', filter: `invoice_id=eq.${invoiceId}` },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ['invoice', invoiceId] });
        }
      )
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'payments', filter: `invoice_id=eq.${invoiceId}` },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ['invoice', invoiceId] });
          if (payload.eventType === 'INSERT') {
            toast.success('Payment recorded');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [invoiceId, queryClient]);

  return query;
}

export function useUpdateInvoiceStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ invoiceId, status }: { invoiceId: string; status: string }) => {
      const response = await fetch(`/api/invoices/${invoiceId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update invoice');
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoice', variables.invoiceId] });

      toast.success(`Invoice marked as ${variables.status}`);
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to update invoice');
    }
  });
}