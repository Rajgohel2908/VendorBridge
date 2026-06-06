import { Router } from 'express';
import {
  createQuotation,
  getQuotation,
  listQuotations,
  updateQuotation,
} from '../controllers/quotation.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import allowRoles from '../middleware/role.middleware.js';
import { quotationValidator } from '../validators/quotation.validator.js';

const router = Router();

router.use(authMiddleware);
router.get('/', allowRoles('VENDOR'), listQuotations);
router.post('/', allowRoles('VENDOR'), quotationValidator, createQuotation);
router.put('/:id', allowRoles('VENDOR'), quotationValidator, updateQuotation);
router.patch('/:id', allowRoles('VENDOR'), quotationValidator, updateQuotation);
router.get('/:id', allowRoles('PROCUREMENT_OFFICER', 'VENDOR'), getQuotation);

export default router;
