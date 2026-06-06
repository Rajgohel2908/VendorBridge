import RFQ from '../models/RFQ.js';
import Quotation from '../models/Quotation.js';
import Vendor from '../models/Vendor.js';
import { logActivity } from '../utils/activityLogger.js';
import { sendEmail } from '../utils/sendEmail.js';

export async function listRFQs(req, res, next) {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    // Vendors should only see RFQs assigned to them
    if (req.user.role === 'VENDOR' && req.user.vendorId) {
      filter.vendors = req.user.vendorId;
    }

    const rfqs = await RFQ.find(filter)
      .populate('createdBy', 'name email')
      .populate('vendors', 'name email')
      .sort({ createdAt: -1 });

    return res.json({ data: rfqs });
  } catch (err) {
    return next(err);
  }
}

export async function createRFQ(req, res, next) {
  try {
    const rfqData = {
      title: req.body.title,
      description: req.body.description,
      quantity: req.body.quantity,
      deadline: req.body.deadline,
      vendors: req.body.vendors ? JSON.parse(req.body.vendors) : [],
      createdBy: req.user.id,
    };

    if (req.file) {
      rfqData.attachment = `/uploads/${req.file.filename}`;
    }

    const rfq = await RFQ.create(rfqData);
    await logActivity({ userId: req.user.id, action: 'Created RFQ', entity: 'RFQ', entityId: rfq._id });

    // Notify assigned vendors
    if (rfq.vendors.length > 0) {
      const vendors = await Vendor.find({ _id: { $in: rfq.vendors } });
      for (const vendor of vendors) {
        try {
          await sendEmail({
            to: vendor.email,
            subject: `VendorBridge — New RFQ: ${rfq.title}`,
            html: `<h2>New RFQ Invitation</h2><p>You have been invited to submit a quotation for <strong>${rfq.title}</strong>.</p><p>Quantity: ${rfq.quantity}<br>Deadline: ${new Date(rfq.deadline).toLocaleDateString()}</p>`,
          });
        } catch {
          console.warn(`Failed to send RFQ notification to ${vendor.email}`);
        }
      }
    }

    return res.status(201).json({ data: rfq });
  } catch (err) {
    return next(err);
  }
}

export async function getRFQ(req, res, next) {
  try {
    const rfq = await RFQ.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('vendors', 'name email category');

    if (!rfq) return res.status(404).json({ message: 'RFQ not found' });
    return res.json({ data: rfq });
  } catch (err) {
    return next(err);
  }
}

export async function updateRFQ(req, res, next) {
  try {
    const update = { ...req.body };
    if (update.vendors && typeof update.vendors === 'string') {
      update.vendors = JSON.parse(update.vendors);
    }
    if (req.file) {
      update.attachment = `/uploads/${req.file.filename}`;
    }

    const rfq = await RFQ.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!rfq) return res.status(404).json({ message: 'RFQ not found' });
    await logActivity({ userId: req.user.id, action: 'Updated RFQ', entity: 'RFQ', entityId: rfq._id });
    return res.json({ data: rfq });
  } catch (err) {
    return next(err);
  }
}

export async function deleteRFQ(req, res, next) {
  try {
    const rfq = await RFQ.findByIdAndUpdate(req.params.id, { status: 'CANCELLED' }, { new: true });
    if (!rfq) return res.status(404).json({ message: 'RFQ not found' });
    await logActivity({ userId: req.user.id, action: 'Cancelled RFQ', entity: 'RFQ', entityId: rfq._id });
    return res.json({ data: rfq });
  } catch (err) {
    return next(err);
  }
}

export async function listRFQQuotations(req, res, next) {
  try {
    const quotations = await Quotation.find({ rfqId: req.params.id })
      .populate('vendorId', 'name email category')
      .sort({ createdAt: -1 });

    return res.json({ data: quotations });
  } catch (err) {
    return next(err);
  }
}
