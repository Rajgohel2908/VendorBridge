import { Router } from 'express';
import { listUsers, updateUser } from '../controllers/admin.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import allowRoles from '../middleware/role.middleware.js';

const router = Router();

router.use(authMiddleware);
router.use(allowRoles('ADMIN'));

router.get('/users', listUsers);
router.patch('/users/:id', updateUser);

export default router;
