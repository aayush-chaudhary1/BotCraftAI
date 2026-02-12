import { Router } from 'express';
import { RagClient } from '../services/ragClient';
import { config } from '../config/env';

const router = Router();

/**
 * GET /api/rag/health
 * Check health of RAG service + valid connectivity from backend
 */
router.get('/health', async (req, res) => {
    try {
        const ragHealth = await RagClient.health();

        res.json({
            ok: true,
            timestamp: new Date().toISOString(),
            ragUrl: config.rag.url,
            rag: ragHealth,
        });
    } catch (error) {
        res.status(503).json({
            ok: false,
            timestamp: new Date().toISOString(),
            ragUrl: config.rag.url,
            error: 'RAG service unreachable or error',
            details: error instanceof Error ? error.message : String(error),
        });
    }
});

// Future routes for upload/query will go here or in specific controllers

export default router;
