import ActivityLog from '../models/ActivityLog.js';

export async function logActivity({ userId, action, entity, entityId }) {
  return ActivityLog.create({ userId, action, entity, entityId });
}
