export function listQuotations(req, res) {
  res.json({ message: 'List quotations endpoint wired', data: [] });
}

export function createQuotation(req, res) {
  res.status(201).json({ message: 'Submit quotation endpoint wired', data: req.body });
}

export function updateQuotation(req, res) {
  res.json({ message: 'Revise quotation endpoint wired', id: req.params.id, data: req.body });
}

export function getQuotation(req, res) {
  res.json({ message: 'Quotation detail endpoint wired', id: req.params.id });
}
