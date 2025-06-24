// Create the minimum required tables to get the app working
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTables() {
  try {
    console.log('Creating organizations table...');

    // First, create the organizations table
    const { error: orgsError } = await supabase.from('organizations').insert({
      name: 'Default Organization'
    }).select();

    if (orgsError) {
      if (orgsError.code === '42P01') {
        console.log('Organizations table does not exist. You need to create the schema first.');
        console.log('Please use the Supabase Dashboard SQL Editor to run the schema.sql file.');
      } else {
        console.error('Error creating organization:', orgsError);
      }
    } else {
      console.log('Successfully created default organization');
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

createTables();