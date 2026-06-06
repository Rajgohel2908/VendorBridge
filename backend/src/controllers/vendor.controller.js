export function listVendors(req, res) {
  res.json({ message: 'List vendors endpoint wired', data: [] });
}

export function createVendor(req, res) {
  res.status(201).json({ message: 'Create vendor endpoint wired', data: req.body });
}

export function getVendor(req, res) {
  res.json({ message: 'Vendor detail endpoint wired', id: req.params.id });
}

export function updateVendor(req, res) {
  res.json({ message: 'Update vendor endpoint wired', id: req.params.id, data: req.body });
}

export function deleteVendor(req, res) {
  res.json({ message: 'Delete vendor endpoint wired', id: req.params.id });
}
