
import { DocumentService } from './documentService';
import { RagClient } from './ragClient';
import { prisma } from '../config/database';
import fs from 'fs/promises';

// Mock dependencies
jest.mock('../config/database', () => ({
    prisma: {
        document: {
            create: jest.fn(),
            update: jest.fn(),
            findUniqueOrThrow: jest.fn(),
            findUnique: jest.fn(),
            delete: jest.fn(),
        },
        chatbot: {
            findUnique: jest.fn(),
        }
    },
}));

jest.mock('./ragClient', () => ({
    RagClient: {
        uploadDocument: jest.fn(),
        deleteDocument: jest.fn(),
    },
}));

jest.mock('fs/promises', () => ({
    unlink: jest.fn().mockResolvedValue(undefined),
}));

describe('Phase 5 Verification', () => {
    const mockChatbotId = 'bot-123';
    const mockUserId = 'user-123';
    const fileInfo = {
        filename: 'test.pdf',
        originalName: 'Original.pdf',
        filePath: '/tmp/test.pdf',
        fileSize: 1024,
        mimeType: 'application/pdf',
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (prisma.chatbot.findUnique as jest.Mock).mockResolvedValue({ userId: mockUserId });
    });

    describe('createDocument', () => {
        it('should initialize status to processing, call RAG, and update to ready', async () => {
            // Setup mocks
            (prisma.document.create as jest.Mock).mockResolvedValue({
                id: 'doc-1',
                metadata: { ingestionStatus: 'processing' },
                ...fileInfo
            });
            (RagClient.uploadDocument as jest.Mock).mockResolvedValue({ chunkCount: 5 });
            (prisma.document.findUniqueOrThrow as jest.Mock).mockResolvedValue({
                id: 'doc-1',
                metadata: { ingestionStatus: 'ready', chunkCount: 5 }
            });

            // Execute
            await DocumentService.createDocument(mockChatbotId, mockUserId, fileInfo);

            // Verify DB Create
            expect(prisma.document.create).toHaveBeenCalledWith(expect.objectContaining({
                data: expect.objectContaining({
                    metadata: expect.objectContaining({ ingestionStatus: 'processing' })
                })
            }));

            // Verify RAG Call
            expect(RagClient.uploadDocument).toHaveBeenCalledWith(
                mockChatbotId, 'doc-1', fileInfo.filePath, fileInfo.originalName
            );

            // Verify DB Update (Ready)
            expect(prisma.document.update).toHaveBeenCalledWith(expect.objectContaining({
                where: { id: 'doc-1' },
                data: expect.objectContaining({
                    metadata: expect.objectContaining({ ingestionStatus: 'ready', chunkCount: 5 })
                })
            }));
        });

        it('should handle RAG failure and update status to failed', async () => {
            // Setup mocks
            (prisma.document.create as jest.Mock).mockResolvedValue({
                id: 'doc-2',
                metadata: { ingestionStatus: 'processing' },
                ...fileInfo
            });
            (RagClient.uploadDocument as jest.Mock).mockRejectedValue(new Error('RAG Error'));
            (prisma.document.findUniqueOrThrow as jest.Mock).mockResolvedValue({
                id: 'doc-2',
                metadata: { ingestionStatus: 'failed' }
            });

            // Execute
            await DocumentService.createDocument(mockChatbotId, mockUserId, fileInfo);

            // Verify DB Update (Failed)
            expect(prisma.document.update).toHaveBeenCalledWith(expect.objectContaining({
                where: { id: 'doc-2' },
                data: expect.objectContaining({
                    metadata: expect.objectContaining({ ingestionStatus: 'failed', errorMessage: 'RAG Error' })
                })
            }));
        });
    });

    describe('deleteDocument', () => {
        it('should call RagClient.deleteDocument', async () => {
            const docId = 'doc-to-delete';
            (prisma.document.findUnique as jest.Mock).mockResolvedValue({
                id: docId,
                chatbotId: mockChatbotId,
                filePath: '/tmp/test.pdf',
                chatbot: { userId: mockUserId }
            });

            await DocumentService.deleteDocument(docId, mockUserId);

            expect(RagClient.deleteDocument).toHaveBeenCalledWith(mockChatbotId, docId);
            expect(prisma.document.delete).toHaveBeenCalledWith({ where: { id: docId } });
        });
    });
});
