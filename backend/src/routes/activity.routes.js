import { Router } from 'express';
import { listActivity } from '../controllers/activity.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', authMiddleware, listActivity);

export default router;
