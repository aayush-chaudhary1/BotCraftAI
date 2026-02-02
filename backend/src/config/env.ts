// Environment variable validation and configuration

import dotenv from 'dotenv';

dotenv.config();

// Required for app to run
const requiredEnvVars = ['DATABASE_URL', 'PORT'];

// JWT: prefer access/refresh secrets; fallback to single JWT_SECRET for backward compat
const jwtAccessSecret =
  process.env.JWT_ACCESS_TOKEN_SECRET || process.env.JWT_SECRET;
const jwtRefreshSecret =
  process.env.JWT_REFRESH_TOKEN_SECRET || process.env.JWT_SECRET;

if (!jwtAccessSecret || !jwtRefreshSecret) {
  throw new Error(
    'Missing JWT secrets: set JWT_ACCESS_TOKEN_SECRET and JWT_REFRESH_TOKEN_SECRET (or JWT_SECRET for both)'
  );
}

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

export const config = {
  database: {
    url: process.env.DATABASE_URL!,
  },
  jwt: {
    accessSecret: jwtAccessSecret,
    refreshSecret: jwtRefreshSecret,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    // Legacy single secret (used only if access/refresh not set)
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  server: {
    port: parseInt(process.env.PORT || '3001', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
  },
  cors: {
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  },
  email: {
    provider: (process.env.EMAIL_PROVIDER || 'smtp').toLowerCase(),
    apiKey: process.env.EMAIL_API_KEY || '',
    from: process.env.EMAIL_FROM || 'noreply@localhost',
    smtp: {
      host: process.env.SMTP_HOST || 'localhost',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    },
  },
  uploads: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'text/csv',
      'text/markdown',
    ],
  },
} as const;
