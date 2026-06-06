import { Router } from 'express';
import { getApproval, listApprovals, updateApproval } from '../controllers/approval.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import allowRoles from '../middleware/role.middleware.js';
import Approval from '../models/Approval.js';

const router = Router();

router.use(authMiddleware);

// PROCUREMENT_OFFICER creates approvals, MANAGER/ADMIN views and decides
router.get('/', allowRoles('MANAGER', 'ADMIN', 'PROCUREMENT_OFFICER'), listApprovals);
router.post('/', allowRoles('PROCUREMENT_OFFICER'), async (req, res, next) => {
  try {
    const approval = await Approval.create({
      quotationId: req.body.quotationId,
      rfqId: req.body.rfqId,
      status: 'PENDING',
    });
    return res.status(201).json({ data: approval });
  } catch (err) {
    return next(err);
  }
});
router.get('/:id', allowRoles('MANAGER', 'ADMIN', 'PROCUREMENT_OFFICER'), getApproval);
router.put('/:id', allowRoles('MANAGER', 'ADMIN'), updateApproval);

export default router;
