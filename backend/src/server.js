import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env.js';
import authRoutes from './routes/auth.js';
import employeeRoutes from './routes/employees.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(helmet());
app.use(express.json({ limit: '100kb' }));
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));

app.use(
  cors({
    origin(origin, cb) {
      // Allow same-origin tools (curl, server-to-server) with no Origin header.
      if (!origin) return cb(null, true);
      const clean = origin.replace(/\/$/, '');
      if (env.allowedOrigins.includes(clean)) return cb(null, true);
      return cb(new Error(`CORS: origin "${origin}" is not allowed`));
    },
    credentials: false,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'prodigy_fs_02', uptime: process.uptime() });
});

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`[prodigy_fs_02] API running on http://localhost:${env.port}`);
  console.log(`[prodigy_fs_02] Allowed origins: ${env.allowedOrigins.join(', ')}`);
});
