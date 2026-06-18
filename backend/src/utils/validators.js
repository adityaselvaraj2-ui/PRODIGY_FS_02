import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().toLowerCase().email().max(255),
  password: z.string().min(8).max(128),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(255),
  password: z.string().min(1).max(128),
});

export const employeeSchema = z.object({
  first_name: z.string().trim().min(1).max(60),
  last_name: z.string().trim().min(1).max(60),
  email: z.string().trim().toLowerCase().email().max(255),
  phone: z.string().trim().max(30).optional().nullable().or(z.literal('')),
  department: z.string().trim().min(1).max(60),
  position: z.string().trim().min(1).max(80),
  salary: z.coerce.number().nonnegative().max(1_000_000_000),
  hire_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'hire_date must be YYYY-MM-DD'),
});

export const employeeUpdateSchema = employeeSchema.partial();

export const listQuerySchema = z.object({
  q: z.string().trim().max(120).optional(),
  department: z.string().trim().max(60).optional(),
});
