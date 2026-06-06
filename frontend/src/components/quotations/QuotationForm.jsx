import Button from '../ui/Button.jsx';
import Input from '../ui/Input.jsx';

export default function QuotationForm() {
  return (
    <form className="grid gap-4">
      <Input label="Price" type="number" placeholder="12000" />
      <p className="-mt-2 text-sm text-brand-muted">Total is calculated from price and RFQ quantity.</p>
      <Input label="Delivery Days" type="number" placeholder="14" />
      <label>
        <span className="mb-1 block text-sm font-medium text-slate-700">Notes</span>
        <textarea className="min-h-24 w-full rounded border border-brand-border px-3 py-2 text-sm outline-none focus:border-brand-primary focus:ring-2 focus:ring-blue-100" />
      </label>
      <Button variant="blue" type="button">Submit Quotation</Button>
    </form>
  );
}
