// Document controller
// Handles HTTP requests for document operations

import { Response, NextFunction } from 'express';
import multer from 'multer';
import path from 'path';
import { AuthRequest } from '../types';
import { DocumentService } from '../services/documentService';
import { sendSuccess, sendError } from '../utils/response';
import { config } from '../config/env';
import { ValidationError } from '../utils/errors';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadsDir = path.join(process.cwd(), 'uploads');
    try {
      await import('fs/promises').then((fs) => 
        fs.default.mkdir(uploadsDir, { recursive: true })
      );
      cb(null, uploadsDir);
    } catch (error) {
      cb(error as Error, uploadsDir);
    }
  },
  filename: (req, file, cb) => {
    const uniqueFilename = DocumentService.generateFilename(file.originalname);
    cb(null, uniqueFilename);
  },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (config.uploads.allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ValidationError(`File type ${file.mimetype} is not allowed`));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.uploads.maxFileSize,
  },
});

export class DocumentController {
  /**
   * POST /api/chatbots/:chatbotId/documents
   * Upload a document
   */
  static async uploadDocument(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) {
        return sendError(res, 'Not authenticated', 401);
      }

      if (!req.file) {
        return sendError(res, 'No file uploaded', 400);
      }

      const { chatbotId } = req.params;
      const file = req.file;

      const document = await DocumentService.createDocument(
        chatbotId,
        req.userId,
        {
          filename: file.filename,
          originalName: file.originalname,
          filePath: file.path,
          fileSize: file.size,
          mimeType: file.mimetype,
          // Future: Extract metadata here (page count, word count, etc.)
          metadata: {},
        }
      );

      sendSuccess(res, document, 'Document uploaded successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/chatbots/:chatbotId/documents
   * Get all documents for a chatbot
   */
  static async getDocuments(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) {
        return sendError(res, 'Not authenticated', 401);
      }

      const { chatbotId } = req.params;
      const documents = await DocumentService.getChatbotDocuments(chatbotId, req.userId);
      sendSuccess(res, documents);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/documents/:id
   * Get a single document by ID
   */
  static async getDocument(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) {
        return sendError(res, 'Not authenticated', 401);
      }

      const { id } = req.params;
      const document = await DocumentService.getDocumentById(id, req.userId);
      sendSuccess(res, document);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/documents/:id
   * Delete a document
   */
  static async deleteDocument(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.userId) {
        return sendError(res, 'Not authenticated', 401);
      }

      const { id } = req.params;
      await DocumentService.deleteDocument(id, req.userId);
      sendSuccess(res, null, 'Document deleted successfully');
    } catch (error) {
      next(error);
    }
  }
}
