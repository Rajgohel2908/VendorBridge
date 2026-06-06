import mongoose from 'mongoose';

const approvalSchema = new mongoose.Schema(
  {
    quotationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quotation', required: true },
    rfqId: { type: mongoose.Schema.Types.ObjectId, ref: 'RFQ' },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
    remarks: { type: String },
  },
  { timestamps: true },
);

export default mongoose.model('Approval', approvalSchema);
