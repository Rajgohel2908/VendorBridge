import mongoose from 'mongoose';

const rfqSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String },
    quantity: { type: Number, required: true },
    deadline: { type: Date, required: true },
    attachment: { type: String },
    status: { type: String, enum: ['OPEN', 'CLOSED', 'CANCELLED'], default: 'OPEN' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    vendors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' }],
  },
  { timestamps: true },
);

export default mongoose.model('RFQ', rfqSchema);
