// Document routes

import { Router } from 'express';
import { DocumentController, upload } from '../controllers/documentController';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Upload document for a chatbot
router.post('/chatbots/:chatbotId/documents', upload.single('file'), DocumentController.uploadDocument);

// Get all documents for a chatbot
router.get('/chatbots/:chatbotId/documents', DocumentController.getDocuments);

// Get single document
router.get('/documents/:id', DocumentController.getDocument);

// Delete document
router.delete('/documents/:id', DocumentController.deleteDocument);

export default router;
