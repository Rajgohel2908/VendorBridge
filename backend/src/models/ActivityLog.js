import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    action: { type: String, required: true },
    entity: {
      type: String,
      enum: ['RFQ', 'QUOTATION', 'PO', 'INVOICE', 'VENDOR', 'APPROVAL'],
      required: true,
    },
    entityId: { type: mongoose.Schema.Types.ObjectId },
  },
  { timestamps: true },
);

export default mongoose.model('ActivityLog', activityLogSchema);
