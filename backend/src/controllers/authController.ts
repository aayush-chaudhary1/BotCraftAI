// Authentication controller: register, verify-email, login, refresh, logout, forgot/reset password

import { Response, NextFunction } from 'express';
import { AuthRequest, SignUpInput, LoginInput, ForgotPasswordInput, ResetPasswordInput } from '../types';
import * as AuthService from '../services/authService';
import { sendSuccess, sendError } from '../utils/response';
import { AppError } from '../utils/errors';
import { config } from '../config/env';

const REFRESH_COOKIE = AuthService.getRefreshTokenCookieName();
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: config.server.nodeEnv === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
};

function setRefreshCookie(res: Response, token: string) {
  res.cookie(REFRESH_COOKIE, token, COOKIE_OPTIONS);
}

function clearRefreshCookie(res: Response) {
  res.clearCookie(REFRESH_COOKIE, { path: '/', httpOnly: true, sameSite: 'lax' });
}

export async function register(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const input: SignUpInput = req.body;
    const result = await AuthService.register(input);
    sendSuccess(res, result, result.message, 201);
  } catch (e) {
    next(e);
  }
}

export async function verifyEmail(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const token = (req.query.token as string) || '';
    const result = await AuthService.verifyEmail(token);
    sendSuccess(res, result, result.message);
  } catch (e) {
    next(e);
  }
}

export async function login(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const input: LoginInput = req.body;
    const result = await AuthService.login(input, (token) => setRefreshCookie(res, token));
    sendSuccess(res, result, 'Login successful');
  } catch (e) {
    next(e);
  }
}

export async function refresh(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.[REFRESH_COOKIE];
    const result = await AuthService.refresh(
      token,
      (t) => setRefreshCookie(res, t),
      () => clearRefreshCookie(res)
    );
    if (!result) {
      return sendError(res, 'Invalid or expired refresh token', 401);
    }
    sendSuccess(res, result, 'Token refreshed');
  } catch (e) {
    next(e);
  }
}

export async function logout(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.[REFRESH_COOKIE];
    await AuthService.logout(token, () => clearRefreshCookie(res));
    sendSuccess(res, null, 'Logged out');
  } catch (e) {
    next(e);
  }
}

export async function forgotPassword(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const input: ForgotPasswordInput = req.body;
    const result = await AuthService.forgotPassword(input);
    sendSuccess(res, result, result.message);
  } catch (e) {
    next(e);
  }
}

export async function resetPassword(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const input: ResetPasswordInput = req.body;
    const result = await AuthService.resetPassword(input);
    sendSuccess(res, result, result.message);
  } catch (e) {
    next(e);
  }
}

export async function getMe(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.userId) throw new AppError('Not authenticated', 401);
    const user = await AuthService.getUserById(req.userId);
    sendSuccess(res, user);
  } catch (e) {
    next(e);
  }
}
