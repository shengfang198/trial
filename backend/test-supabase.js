/* eslint-env node */
/* global process */
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function testSupabase() {
  console.log('Testing Supabase connection...');

  try {
    // Test basic connection
    const { data, error } = await supabase.from('profiles').select('*').limit(1);
    if (error) throw error;
    console.log('✅ Supabase connected successfully!');
    console.log('Sample data from profiles:', data);

    // Test subscribers table
    const { data: subscribers, error: subError } = await supabase.from('subscribers').select('*').limit(1);
    if (subError) {
      console.log('⚠️  Subscribers table may not exist or is empty:', subError.message);
    } else {
      console.log('✅ Subscribers table accessible:', subscribers);
    }

    // Test inserting a sample email
    const testEmail = 'sample@example.com';
    console.log(`\nTesting subscription insert with email: ${testEmail}`);
    const { data: insertData, error: insertError } = await supabase
      .from('subscribers')
      .insert([{ email: testEmail }]);

    if (insertError) {
      console.log('⚠️  Insert failed (may be due to duplicate or RLS):', insertError.message);
    } else {
      console.log('✅ Sample email inserted successfully:', insertData);
    }

  } catch (err) {
    console.error('❌ Supabase connection failed:', err.message);
  }
}

testSupabase();
