-- prodigy_fs_02 schema
-- Run this once in the Supabase SQL Editor.
-- The backend uses the SERVICE ROLE key and bypasses RLS, so we keep RLS off
-- on these tables. All authorization is enforced in the Express middleware.

create extension if not exists "pgcrypto";

-- ============ admins ============
create table if not exists public.admins (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  email         text not null unique,
  password_hash text not null,
  created_at    timestamptz not null default now()
);

create index if not exists admins_email_idx on public.admins (lower(email));

-- ============ employees ============
create table if not exists public.employees (
  id          uuid primary key default gen_random_uuid(),
  first_name  text not null,
  last_name   text not null,
  email       text not null unique,
  phone       text,
  department  text not null,
  position    text not null,
  salary      numeric(12,2) not null check (salary >= 0),
  hire_date   date not null,
  created_by  uuid not null references public.admins(id) on delete cascade,
  created_at  timestamptz not null default now()
);

create index if not exists employees_created_by_idx on public.employees (created_by);
create index if not exists employees_department_idx on public.employees (department);
create index if not exists employees_email_idx      on public.employees (lower(email));
