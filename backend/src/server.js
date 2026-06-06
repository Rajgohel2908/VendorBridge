import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import vendorRoutes from './routes/vendor.routes.js';
import rfqRoutes from './routes/rfq.routes.js';
import quotationRoutes from './routes/quotation.routes.js';
import approvalRoutes from './routes/approval.routes.js';
import purchaseOrderRoutes from './routes/purchaseOrder.routes.js';
import invoiceRoutes from './routes/invoice.routes.js';
import activityRoutes from './routes/activity.routes.js';
import adminRoutes from './routes/admin.routes.js';
import reportsRoutes from './routes/reports.routes.js';
import errorHandler from './middleware/errorHandler.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 5000;

app.use(cors()); // Allow all origins for development to prevent CORS issues
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[REQUEST] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'VendorBridge API' }));
app.use('/api/auth', authRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/rfq', rfqRoutes);
app.use('/api/quotations', quotationRoutes);
app.use('/api/approvals', approvalRoutes);
app.use('/api/purchase-orders', purchaseOrderRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/admin', adminRoutes);
app.use(errorHandler);

connectDB().then(() => {
  app.listen(port, '0.0.0.0', () => {
    console.log(`VendorBridge API running on port ${port}`);
  });
});
