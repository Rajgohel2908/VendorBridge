import { Router } from 'express';
import {
  createVendor,
  deleteVendor,
  getVendor,
  listVendors,
  updateVendor,
} from '../controllers/vendor.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import allowRoles from '../middleware/role.middleware.js';
import { vendorValidator } from '../validators/vendor.validator.js';

const router = Router();

router.use(authMiddleware);
router.get('/', allowRoles('ADMIN', 'PROCUREMENT_OFFICER'), listVendors);
router.post('/', allowRoles('ADMIN', 'PROCUREMENT_OFFICER'), vendorValidator, createVendor);
router.get('/:id', allowRoles('ADMIN', 'PROCUREMENT_OFFICER'), getVendor);
router.put('/:id', allowRoles('ADMIN', 'PROCUREMENT_OFFICER'), vendorValidator, updateVendor);
router.delete('/:id', allowRoles('ADMIN'), deleteVendor);

export default router;
