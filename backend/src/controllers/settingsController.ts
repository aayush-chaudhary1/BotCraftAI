// Settings controller
// Handles HTTP requests for user settings

import { Response, NextFunction } from 'express';
import { AuthRequest, UpdateSettingsInput } from '../types';
import { SettingsService } from '../services/settingsService';
import { sendSuccess, sendError } from '../utils/response';

export class SettingsController {
  /**
   * GET /api/settings
   * Get user settings
   */
  static async getSettings(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) {
        return sendError(res, 'Not authenticated', 401);
      }

      const settings = await SettingsService.getUserSettings(req.userId);
      sendSuccess(res, settings);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/settings
   * Update user settings
   */
  static async updateSettings(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) {
        return sendError(res, 'Not authenticated', 401);
      }

      const input: UpdateSettingsInput = req.body;
      const settings = await SettingsService.updateSettings(req.userId, input);
      sendSuccess(res, settings, 'Settings updated successfully');
    } catch (error) {
      next(error);
    }
  }
}
