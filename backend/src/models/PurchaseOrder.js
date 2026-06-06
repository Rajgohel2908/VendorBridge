import mongoose from 'mongoose';

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
        unitPrice: Number,
        total: Number,
      },
    ],
    subtotal: Number,
    taxAmount: Number,
    totalAmount: Number,
    status: { type: String, enum: ['GENERATED', 'SENT', 'COMPLETED'], default: 'GENERATED' },
  },
  { timestamps: true },
);

export default mongoose.model('PurchaseOrder', purchaseOrderSchema);
