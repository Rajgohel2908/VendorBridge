import User from '../models/User.js';

export async function listUsers(req, res, next) {
  try {
    const users = await User.find()
      .select('-password -resetToken -resetTokenExpiry')
      .sort({ createdAt: -1 });

    return res.json({ data: users });
  } catch (err) {
    return next(err);
  }
}

export async function updateUser(req, res, next) {
  try {
    const { role, isActive } = req.body;
    const update = {};

    if (role !== undefined) {
      const validRoles = ['ADMIN', 'PROCUREMENT_OFFICER', 'MANAGER', 'VENDOR'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({ message: `Invalid role. Must be one of: ${validRoles.join(', ')}` });
      }
      update.role = role;
    }

    if (isActive !== undefined) {
      update.isActive = Boolean(isActive);
    }

    // Prevent admin from deactivating themselves
    if (req.params.id === req.user.id && isActive === false) {
      return res.status(400).json({ message: 'Cannot deactivate your own account' });
    }

    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true })
      .select('-password -resetToken -resetTokenExpiry');

    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({ data: user });
  } catch (err) {
    return next(err);
  }
}
