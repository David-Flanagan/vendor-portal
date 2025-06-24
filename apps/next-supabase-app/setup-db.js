// Load the schema.sql file and execute it on the database
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  try {
    // Load the schema SQL
    const schema = fs.readFileSync('./src/lib/schema.sql', 'utf8');

    console.log('Checking if tables exist...');

    // Try to query the organizations table to see if it exists
    const { data: orgsExists, error: orgsError } = await supabase
      .from('organizations')
      .select('id')
      .limit(1);

    if (orgsError && orgsError.code === '42P01') {
      console.log('Tables do not exist. Creating schema...');

      // Execute the schema SQL
      const { error } = await supabase.rpc('exec_sql', { sql: schema });

      if (error) {
        console.error('Error executing schema SQL:', error);

        console.log('\nAlternative approach: Creating tables one by one...');

        // Split the schema into individual statements and run them
        const statements = schema.split(';')
          .map(stmt => stmt.trim())
          .filter(stmt => stmt.length > 0);

        for (const stmt of statements) {
          const { error: stmtError } = await supabase.rpc('exec_sql', { sql: stmt + ';' });
          if (stmtError) {
            console.error(`Error executing statement: ${stmt}`);
            console.error(stmtError);
          } else {
            console.log(`Successfully executed: ${stmt.substring(0, 50)}...`);
          }
        }
      } else {
        console.log('Schema created successfully!');
      }
    } else {
      console.log('Tables already exist. Schema creation skipped.');
    }

    console.log('Database setup complete.');
  } catch (error) {
    console.error('Error setting up database:', error);
  }
}

setupDatabase();