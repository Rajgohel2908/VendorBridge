import { Router } from 'express';
import {
  createPurchaseOrder,
  getPurchaseOrder,
  listPurchaseOrders,
} from '../controllers/purchaseOrder.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import allowRoles from '../middleware/role.middleware.js';

const router = Router();

router.use(authMiddleware);
router.get('/', allowRoles('PROCUREMENT_OFFICER', 'VENDOR', 'MANAGER', 'ADMIN'), listPurchaseOrders);
router.post('/', allowRoles('PROCUREMENT_OFFICER'), createPurchaseOrder);
router.get('/:id', allowRoles('PROCUREMENT_OFFICER', 'VENDOR', 'MANAGER', 'ADMIN'), getPurchaseOrder);

export default router;
