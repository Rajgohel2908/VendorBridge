import Approval from '../models/Approval.js';
import Quotation from '../models/Quotation.js';
import RFQ from '../models/RFQ.js';
import { logActivity } from '../utils/activityLogger.js';
import { sendEmail } from '../utils/sendEmail.js';
import User from '../models/User.js';

export async function listApprovals(req, res, next) {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const approvals = await Approval.find(filter)
      .populate({
        path: 'quotationId',
        populate: [
          { path: 'vendorId', select: 'name email' },
          { path: 'rfqId', select: 'title quantity deadline' },
        ],
      })
      .populate('rfqId', 'title quantity deadline')
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 });

    return res.json({ data: approvals });
  } catch (err) {
    return next(err);
  }
}

export async function getApproval(req, res, next) {
  try {
    const approval = await Approval.findById(req.params.id)
      .populate({
        path: 'quotationId',
        populate: [
          { path: 'vendorId', select: 'name email category gstNumber address' },
          { path: 'rfqId', select: 'title description quantity deadline status createdBy' },
        ],
      })
      .populate('rfqId', 'title quantity deadline')
      .populate('approvedBy', 'name email');

    if (!approval) return res.status(404).json({ message: 'Approval not found' });
    return res.json({ data: approval });
  } catch (err) {
    return next(err);
  }
}

export async function updateApproval(req, res, next) {
  try {
    const { status, remarks } = req.body;

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ message: 'Status must be APPROVED or REJECTED' });
    }

    const approval = await Approval.findById(req.params.id).populate('quotationId');
    if (!approval) return res.status(404).json({ message: 'Approval not found' });

    approval.status = status;
    approval.remarks = remarks || '';
    approval.approvedBy = req.user.id;
    await approval.save();

    // Update quotation status
    if (approval.quotationId) {
      await Quotation.findByIdAndUpdate(approval.quotationId._id, {
        status: status === 'APPROVED' ? 'SELECTED' : 'REJECTED',
      });
    }

    // Close the RFQ if approved
    if (status === 'APPROVED' && approval.rfqId) {
      await RFQ.findByIdAndUpdate(approval.rfqId, { status: 'CLOSED' });
    }

    await logActivity({
      userId: req.user.id,
      action: status === 'APPROVED' ? 'Approved Quotation' : 'Rejected Quotation',
      entity: 'APPROVAL',
      entityId: approval._id,
    });

    // Notify the procurement officer who created the RFQ
    try {
      if (approval.rfqId) {
        const rfq = await RFQ.findById(approval.rfqId).populate('createdBy', 'email');
        if (rfq?.createdBy?.email) {
          await sendEmail({
            to: rfq.createdBy.email,
            subject: `VendorBridge — Quotation ${status}`,
            html: `<h2>Quotation ${status}</h2><p>The quotation for RFQ <strong>${rfq.title}</strong> has been ${status.toLowerCase()}.</p>${remarks ? `<p>Remarks: ${remarks}</p>` : ''}`,
          });
        }
      }
    } catch {
      console.warn('Failed to send approval notification email');
    }

    return res.json({ data: approval });
  } catch (err) {
    return next(err);
  }
}
