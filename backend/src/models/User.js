import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['ADMIN', 'PROCUREMENT_OFFICER', 'MANAGER', 'VENDOR'],
      required: true,
    },
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
    isActive: { type: Boolean, default: true },
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
  },
  { timestamps: true },
);

export default mongoose.model('User', userSchema);
