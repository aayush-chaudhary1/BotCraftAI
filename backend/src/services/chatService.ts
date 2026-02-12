// Chat service
// Handles chat sessions and messages
// Note: AI/RAG integration will be added here in the future

import { prisma } from '../config/database';
import { ChatInput, ChatResponse } from '../types';
import { NotFoundError, AuthorizationError } from '../utils/errors';
import { RagClient } from './ragClient';

export class ChatService {
  /**
   * Process a chat message and return response
   * Currently returns a placeholder response
   * Future: This will integrate with RAG/vector DB to generate AI responses
   */
  static async processMessage(
    chatbotId: string,
    userId: string,
    input: ChatInput
  ): Promise<ChatResponse> {
    // Verify chatbot ownership
    const chatbot = await prisma.chatbot.findUnique({
      where: { id: chatbotId },
    });

    if (!chatbot) {
      throw new NotFoundError('Chatbot');
    }

    if (chatbot.userId !== userId) {
      throw new AuthorizationError('You do not have access to this chatbot');
    }

    // Get or create session
    let sessionId = input.sessionId;
    if (!sessionId) {
      const session = await prisma.chatSession.create({
        data: {
          chatbotId,
          userId,
        },
      });
      sessionId = session.id;
    } else {
      // Verify session belongs to user and chatbot
      const session = await prisma.chatSession.findUnique({
        where: { id: sessionId },
      });

      if (!session) {
        throw new NotFoundError('Chat session');
      }

      if (session.userId !== userId || session.chatbotId !== chatbotId) {
        throw new AuthorizationError('Invalid chat session');
      }
    }

    // Save user message
    await prisma.message.create({
      data: {
        sessionId,
        role: 'user',
        content: input.message,
      },
    });

    // RAG Integration
    let responseContent = '';
    let sources: any[] = [];
    let isError = false;

    try {
      console.log(`[RAG] Querying for bot ${chatbotId}: "${input.message}"`);
      const ragResponse = await RagClient.query(chatbotId, input.message);
      console.log(`[RAG] Response:`, ragResponse);

      responseContent = ragResponse.answer;
      sources = ragResponse.sources || [];
    } catch (error) {
      console.error('[RAG] Query failed:', error);
      responseContent = "I'm sorry, I'm having trouble accessing my knowledge base right now. Please try again later.";
      isError = true;
    }

    // Save assistant response
    await prisma.message.create({
      data: {
        sessionId,
        role: 'assistant',
        content: responseContent,
        metadata: {
          sources,
          isError,
        },
      },
    });

    // Update session timestamp
    await prisma.chatSession.update({
      where: { id: sessionId },
      data: { updatedAt: new Date() },
    });

    return {
      message: responseContent,
      sessionId,
      sources,
    };
  }

  /**
   * Get chat session with messages
   */
  static async getChatSession(sessionId: string, userId: string) {
    const session = await prisma.chatSession.findUnique({
      where: { id: sessionId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
        chatbot: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!session) {
      throw new NotFoundError('Chat session');
    }

    if (session.userId !== userId) {
      throw new AuthorizationError('You do not have access to this chat session');
    }

    return session;
  }

  /**
   * Get all chat sessions for a chatbot
   */
  static async getChatbotSessions(chatbotId: string, userId: string) {
    // Verify chatbot ownership
    await prisma.chatbot.findFirstOrThrow({
      where: {
        id: chatbotId,
        userId,
      },
    });

    return await prisma.chatSession.findMany({
      where: { chatbotId },
      include: {
        _count: {
          select: {
            messages: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }
}
