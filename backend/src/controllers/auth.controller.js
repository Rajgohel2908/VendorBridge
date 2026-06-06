import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import User from '../models/User.js';
import { sendEmail } from '../utils/sendEmail.js';

function handleValidation(req) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.statusCode = 400;
    error.details = errors.array();
    throw error;
  }
}

function signToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role, vendorId: user.vendorId || null },
    process.env.JWT_SECRET || 'development-secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
  );
}

export async function register(req, res, next) {
  try {
    handleValidation(req);

    // Prevent self-registration as ADMIN
    if (req.body.role === 'ADMIN') {
      return res.status(403).json({ message: 'Admin accounts can only be created by an existing admin' });
    }

    const existing = await User.findOne({ email: req.body.email });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashed = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashed,
      role: req.body.role,
      vendorId: req.body.vendorId || undefined,
    });

    const token = signToken(user);
    return res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, vendorId: user.vendorId },
    });
  } catch (err) {
    return next(err);
  }
}

export async function login(req, res, next) {
  try {
    handleValidation(req);

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.isActive === false) {
      return res.status(403).json({ message: 'Your account has been deactivated. Contact an administrator.' });
    }

    const valid = await bcrypt.compare(req.body.password, user.password);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = signToken(user);
    return res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, vendorId: user.vendorId },
    });
  } catch (err) {
    return next(err);
  }
}

export async function forgotPassword(req, res, next) {
  try {
    handleValidation(req);

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      // Don't reveal if email exists
      return res.json({ message: 'If that email is registered, a reset link has been sent.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    try {
      await sendEmail({
        to: user.email,
        subject: 'VendorBridge — Password Reset',
        html: `<p>Use this token to reset your password: <strong>${resetToken}</strong></p>`,
      });
    } catch {
      console.warn('Email sending failed — SMTP may not be configured');
    }

    return res.json({ message: 'If that email is registered, a reset link has been sent.' });
  } catch (err) {
    return next(err);
  }
}
