// Settings service
// Handles user settings management

import { prisma } from '../config/database';
import { UpdateSettingsInput } from '../types';

export class SettingsService {
  /**
   * Get user settings (create default if doesn't exist)
   */
  static async getUserSettings(userId: string) {
    let settings = await prisma.settings.findUnique({
      where: { userId },
    });

    if (!settings) {
      settings = await prisma.settings.create({
        data: { userId },
      });
    }

    return settings;
  }

  /**
   * Update user settings
   */
  static async updateSettings(userId: string, input: UpdateSettingsInput) {
    return await prisma.settings.upsert({
      where: { userId },
      update: {
        ...(input.theme && { theme: input.theme }),
        ...(input.language && { language: input.language }),
        ...(input.notifications !== undefined && { notifications: input.notifications }),
        ...(input.preferences && { preferences: input.preferences }),
      },
      create: {
        userId,
        theme: input.theme || 'light',
        language: input.language || 'en',
        notifications: input.notifications !== undefined ? input.notifications : true,
        preferences: input.preferences || {},
      },
    });
  }
}
