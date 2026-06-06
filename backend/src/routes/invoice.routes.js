import { Router } from 'express';
import {
  createInvoice,
  emailInvoice,
  getInvoice,
  getInvoicePdf,
  listInvoices,
} from '../controllers/invoice.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import allowRoles from '../middleware/role.middleware.js';

const router = Router();

router.use(authMiddleware);
router.get('/', allowRoles('PROCUREMENT_OFFICER', 'VENDOR', 'MANAGER', 'ADMIN'), listInvoices);
router.post('/', allowRoles('PROCUREMENT_OFFICER'), createInvoice);
router.get('/:id/pdf', allowRoles('PROCUREMENT_OFFICER', 'VENDOR', 'MANAGER', 'ADMIN'), getInvoicePdf);
router.post('/:id/email', allowRoles('PROCUREMENT_OFFICER'), emailInvoice);
router.get('/:id', allowRoles('PROCUREMENT_OFFICER', 'VENDOR', 'MANAGER', 'ADMIN'), getInvoice);

export default router;
