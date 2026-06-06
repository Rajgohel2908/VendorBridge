import mongoose from 'mongoose';

const { Decimal128 } = mongoose.Schema.Types;

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNo: { type: String, unique: true },
    poId: { type: mongoose.Schema.Types.ObjectId, ref: 'PurchaseOrder', unique: true },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
    subtotal: { type: Decimal128, required: true },
    tax: { type: Decimal128, required: true },
    total: { type: Decimal128, required: true },
    status: { type: String, enum: ['GENERATED', 'SENT', 'PAID'], default: 'GENERATED' },
    sentAt: Date,
    emailDeliveryStatus: {
      type: String,
      enum: ['Pending', 'Sent', 'Failed', 'Bounced'],
      default: 'Pending',
    },
  },
  { timestamps: true },
);

// Serialize Decimal128 as plain numbers in JSON responses
invoiceSchema.set('toJSON', {
  transform: (_doc, ret) => {
    for (const key of ['subtotal', 'tax', 'total']) {
      if (ret[key]) ret[key] = parseFloat(ret[key].toString());
    }
    return ret;
  },
});

export default mongoose.model('Invoice', invoiceSchema);
