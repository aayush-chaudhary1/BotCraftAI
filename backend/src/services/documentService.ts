// Document service
// Handles document uploads and metadata management
// Note: Actual file processing and embeddings will be added when RAG is implemented

import { prisma } from '../config/database';
import { NotFoundError, AuthorizationError } from '../utils/errors';
import { DocumentMetadata } from '../types';
import path from 'path';
import fs from 'fs/promises';

export class DocumentService {
  /**
   * Create document record in database
   */
  static async createDocument(
    chatbotId: string,
    userId: string,
    fileInfo: {
      filename: string;
      originalName: string;
      filePath: string;
      fileSize: number;
      mimeType: string;
      metadata?: DocumentMetadata;
    }
  ) {
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

    return await prisma.document.create({
      data: {
        chatbotId,
        filename: fileInfo.filename,
        originalName: fileInfo.originalName,
        filePath: fileInfo.filePath,
        fileSize: fileInfo.fileSize,
        mimeType: fileInfo.mimeType,
        metadata: fileInfo.metadata || {},
      },
    });
  }

  /**
   * Get all documents for a chatbot
   */
  static async getChatbotDocuments(chatbotId: string, userId: string) {
    // Verify chatbot ownership
    await prisma.chatbot.findFirstOrThrow({
      where: {
        id: chatbotId,
        userId,
      },
    });

    return await prisma.document.findMany({
      where: { chatbotId },
      orderBy: { uploadedAt: 'desc' },
    });
  }

  /**
   * Get a single document by ID
   */
  static async getDocumentById(documentId: string, userId: string) {
    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: {
        chatbot: true,
      },
    });

    if (!document) {
      throw new NotFoundError('Document');
    }

    // Verify ownership through chatbot
    if (document.chatbot.userId !== userId) {
      throw new AuthorizationError('You do not have access to this document');
    }

    return document;
  }

  /**
   * Delete a document
   */
  static async deleteDocument(documentId: string, userId: string) {
    const document = await this.getDocumentById(documentId, userId);

    // Delete file from filesystem
    try {
      await fs.unlink(document.filePath);
    } catch (error) {
      // Log but don't fail if file doesn't exist
      console.error(`Failed to delete file: ${document.filePath}`, error);
    }

    // Delete database record
    await prisma.document.delete({
      where: { id: documentId },
    });

    return { success: true };
  }

  /**
   * Generate unique filename
   */
  static generateFilename(originalName: string): string {
    const ext = path.extname(originalName);
    const baseName = path.basename(originalName, ext);
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9);
    return `${baseName}_${timestamp}_${random}${ext}`;
  }
}
