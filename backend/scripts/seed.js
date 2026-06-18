import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { supabase } from '../src/config/supabase.js';

const SEED_EMAIL = 'admin@prodigy.com';
const SEED_PASSWORD = 'Admin@123';
const SEED_NAME = 'Prodigy Admin';

async function main() {
  const { data: existing } = await supabase
    .from('admins')
    .select('id, email')
    .eq('email', SEED_EMAIL)
    .maybeSingle();

  if (existing) {
    console.log(`[seed] Admin ${SEED_EMAIL} already exists (id=${existing.id}). Skipping.`);
    return;
  }

  const password_hash = await bcrypt.hash(SEED_PASSWORD, 12);
  const { data, error } = await supabase
    .from('admins')
    .insert({ name: SEED_NAME, email: SEED_EMAIL, password_hash })
    .select('id, email')
    .single();

  if (error) {
    console.error('[seed] Failed:', error.message);
    process.exit(1);
  }
  console.log(`[seed] Created admin ${data.email} (id=${data.id})`);
  console.log(`[seed] Login with password: ${SEED_PASSWORD}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
