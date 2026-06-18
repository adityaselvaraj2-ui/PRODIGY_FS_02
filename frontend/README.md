# Frontend — prodigy_fs_02

React + Vite + Tailwind dashboard, Solo Leveling dark/cyan theme.

## Setup
```bash
cp .env.example .env
# Set VITE_API_URL to your backend URL (no trailing slash)
npm install
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

## Deploy (Vercel)
- Framework preset: Vite
- Build command: `npm run build`
- Output: `dist`
- Env var: `VITE_API_URL=https://<your-backend>`

Make sure the backend's `ALLOWED_ORIGINS` contains your Vercel URL exactly.
