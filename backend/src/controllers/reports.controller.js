import PurchaseOrder from '../models/PurchaseOrder.js';
import Invoice from '../models/Invoice.js';
import Vendor from '../models/Vendor.js';
import RFQ from '../models/RFQ.js';
import Approval from '../models/Approval.js';

export async function getReports(req, res, next) {
  try {
    const role = req.user.role;
    const vendorId = req.user.vendorId;

    let activeVendors = 0;
    let activeRFQs = 0;
    let pendingApprovals = 0;
    let totalPOs = 0;
    let totalInvoices = 0;
    let totalSpend = 0;
    let monthlyData = [];
    let vendorPerformance = [];
    let deliveryPerformance = [];

    if (role === 'VENDOR') {
      // Scoped for Vendor
      [activeRFQs, totalPOs, totalInvoices] = await Promise.all([
        RFQ.countDocuments({ status: 'OPEN', vendors: vendorId }),
        PurchaseOrder.countDocuments({ vendorId }),
        Invoice.countDocuments({ vendorId }),
      ]);
    } else {
      // ADMIN, MANAGER, PROCUREMENT_OFFICER
      [activeVendors, activeRFQs, pendingApprovals, totalPOs, totalInvoices] = await Promise.all([
        Vendor.countDocuments({ status: 'ACTIVE' }),
        RFQ.countDocuments({ status: 'OPEN' }),
        Approval.countDocuments({ status: 'PENDING' }),
        PurchaseOrder.countDocuments(),
        Invoice.countDocuments(),
      ]);

      // Financials only for ADMIN and MANAGER
      if (role === 'ADMIN' || role === 'MANAGER') {
        const spendAgg = await PurchaseOrder.aggregate([
          { $group: { _id: null, total: { $sum: '$totalAmount' } } },
        ]);
        totalSpend = spendAgg[0]?.total || 0;

        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlyTrend = await PurchaseOrder.aggregate([
          { $match: { createdAt: { $gte: sixMonthsAgo } } },
          {
            $group: {
              _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
              spend: { $sum: '$totalAmount' },
              count: { $sum: 1 },
            },
          },
          { $sort: { '_id.year': 1, '_id.month': 1 } },
        ]);

        const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        monthlyData = monthlyTrend.map((m) => ({
          month: months[m._id.month],
          spend: m.spend,
          orders: m.count,
        }));

        vendorPerformance = await PurchaseOrder.aggregate([
          {
            $lookup: {
              from: 'vendors',
              localField: 'vendorId',
              foreignField: '_id',
              as: 'vendor',
            },
          },
          { $unwind: '$vendor' },
          {
            $group: {
              _id: '$vendorId',
              name: { $first: '$vendor.name' },
              totalOrders: { $sum: 1 },
              totalSpend: { $sum: '$totalAmount' },
            },
          },
          { $sort: { totalSpend: -1 } },
          { $limit: 10 },
        ]);

        const delPerformance = await PurchaseOrder.aggregate([
          {
            $lookup: {
              from: 'quotations',
              localField: 'quotationId',
              foreignField: '_id',
              as: 'quotation',
            },
          },
          { $unwind: '$quotation' },
          {
            $lookup: {
              from: 'vendors',
              localField: 'vendorId',
              foreignField: '_id',
              as: 'vendor',
            },
          },
          { $unwind: '$vendor' },
          {
            $group: {
              _id: '$vendorId',
              vendor: { $first: '$vendor.name' },
              avgDeliveryDays: { $avg: '$quotation.deliveryDays' },
              wins: { $sum: 1 },
            },
          },
          { $sort: { wins: -1 } },
          { $limit: 10 },
        ]);

        deliveryPerformance = delPerformance.map((d) => ({
          vendor: d.vendor,
          days: Math.round(d.avgDeliveryDays),
          wins: d.wins,
        }));
      }
    }

    return res.json({
      data: {
        summary: {
          totalSpend,
          totalPOs,
          activeVendors,
          activeRFQs,
          pendingApprovals,
          totalInvoices,
        },
        monthlyTrend: monthlyData,
        vendorPerformance,
        deliveryPerformance,
      },
    });
  } catch (err) {
    return next(err);
  }
}
