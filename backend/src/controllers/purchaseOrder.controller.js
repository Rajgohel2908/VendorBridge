export function listPurchaseOrders(req, res) {
  res.json({ message: 'List purchase orders endpoint wired', data: [] });
}

export function createPurchaseOrder(req, res) {
  res.status(201).json({ message: 'Generate purchase order endpoint wired', data: req.body });
}

export function getPurchaseOrder(req, res) {
  res.json({ message: 'Purchase order detail endpoint wired', id: req.params.id });
}
