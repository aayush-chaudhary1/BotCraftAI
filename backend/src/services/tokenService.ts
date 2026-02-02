// Token generation and verification: JWT access/refresh, email verification, password reset

import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from '../config/env';

const VERIFICATION_TTL = '24h';
const RESET_TTL = '1h';

export function generateEmailVerificationToken(userId: string, email: string): string {
  return jwt.sign(
    { userId, email, purpose: 'email_verification' },
    config.jwt.accessSecret,
    { expiresIn: VERIFICATION_TTL }
  );
}

export function verifyEmailVerificationToken(token: string): { userId: string; email: string } | null {
  try {
    const decoded = jwt.verify(token, config.jwt.accessSecret) as {
      userId: string;
      email: string;
      purpose?: string;
    };
    if (decoded.purpose !== 'email_verification') return null;
    return { userId: decoded.userId, email: decoded.email };
  } catch {
    return null;
  }
}

export function generatePasswordResetToken(userId: string, email: string): string {
  return jwt.sign(
    { userId, email, purpose: 'password_reset' },
    config.jwt.accessSecret,
    { expiresIn: RESET_TTL }
  );
}

export function verifyPasswordResetToken(token: string): { userId: string; email: string } | null {
  try {
    const decoded = jwt.verify(token, config.jwt.accessSecret) as {
      userId: string;
      email: string;
      purpose?: string;
    };
    if (decoded.purpose !== 'password_reset') return null;
    return { userId: decoded.userId, email: decoded.email };
  } catch {
    return null;
  }
}

export function generateAccessToken(userId: string, email: string): string {
  return jwt.sign(
    { userId, email },
    config.jwt.accessSecret,
    { expiresIn: config.jwt.accessExpiresIn }
  );
}

export function generateRefreshToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/** Deterministic id for DB lookup */
export function getRefreshTokenId(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export async function hashRefreshToken(token: string): Promise<string> {
  return bcrypt.hash(token, 10);
}

export async function compareRefreshToken(token: string, hash: string): Promise<boolean> {
  return bcrypt.compare(token, hash);
}
