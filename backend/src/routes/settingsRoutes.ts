// Settings routes

import { Router } from 'express';
import { SettingsController } from '../controllers/settingsController';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', SettingsController.getSettings);
router.patch('/', SettingsController.updateSettings);

export default router;
