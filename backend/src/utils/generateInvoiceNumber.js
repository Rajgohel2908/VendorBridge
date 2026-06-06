export function generateInvoiceNumber(sequence = 1, date = new Date()) {
  return `INV-${date.getFullYear()}-${String(sequence).padStart(4, '0')}`;
}
