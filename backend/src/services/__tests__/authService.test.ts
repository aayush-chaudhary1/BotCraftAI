/**
 * Unit tests for auth service.
 * Prisma and email are mocked.
 */

import { ConflictError } from '../../utils/errors';

const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  refreshToken: { create: jest.fn(), delete: jest.fn(), deleteMany: jest.fn(), findUnique: jest.fn() },
  settings: { create: jest.fn() },
};

jest.mock('../../config/database', () => ({ prisma: mockPrisma }));
jest.mock('../emailService', () => ({ sendEmail: jest.fn().mockResolvedValue(true), getVerificationEmailHtml: () => '<p>Verify</p>' }));
jest.mock('../tokenService', () => ({
  generateEmailVerificationToken: () => 'mock-verification-token',
  verifyEmailVerificationToken: jest.fn(),
  generatePasswordResetToken: () => 'mock-reset-token',
  verifyPasswordResetToken: jest.fn(),
  generateAccessToken: () => 'mock-access-token',
  generateRefreshToken: () => 'mock-refresh-token',
  getRefreshTokenId: () => 'mock-token-id',
  hashRefreshToken: jest.fn().mockResolvedValue('hashed'),
  compareRefreshToken: jest.fn().mockResolvedValue(true),
}));

import * as AuthService from '../authService';

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('throws ConflictError when email already exists', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'existing' });

      await expect(
        AuthService.register({ email: 'existing@example.com', password: 'Password123' })
      ).rejects.toThrow(ConflictError);
    });

    it('creates user verified and returns message', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({
        id: 'user-1',
        email: 'new@example.com',
        name: 'New User',
      });
      mockPrisma.user.update.mockResolvedValue({});
      mockPrisma.settings.create.mockResolvedValue({});

      const result = await AuthService.register({
        email: 'new@example.com',
        password: 'Password123',
        name: 'New User',
      });

      expect(result.user.email).toBe('new@example.com');
      expect(result.message).toContain('log in');
      expect(mockPrisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            email: 'new@example.com',
            isEmailVerified: true,
          }),
        })
      );
    });
  });

  describe('verifyEmail', () => {
    it('returns success false for missing token', async () => {
      const result = await AuthService.verifyEmail('');
      expect(result.success).toBe(false);
    });
  });
});
