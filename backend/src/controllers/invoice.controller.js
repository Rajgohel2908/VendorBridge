export function listInvoices(req, res) {
  res.json({ message: 'List invoices endpoint wired', data: [] });
}

export function createInvoice(req, res) {
  res.status(201).json({ message: 'Generate invoice endpoint wired', data: req.body });
}

export function getInvoice(req, res) {
  res.json({ message: 'Invoice detail endpoint wired', id: req.params.id });
}

export function getInvoicePdf(req, res) {
  res.json({ message: 'Invoice PDF endpoint wired', id: req.params.id });
}

export function emailInvoice(req, res) {
  res.json({ message: 'Invoice email endpoint wired', id: req.params.id, data: req.body });
}
