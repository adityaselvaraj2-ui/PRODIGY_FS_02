# prodigy_fs_02

Full-stack Employee Management System with a Solo Leveling-inspired UI.

- **/backend** — Node.js + Express + Supabase (PostgreSQL) + JWT auth
- **/frontend** — React + Vite + Tailwind CSS

> Note: this repository lives inside a Lovable workspace for authoring, but
> the two apps are designed to be cloned, run, and deployed independently
> (backend on Render / Railway / Fly, frontend on Vercel / Netlify).

## Local setup

```bash
# 1. Clone
git clone https://github.com/<you>/prodigy_fs_02.git
cd prodigy_fs_02

# 2. Backend
cd backend
cp .env.example .env          # fill in your values
npm install
# Open Supabase SQL Editor and run sql/schema.sql
npm run seed                  # seeds admin@prodigy.com / Admin@123
npm run dev                   # http://localhost:5000

# 3. Frontend (new terminal)
cd ../frontend
cp .env.example .env          # set VITE_API_URL=http://localhost:5000
npm install
npm run dev                   # http://localhost:5173
```

## Publishing to GitHub

```bash
cd prodigy_fs_02
git init
git add .
git commit -m "feat: initial full-stack scaffold"
git branch -M main
git remote add origin https://github.com/<you>/prodigy_fs_02.git
git push -u origin main
```

## Deployment notes

- **Backend**: set `ALLOWED_ORIGINS` to the exact deployed frontend URL
  (e.g. `https://prodigy-fs-02.vercel.app`) — no trailing slash, no wildcards.
- **Frontend**: set `VITE_API_URL` to the deployed backend URL — no trailing slash.
- Never commit `.env`. Only `.env.example` is tracked.

## Default credentials (after seeding)

```
email:    admin@prodigy.com
password: Admin@123
```

Change them in production.
