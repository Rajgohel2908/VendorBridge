import { Router } from 'express';
import {
  createRFQ,
  deleteRFQ,
  getRFQ,
  listRFQQuotations,
  listRFQs,
  updateRFQ,
} from '../controllers/rfq.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import allowRoles from '../middleware/role.middleware.js';
import { upload } from '../middleware/upload.middleware.js';
import { rfqValidator } from '../validators/rfq.validator.js';

const router = Router();

router.use(authMiddleware);
router.get('/', allowRoles('PROCUREMENT_OFFICER', 'MANAGER', 'ADMIN'), listRFQs);
router.post('/', allowRoles('PROCUREMENT_OFFICER'), upload.single('attachment'), rfqValidator, createRFQ);
router.get('/:id/quotations', allowRoles('PROCUREMENT_OFFICER'), listRFQQuotations);
router.get('/:id', allowRoles('PROCUREMENT_OFFICER', 'VENDOR'), getRFQ);
router.put('/:id', allowRoles('PROCUREMENT_OFFICER'), rfqValidator, updateRFQ);
router.delete('/:id', allowRoles('PROCUREMENT_OFFICER'), deleteRFQ);

export default router;
