import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    action: {
      type: String,
      required: true,
      enum: ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'EXPORT', 'EMAIL'],
    },
    resourceType: {
      type: String,
      required: true,
      enum: ['USER', 'VENDOR', 'RFQ', 'QUOTATION', 'APPROVAL', 'PURCHASE_ORDER', 'INVOICE', 'SYSTEM'],
    },
    resourceId: { type: mongoose.Schema.Types.ObjectId },
    previousData: { type: mongoose.Schema.Types.Mixed, default: null },
    newData: { type: mongoose.Schema.Types.Mixed, default: null },
    ipAddress: { type: String, trim: true },
    userAgent: { type: String, trim: true },
  },
  { timestamps: true },
);

// Compound index for querying audit trail of a specific resource
auditLogSchema.index({ resourceType: 1, resourceId: 1 });

// Index for filtering by user
auditLogSchema.index({ userId: 1 });

// TTL index — automatically remove audit logs older than 90 days
auditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

export default mongoose.model('AuditLog', auditLogSchema);
