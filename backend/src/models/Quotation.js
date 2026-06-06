import mongoose from 'mongoose';

const quotationSchema = new mongoose.Schema(
  {
    rfqId: { type: mongoose.Schema.Types.ObjectId, ref: 'RFQ', required: true },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    price: { type: Number, required: true },
    deliveryDays: { type: Number, required: true },
    notes: { type: String },
    status: {
      type: String,
      enum: ['SUBMITTED', 'REVISED', 'SELECTED', 'REJECTED'],
      default: 'SUBMITTED',
    },
  },
  { timestamps: true },
);

export default mongoose.model('Quotation', quotationSchema);
