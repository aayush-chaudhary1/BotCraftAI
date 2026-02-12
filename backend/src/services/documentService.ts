// Document service
// Handles document uploads and metadata management
// Note: Actual file processing and embeddings will be added when RAG is implemented

import { prisma } from '../config/database';
import { NotFoundError, AuthorizationError } from '../utils/errors';
import { DocumentMetadata } from '../types';
import path from 'path';
import fs from 'fs/promises';
import { RagClient } from './ragClient';

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

    // Create initial document record with processing status
    const document = await prisma.document.create({
      data: {
        chatbotId,
        filename: fileInfo.filename,
        originalName: fileInfo.originalName,
        filePath: fileInfo.filePath,
        fileSize: fileInfo.fileSize,
        mimeType: fileInfo.mimeType,
        metadata: {
          ...fileInfo.metadata,
          ingestionStatus: 'processing',
        },
      },
    });

    // Trigger RAG ingestion asynchronously
    // We don't await this to keep the API response fast, but for reliability we might
    // consider a job queue. For now, we do it in background.
    (async () => {
      try {
        console.log(`[RAG] Starting ingestion for doc ${document.id} in bot ${chatbotId}`);
        const result = await RagClient.uploadDocument(
          chatbotId,
          document.id,
          fileInfo.filePath,
          fileInfo.originalName
        );
        console.log(`[RAG] Ingestion success for doc ${document.id}:`, result);

        await prisma.document.update({
          where: { id: document.id },
          data: {
            metadata: {
              ...document.metadata as object,
              ingestionStatus: 'ready',
              chunkCount: result.chunkCount || 0,
              processedAt: new Date().toISOString(),
            }
          }
        });
      } catch (error) {
        console.error(`[RAG] Ingestion failed for doc ${document.id}:`, error);
        await prisma.document.update({
          where: { id: document.id },
          data: {
            metadata: {
              ...document.metadata as object,
              ingestionStatus: 'failed',
              error: (error as Error).message,
              failedAt: new Date().toISOString(),
            }
          }
        });
      }
    })();

    return document;
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
    const document = await DocumentService.getDocumentById(documentId, userId);

    // Delete file from filesystem
    try {
      await fs.unlink(document.filePath);
    } catch (error) {
      console.error(`Failed to delete file: ${document.filePath}`, error);
    }

    // Delete from RAG (Best effort)
    try {
      await RagClient.deleteDocument(document.chatbotId, documentId);
    } catch (error) {
      console.error(`[RAG] Failed to delete document ${documentId}:`, error);
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
