// Chatbot routes

import { Router } from 'express';
import { ChatbotController } from '../controllers/chatbotController';
import { authenticate } from '../middleware/auth';
import { validate, createChatbotValidation, updateChatbotValidation } from '../middleware/validator';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.post('/', validate(createChatbotValidation), ChatbotController.createChatbot);
router.get('/', ChatbotController.getChatbots);
router.get('/:id', ChatbotController.getChatbot);
router.patch('/:id', validate(updateChatbotValidation), ChatbotController.updateChatbot);
router.delete('/:id', ChatbotController.deleteChatbot);

export default router;
