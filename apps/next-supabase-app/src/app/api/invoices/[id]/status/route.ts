import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createAPISupabaseClient } from '@/lib/supabase-server';

const statusUpdateSchema = z.object({
  status: z.enum(['draft', 'sent', 'paid', 'overdue']),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const invoiceId = params.id;

    // Create a Supabase client specifically for API routes
    const supabase = await createAPISupabaseClient();

    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();

    console.log("Status API route session:", session ? "Session exists" : "No session");

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const result = statusUpdateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation error', details: result.error.format() },
        { status: 400 }
      );
    }

    const { status } = result.data;

    // Check if invoice exists and if user has access to it
    const { data: invoice, error: fetchError } = await supabase
      .from('invoices')
      .select('*, organizations!inner(*)')
      .eq('id', invoiceId)
      .single();

    if (fetchError || !invoice) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    // Update invoice status
    const { data: updatedInvoice, error: updateError } = await supabase
      .from('invoices')
      .update({ status })
      .eq('id', invoiceId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating invoice status:', updateError);
      return NextResponse.json(
        { error: 'Failed to update invoice status' },
        { status: 500 }
      );
    }

    return NextResponse.json({ invoice: updatedInvoice });

  } catch (error) {
    console.error('Error updating invoice status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}