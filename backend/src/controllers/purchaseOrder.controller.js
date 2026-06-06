import mongoose from 'mongoose';
import PurchaseOrder from '../models/PurchaseOrder.js';
import Quotation from '../models/Quotation.js';
import Approval from '../models/Approval.js';
import User from '../models/User.js';
import Invoice from '../models/Invoice.js';
import RFQ from '../models/RFQ.js';
import { logActivity } from '../utils/activityLogger.js';
import { generatePONumber } from '../utils/generatePONumber.js';

const toDecimal = (value) => mongoose.Types.Decimal128.fromString(String(value));

export async function listPurchaseOrders(req, res, next) {
  try {
    const filter = {};
    if (req.user.role === 'VENDOR') {
      filter.vendorId = req.user.vendorId;
    }
    const pos = await PurchaseOrder.find(filter)
      .populate('vendorId', 'name email')
      .populate('rfqId', 'title')
      .sort({ createdAt: -1 });

    return res.json({ data: pos });
  } catch (err) {
    return next(err);
  }
}

export async function createPurchaseOrder(req, res, next) {
  try {
    const { approvalId } = req.body;

    const approval = await Approval.findById(approvalId);
    if (!approval || approval.status !== 'APPROVED') {
      return res.status(400).json({ message: 'Valid approved quotation required' });
    }

    const quotation = await Quotation.findById(approval.quotationId).populate('rfqId');
    if (!quotation) return res.status(404).json({ message: 'Quotation not found' });

    const rfq = quotation.rfqId;

    // Generate sequential PO number
    const count = await PurchaseOrder.countDocuments();
    const poNumber = generatePONumber(count + 1);

    const subtotal = quotation.price * rfq.quantity;
    const taxAmount = Math.round(subtotal * 0.18 * 100) / 100;
    const totalAmount = subtotal + taxAmount;

    const po = await PurchaseOrder.create({
      poNumber,
      quotationId: quotation._id,
      approvalId: approval._id,
      vendorId: quotation.vendorId,
      rfqId: rfq._id,
      items: [
        {
          description: rfq.title,
          quantity: rfq.quantity,
          unitPrice: toDecimal(quotation.price),
          total: toDecimal(subtotal),
        },
      ],
      subtotal: toDecimal(subtotal),
      taxAmount: toDecimal(taxAmount),
      totalAmount: toDecimal(totalAmount),
      status: 'GENERATED',
    });

    await logActivity({ userId: req.user.id, action: 'Generated Purchase Order', entity: 'PO', entityId: po._id });

    return res.status(201).json({ data: po });
  } catch (err) {
    return next(err);
  }
}

export async function getPurchaseOrder(req, res, next) {
  try {
    const po = await PurchaseOrder.findById(req.params.id)
      .populate('vendorId', 'name email gstNumber address phone')
      .populate('rfqId', 'title description quantity deadline')
      .populate('quotationId', 'price deliveryDays notes');

    if (!po) return res.status(404).json({ message: 'Purchase order not found' });

    // Ensure Vendor only sees their own PO
    if (req.user.role === 'VENDOR' && po.vendorId && String(po.vendorId._id) !== String(req.user.vendorId)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    const invoice = await Invoice.findOne({ poId: po._id });
    const poObj = po.toJSON();
    poObj.invoiceId = invoice ? invoice._id : null;

    return res.json({ data: poObj });
  } catch (err) {
    return next(err);
  }
}
