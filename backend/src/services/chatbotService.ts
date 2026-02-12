// Chatbot service
// Handles CRUD operations for chatbots

import { prisma } from '../config/database';
import { CreateChatbotInput, UpdateChatbotInput } from '../types';
import { NotFoundError, AuthorizationError } from '../utils/errors';

export class ChatbotService {
  /**
   * Create a new chatbot
   */
  static async createChatbot(
    userId: string,
    input: CreateChatbotInput
  ) {
    return await prisma.chatbot.create({
      data: {
        userId,
        name: input.name,
        description: input.description,
        config: input.config || {},
      },
      include: {
        _count: {
          select: {
            documents: true,
            chatSessions: true,
          },
        },
      },
    });
  }

  /**
   * Get all chatbots for a user
   */
  static async getUserChatbots(userId: string) {
    const chatbots = await prisma.chatbot.findMany({
      where: { userId },
      include: {
        _count: {
          select: {
            documents: true,
            chatSessions: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return chatbots.map(bot => ({
      ...bot,
      documents: bot._count.documents,
      conversations: bot._count.chatSessions,
    }));
  }

  /**
   * Get a single chatbot by ID
   */
  static async getChatbotById(chatbotId: string, userId: string) {
    const chatbot = await prisma.chatbot.findUnique({
      where: { id: chatbotId },
      include: {
        _count: {
          select: {
            documents: true,
            chatSessions: true,
          },
        },
      },
    });

    if (!chatbot) {
      throw new NotFoundError('Chatbot');
    }

    // Verify ownership
    if (chatbot.userId !== userId) {
      throw new AuthorizationError('You do not have access to this chatbot');
    }

    return chatbot;
  }

  /**
   * Update a chatbot
   */
  static async updateChatbot(
    chatbotId: string,
    userId: string,
    input: UpdateChatbotInput
  ) {
    // Verify ownership first
    await this.getChatbotById(chatbotId, userId);

    return await prisma.chatbot.update({
      where: { id: chatbotId },
      data: {
        ...(input.name && { name: input.name }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.config && { config: input.config }),
      },
      include: {
        _count: {
          select: {
            documents: true,
            chatSessions: true,
          },
        },
      },
    });
  }

  /**
   * Delete a chatbot
   */
  static async deleteChatbot(chatbotId: string, userId: string) {
    // Verify ownership first
    await this.getChatbotById(chatbotId, userId);

    await prisma.chatbot.delete({
      where: { id: chatbotId },
    });

    return { success: true };
  }
}
