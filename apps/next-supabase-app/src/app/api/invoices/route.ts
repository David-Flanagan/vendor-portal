import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createAPISupabaseClient } from '@/lib/supabase-server';
import { calculateInvoiceTotal } from '@/lib/utils';

const invoiceItemSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  qty: z.number().min(1, 'Quantity must be at least 1'),
  unit_price_cents: z.number().min(1, 'Price must be greater than 0'),
});

const invoiceSchema = z.object({
  customer_email: z.string().email('Invalid email address'),
  due_date: z.string().min(1, 'Due date is required'),
  currency: z.string().default('USD'),
  items: z.array(invoiceItemSchema).min(1, 'At least one item is required'),
  org_id: z.string().uuid(),
});

export async function POST(request: NextRequest) {
  try {
    // Create a Supabase client specifically for API routes
    const supabase = await createAPISupabaseClient();

    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();

    console.log("API route session:", session ? "Session exists" : "No session");

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const result = invoiceSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation error', details: result.error.format() },
        { status: 400 }
      );
    }

    const { customer_email, due_date, currency, items, org_id } = result.data;

    // Check if user belongs to organization
    const { data: orgMember, error: orgError } = await supabase
      .from('org_members')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('org_id', org_id)
      .single();

    if (orgError || !orgMember) {
      return NextResponse.json(
        { error: 'Not authorized to create invoices for this organization' },
        { status: 403 }
      );
    }

    // Calculate total amount
    const total_cents = calculateInvoiceTotal(items);

    // Create invoice
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .insert({
        org_id,
        customer_email,
        due_date,
        currency,
        amount_cents: total_cents,
        status: 'draft',
      })
      .select()
      .single();

    if (invoiceError) {
      console.error('Invoice creation error:', invoiceError);
      return NextResponse.json(
        { error: 'Failed to create invoice' },
        { status: 500 }
      );
    }

    // Create invoice items
    const itemsWithInvoiceId = items.map(item => ({
      ...item,
      invoice_id: invoice.id,
    }));

    const { error: itemsError } = await supabase
      .from('invoice_items')
      .insert(itemsWithInvoiceId);

    if (itemsError) {
      console.error('Invoice items creation error:', itemsError);
      return NextResponse.json(
        { error: 'Failed to create invoice items' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      invoice_id: invoice.id
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createAPISupabaseClient();

    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const org_id = searchParams.get('org_id');

    if (!org_id) {
      return NextResponse.json(
        { error: 'Organization ID is required' },
        { status: 400 }
      );
    }

    // Build query
    let query = supabase
      .from('invoices')
      .select('*, items:invoice_items(*)')
      .eq('org_id', org_id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (status) {
      query = query.eq('status', status);
    }

    const { data: invoices, error } = await query;

    if (error) {
      console.error('Error fetching invoices:', error);
      return NextResponse.json(
        { error: 'Failed to fetch invoices' },
        { status: 500 }
      );
    }

    return NextResponse.json({ invoices });

  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}