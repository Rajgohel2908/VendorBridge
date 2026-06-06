import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { validationResult } from 'express-validator';
import User from '../models/User.js';
import Vendor from '../models/Vendor.js';
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

function isDBConnected() {
  return mongoose.connection.readyState === 1;
}

// Hardcoded test users for all roles (works without MongoDB/out of the box)
const MOCK_USERS = {
  'aarav@vendorbridge.test': {
    _id: '6a23c662b671344e9fafcda1',
    name: 'Aarav (Admin)',
    email: 'aarav@vendorbridge.test',
    password: 'password123',
    role: 'ADMIN',
    vendorId: null
  },
  'priya@vendorbridge.test': {
    _id: '6a23c662b671344e9fafcda2',
    name: 'Priya (Procurement)',
    email: 'priya@vendorbridge.test',
    password: 'password123',
    role: 'PROCUREMENT_OFFICER',
    vendorId: null
  },
  'karan@vendorbridge.test': {
    _id: '6a23c662b671344e9fafcda3',
    name: 'Karan (Manager)',
    email: 'karan@vendorbridge.test',
    password: 'password123',
    role: 'MANAGER',
    vendorId: null
  },
  'vendor@acme.test': {
    _id: '6a23c662b671344e9fafcda4',
    name: 'Acme Vendor Representative',
    email: 'vendor@acme.test',
    password: 'password123',
    role: 'VENDOR',
    vendorId: '6a23c662b671344e9fafcdbb'
  },
  'rudrarp2006@gmail.com': {
    _id: '6a23c662b671344e9fafcda5',
    name: 'Admin',
    email: 'rudrarp2006@gmail.com',
    password: '123456',
    role: 'ADMIN',
    vendorId: null
  }
};

export async function register(req, res, next) {
  try {
    handleValidation(req);

    // Prevent self-registration as ADMIN
    if (req.body.role === 'ADMIN') {
      return res.status(403).json({ message: 'Admin accounts can only be created by an existing admin' });
    }

    if (!isDBConnected()) {
      return res.status(503).json({ message: 'Database not available. Registration requires MongoDB.' });
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

    const { email, password } = req.body;
    const lowerEmail = (email || '').trim().toLowerCase();

    console.log(`[LOGIN ATTEMPT] email="${lowerEmail}" passwordLength=${password ? password.length : 0}`);

    // --- Hardcoded users check (no DB required to log in) ---
    if (MOCK_USERS[lowerEmail] && MOCK_USERS[lowerEmail].password === password) {
      const mockUser = MOCK_USERS[lowerEmail];
      
      // Auto-provision Vendor if database is connected and role is VENDOR
      if (mockUser.role === 'VENDOR' && isDBConnected() && mockUser.vendorId) {
        try {
          const exists = await Vendor.findById(mockUser.vendorId);
          if (!exists) {
            await Vendor.create({
              _id: mockUser.vendorId,
              name: 'Acme Corp',
              category: 'General Goods',
              gstNumber: '29AAAAA0000A1Z5',
              email: 'vendor@acme.test',
              phone: '9876543210',
              address: '123 Acme Street, Industrial Area',
              status: 'ACTIVE'
            });
            console.log('Provisioned mock vendor document in database');
          }
        } catch (err) {
          console.error('Failed to auto-provision mock vendor:', err.message);
        }
      }

      const token = signToken(mockUser);
      return res.json({
        token,
        user: { id: mockUser._id, name: mockUser.name, email: mockUser.email, role: mockUser.role, vendorId: mockUser.vendorId },
      });
    }

    // --- Regular DB-based login (only if MongoDB is connected) ---
    if (!isDBConnected()) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.isActive === false) {
      return res.status(403).json({ message: 'Your account has been deactivated. Contact an administrator.' });
    }

    const valid = await bcrypt.compare(password, user.password);
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
