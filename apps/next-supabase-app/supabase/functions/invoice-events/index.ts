// @ts-expect-error -- Deno import
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
// @ts-expect-error -- Deno import
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

// Define types for event payloads
interface EventPayload {
  type: string;
  invoice_id: string;
}

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // @ts-expect-error -- Deno specific API
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    // @ts-expect-error -- Deno specific API
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

    const supabase: SupabaseClient = createClient(supabaseUrl, supabaseServiceKey);


    const { type, invoice_id }: EventPayload = await req.json();


    console.log(`Processing event: ${type} for invoice: ${invoice_id}`);

    switch (type) {
      case 'invoice.created':
        console.log('Invoice created');
        // Emit realtime event
        await supabase.from('events').insert({
          type: 'invoice.created',
          payload: { invoice_id },
        });
        break;

      case 'invoice.sent':
        console.log('Invoice sent');
        // Emit realtime event
        await supabase.from('events').insert({
          type: 'invoice.sent',
          payload: { invoice_id },
        });

        // TODO: Trigger email notification to customer here
        break;

      case 'invoice.paid':
        console.log('Invoice paid');
        // Emit realtime event
        await supabase.from('events').insert({
          type: 'invoice.paid',
          payload: { invoice_id },
        });

        // TODO: Trigger receipt email to customer here
        break;

      case 'invoice.overdue':
        console.log('Invoice overdue');
        // Emit realtime event
        await supabase.from('events').insert({
          type: 'invoice.overdue',
          payload: { invoice_id },
        });

        // TODO: Trigger reminder email to customer here
        break;

      default:
        console.log(`Unknown event type: ${type}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Error processing event:', error);

    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});