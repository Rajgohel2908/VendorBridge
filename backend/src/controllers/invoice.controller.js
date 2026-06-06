import mongoose from 'mongoose';
import Invoice from '../models/Invoice.js';
import PurchaseOrder from '../models/PurchaseOrder.js';
import Vendor from '../models/Vendor.js';
import { logActivity } from '../utils/activityLogger.js';
import { generateInvoiceNumber } from '../utils/generateInvoiceNumber.js';
import { sendEmail } from '../utils/sendEmail.js';

const toDecimal = (value) => mongoose.Types.Decimal128.fromString(String(value));

/**
 * Helper to read a Decimal128 or Number value as a plain number.
 * Handles both raw Decimal128 objects and already-parsed numbers.
 */
function readDecimal(val) {
  if (val == null) return 0;
  if (typeof val === 'number') return val;
  if (typeof val.toString === 'function') return parseFloat(val.toString());
  return 0;
}

export async function listInvoices(req, res, next) {
  try {
    const invoices = await Invoice.find()
      .populate('vendorId', 'name email')
      .populate('poId', 'poNumber')
      .sort({ createdAt: -1 });

    return res.json({ data: invoices });
  } catch (err) {
    return next(err);
  }
}

export async function createInvoice(req, res, next) {
  try {
    const { poId } = req.body;

    // Check if invoice already exists for this PO
    const existing = await Invoice.findOne({ poId });
    if (existing) {
      return res.status(409).json({ message: 'Invoice already exists for this PO', data: existing });
    }

    const po = await PurchaseOrder.findById(poId);
    if (!po) return res.status(404).json({ message: 'Purchase order not found' });

    const count = await Invoice.countDocuments();
    const invoiceNo = generateInvoiceNumber(count + 1);

    const invoice = await Invoice.create({
      invoiceNo,
      poId: po._id,
      vendorId: po.vendorId,
      subtotal: toDecimal(readDecimal(po.subtotal)),
      tax: toDecimal(readDecimal(po.taxAmount)),
      total: toDecimal(readDecimal(po.totalAmount)),
      status: 'GENERATED',
      emailDeliveryStatus: 'Pending',
    });

    await logActivity({ userId: req.user.id, action: 'Generated Invoice', entity: 'INVOICE', entityId: invoice._id });

    return res.status(201).json({ data: invoice });
  } catch (err) {
    return next(err);
  }
}

export async function getInvoice(req, res, next) {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('vendorId', 'name email gstNumber address phone')
      .populate({
        path: 'poId',
        populate: [
          { path: 'rfqId', select: 'title description quantity' },
        ],
      });

    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    return res.json({ data: invoice });
  } catch (err) {
    return next(err);
  }
}

export function getInvoicePdf(req, res) {
  // PDF generation is handled on the frontend with @react-pdf/renderer
  // This endpoint returns invoice data in a format suitable for PDF rendering
  return getInvoice(req, res, (err) => {
    if (err) return res.status(500).json({ message: 'Error generating PDF data' });
  });
}

export async function emailInvoice(req, res, next) {
  try {
    const invoice = await Invoice.findById(req.params.id).populate('vendorId', 'name email');
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

    const vendorEmail = req.body.email || invoice.vendorId?.email;
    const subject = req.body.subject || `Invoice ${invoice.invoiceNo} — VendorBridge`;
    const notes = req.body.notes || '';

    const subtotalDisplay = readDecimal(invoice.subtotal).toLocaleString();
    const taxDisplay = readDecimal(invoice.tax).toLocaleString();
    const totalDisplay = readDecimal(invoice.total).toLocaleString();

    try {
      await sendEmail({
        to: vendorEmail,
        subject,
        html: `
          <h2>Invoice ${invoice.invoiceNo}</h2>
          <p>Dear ${invoice.vendorId?.name || 'Vendor'},</p>
          <p>Please find your invoice details below:</p>
          <table style="border-collapse:collapse;width:100%">
            <tr><td style="padding:8px;border:1px solid #ddd"><strong>Invoice No</strong></td><td style="padding:8px;border:1px solid #ddd">${invoice.invoiceNo}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd"><strong>Subtotal</strong></td><td style="padding:8px;border:1px solid #ddd">$${subtotalDisplay}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd"><strong>Tax (GST 18%)</strong></td><td style="padding:8px;border:1px solid #ddd">$${taxDisplay}</td></tr>
            <tr><td style="padding:8px;border:1px solid #ddd"><strong>Total</strong></td><td style="padding:8px;border:1px solid #ddd"><strong>$${totalDisplay}</strong></td></tr>
          </table>
          ${notes ? `<p>Notes: ${notes}</p>` : ''}
          <p style="margin-top:20px;color:#666">VendorBridge — Procurement Management</p>
        `,
      });

      // Email sent successfully
      invoice.emailDeliveryStatus = 'Sent';
    } catch {
      // Email sending failed
      invoice.emailDeliveryStatus = 'Failed';
      invoice.status = invoice.status; // preserve current status
      await invoice.save();
      return res.status(500).json({ message: 'Failed to send email — SMTP may not be configured' });
    }

    invoice.status = 'SENT';
    invoice.sentAt = new Date();
    await invoice.save();

    await logActivity({ userId: req.user.id, action: 'Sent Invoice via Email', entity: 'INVOICE', entityId: invoice._id });

    return res.json({ message: 'Invoice sent successfully', data: invoice });
  } catch (err) {
    return next(err);
  }
}
