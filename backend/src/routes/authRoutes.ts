// Authentication routes: register, verify-email, login, refresh, logout, forgot/reset password

import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as AuthController from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import {
  validate,
  signUpValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
} from '../middleware/validator';

const router = Router();

// Rate limit auth endpoints: 100 requests per hour per IP
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100,
  message: { success: false, error: 'Too many requests. Try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.use(authLimiter);

router.post('/register', validate(signUpValidation), AuthController.register);
router.post('/signup', validate(signUpValidation), AuthController.register);
router.get('/verify-email', AuthController.verifyEmail);
router.post('/login', validate(loginValidation), AuthController.login);
router.post('/refresh', AuthController.refresh);
router.post('/logout', AuthController.logout);
router.post('/forgot-password', validate(forgotPasswordValidation), AuthController.forgotPassword);
router.post('/reset-password', validate(resetPasswordValidation), AuthController.resetPassword);

router.get('/me', authenticate, AuthController.getMe);

export default router;
