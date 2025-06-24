const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkDatabase() {
  try {
    console.log('===== DATABASE CHECK =====');

    // Check if key tables exist and get their counts
    const tables = [
      'organizations',
      'org_members',
      'invoices',
      'invoice_items',
      'payments'
    ];

    for (const table of tables) {
      try {
        // Try to count rows in each table
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });

        if (error) {
          console.error(`Error checking table ${table}:`, error);
        } else {
          console.log(`Table ${table}: ${count} rows`);
        }
      } catch (error) {
        console.error(`Error checking table ${table}:`, error);
      }
    }

    // Get organization data
    const { data: organizations, error: orgsError } = await supabase
      .from('organizations')
      .select('*')
      .limit(5);

    if (orgsError) {
      console.error('Error fetching organizations:', orgsError);
    } else {
      console.log('\n===== ORGANIZATIONS =====');
      organizations.forEach(org => {
        console.log(`ID: ${org.id}, Name: ${org.name}`);
      });
    }

    // Get org_members data
    const { data: members, error: membersError } = await supabase
      .from('org_members')
      .select('*')
      .limit(5);

    if (membersError) {
      console.error('Error fetching org_members:', membersError);
    } else {
      console.log('\n===== ORG MEMBERS =====');
      members.forEach(member => {
        console.log(`ID: ${member.id}, Org ID: ${member.org_id}, User ID: ${member.user_id}, Role: ${member.role}`);
      });
    }

    // Check if the get_invoice_stats function exists
    try {
      const { data: funcResult, error: funcError } = await supabase.rpc('get_invoice_stats', {
        org_id_param: organizations?.[0]?.id
      });

      if (funcError) {
        console.error('\nError calling get_invoice_stats function:', funcError);
        console.log('You need to run this SQL in the Supabase SQL Editor:');
        console.log(`
CREATE OR REPLACE FUNCTION get_invoice_stats(org_id_param UUID)
RETURNS TABLE (
  total_invoices INT,
  total_draft INT,
  total_sent INT,
  total_paid INT,
  total_overdue INT,
  total_amount_cents BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(id)::INT AS total_invoices,
    COUNT(id) FILTER (WHERE status = 'draft')::INT AS total_draft,
    COUNT(id) FILTER (WHERE status = 'sent')::INT AS total_sent,
    COUNT(id) FILTER (WHERE status = 'paid')::INT AS total_paid,
    COUNT(id) FILTER (WHERE status = 'overdue')::INT AS total_overdue,
    COALESCE(SUM(amount_cents), 0)::BIGINT AS total_amount_cents
  FROM
    invoices
  WHERE
    org_id = org_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
        `);
      } else {
        console.log('\nget_invoice_stats function exists and returned:', funcResult);
      }
    } catch (error) {
      console.error('\nError checking get_invoice_stats function:', error);
    }

  } catch (error) {
    console.error('Error checking database:', error);
  }
}

checkDatabase();