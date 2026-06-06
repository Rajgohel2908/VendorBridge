import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Vendor from './models/Vendor.js';
import RFQ from './models/RFQ.js';
import Quotation from './models/Quotation.js';
import Approval from './models/Approval.js';
import PurchaseOrder from './models/PurchaseOrder.js';
import Invoice from './models/Invoice.js';
import ActivityLog from './models/ActivityLog.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI || MONGODB_URI.includes('<user>')) {
  console.error('Set MONGODB_URI in backend/.env before running seed.');
  process.exit(1);
}

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  // Clear existing data
  await Promise.all([
    User.deleteMany({}),
    Vendor.deleteMany({}),
    RFQ.deleteMany({}),
    Quotation.deleteMany({}),
    Approval.deleteMany({}),
    PurchaseOrder.deleteMany({}),
    Invoice.deleteMany({}),
    ActivityLog.deleteMany({}),
  ]);
  console.log('Cleared existing data');

  const password = await bcrypt.hash('password123', 10);

  // Create vendors
  const vendors = await Vendor.insertMany([
    { _id: new mongoose.Types.ObjectId('6a23c662b671344e9fafcdbb'), name: 'Acme Supplies', category: 'Raw Materials', gstNumber: '22AAAAA0000A1Z5', email: 'ops@acme.test', phone: '+1 555 0100', address: '123 Industrial Ave, Chicago, IL', status: 'ACTIVE' },
    { name: 'Metro Tools', category: 'Equipment', gstNumber: '27BBBBB1111B2Z6', email: 'sales@metro.test', phone: '+1 555 0200', address: '456 Commerce St, Detroit, MI', status: 'ACTIVE' },
    { name: 'Northline Traders', category: 'Office Supplies', gstNumber: '33CCCCC2222C3Z7', email: 'info@northline.test', phone: '+1 555 0300', address: '789 Trade Blvd, New York, NY', status: 'ACTIVE' },
    { name: 'Prime Components', category: 'Electronics', gstNumber: '44DDDDD3333D4Z8', email: 'procurement@prime.test', phone: '+1 555 0400', address: '321 Tech Park, San Jose, CA', status: 'ACTIVE' },
    { name: 'Global Freight', category: 'Logistics', gstNumber: '55EEEEE4444E5Z9', email: 'dispatch@globalfreight.test', phone: '+1 555 0500', address: '654 Harbor Rd, Houston, TX', status: 'INACTIVE' },
  ]);
  console.log(`Created ${vendors.length} vendors`);

  // Create users
  const users = await User.insertMany([
    { _id: new mongoose.Types.ObjectId('6a23c662b671344e9fafcda1'), name: 'Aarav Sharma', email: 'aarav@vendorbridge.test', password, role: 'ADMIN' },
    { _id: new mongoose.Types.ObjectId('6a23c662b671344e9fafcda2'), name: 'Priya Patel', email: 'priya@vendorbridge.test', password, role: 'PROCUREMENT_OFFICER' },
    { _id: new mongoose.Types.ObjectId('6a23c662b671344e9fafcda3'), name: 'Karan Mehta', email: 'karan@vendorbridge.test', password, role: 'MANAGER' },
    { _id: new mongoose.Types.ObjectId('6a23c662b671344e9fafcda4'), name: 'Vendor User', email: 'vendor@acme.test', password, role: 'VENDOR', vendorId: vendors[0]._id },
    { name: 'Metro Vendor', email: 'vendor@metro.test', password, role: 'VENDOR', vendorId: vendors[1]._id },
  ]);
  const [admin, officer, manager, vendorUser1, vendorUser2] = users;
  console.log(`Created ${users.length} users`);

  // Create RFQs
  const rfqs = await RFQ.insertMany([
    {
      title: 'Laptop Procurement',
      description: 'High-performance laptops for engineering team. 16GB RAM, 512GB SSD, 14-inch display.',
      quantity: 50,
      deadline: new Date(Date.now() + 14 * 86400000),
      status: 'OPEN',
      createdBy: officer._id,
      vendors: [vendors[0]._id, vendors[1]._id, vendors[3]._id],
    },
    {
      title: 'Office Furniture',
      description: 'Ergonomic desks and chairs for new office expansion.',
      quantity: 30,
      deadline: new Date(Date.now() + 21 * 86400000),
      status: 'OPEN',
      createdBy: officer._id,
      vendors: [vendors[0]._id, vendors[2]._id],
    },
    {
      title: 'Server Equipment',
      description: 'Rack-mounted servers for data center upgrade. Minimum 64GB RAM, dual CPU.',
      quantity: 10,
      deadline: new Date(Date.now() + 7 * 86400000),
      status: 'CLOSED',
      createdBy: officer._id,
      vendors: [vendors[1]._id, vendors[3]._id],
    },
  ]);
  console.log(`Created ${rfqs.length} RFQs`);

  // Create quotations
  const quotations = await Quotation.insertMany([
    { rfqId: rfqs[0]._id, vendorId: vendors[0]._id, price: 1200, deliveryDays: 15, notes: 'Includes freight and setup', status: 'SUBMITTED' },
    { rfqId: rfqs[0]._id, vendorId: vendors[1]._id, price: 1340, deliveryDays: 11, notes: 'Stock ready, express shipping', status: 'SUBMITTED' },
    { rfqId: rfqs[0]._id, vendorId: vendors[3]._id, price: 1150, deliveryDays: 18, notes: 'Bulk discount applied', status: 'SUBMITTED' },
    { rfqId: rfqs[1]._id, vendorId: vendors[0]._id, price: 450, deliveryDays: 20, notes: 'Assembly included', status: 'SUBMITTED' },
    { rfqId: rfqs[1]._id, vendorId: vendors[2]._id, price: 480, deliveryDays: 14, notes: 'Premium ergonomic range', status: 'SUBMITTED' },
    { rfqId: rfqs[2]._id, vendorId: vendors[1]._id, price: 8500, deliveryDays: 12, notes: 'Warranty: 3 years', status: 'SELECTED' },
    { rfqId: rfqs[2]._id, vendorId: vendors[3]._id, price: 9200, deliveryDays: 10, notes: 'Next-gen hardware', status: 'REJECTED' },
  ]);
  console.log(`Created ${quotations.length} quotations`);

  // Create approvals
  const approvals = await Approval.insertMany([
    { quotationId: quotations[5]._id, rfqId: rfqs[2]._id, approvedBy: manager._id, status: 'APPROVED', remarks: 'Good value, approved.' },
  ]);
  console.log(`Created ${approvals.length} approvals`);

  // Create purchase order
  const subtotal = quotations[5].price * rfqs[2].quantity;
  const taxAmount = Math.round(subtotal * 0.18 * 100) / 100;
  const pos = await PurchaseOrder.insertMany([
    {
      poNumber: 'PO-2026-0001',
      quotationId: quotations[5]._id,
      approvalId: approvals[0]._id,
      vendorId: vendors[1]._id,
      rfqId: rfqs[2]._id,
      items: [{ description: 'Server Equipment', quantity: 10, unitPrice: 8500, total: subtotal }],
      subtotal,
      taxAmount,
      totalAmount: subtotal + taxAmount,
      status: 'GENERATED',
    },
  ]);
  console.log(`Created ${pos.length} purchase orders`);

  // Create invoice
  const invoices = await Invoice.insertMany([
    {
      invoiceNo: 'INV-2026-0001',
      poId: pos[0]._id,
      vendorId: vendors[1]._id,
      subtotal: pos[0].subtotal,
      tax: pos[0].taxAmount,
      total: pos[0].totalAmount,
      status: 'GENERATED',
    },
  ]);
  console.log(`Created ${invoices.length} invoices`);

  // Create activity logs
  await ActivityLog.insertMany([
    { userId: officer._id, action: 'Created RFQ', entity: 'RFQ', entityId: rfqs[0]._id },
    { userId: officer._id, action: 'Created RFQ', entity: 'RFQ', entityId: rfqs[1]._id },
    { userId: officer._id, action: 'Created RFQ', entity: 'RFQ', entityId: rfqs[2]._id },
    { userId: vendorUser1._id, action: 'Submitted Quotation', entity: 'QUOTATION', entityId: quotations[0]._id },
    { userId: vendorUser2._id, action: 'Submitted Quotation', entity: 'QUOTATION', entityId: quotations[1]._id },
    { userId: manager._id, action: 'Approved Quotation', entity: 'APPROVAL', entityId: approvals[0]._id },
    { userId: officer._id, action: 'Generated Purchase Order', entity: 'PO', entityId: pos[0]._id },
    { userId: officer._id, action: 'Generated Invoice', entity: 'INVOICE', entityId: invoices[0]._id },
  ]);
  console.log('Created activity logs');

  console.log('\n--- Seed Complete ---');
  console.log('Login credentials (all passwords: password123):');
  console.log('  Admin:              aarav@vendorbridge.test');
  console.log('  Procurement Officer: priya@vendorbridge.test');
  console.log('  Manager:            karan@vendorbridge.test');
  console.log('  Vendor (Acme):      vendor@acme.test');
  console.log('  Vendor (Metro):     vendor@metro.test');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
