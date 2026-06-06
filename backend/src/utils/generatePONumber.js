export function generatePONumber(sequence = 1, date = new Date()) {
  return `PO-${date.getFullYear()}-${String(sequence).padStart(4, '0')}`;
}
