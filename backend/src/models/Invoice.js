import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNo: { type: String, unique: true },
    poId: { type: mongoose.Schema.Types.ObjectId, ref: 'PurchaseOrder', unique: true },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
    subtotal: Number,
    tax: Number,
    total: Number,
    status: { type: String, enum: ['GENERATED', 'SENT', 'PAID'], default: 'GENERATED' },
    sentAt: Date,
  },
  { timestamps: true },
);

export default mongoose.model('Invoice', invoiceSchema);
