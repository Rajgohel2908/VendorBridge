import { Router } from 'express';
import { getApproval, listApprovals, updateApproval } from '../controllers/approval.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import allowRoles from '../middleware/role.middleware.js';

const router = Router();

router.use(authMiddleware, allowRoles('MANAGER'));
router.get('/', listApprovals);
router.get('/:id', getApproval);
router.put('/:id', updateApproval);

export default router;
