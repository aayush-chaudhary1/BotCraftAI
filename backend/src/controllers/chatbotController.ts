// Chatbot controller
// Handles HTTP requests for chatbot CRUD operations

import { Response, NextFunction } from 'express';
import { AuthRequest, CreateChatbotInput, UpdateChatbotInput } from '../types';
import { ChatbotService } from '../services/chatbotService';
import { sendSuccess, sendError } from '../utils/response';

export class ChatbotController {
  /**
   * POST /api/chatbots
   * Create a new chatbot
   */
  static async createChatbot(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) {
        return sendError(res, 'Not authenticated', 401);
      }

      const input: CreateChatbotInput = req.body;
      const chatbot = await ChatbotService.createChatbot(req.userId, input);
      sendSuccess(res, chatbot, 'Chatbot created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/chatbots
   * Get all chatbots for the authenticated user
   */
  static async getChatbots(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) {
        return sendError(res, 'Not authenticated', 401);
      }

      const chatbots = await ChatbotService.getUserChatbots(req.userId);
      sendSuccess(res, chatbots);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/chatbots/:id
   * Get a single chatbot by ID
   */
  static async getChatbot(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) {
        return sendError(res, 'Not authenticated', 401);
      }

      const { id } = req.params;
      const chatbot = await ChatbotService.getChatbotById(id, req.userId);
      sendSuccess(res, chatbot);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/chatbots/:id
   * Update a chatbot
   */
  static async updateChatbot(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) {
        return sendError(res, 'Not authenticated', 401);
      }

      const { id } = req.params;
      const input: UpdateChatbotInput = req.body;
      const chatbot = await ChatbotService.updateChatbot(id, req.userId, input);
      sendSuccess(res, chatbot, 'Chatbot updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/chatbots/:id
   * Delete a chatbot
   */
  static async deleteChatbot(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) {
        return sendError(res, 'Not authenticated', 401);
      }

      const { id } = req.params;
      await ChatbotService.deleteChatbot(id, req.userId);
      sendSuccess(res, null, 'Chatbot deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}
