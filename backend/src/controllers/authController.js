import bcrypt from 'bcryptjs';
import { supabase } from '../config/supabase.js';
import { signToken } from '../utils/jwt.js';

export async function register(req, res) {
  const { name, email, password } = req.body;

  const { data: existing } = await supabase
    .from('admins')
    .select('id')
    .eq('email', email)
    .maybeSingle();
  if (existing) {
    return res.status(409).json({ error: 'An admin with this email already exists' });
  }

  const password_hash = await bcrypt.hash(password, 12);
  const { data, error } = await supabase
    .from('admins')
    .insert({ name, email, password_hash })
    .select('id, name, email, created_at')
    .single();

  if (error) return res.status(500).json({ error: error.message });

  const token = signToken({ sub: data.id, email: data.email });
  res.status(201).json({ token, admin: data });
}

export async function login(req, res) {
  const { email, password } = req.body;

  const { data: admin, error } = await supabase
    .from('admins')
    .select('id, name, email, password_hash, created_at')
    .eq('email', email)
    .maybeSingle();

  if (error) return res.status(500).json({ error: error.message });
  if (!admin) return res.status(401).json({ error: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, admin.password_hash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

  const token = signToken({ sub: admin.id, email: admin.email });
  // eslint-disable-next-line no-unused-vars
  const { password_hash, ...safe } = admin;
  res.json({ token, admin: safe });
}

export async function me(req, res) {
  const { data, error } = await supabase
    .from('admins')
    .select('id, name, email, created_at')
    .eq('id', req.admin.id)
    .maybeSingle();
  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Admin not found' });
  res.json({ admin: data });
}
