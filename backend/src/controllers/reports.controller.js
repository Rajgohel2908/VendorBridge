export function getReports(req, res) {
  res.json({
    message: 'Reports endpoint wired',
    data: {
      totalSpend: 0,
      purchaseOrders: 0,
      activeVendors: 0,
    },
  });
}
