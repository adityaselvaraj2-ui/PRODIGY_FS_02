import { supabase } from '../config/supabase.js';

const SAFE_COLS = 'id, first_name, last_name, email, phone, department, position, salary, hire_date, created_by, created_at';

export async function listEmployees(req, res) {
  const { q, department } = req.query;
  let query = supabase
    .from('employees')
    .select(SAFE_COLS)
    .eq('created_by', req.admin.id)
    .order('created_at', { ascending: false });

  if (department) query = query.eq('department', department);
  if (q) {
    const term = `%${q}%`;
    query = query.or(
      `first_name.ilike.${term},last_name.ilike.${term},email.ilike.${term},position.ilike.${term}`
    );
  }

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json({ employees: data });
}

export async function getEmployee(req, res) {
  const { data, error } = await supabase
    .from('employees')
    .select(SAFE_COLS)
    .eq('id', req.params.id)
    .eq('created_by', req.admin.id)
    .maybeSingle();
  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Employee not found' });
  res.json({ employee: data });
}

export async function createEmployee(req, res) {
  const payload = { ...req.body, created_by: req.admin.id };
  if (payload.phone === '') payload.phone = null;

  const { data, error } = await supabase
    .from('employees')
    .insert(payload)
    .select(SAFE_COLS)
    .single();

  if (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'An employee with this email already exists' });
    }
    return res.status(500).json({ error: error.message });
  }
  res.status(201).json({ employee: data });
}

export async function updateEmployee(req, res) {
  const updates = { ...req.body };
  delete updates.created_by;
  if (updates.phone === '') updates.phone = null;

  const { data: existing } = await supabase
    .from('employees')
    .select('id')
    .eq('id', req.params.id)
    .eq('created_by', req.admin.id)
    .maybeSingle();
  if (!existing) return res.status(404).json({ error: 'Employee not found' });

  const { data, error } = await supabase
    .from('employees')
    .update(updates)
    .eq('id', req.params.id)
    .select(SAFE_COLS)
    .single();

  if (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'An employee with this email already exists' });
    }
    return res.status(500).json({ error: error.message });
  }
  res.json({ employee: data });
}

export async function deleteEmployee(req, res) {
  const { data: existing } = await supabase
    .from('employees')
    .select('id')
    .eq('id', req.params.id)
    .eq('created_by', req.admin.id)
    .maybeSingle();
  if (!existing) return res.status(404).json({ error: 'Employee not found' });

  const { error } = await supabase
    .from('employees')
    .delete()
    .eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).end();
}
