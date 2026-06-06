import Quotation from '../models/Quotation.js';
import { logActivity } from '../utils/activityLogger.js';

export async function listQuotations(req, res, next) {
  try {
    const filter = {};

    // Vendors only see their own quotations
    if (req.user.role === 'VENDOR' && req.user.vendorId) {
      filter.vendorId = req.user.vendorId;
    }

    if (req.query.rfqId) filter.rfqId = req.query.rfqId;

    const quotations = await Quotation.find(filter)
      .populate('rfqId', 'title quantity deadline status')
      .populate('vendorId', 'name email')
      .sort({ createdAt: -1 });

    return res.json({ data: quotations });
  } catch (err) {
    return next(err);
  }
}

export async function createQuotation(req, res, next) {
  try {
    const quotation = await Quotation.create({
      rfqId: req.body.rfqId,
      vendorId: req.user.vendorId || req.body.vendorId,
      price: req.body.price,
      deliveryDays: req.body.deliveryDays,
      notes: req.body.notes,
    });

    await logActivity({ userId: req.user.id, action: 'Submitted Quotation', entity: 'QUOTATION', entityId: quotation._id });
    return res.status(201).json({ data: quotation });
  } catch (err) {
    return next(err);
  }
}

export async function updateQuotation(req, res, next) {
  try {
    const update = {
      price: req.body.price,
      deliveryDays: req.body.deliveryDays,
      notes: req.body.notes,
      status: 'REVISED',
    };

    const quotation = await Quotation.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!quotation) return res.status(404).json({ message: 'Quotation not found' });

    await logActivity({ userId: req.user.id, action: 'Revised Quotation', entity: 'QUOTATION', entityId: quotation._id });
    return res.json({ data: quotation });
  } catch (err) {
    return next(err);
  }
}

export async function getQuotation(req, res, next) {
  try {
    const quotation = await Quotation.findById(req.params.id)
      .populate('rfqId', 'title description quantity deadline status')
      .populate('vendorId', 'name email category');

    if (!quotation) return res.status(404).json({ message: 'Quotation not found' });
    return res.json({ data: quotation });
  } catch (err) {
    return next(err);
  }
}
