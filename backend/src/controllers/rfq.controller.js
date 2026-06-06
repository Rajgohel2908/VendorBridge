export function listRFQs(req, res) {
  res.json({ message: 'List RFQs endpoint wired', data: [] });
}

export function createRFQ(req, res) {
  res.status(201).json({ message: 'Create RFQ endpoint wired', data: req.body });
}

export function getRFQ(req, res) {
  res.json({ message: 'RFQ detail endpoint wired', id: req.params.id });
}

export function updateRFQ(req, res) {
  res.json({ message: 'Update RFQ endpoint wired', id: req.params.id, data: req.body });
}

export function deleteRFQ(req, res) {
  res.json({ message: 'Cancel RFQ endpoint wired', id: req.params.id });
}

export function listRFQQuotations(req, res) {
  res.json({ message: 'RFQ quotations endpoint wired', rfqId: req.params.id, data: [] });
}
