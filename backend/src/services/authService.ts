// Authentication service: register, verify email, login (access + refresh), refresh, logout, forgot/reset password

import bcrypt from 'bcryptjs';
import { prisma } from '../config/database';
import {
  SignUpInput,
  LoginInput,
  AuthResponse,
  ForgotPasswordInput,
  ResetPasswordInput,
} from '../types';
import { ConflictError, AuthenticationError } from '../utils/errors';
import { config } from '../config/env';
import { sendEmail, getPasswordResetEmailHtml } from './emailService';
import {
  generatePasswordResetToken,
  verifyPasswordResetToken,
  generateAccessToken,
  generateRefreshToken,
  getRefreshTokenId,
  hashRefreshToken,
  compareRefreshToken,
} from './tokenService';

const REFRESH_TOKEN_COOKIE = 'refreshToken';
const BCRYPT_ROUNDS = 12;

export function getRefreshTokenCookieName() {
  return REFRESH_TOKEN_COOKIE;
}

/**
 * Register: create user and allow immediate login (no 2FA, no email-verified gate).
 * Note: password reset emails are still supported.
 */
export async function register(input: SignUpInput): Promise<{ user: { id: string; email: string; name?: string }; message: string }> {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) throw new ConflictError('User with this email already exists');

  const hashedPassword = await bcrypt.hash(input.password, BCRYPT_ROUNDS);
  const user = await prisma.user.create({
    data: {
      email: input.email,
      password: hashedPassword,
      name: input.name,
      // Allow login immediately after signup
      isEmailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpires: null,
    },
    select: { id: true, email: true, name: true },
  });

  await prisma.settings.create({ data: { userId: user.id } });

  return {
    user,
    message: 'Registration successful. You can now log in.',
  };
}

/**
 * Verify email: legacy endpoint (kept for compatibility).
 * If you later re-enable email verification, restore token validation here.
 */
export async function verifyEmail(token: string): Promise<{ success: boolean; message: string }> {
  if (!token) return { success: false, message: 'Missing token.' };
  return { success: true, message: 'Email verification is currently not required. You can log in.' };
}

/**
 * Login: email + password only (no email-verified requirement).
 */
export async function login(
  input: LoginInput,
  setRefreshCookie: (token: string) => void
): Promise<AuthResponse> {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
    select: { id: true, email: true, name: true, password: true, isEmailVerified: true },
  });

  if (!user) throw new AuthenticationError('Invalid email or password');

  const valid = await bcrypt.compare(input.password, user.password);
  if (!valid) throw new AuthenticationError('Invalid email or password');

  const accessToken = generateAccessToken(user.id, user.email);
  const refreshToken = generateRefreshToken();
  const tokenId = getRefreshTokenId(refreshToken);
  const tokenHash = await hashRefreshToken(refreshToken);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await prisma.refreshToken.create({
    data: { userId: user.id, tokenId, tokenHash, expiresAt },
  });

  setRefreshCookie(refreshToken);

  return {
    token: accessToken,
    user: { id: user.id, email: user.email, name: user.name ?? undefined },
  };
}

/**
 * Refresh: validate refresh cookie, rotate token, issue new access + refresh cookie
 */
export async function refresh(
  refreshTokenFromCookie: string | undefined,
  setRefreshCookie: (token: string) => void,
  clearRefreshCookie: () => void
): Promise<AuthResponse | null> {
  if (!refreshTokenFromCookie) return null;

  const tokenId = getRefreshTokenId(refreshTokenFromCookie);
  const stored = await prisma.refreshToken.findUnique({
    where: { tokenId },
    include: { user: { select: { id: true, email: true, name: true } } },
  });

  if (!stored || stored.expiresAt < new Date()) {
    if (stored) await prisma.refreshToken.delete({ where: { id: stored.id } }).catch(() => {});
    clearRefreshCookie();
    return null;
  }

  const valid = await compareRefreshToken(refreshTokenFromCookie, stored.tokenHash);
  if (!valid) {
    await prisma.refreshToken.delete({ where: { id: stored.id } }).catch(() => {});
    clearRefreshCookie();
    return null;
  }

  await prisma.refreshToken.delete({ where: { id: stored.id } });
  const newRefreshToken = generateRefreshToken();
  const newTokenId = getRefreshTokenId(newRefreshToken);
  const newHash = await hashRefreshToken(newRefreshToken);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await prisma.refreshToken.create({
    data: { userId: stored.userId, tokenId: newTokenId, tokenHash: newHash, expiresAt },
  });

  setRefreshCookie(newRefreshToken);

  const accessToken = generateAccessToken(stored.user.id, stored.user.email);
  return {
    token: accessToken,
    user: {
      id: stored.user.id,
      email: stored.user.email,
      name: stored.user.name ?? undefined,
    },
  };
}

/**
 * Logout: invalidate refresh token, clear cookie
 */
export async function logout(refreshTokenFromCookie: string | undefined, clearRefreshCookie: () => void): Promise<void> {
  clearRefreshCookie();
  if (!refreshTokenFromCookie) return;
  const tokenId = getRefreshTokenId(refreshTokenFromCookie);
  await prisma.refreshToken.deleteMany({ where: { tokenId } });
}

/**
 * Forgot password: generate reset token, send email
 */
export async function forgotPassword(input: ForgotPasswordInput): Promise<{ message: string }> {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
    select: { id: true, email: true, name: true },
  });
  if (!user) {
    return { message: 'If an account exists with this email, you will receive a password reset link.' };
  }

  const resetToken = generatePasswordResetToken(user.id, user.email);
  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordResetToken: resetToken,
      passwordResetExpires: new Date(Date.now() + 60 * 60 * 1000),
    },
  });

  const frontendUrl = config.cors.frontendUrl.replace(/\/$/, '');
  const resetLink = `${frontendUrl}/auth/reset-password?token=${encodeURIComponent(resetToken)}`;
  await sendEmail({
    to: user.email,
    subject: 'Reset your password – BotCraft AI',
    html: getPasswordResetEmailHtml(resetLink, user.name ?? undefined),
  });

  return { message: 'If an account exists with this email, you will receive a password reset link.' };
}

/**
 * Reset password: verify token, update password, invalidate all refresh tokens for user
 */
export async function resetPassword(input: ResetPasswordInput): Promise<{ success: boolean; message: string }> {
  const payload = verifyPasswordResetToken(input.token);
  if (!payload) return { success: false, message: 'Invalid or expired reset link.' };

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, passwordResetToken: true, passwordResetExpires: true },
  });
  if (!user || user.passwordResetToken !== input.token || !user.passwordResetExpires || user.passwordResetExpires < new Date()) {
    return { success: false, message: 'Invalid or expired reset link.' };
  }

  const hashedPassword = await bcrypt.hash(input.password, BCRYPT_ROUNDS);
  await prisma.user.update({
    where: { id: payload.userId },
    data: {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetExpires: null,
    },
  });
  await prisma.refreshToken.deleteMany({ where: { userId: payload.userId } });

  return { success: true, message: 'Password reset successfully. You can now log in.' };
}

/**
 * Get user by ID (for /me)
 */
export async function getUserById(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, isEmailVerified: true, createdAt: true },
  });
  if (!user) throw new AuthenticationError('User not found');
  return user;
}
