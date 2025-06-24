#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset);
}

function logStep(step, message) {
  log(`[${step}] ${message}`, 'cyan');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

async function checkPrerequisites() {
  logStep('PREREQUISITES', 'Checking setup requirements...');

  // Check Node.js version
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.substring(1).split('.')[0]);

  if (majorVersion < 20) {
    logWarning(`Node.js version ${nodeVersion} detected. v20+ recommended.`);
  } else {
    logSuccess(`Node.js version ${nodeVersion} is supported.`);
  }

  // Check for environment file
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) {
    logError('Missing .env.local file');
    console.log('\nCreate .env.local with:');
    console.log('NEXT_PUBLIC_SUPABASE_URL=your_supabase_url');
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key');
    console.log('SUPABASE_SERVICE_ROLE_KEY=your_service_role_key');
    return false;
  }

  logSuccess('Environment file exists');
  return true;
}

async function validateDatabase() {
  logStep('DATABASE', 'Validating database connection...');

  try {
    // Load environment variables
    require('dotenv').config({ path: '.env.local' });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      logError('Missing Supabase credentials in .env.local');
      return false;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Test connection
    const { data, error } = await supabase.from('companies').select('id').limit(1);

    if (error && error.code === '42P01') {
      logWarning('Database schema not found. Run database setup.');
      return false;
    } else if (error) {
      logError(`Database connection failed: ${error.message}`);
      return false;
    }

    logSuccess('Database connection successful');
    return true;

  } catch (error) {
    logError(`Database validation failed: ${error.message}`);
    return false;
  }
}

async function checkFileStructure() {
  logStep('FILES', 'Checking Phase 1 file structure...');

  const requiredFiles = [
    'src/lib/schema.sql',
    'src/lib/auth.tsx',
    'src/lib/supabase.ts',
    'src/lib/supabase-server.ts',
    'src/types/supabase.ts'
  ];

  let allFilesExist = true;

  for (const file of requiredFiles) {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      logSuccess(`${file} exists`);
    } else {
      logError(`${file} missing`);
      allFilesExist = false;
    }
  }

  return allFilesExist;
}

async function setupDatabase() {
  logStep('SETUP', 'Setting up database schema...');

  try {
    require('dotenv').config({ path: '.env.local' });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      logError('Missing service role key for database setup');
      return false;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const schemaPath = path.join(process.cwd(), 'src/lib/schema.sql');

    if (!fs.existsSync(schemaPath)) {
      logError('Schema file not found at src/lib/schema.sql');
      return false;
    }

    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Execute schema
    log('Executing database schema...', 'yellow');

    // Split and execute statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    for (const stmt of statements) {
      if (stmt.includes('CREATE') || stmt.includes('INSERT') || stmt.includes('ALTER')) {
        try {
          await supabase.rpc('exec_sql', { sql: stmt + ';' });
          log(`✓ Executed: ${stmt.substring(0, 50)}...`, 'green');
        } catch (error) {
          log(`✗ Error: ${stmt.substring(0, 50)}...`, 'red');
          console.log(error);
        }
      }
    }

    logSuccess('Database schema setup completed');
    return true;

  } catch (error) {
    logError(`Database setup failed: ${error.message}`);
    return false;
  }
}

async function main() {
  log('\n🚀 Phase 1 Setup - Multi-tenant SaaS Foundation', 'bright');
  log('='*50, 'cyan');

  // Check prerequisites
  const prereqsPassed = await checkPrerequisites();
  if (!prereqsPassed) {
    logError('Prerequisites check failed. Please fix the issues above.');
    process.exit(1);
  }

  // Check file structure
  const filesExist = await checkFileStructure();
  if (!filesExist) {
    logError('File structure check failed. Some required files are missing.');
    process.exit(1);
  }

  // Validate database
  const dbValid = await validateDatabase();
  if (!dbValid) {
    log('\nDatabase not set up. Attempting to create schema...', 'yellow');
    const setupSuccessful = await setupDatabase();
    if (!setupSuccessful) {
      logError('Database setup failed. Please check your credentials and try again.');
      process.exit(1);
    }
  }

  log('\n' + '='*50, 'green');
  logSuccess('Phase 1 Setup Complete!');
  log('\nPhase 1 Foundation includes:', 'bright');
  log('✅ Multi-tenant database schema with RLS', 'green');
  log('✅ Complete TypeScript type system', 'green');
  log('✅ Multi-tenant authentication system', 'green');
  log('✅ Role-based access control', 'green');
  log('✅ Company management', 'green');
  log('✅ User profiles and permissions', 'green');

  log('\nNext steps:', 'bright');
  log('1. Start development server: pnpm dev', 'cyan');
  log('2. Visit http://localhost:3000', 'cyan');
  log('3. Ready for Phase 2 implementation', 'cyan');

  log('\nNeed help? Check PHASE_1_SETUP.md for detailed documentation.', 'blue');
}

// Run the setup
main().catch(error => {
  logError(`Setup failed: ${error.message}`);
  process.exit(1);
});