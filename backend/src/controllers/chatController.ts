// Chat controller
// Handles HTTP requests for chat operations

import { Response, NextFunction } from 'express';
import { AuthRequest, ChatInput } from '../types';
import { ChatService } from '../services/chatService';
import { sendSuccess, sendError } from '../utils/response';

export class ChatController {
  /**
   * POST /api/chatbots/:chatbotId/chat
   * Send a message to a chatbot
   */
  static async sendMessage(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) {
        return sendError(res, 'Not authenticated', 401);
      }

      const { chatbotId } = req.params;
      const input: ChatInput = req.body;

      const response = await ChatService.processMessage(chatbotId, req.userId, input);
      sendSuccess(res, response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/chatbots/:chatbotId/sessions
   * Get all chat sessions for a chatbot
   */
  static async getSessions(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) {
        return sendError(res, 'Not authenticated', 401);
      }

      const { chatbotId } = req.params;
      const sessions = await ChatService.getChatbotSessions(chatbotId, req.userId);
      sendSuccess(res, sessions);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/sessions/:id
   * Get a chat session with messages
   */
  static async getSession(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) {
        return sendError(res, 'Not authenticated', 401);
      }

      const { id } = req.params;
      const session = await ChatService.getChatSession(id, req.userId);
      sendSuccess(res, session);
    } catch (error) {
      next(error);
    }
  }
}
