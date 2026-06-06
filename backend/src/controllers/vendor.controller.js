import Vendor from '../models/Vendor.js';
import { logActivity } from '../utils/activityLogger.js';

export async function listVendors(req, res, next) {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.search) {
      filter.name = { $regex: req.query.search, $options: 'i' };
    }

    const vendors = await Vendor.find(filter).sort({ createdAt: -1 });
    return res.json({ data: vendors });
  } catch (err) {
    return next(err);
  }
}

export async function createVendor(req, res, next) {
  try {
    const vendor = await Vendor.create(req.body);
    await logActivity({ userId: req.user.id, action: 'Created Vendor', entity: 'VENDOR', entityId: vendor._id });
    return res.status(201).json({ data: vendor });
  } catch (err) {
    return next(err);
  }
}

export async function getVendor(req, res, next) {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
    return res.json({ data: vendor });
  } catch (err) {
    return next(err);
  }
}

export async function updateVendor(req, res, next) {
  try {
    const vendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
    await logActivity({ userId: req.user.id, action: 'Updated Vendor', entity: 'VENDOR', entityId: vendor._id });
    return res.json({ data: vendor });
  } catch (err) {
    return next(err);
  }
}

export async function deleteVendor(req, res, next) {
  try {
    const vendor = await Vendor.findByIdAndDelete(req.params.id);
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
    await logActivity({ userId: req.user.id, action: 'Deleted Vendor', entity: 'VENDOR', entityId: vendor._id });
    return res.json({ message: 'Vendor deleted' });
  } catch (err) {
    return next(err);
  }
}
