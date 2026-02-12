import { config } from '../config/env';
import { logger } from '../utils/logger';
import fs from 'fs/promises';

interface RagHealthResponse {
    status: string;
    service: string;
}

interface RagQueryResponse {
    answer: string;
    sources: Array<{
        documentId: string;
        source: string;
        snippet: string;
        score: number;
        metadata: any;
    }>;
}

export class RagClient {
    private static get baseUrl(): string {
        return config.rag.url;
    }

    private static get timeout(): number {
        return config.rag.timeout;
    }

    /**
     * Check the health of the RAG service
     */
    static async health(): Promise<RagHealthResponse> {
        try {
            console.log(`[RAG] Health check to ${this.baseUrl} with timeout ${this.timeout}ms`);
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.timeout);

            const response = await fetch(`${this.baseUrl}/health`, {
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`RAG service responded with status: ${response.status}`);
            }

            return (await response.json()) as RagHealthResponse;
        } catch (error) {
            logger.error('RAG Health Check Failed:', error);
            throw error;
        }
    }

    /**
     * Upload a single document to RAG
     */
    static async uploadDocument(chatbotId: string, documentId: string, filePath: string, originalName: string): Promise<any> {
        try {
            console.log(`[RAG] Uploading to ${this.baseUrl} with timeout ${this.timeout}ms`);
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.timeout * 2);

            const formData = new FormData();
            const buffer = await fs.readFile(filePath);
            const fileBlob = new Blob([buffer]);

            formData.append('file', fileBlob, originalName);

            const url = `${this.baseUrl}/chatbots/${chatbotId}/upload-documents?documentId=${documentId}`;

            const response = await fetch(url, {
                method: 'POST',
                body: formData,
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`RAG upload failed: ${response.status} ${errorText}`);
            }

            return await response.json();
        } catch (error) {
            logger.error('RAG Upload Failed:', error);
            throw error;
        }
    }

    /**
     * Query the RAG service
     */
    static async query(chatbotId: string, query: string): Promise<RagQueryResponse> {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.timeout);

            const url = `${this.baseUrl}/chatbots/${chatbotId}/query`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`RAG query failed with status: ${response.status}`);
            }

            return (await response.json()) as RagQueryResponse;
        } catch (error) {
            logger.error('RAG Query Failed:', error);
            throw error;
        }
    }

    /**
     * Delete a document from RAG
     */
    static async deleteDocument(chatbotId: string, documentId: string): Promise<void> {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.timeout);

            const url = `${this.baseUrl}/chatbots/${chatbotId}/documents/${documentId}`;

            const response = await fetch(url, {
                method: 'DELETE',
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`RAG delete failed with status: ${response.status}`);
            }
        } catch (error) {
            logger.error('RAG Delete Failed:', error);
            throw error;
        }
    }
}
