// Chat routes

import { Router } from 'express';
import { ChatController } from '../controllers/chatController';
import { authenticate } from '../middleware/auth';
import { validate, chatValidation } from '../middleware/validator';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Send message to chatbot
router.post('/chatbots/:chatbotId/chat', validate(chatValidation), ChatController.sendMessage);

// Get all sessions for a chatbot
router.get('/chatbots/:chatbotId/sessions', ChatController.getSessions);

// Get a single session with messages
router.get('/sessions/:id', ChatController.getSession);

export default router;
