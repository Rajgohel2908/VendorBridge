import mongoose from 'mongoose';

const { Decimal128 } = mongoose.Schema.Types;

const purchaseOrderSchema = new mongoose.Schema(
  {
    poNumber: { type: String, unique: true },
    quotationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quotation' },
    approvalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Approval' },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
    rfqId: { type: mongoose.Schema.Types.ObjectId, ref: 'RFQ' },
    items: [
      {
        description: String,
        quantity: Number,
        unitPrice: Decimal128,
        total: Decimal128,
      },
    ],
    subtotal: { type: Decimal128, required: true },
    taxAmount: { type: Decimal128, required: true },
    totalAmount: { type: Decimal128, required: true },
    status: { type: String, enum: ['GENERATED', 'SENT', 'COMPLETED'], default: 'GENERATED' },
    invoiceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice', default: null },
  },
  { timestamps: true },
);

// Serialize Decimal128 as plain numbers in JSON responses
purchaseOrderSchema.set('toJSON', {
  transform: (_doc, ret) => {
    for (const key of ['subtotal', 'taxAmount', 'totalAmount']) {
      if (ret[key]) ret[key] = parseFloat(ret[key].toString());
    }
    if (ret.items) {
      ret.items = ret.items.map((item) => ({
        ...item,
        unitPrice: item.unitPrice ? parseFloat(item.unitPrice.toString()) : item.unitPrice,
        total: item.total ? parseFloat(item.total.toString()) : item.total,
      }));
    }
    return ret;
  },
});

export default mongoose.model('PurchaseOrder', purchaseOrderSchema);
