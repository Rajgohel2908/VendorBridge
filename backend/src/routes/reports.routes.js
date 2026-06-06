import { Router } from 'express';
import { getReports } from '../controllers/reports.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import allowRoles from '../middleware/role.middleware.js';

const router = Router();

router.get('/', authMiddleware, allowRoles('ADMIN', 'MANAGER'), getReports);

export default router;
