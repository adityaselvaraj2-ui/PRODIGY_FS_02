# Backend — prodigy_fs_02

Express API with Supabase (PostgreSQL) data layer and JWT-based admin auth.

## Setup

1. `cp .env.example .env` and fill in every value.
2. Create a Supabase project at https://app.supabase.com.
3. In the Supabase SQL Editor, run `sql/schema.sql` once.
4. `npm install`
5. `npm run seed` — creates `admin@prodigy.com` / `Admin@123`.
6. `npm run dev`

## Endpoints

| Method | Path                   | Auth | Purpose                          |
| ------ | ---------------------- | ---- | -------------------------------- |
| POST   | /api/auth/register     | —    | Create new admin                 |
| POST   | /api/auth/login        | —    | Login, returns `{ token, admin }`|
| GET    | /api/auth/me           | JWT  | Current admin                    |
| GET    | /api/employees         | JWT  | List own employees (`?q`, `?department`) |
| POST   | /api/employees         | JWT  | Create employee                  |
| GET    | /api/employees/:id     | JWT  | Get one employee                 |
| PUT    | /api/employees/:id     | JWT  | Update employee                  |
| DELETE | /api/employees/:id     | JWT  | Delete employee                  |
| GET    | /api/health            | —    | Health check (used by frontend)  |

Each admin can only see/edit employees they created (`created_by = admin.id`).
